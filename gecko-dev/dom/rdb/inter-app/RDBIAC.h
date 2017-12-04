
#ifndef NS_RDB_IAC_h
#define NS_RDB_IAC_h

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
#include "mozilla/Monitor.h"
#include "RDB.h"
#include "RDBIACRequest.h"


#include <map>
#include <queue>

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

using mozilla::Mutex;
class RDBIAS;
class RDBIACRequest;
class RDBIASRequest;

struct IACPerTableCapInfo {
  RDBObjectClone* mWhere;

  bool mInsertable;
  bool mQueryable;
  bool mUpdatable;
  bool mDeletable;

  std::set<nsCString> mCols;
  std::map<nsCString, nsString> mFixedStringCols;
  std::map<nsCString, double> mFixedNumCols;
  std::set<nsCString> mFixedNullCols;

  IACPerTableCapInfo()
    : mWhere(nullptr)
    , mInsertable(true)
    , mQueryable(true)
    , mUpdatable(true)
    , mDeletable(true)
  {
  }
  ~IACPerTableCapInfo() {
    if (mWhere)
      delete mWhere;
  }
};

class RDBIAC : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBIAC,
                                                         RDBWrapperCache)

  RDBIAC(RDBIAC* aClone, bool aInheritWhere);

  static already_AddRefed<RDBIAC>
  CreateRDBIAC(nsPIDOMWindow* aWin, const nsAString& aName, uint32_t aAppId);

  static already_AddRefed<RDBIAC>
  CreateRDBIACWithServer(nsPIDOMWindow* aWin, RDBIAS* aServer, uint32_t aAppId);

  // nsWrapperCache
  virtual JSObject*
  WrapObject(JSContext* aCx) MOZ_OVERRIDE;

  // WebIDL
  nsPIDOMWindow*
  GetParentObject() const
  {
    return GetOwner();
  }

  void
  Send(const nsAString& aMsg, ErrorResult& aRv);

  already_AddRefed<RDBIACRequest>
  Query(JSContext* aCx,
        const Sequence<nsCString>& aTabs,
        const Sequence<nsCString>& aCols,
        JS::Handle<JSObject*> aWhere,
        const nsACString& aOrderBy,
        ErrorResult& aRv);

  already_AddRefed<RDBIACRequest>
  Update(JSContext* aCx,
         const nsACString& aTab,
         JS::Handle<JSObject*> aWhere,
         JS::Handle<JSObject*> aVals,
         ErrorResult& aRv);

  already_AddRefed<RDBIACRequest>
  Insert(JSContext* aCx,
         const nsACString& aTab,
         JS::Handle<JSObject*> aVals,
         ErrorResult& aRv);

  already_AddRefed<RDBIACRequest>
  Delete(JSContext* aCx,
        const nsACString& aTab,
        JS::Handle<JSObject*> aWhere,
        ErrorResult& aRv);

  IMPL_EVENT_HANDLER(received);
  IMPL_EVENT_HANDLER(error);
  
  void CloseAllOps();

  std::map<nsCString, IACPerTableCapInfo> mTabs;

  nsRefPtr<RDBIAS> mServer;

private:
  RDBIAC(nsPIDOMWindow* aOwner, RDBIAS* aServer);
  RDBIAC(nsPIDOMWindow* aOwner, RDBIAS* aServer, uint32_t aAppId);
  ~RDBIAC(){}

  uint32_t mAppId;
};


class RDBIAS : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBIAS,
                                                         RDBWrapperCache)

  static RDBIAS*
  CreateRDBIAS(nsPIDOMWindow* aWin, const nsAString& aName);

  already_AddRefed<RDBIAC>
  CreateClientFor(uint32_t aAppId, ErrorResult& aRv);

  void
  EnqueueRequest(RDBIACRequest* aClientReq, const char *op);

  already_AddRefed<RDBIASRequest>
  GetNextRequest(ErrorResult& aRv);

  static already_AddRefed<RDBIAS>
  GetRegistered(const nsString& aName, uint32_t mAppId);

  void GetName(nsString& aName) {
    aName = mName;
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

  void
  Send(const nsAString& aMsg, ErrorResult& aRv);

  void
  SetClient(RDBIAC* aClient) {
    mClient = aClient;
  }

  IMPL_EVENT_HANDLER(received);
  IMPL_EVENT_HANDLER(error);

  void SetDefaultPolicy(JSContext* aCx, JS::Handle<JSObject*> aPolicy, ErrorResult& aRv);
  void SetPolicyForMyself(JSContext* aCx, JS::Handle<JSObject*> aPolicy, ErrorResult& aRv);
  void SetPolicyForApp(JSContext* aCx,
                       const nsAString& aAppName,
                       JS::Handle<JSObject*> aPolicy,
                       ErrorResult& aRv);
  void GetPolicyForApp(RDBIAC* aClient, const nsString& aAppName);

private:
  RDBIAS(nsPIDOMWindow* aOwner, const nsAString& aName);
  ~RDBIAS(){}

  nsString mName;
  nsRefPtr<RDBIAC> mClient;
  std::queue<nsRefPtr<RDBIASRequest>> mQueue;
  mozilla::Mutex mMutex;
  std::map<nsString, std::map<nsCString, IACPerTableCapInfo>> mPolicyRepo;
  uint32_t mAppId;

  static mozilla::Mutex gRegisteredServersMutex;
  static std::map<nsString, nsRefPtr<RDBIAS>> gRegisteredServers;
};


class RDBIACRunnable : public nsRunnable {
public:
  NS_DECL_THREADSAFE_ISUPPORTS
  NS_DECL_NSIRUNNABLE

  RDBIACRunnable(RDBIACRequest* req);

private:
  ~RDBIACRunnable() {}
  nsRefPtr<RDBIACRequest> mRequest;
  RDBIACRequest* mParentRequest;
  RDBObjectClone* mVal;
  int mOp;
};

#endif
