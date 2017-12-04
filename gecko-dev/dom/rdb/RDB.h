/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 sw=2 et tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef RDB_h
#define RDB_h

#include "mozilla/Mutex.h"
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

#include "mozilla/storage.h"
#include "mozilla/Monitor.h"

#include "RDBRequest.h"
#include "RDBCursor.h"

#include <set>
#include <map>

class mozIStorageConnection;
class nsIThreadPool;

//#include "nsIDOMRDB.h"


//class nsIInputStream;
//class nsIOutputStream;

namespace mozilla {
class EventListenerManager;
class ErrorResult;
class Mutex;
namespace dom {
class DOMCursor;
class DOMRequest;
class Promise;
} // namespace dom
namespace ipc {
class FileDescriptor;
}
} // namespace mozilla

class RDBRequest;
class RDBCursor;
class RDBChild;
class RDBSubsetDesc;

struct PerTableCapInfo {
  nsCString mWhere;
  nsTArray<nsString> mStringParams;
  nsTArray<double> mNumParams;
  nsTArray<short> mParamTypes;

  bool mInsertable;
  bool mQueryable;
  bool mUpdatable;
  bool mDeletable;

  std::set<nsCString> mCols;
  std::map<nsCString, nsString> mFixedStringCols;
  std::map<nsCString, double> mFixedNumCols;
  std::set<nsCString> mFixedNullCols;

  PerTableCapInfo()
    : mWhere("1")
    , mInsertable(true)
    , mQueryable(true)
    , mUpdatable(true)
    , mDeletable(true)
  {
  }
};

using mozilla::ErrorResult;
using mozilla::dom::Sequence;
using mozilla::dom::Nullable;

class nsDOMRDB
  //: public mozilla::DOMEventTargetHelper
  // : public nsISupports
  : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(nsDOMRDB,
                  RDBWrapperCache)


  // nsWrapperCache
  virtual JSObject*
  WrapObject(JSContext* aCx) MOZ_OVERRIDE;

  // WebIDL
  nsPIDOMWindow*
  GetParentObject() const
  {
    return GetOwner();
  }

  RDBChild*
  GetActorChild() const {
    return mActorChild;
  }


  void Show(nsString& retval);
  void GetAttr(nsString& retval);
  void SetAttr(const nsAString& value);
  void Close();

  static nsresult
  GetRDBForInternal(nsPIDOMWindow* aWin,
                    const nsAString& aDBName,
                    nsDOMRDB** aRDB,
                    bool sync,
                    bool refreshMetadata);
  
  static nsresult GetRDBFor(nsPIDOMWindow* aWin,
                            const nsAString& aDBName,
                            nsDOMRDB** aRDB);

  bool Sync() { return mSync; }
  void SetSync(bool val) { mSync = val; }

  bool RequestOrder() { return mRequestOrder; }
  void SetRequestOrder(bool val) { mRequestOrder = val; }

  mozIStorageConnection* GetConnection() {
    return mConnection;
  }

  already_AddRefed<RDBRequest>
  Test(const nsAString& aName,
       ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  ExecRaw(const nsACString& aStmt,
          const Nullable<Sequence<nsString>>& aParams,
          ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  ExecRaw(const nsACString& aStmt,
          const Nullable<Sequence<nsString>>& aParams,
          bool aRefreshMetadata,
          ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  Insert(const nsACString& aTab,
         const Sequence<nsCString>& aCols,
         const Sequence<nsString>& aVals,
         ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  InsertInternal(JSContext* aCx,
                const nsACString& aTab,
                JS::Handle<JSObject*> aVals,
                ErrorResult& aRv,
                RDBSubsetDesc* aSrcDesc);

  already_AddRefed<RDBRequest>
  Insert(JSContext* aCx,
         const nsACString& aTab,
         JS::Handle<JSObject*> aVals,
         ErrorResult& aRv);

  
  already_AddRefed<RDBCursor>
  Query(const Sequence<nsCString>& aTabs,
        const Sequence<nsCString>& aCols,
        const nsACString& aWhere,
        const Nullable<Sequence<nsString>>& aParams,
        const nsACString& aOrderBy,
        ErrorResult& aRv);

  already_AddRefed<RDBCursor>
  Query(JSContext* aCx,
        const Sequence<nsCString>& aTabs,
        const Sequence<nsCString>& aCols,
        JS::Handle<JSObject*> aWhere,
        const nsACString& aOrderBy,
        ErrorResult& aRv);

  // Internal use only
  already_AddRefed<RDBCursor>
  QueryInternalRaw(JSContext* aCx,
                   const Sequence<nsCString>& aTabs,
                   const Sequence<nsCString>& aCols,
                   JS::Handle<JSObject*> aWhere,
                   const nsACString& aOrderBy,
                   ErrorResult& aRv,
                   nsCString* aExtraWhere,
                   nsTArray<short>* aParamTypes,
                   nsTArray<nsString>* aStringParams,
                   nsTArray<double>* aNumParams);

  // Internal use only
  already_AddRefed<RDBCursor>
  QueryInternal(JSContext* aCx,
                const Sequence<nsCString>& aTabs,
                const Sequence<nsCString>& aCols,
                JS::Handle<JSObject*> aWhere,
                const nsACString& aOrderBy,
                ErrorResult& aRv,
                RDBSubsetDesc* aSrcDesc);

  already_AddRefed<RDBRequest>
  Update(const nsACString& aTab,
         const nsACString& aWhere,
         const Nullable<Sequence<nsString>>& aParams,
         const Sequence<nsCString>& aCols,
         const Sequence<nsString>& aVals,
         ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  Update(JSContext* aCx,
         const nsACString& aTab,
         JS::Handle<JSObject*> aWhere,
         JS::Handle<JSObject*> aVals,
         ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  UpdateInternal(JSContext* aCx,
                 const nsACString& aTab,
                 JS::Handle<JSObject*> aWhere,
                 JS::Handle<JSObject*> aVals,
                 ErrorResult& aRv,
                 const PerTableCapInfo* aDescInfo);

  already_AddRefed<RDBRequest>
  Delete(const nsACString& aTab,
         const nsACString& aWhere,
         const Nullable<Sequence<nsString>>& aParams,
         ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  Delete(JSContext* aCx,
        const nsACString& aTab,
        JS::Handle<JSObject*> aWhere,
        ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  DeleteInternal(JSContext* aCx,
                 const nsACString& aTab,
                 JS::Handle<JSObject*> aWhere,
                 ErrorResult& aRv,
                 const PerTableCapInfo* aDescInfo);

  already_AddRefed<RDBRequest>
  CreateTable(const nsACString& aTab,
              const Sequence<nsCString>& aCols,
              const Sequence<nsCString>& aTypes,
              ErrorResult& aRv);

  static bool
  GetTerms(JSContext* cx, JS::Handle<JSObject*> obj,
           nsTArray<short>& aParamTypes,
           nsTArray<nsString>& aStringParams,
           nsTArray<double>& aNumParams,
           const char* connection, nsCString& res);
  static bool
  ConstructWhere(JSContext* aCx,
                 JS::Handle<JSObject*> aWhere,
                 nsTArray<short>& aParamTypes,
                 nsTArray<nsString>& aStringParams,
                 nsTArray<double>& aNumParams,
                 nsCString& res);

  static bool
  ConstructWhereInternal(JSContext* aCx, JS::Handle<JSObject*> aWhere,
                         nsTArray<short>& aParamTypes,
                         nsTArray<nsString>& aStringParams,
                         nsTArray<double>& aNumParams,
                         nsCString& res);

  already_AddRefed<RDBRequest>
  StartTx(ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  AbortTx(ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  CommitTx(ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetDesc(ErrorResult& aRv);

  void
  SetConnection(mozIStorageConnection* aConnection)
  {
    mConnection = aConnection;
  }

  nsresult CreateSchemaInfoTab();

  void FillTabInfo(nsCString aTab, bool aForced = false);

  void FillTabInfoLocked(nsCString aTab, bool aForced = false);

  void FillTabInfo(bool aForced = false);

  uint32_t AppId();

  static
  nsIThreadPool* GetThreadPool();

  IMPL_EVENT_HANDLER(success);
  IMPL_EVENT_HANDLER(error);

  nsString mName;

  nsString mRDBPath;
  nsString mBlobPath;
  nsString mDirPath;

  std::map<nsCString, std::set<nsCString>> mBlobCols;
  std::map<nsCString, PerTableCapInfo> mTabs;

  bool mSync;

  void WaitForSeq(uint64_t seq);
  void NotifyComplete();
  void WaitForSeqWithBlob(uint64_t seq);
  void NotifyCompleteNoBlob();
  void NotifyCompleteForBlob();

protected:
  nsDOMRDB(nsPIDOMWindow* aWin);
  ~nsDOMRDB();
  nsString mAttr;
  nsCOMPtr<nsPIDOMWindow> mWindow;
  RDBChild* mActorChild;
  nsCOMPtr<mozIStorageConnection> mConnection;
  mozilla::Mutex mMutex;
  int64_t mAppId;
  bool mDirectAccess;
  uint64_t mLastWrite;
  uint64_t mLastOp;
  uint64_t mLastComplete;
  uint64_t mLastCompleteWithBlob;
  mozilla::Monitor mMonitor;
  bool mRequestOrder;

  //RDBPerms* mPerms;
  static nsCOMPtr<nsIThreadPool> gThreadPool;
};


class RDBRunnable MOZ_FINAL
  : public nsIRunnable
{
  public:
    NS_DECL_THREADSAFE_ISUPPORTS
    NS_DECL_NSIRUNNABLE

    // NS_DECL_CYCLE_COLLECTING_ISUPPORTS
    // NS_DECL_CYCLE_COLLECTION_CLASS(RDBRunnable)

    RDBRunnable(const int aRequestType,
               RDBRequest* aRequest,
               nsDOMRDB* aRDB,
               bool aSync,
               uint64_t aWaitForSeqNo)
      : mRefreshMetadata(false)
      , mSuccess(false)
      , mSync(aSync)
      , mRequestType(aRequestType)
      , mRequest(aRequest)
      , mCursor(nullptr)
      , mRDB(aRDB)
      , mWaitForSeqNo(aWaitForSeqNo)
    {
    }

    RDBRunnable(const int aRequestType,
               RDBCursor* aCursor,
               nsDOMRDB* aRDB,
               bool aSync,
               uint64_t aWaitForSeqNo)
      : mRefreshMetadata(false)
      , mSuccess(false)
      , mSync(aSync)
      , mRequestType(aRequestType)
      , mRequest(nullptr)
      , mCursor(aCursor)
      , mRDB(aRDB)
      , mWaitForSeqNo(aWaitForSeqNo)
    {
    }

    NS_IMETHOD Allow(JS::HandleValue aChoices);


    bool mRefreshMetadata;
  private:
    ~RDBRunnable() {}

    bool mSuccess;
    bool mSync;
    int mRequestType;
    nsRefPtr<RDBRequest> mRequest;
    nsRefPtr<RDBCursor> mCursor;
    nsRefPtr<nsDOMRDB> mRDB;
    uint64_t mWaitForSeqNo;
};

#endif
