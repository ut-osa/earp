
#ifndef NS_RDB_IAC_Request_h
#define NS_RDB_IAC_Request_h

#include "mozilla/DOMEventTargetHelper.h"
#include "mozilla/RefPtr.h"
#include "mozilla/StaticPtr.h"
#include "mozilla/dom/DOMRequest.h"
#include "nsWrapperCache.h"
#include "RDBWrapperCache.h"
#include "nsCycleCollectionParticipant.h"

#include "nsIVariant.h"
#include "nsCOMPtr.h"

#include "mozilla/dom/TypedArray.h"
#include "mozilla/dom/DOMError.h"
#include "mozilla/ErrorResult.h"
#include "RDB.h"

#include <map>
#include <list>
#include <set>

namespace mozilla {
class EventListenerManager;
class ErrorResult;
namespace dom {
class DOMRequest;
} // namespace dom
} // namespace mozilla


using mozilla::ErrorResult;
using mozilla::dom::Sequence;
using mozilla::dom::Nullable;

using mozilla::Monitor;
using mozilla::Mutex;
class RDBIAS;
class RDBIAC;
struct IACPerTableCapInfo;

class RDBObjectClone {
public:
  RDBObjectClone() {};
  RDBObjectClone(JSContext* cx, JS::Handle<JSObject*> obj);

  static RDBObjectClone*
  CreateWithRestriction(JSContext* cx,
                        JS::Handle<JSObject*> obj,
                        IACPerTableCapInfo& info,
                        int op);
  ~RDBObjectClone();

  RDBObjectClone* Clone();
  void ToObject(JSContext* cx, JS::MutableHandle<JSObject*> retval);

  bool FilterWhere(RDBObjectClone* aWhere);
  void FilterCols(std::set<nsCString>& aCols);
  // bool Filter(RDBObjectClone* aWhere, std::set<nsCString>& aClosedCols);

  std::map<nsCString, double> numMembers;
  std::map<nsCString, nsString> strMembers;
  std::map<nsCString, nsRefPtr<nsIDOMBlob>> blobMembers;
  std::map<nsCString, RDBObjectClone*> objMembers;
};

class RDBIACRequest : public RDBWrapperCache {
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBIACRequest,
                                                         RDBWrapperCache)

  RDBIACRequest(nsPIDOMWindow* aOwner)
    : RDBWrapperCache(aOwner)
    , mSecurityWhereWeak(nullptr)
    , mOriginalWhere(nullptr)
    , mVal(nullptr)
    , mNewValWeak(nullptr)
    , mClient(nullptr)
    , mComplete(0)
    , mSuccess(0)
    , mContinue(false)
    , mStarted(false)
    , mProcessed(false)
    , mMonitor("RDBIACRequest.mMonitor")
    , mSequenceNumber(GenerateSequenceNumber())
    , mNumNewPk(-1)
  {
  }

  // nsWrapperCache
  virtual JSObject*
  WrapObject(JSContext* aCx) MOZ_OVERRIDE;

  // WebIDL
  nsPIDOMWindow*
  GetParentObject() const
  {
    return GetOwner();
  }

  void Notify(bool aSuccess) {
    mozilla::MonitorAutoLock l(mMonitor);
    mComplete += 1;
    if (aSuccess)
      mSuccess += 1;
    l.Notify();
  }

  void NotifyIncomplete() {
    mozilla::MonitorAutoLock l(mMonitor);
    mComplete += 1;
    mSuccess += 1;
    mContinue = true;
    l.Notify();
  }

  bool WaitForComplete(int n = 1) {
    mozilla::MonitorAutoLock l(mMonitor);
    while (mComplete < n)
      l.Wait();
    return mSuccess == n;
  }

  void ResetStatus() {
    mComplete = 0;
    mSuccess = 0;
    mProcessed = false;
    mContinue = false;
    mStarted = false;
  }

  IMPL_EVENT_HANDLER(success);
  IMPL_EVENT_HANDLER(error);

  bool Next(ErrorResult& aRv); // sync API
  bool Continue(ErrorResult& aRv); // async API for next batch

  void
  GetByName(JSContext* cx,
            const nsACString& colName,
            JS::MutableHandle<JS::Value> retval,
            ErrorResult& aRv) {}

  void GetRow(JSContext* cx, JS::MutableHandle<JSObject*> retval);

  void GetBackend(nsCString& ret) {
    ret.Assign("iac");
  }

  void FilterAll();

  bool HasMore() { return mContinue; }

  already_AddRefed<RDBIAC>
  GetPropDesc(const nsACString& aAttrTab, ErrorResult& aRv);

  already_AddRefed<RDBIAC>
  GetCapDesc(const nsACString& aCap, ErrorResult& aRv);

  already_AddRefed<RDBIAC>
  GetSelfDesc(ErrorResult& aRv);

  void SetNewPk(double pk) { mNumNewPk = pk; }

  void SetNewPk(const nsAString& pk) { mStrNewPk.Assign(pk); }

  int mOp;
  nsCString mTab;
  nsTArray<nsCString> mTabs;
  std::set<nsCString> mCols;
  RDBObjectClone* mSecurityWhereWeak;
  RDBObjectClone* mOriginalWhere;
  RDBObjectClone* mVal;
  RDBObjectClone* mNewValWeak; // no ownership

  std::list<RDBObjectClone*> mResultSet;

  nsRefPtr<RDBIAC> mClient;

private:
  int mComplete;
  int mSuccess;
  bool mContinue;
  bool mStarted;
  bool mProcessed;
  mozilla::Monitor mMonitor;
  uint64_t mSequenceNumber;
  double mNumNewPk;
  nsString mStrNewPk;

  ~RDBIACRequest();
  friend class RDBIASRequest;
  static mozilla::Mutex gSequenceNumberMutex;
  static uint64_t gNextSequenceNumber;
  static uint64_t GenerateSequenceNumber();
};


class RDBIASRequest : public RDBWrapperCache {
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBIASRequest,
                                                         RDBWrapperCache)

  RDBIASRequest(nsPIDOMWindow* aOwner, RDBIACRequest* aClientRequest, const char *op)
    : RDBWrapperCache(aOwner)
    , mOp(op)
    , mClientRequest(aClientRequest)
  {
  }

  // nsWrapperCache
  virtual JSObject*
  WrapObject(JSContext* aCx) MOZ_OVERRIDE;

  // WebIDL
  nsPIDOMWindow*
  GetParentObject() const
  {
    return GetOwner();
  }

  void GetOp(nsCString& ret) {
    ret = mOp;
  }

  void GetClientOp(nsCString& ret);
  void GetTab(nsCString& ret) {
    ret = mClientRequest->mTab;
  }

  uint64_t SequenceNumber() {
    return mClientRequest->mSequenceNumber;
  }

  void GetCols(nsTArray<nsCString>& ret);
  void GetTabs(nsTArray<nsCString>& ret);

  void GetSecurityWhere(JSContext* cx, JS::MutableHandle<JSObject*> retval);
  void GetOriginalWhere(JSContext* cx, JS::MutableHandle<JSObject*> retval);
  void GetVal(JSContext* cx, JS::MutableHandle<JSObject*> retval);
  void GetUpdatedCols(JSContext* cx, JS::MutableHandle<JSObject*> retval);

  void List(JSContext* cx,
            const Sequence<JSObject*>& aRes,
            ErrorResult& aRv);

  void NotifySuccess(ErrorResult& aRv);
  void NotifyFailure(ErrorResult& aRv);
  void NotifyIncomplete(ErrorResult& aRv);

  void SetNewPk(double pk) { mClientRequest->SetNewPk(pk); }

  void SetNewPk(const nsAString& pk) { mClientRequest->SetNewPk(pk); }

  nsCString mOp;

private:
  ~RDBIASRequest(){}

  nsRefPtr<RDBIACRequest> mClientRequest;
};

#endif