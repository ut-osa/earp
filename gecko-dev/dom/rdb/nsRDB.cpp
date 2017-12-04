/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 sw=2 et tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "nsIScriptContext.h"
#include "nsIScriptSecurityManager.h"
#include "nsIXPConnect.h"
#include "nsIXPCScriptable.h"

#include "mozilla/Attributes.h"
//#include "mozilla/ClearOnShutdown.h"
#include "mozilla/DebugOnly.h"
#include "mozilla/dom/ContentChild.h"
// #include "mozilla/dom/Directory.h"
// #include "mozilla/dom/FileSystemUtils.h"
// #include "mozilla/dom/ipc/Blob.h"
// #include "mozilla/dom/PBrowserChild.h"
// #include "mozilla/dom/PermissionMessageUtils.h"
// #include "mozilla/dom/Promise.h"
// #include "mozilla/dom/ScriptSettings.h"
// #include "mozilla/EventDispatcher.h"
// #include "mozilla/EventListenerManager.h"
// #include "mozilla/LazyIdleThread.h"
// #include "mozilla/Preferences.h"
// #include "mozilla/Scoped.h"
// #include "mozilla/Services.h"

//#include "nsArrayUtils.h"
#include "nsAutoPtr.h"
#include "nsGlobalWindow.h"
#include "nsServiceManagerUtils.h"
#include "nsIFile.h"
#include "nsIDirectoryEnumerator.h"
#include "nsAppDirectoryServiceDefs.h"
#include "nsDirectoryServiceDefs.h"
#include "nsIDOMFile.h"
#include "nsNetUtil.h"
#include "nsCycleCollectionParticipant.h"
#include "nsIPrincipal.h"
#include "nsJSUtils.h"
#include "nsContentUtils.h"
#include "nsXULAppAPI.h"
#include "nsCRT.h"
#include "nsIObserverService.h"
#include "nsIMIMEService.h"
#include "nsCExternalHandlerService.h"
#include "nsIPermissionManager.h"
#include "nsIStringBundle.h"
#include "nsISupportsPrimitives.h"
#include "nsIThreadPool.h"
#include "nsIDocument.h"
#include "nsPrintfCString.h"
#include "nsXPCOMCIDInternal.h"
#include <algorithm>
#include "private/pprio.h"
#include "nsContentPermissionHelper.h"
#include "mozilla/dom/ScriptSettings.h"
#include "mozilla/Monitor.h"


// Microsoft's API Name hackery sucks
#undef CreateEvent

#include "RDB.h"
#include "nsRDB.h"
#include "RDBUtils.h"
#include "ipc/RDBChild.h"
#include "ReportInternalError.h"
#include "mozilla/dom/RDBBinding.h"

class mozIStorageConnection;

using mozilla::AutoJSContext;

using namespace mozilla;
using namespace mozilla::dom;

nsCOMPtr<nsIThreadPool> nsDOMRDB::gThreadPool = nullptr;

nsresult
RDBRunnable::Run()
{
  //MOZ_ASSERT(NS_IsMainThread());
  Allow(JS::UndefinedHandleValue);
  if (!mSuccess) {
    if (!mSync) {
      if (mRequest) {
        switch (mRequestType) {
          // query notifies in the end of cursor
          case RDB_REQUEST_INSERT:
          case RDB_REQUEST_UPDATE:
          case RDB_REQUEST_DELETE:
          case RDB_REQUEST_EXECRAW:
            mRequest->mRDB->NotifyComplete();
            break;
          default:
            break;
        }
        RDBDispatchEventToJS("error", mRequest.forget());
      } else if (mCursor) {
        mCursor->mRDB->NotifyComplete();
        RDBDispatchEventToJS("error", mCursor.forget());
      }
    } else {
      // for sync, return val indicates failure
      return NS_ERROR_FAILURE;
    }
  }
  return NS_OK;
}

nsresult
RDBRunnable::Allow(JS::HandleValue aChoices)
{
  MOZ_ASSERT(NS_IsMainThread());
  MOZ_ASSERT(aChoices.isUndefined());

  nsresult rv;

  switch(mRequestType) {
    case RDB_REQUEST_OPEN:
      if (XRE_GetProcessType() != GeckoProcessType_Default) {
        // yxu TODO
      } else {
        nsCOMPtr<mozIStorageService> ss =
        do_GetService(MOZ_STORAGE_SERVICE_CONTRACTID);
        NS_ENSURE_TRUE(ss, NS_ERROR_FAILURE);

        nsCOMPtr<nsIFile> f =
          do_CreateInstance(NS_LOCAL_FILE_CONTRACTID, &rv);
        NS_ENSURE_SUCCESS(rv, rv);
       
        rv = f->InitWithPath(mRDB->mRDBPath);
        NS_ENSURE_SUCCESS(rv, rv);
        
        nsCOMPtr<mozIStorageConnection> connection;
        rv = ss->OpenDatabase(f, getter_AddRefs(connection));
        NS_ENSURE_SUCCESS(rv, rv);
        // turn on foreign key support
        rv = connection->ExecuteSimpleSQL(NS_LITERAL_CSTRING(
          "PRAGMA foreign_keys = ON; "
#if defined(MOZ_WIDGET_ANDROID) || defined(MOZ_WIDGET_GONK)
          "PRAGMA journal_mode = TRUNCATE; "
#endif
        ));
        NS_ENSURE_SUCCESS(rv, rv);

        mRDB->SetConnection(connection.get());
        rv = mRDB->CreateSchemaInfoTab();
        NS_ENSURE_SUCCESS(rv, rv);

        NS_ENSURE_SUCCESS(rv, rv);

        nsCOMPtr<nsIDOMEvent> event;
        NS_NewDOMEvent(getter_AddRefs(event), mRDB, nullptr, nullptr);

        nsRefPtr<nsDOMRDB> rdb = mRDB;

        mRDB->mTabs.clear();
        mRDB->mBlobCols.clear();
        mRDB->FillTabInfo(true);
        
        // async only
        RDBDispatchEventToJS("success", rdb.forget());
        mSuccess = true;
      }
      return NS_OK;

    case RDB_REQUEST_INSERT:
      if (XRE_GetProcessType() != GeckoProcessType_Default) {
        // yxu TODO
      } else {
        nsCOMPtr<mozIStorageStatement> stmt;
        nsCString s = NS_LITERAL_CSTRING("INSERT INTO ");
        s.Append(mRequest->mTab);
        s.Append("(pk");
        uint64_t pk = RDBGetRandNum() >> 13;
        mRequest->SetInsertPK(pk);
  
        mRequest->SetCompletionNum(
          mRequest->mBlobNames.Length() + mRequest->mDirNames.Length());
        nsCOMPtr<nsIEventTarget> target
            = do_GetService(NS_STREAMTRANSPORTSERVICE_CONTRACTID);
        for (uint32_t i = 0; i < mRequest->mBlobNames.Length(); i++) {
          nsCOMPtr<nsIRunnable> nfevent(new RDBNewFileEvent(
                  mRequest, mRequest->mBlobVals[i],
                  mRequest->mRDB->mBlobPath, mRequest->mBlobNames[i]));
          if (!mSync) {
            nsDOMRDB::GetThreadPool()->Dispatch(nfevent, NS_DISPATCH_NORMAL);
          } else {
            nfevent->Run();
          }
        }

        for (uint32_t i = 0; i < mRequest->mDirNames.Length(); i++) {
          nsCOMPtr<nsIRunnable> nfevent(new RDBNewDirEvent(
                  mRequest, mRequest->mRDB->mDirPath, mRequest->mDirNames[i]));
          if (!mSync) {
            nsCOMPtr<nsIEventTarget> target
                = do_GetService(NS_STREAMTRANSPORTSERVICE_CONTRACTID);
            target->Dispatch(nfevent, NS_DISPATCH_NORMAL);
          } else {
            nfevent->Run();
          }
        }

        nsTArray<nsCString>& cols = mRequest->mColumns;
        for (uint32_t i = 0; i < cols.Length(); i++) {
          // if (i > 0) {
          s.Append(",");
          // }
          s.Append(cols[i]);
        }
        s.Append(") VALUES (");
        char tmp[64];
        sprintf(tmp, "%lld", pk);
        s.Append(tmp);
        for (uint32_t i = 0; i < mRequest->mValTypes.Length(); i++) {
          // if (i > 0) {
          s.Append(NS_LITERAL_CSTRING(","));
          // }
          sprintf(tmp, "?%d", i+1);
          s.Append(tmp);
        }
        s.Append(NS_LITERAL_CSTRING(");"));

        rv = mRequest->mRDB->GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
        NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);

        int n0 = 0, n1 = 0, n2 = 0, n3 = 0;
        for (uint32_t i = 0; i < mRequest->mValTypes.Length(); i++) {
          switch (mRequest->mValTypes[i]) {
            case RDB_VAL_TYPE_NUMBER:
              if (RDBColIsBlob(cols[i]) || RDBColIsDir(cols[i])) {
                return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
              }
              rv = stmt->BindDoubleByIndex(i, mRequest->mNumVals[n0++]);
              break;
            case RDB_VAL_TYPE_STRING:
              if (RDBColIsBlob(cols[i]) || RDBColIsDir(cols[i])) {
                return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
              }
              rv = stmt->BindStringByIndex(i, mRequest->mStringVals[n1++]);
              break;
            case RDB_VAL_TYPE_BLOB:
              {
                if (!RDBColIsBlob(cols[i])) {
                  return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
                }
                rv = stmt->BindInt64ByIndex(i, mRequest->mBlobNames[n2++]);
                break;
              }
            case RDB_VAL_TYPE_DIR:
              {
                if (!RDBColIsDir(cols[i])) {
                  return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
                }
                rv = stmt->BindInt64ByIndex(i, mRequest->mDirNames[n3++]);
                break;
              }
            case RDB_VAL_TYPE_NULL:
              rv = stmt->BindNullByIndex(i);
              break;
          }
          NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);
        }

        if (!mSync) {
          mRequest->mRDB->WaitForSeq(mWaitForSeqNo);
        }
        
        if (NS_FAILED(stmt->Execute())) {
          return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
        }

        stmt->Reset();

        if (!mSync) {
          if (mRequest->mBlobVals.Length() == 0) {
            mRequest->mRDB->NotifyComplete();
          } else {
            mRequest->mRDB->NotifyCompleteNoBlob();
          }
        }

        mRequest->EnableInsertToken();

        if (!mSync) {
          mRequest->WaitForComplete();
          mRequest->mRDB->NotifyCompleteForBlob();
          RDBDispatchEventToJS("success", mRequest.forget());
        }
        mSuccess = true;
      }
      return NS_OK;

    case RDB_REQUEST_UPDATE:
      if (XRE_GetProcessType() != GeckoProcessType_Default) {
        // yxu TODO
      } else {
        char tmp[8];
        uint32_t cnt = 0;
        nsCString s = NS_LITERAL_CSTRING("UPDATE ");
        s.Append(mRequest->mTab);
        s.Append(" SET ");
        nsTArray<nsCString>& cols = mRequest->mColumns;
        if (!mRequest->nullParams)
          cnt = mRequest->mParams.Length();
        uint32_t nvals = mRequest->mValTypes.Length();
        uint32_t ncols = cols.Length();

        for (uint32_t i = 0; i < ncols; i++) {
          // Do not support update dir column
          if (RDBColIsDir(cols[i])) {
            return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
          }
          if (i > 0) {
            s.Append(",");
          }
          s.Append(cols[i]);
          sprintf(tmp, "=?%d", cnt + (nvals - ncols) + i + 1);
          s.Append(tmp);
        }
        s.Append(" WHERE ");
        if (mRequest->mWhere.Length() > 0)
          s.Append(mRequest->mWhere);
        else
          s.Append("1");

        mRequest->SetCompletionNum(mRequest->mBlobVals.Length());

        nsCOMPtr<mozIStorageStatement> stmt;
        rv = mRequest->mRDB->GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
        NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);

        int n0 = 0, n1 = 0, n2 = 0;
        for (uint32_t i = 0; i < nvals; i++) {
          switch (mRequest->mValTypes[i]) {
            case RDB_VAL_TYPE_NUMBER:
              rv = stmt->BindDoubleByIndex(cnt + i, mRequest->mNumVals[n0++]);
              break;
            case RDB_VAL_TYPE_STRING:
              rv = stmt->BindStringByIndex(cnt + i, mRequest->mStringVals[n1++]);
              break;
            case RDB_VAL_TYPE_BLOB:
              {
                if (!RDBColIsBlob(cols[i])) {
                  return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
                }
                rv = stmt->BindInt64ByIndex(i, mRequest->mBlobNames[n2++]);
                break;
              }
            case RDB_VAL_TYPE_NULL:
              rv = stmt->BindNullByIndex(cnt + i);
              break;
          }
          NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);
        }

        if (cnt > 0) {
          for (uint32_t i = 0; i < cnt; i++) {
            rv = stmt->BindStringByIndex(i, mRequest->mParams[i]);
            NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);
          }
        }

        if (!mSync) {
          mRequest->mRDB->WaitForSeq(mWaitForSeqNo);
        }

        if (NS_FAILED(stmt->Execute())) {
          return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
        }

        stmt->Reset();

        if (!mSync) {
          if (mRequest->mBlobVals.Length() == 0) {
            mRequest->mRDB->NotifyComplete();
          } else {
            mRequest->mRDB->NotifyCompleteNoBlob();
          }
        }

        for (uint32_t i = 0; i < mRequest->mBlobVals.Length(); i++) {
          nsCOMPtr<nsIRunnable> nfevent(new RDBNewFileEvent(
                  mRequest, mRequest->mBlobVals[i],
                  mRequest->mRDB->mBlobPath, mRequest->mBlobNames[i]));
          if (!mSync) {
            nsCOMPtr<nsIEventTarget> target
                = do_GetService(NS_STREAMTRANSPORTSERVICE_CONTRACTID);
            target->Dispatch(nfevent, NS_DISPATCH_NORMAL);
          } else {
            nfevent->Run();
          }
        }

        if (!mSync) {
          mRequest->WaitForComplete();
          mRequest->mRDB->NotifyCompleteForBlob();
          RDBDispatchEventToJS("success", mRequest.forget());
        }
        mSuccess = true;
      }
      return NS_OK;

    case RDB_REQUEST_QUERY:
      if (XRE_GetProcessType() != GeckoProcessType_Default) {
        // yxu TODO
      } else {
        //char tmp[8];
        //uint32_t cnt = 0;
        nsCString s;
        if (mCursor->mTabs.Length() == 1) {
          if (mCursor->mTabs[0].Find(" ", false, 0, -1) != kNotFound) {
            s.AssignLiteral("SELECT 0");
          } else {
            s.AssignLiteral("SELECT pk");
          }
        } else {
          s.AssignLiteral("SELECT ");
          s.Append(mCursor->mTabs[0]);
          s.Append(".pk AS pk");
        }
        for (uint32_t i = 0; i < mCursor->mCols.Length(); i++) {
          s.Append(",");
          s.Append(mCursor->mCols[i]);
        }
        s.Append(" FROM ");
        for (uint32_t i = 0; i < mCursor->mTabs.Length(); i++) {
          if (i > 0)
            s.Append(",");
          s.Append(mCursor->mTabs[i]);
        }
        s.Append(" WHERE ");
        if (mCursor->mWhere.Length() <= 0)
          s.Append("1");
        else
          s.Append(mCursor->mWhere);

        if (mCursor->mOrderBy.Length() > 0) {
          s.Append(" ORDER BY ");
          s.Append(mCursor->mOrderBy);
        }

        if (!mSync) {
          mCursor->mRDB->WaitForSeqWithBlob(mWaitForSeqNo);
        }

        nsCOMPtr<mozIStorageStatement> stmt;
        rv = mCursor->GetRDB()->GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
        NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);


        int n0 = 0, n1 = 0, n2 = 0;
        for (uint32_t i = 0; i < mCursor->mParamTypes.Length(); i++) {
          switch (mCursor->mParamTypes[i]) {
            case RDB_VAL_TYPE_NUMBER:
              rv = stmt->BindDoubleByIndex(i, mCursor->mNumParams[n0++]);
              break;
            case RDB_VAL_TYPE_STRING:
              rv = stmt->BindStringByIndex(i, mCursor->mStringParams[n1++]);
              break;
            case RDB_VAL_TYPE_BLOB:
              //rv = stmt->BindBlobByIndex(i, ); XXX
            case RDB_VAL_TYPE_NULL:
              rv = stmt->BindNullByIndex(i);
              break;
          }
        }

        // yxu: no need, because we use ExecuteStep
        // if (NS_FAILED(stmt->Execute())) {
        //   return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
        // }

        mCursor->SetStmt(stmt);

        if (!mSync) {
          RDBDispatchEventToJS("success", mCursor.forget());
        }
        mSuccess = true;
      }
      return NS_OK;


    case RDB_REQUEST_DELETE:
      if (XRE_GetProcessType() != GeckoProcessType_Default) {
        // yxu TODO
      } else {

        if (!mSync) {
          mRequest->mRDB->WaitForSeq(mWaitForSeqNo);
        }
        
        mRequest->mRDB->FillTabInfo(mRequest->mTab);

        if (mRequest->mRDB->mBlobCols[mRequest->mTab].size() > 0) {
          nsCString s = NS_LITERAL_CSTRING("SELECT ");
          int i = 0;
          for (const nsCString& it : mRequest->mRDB->mBlobCols[mRequest->mTab]) {
            if (i > 0)
              s.Append(",");
            else
              i++;
            s.Append(it);
          }
          s.Append(" FROM ");
          s.Append(mRequest->mTab);
          s.Append(" WHERE ");
          if (mRequest->mWhere.Length() > 0)
            s.Append(mRequest->mWhere);
          else
            s.Append("1");

          nsCOMPtr<mozIStorageStatement> stmt;
          rv = mRequest->mRDB->GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
          NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);

          int n0 = 0, n1 = 0, n2 = 0;
          for (uint32_t i = 0; i < mRequest->mValTypes.Length(); i++) {
            switch (mRequest->mValTypes[i]) {
              case RDB_VAL_TYPE_NUMBER:
                rv = stmt->BindDoubleByIndex(i, mRequest->mNumVals[n0++]);
                break;
              case RDB_VAL_TYPE_STRING:
                rv = stmt->BindStringByIndex(i, mRequest->mStringVals[n1++]);
                break;
              case RDB_VAL_TYPE_BLOB:
                //rv = stmt->BindBlobByIndex(i, ); XXX
              case RDB_VAL_TYPE_NULL:
                rv = stmt->BindNullByIndex(i);
                break;
            }
          }
          bool res;
          while (NS_SUCCEEDED(stmt->ExecuteStep(&res)) && res) {
            uint64_t rn;
            for (uint32_t i = 0; i < mRequest->mRDB->mBlobCols[mRequest->mTab].size(); i++) {
              rv = stmt->GetInt64(i, (int64_t*)&rn);
              NS_ENSURE_SUCCESS(rv, rv);
              RDBDeleteFile(mRequest->mRDB->mBlobPath, rn);
            }
          }
          stmt->Reset();
        }

        nsCString s = NS_LITERAL_CSTRING("DELETE FROM ");
        s.Append(mRequest->mTab);
        s.Append(" WHERE ");
        if (mRequest->mWhere.Length() > 0)
          s.Append(mRequest->mWhere);
        else
          s.Append("1");

        nsCOMPtr<mozIStorageStatement> stmt;
        rv = mRequest->mRDB->GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
        NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);

        int n0 = 0, n1 = 0, n2 = 0;
        for (uint32_t i = 0; i < mRequest->mValTypes.Length(); i++) {
          switch (mRequest->mValTypes[i]) {
            case RDB_VAL_TYPE_NUMBER:
              rv = stmt->BindDoubleByIndex(i, mRequest->mNumVals[n0++]);
              break;
            case RDB_VAL_TYPE_STRING:
              rv = stmt->BindStringByIndex(i, mRequest->mStringVals[n1++]);
              break;
            case RDB_VAL_TYPE_BLOB:
              //rv = stmt->BindBlobByIndex(i, ); XXX
            case RDB_VAL_TYPE_NULL:
              rv = stmt->BindNullByIndex(i);
              break;
          }
        }

        if (NS_FAILED(stmt->Execute())) {
          return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
        }

        stmt->Reset();
        if (!mSync) {
          mRequest->mRDB->NotifyComplete();
          RDBDispatchEventToJS("success", mRequest.forget());
        }
        mSuccess = true;
      }
      return NS_OK;

    case RDB_REQUEST_EXECRAW:
      if (XRE_GetProcessType() != GeckoProcessType_Default) {
        // yxu TODO
      } else {

        if (!mSync) {
          mRequest->mRDB->WaitForSeq(mWaitForSeqNo);
        }
        
        nsCOMPtr<mozIStorageStatement> stmt;
        rv = mRequest->mRDB->GetConnection()->CreateStatement(mRequest->mStmt,
                                                    getter_AddRefs(stmt));
        NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);

        if (!mRequest->nullParams) {
          Sequence<nsString>& params = mRequest->mParams;
          for (uint32_t i = 0; i < params.Length(); i++) {
            rv = stmt->BindStringByIndex(i, params[i]);
            NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);
          }
        }

        if (NS_FAILED(stmt->Execute())) {
          return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
        }

        if (mRefreshMetadata) {
          mRequest->mRDB->FillTabInfo(true);
        }

        if (!mSync) {
          mRequest->mRDB->NotifyComplete();
          RDBDispatchEventToJS("success", mRequest.forget());
        }
        mSuccess = true;
      }
      return NS_OK;

    case RDB_REQUEST_TEST:
      if (!mRequest) {
        return NS_ERROR_FAILURE;
      }
      if (XRE_GetProcessType() != GeckoProcessType_Default) {
        RDBRequestConstructorParams para(RDB_REQUEST_TEST);
        RDBRequestChild* actor = new RDBRequestChild(mRequest, para);

        mRequest->mRDB->GetActorChild()->
            SendPRDBRequestConstructor(actor, para);
        return NS_OK;
      } else {
        mRequest->NotifyTestComplete();
        if (!mSync) {
          RDBDispatchEventToJS("success", mRequest.forget());
        }
        mSuccess = true;
        // TODO
        return NS_OK;
      }

      return NS_OK;

    default:
      return NS_OK;
  }

  return NS_OK;
}

NS_IMPL_ISUPPORTS(RDBRunnable, nsIRunnable)

// NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION(RDBRunnable)
//   NS_INTERFACE_MAP_ENTRY(nsIRunnable)
// NS_INTERFACE_MAP_END

// NS_IMPL_CYCLE_COLLECTING_ADDREF(RDBRunnable)
// NS_IMPL_CYCLE_COLLECTING_RELEASE(RDBRunnable)

// NS_IMPL_CYCLE_COLLECTION(RDBRunnable,
//                          mRequest,
//                          mCursor)
//                          //mWindow,
//                          //mRDB)



void nsDOMRDB::Show(nsString& retval) {
  retval.AssignLiteral("It works!");
}


void nsDOMRDB::GetAttr(nsString& retval) {
  retval = mAttr;
}

void nsDOMRDB::SetAttr(const nsAString& value) {
  mAttr = value;
}

// static
nsresult nsDOMRDB::GetRDBForInternal(nsPIDOMWindow* aWin,
                                     const nsAString& aDBName,
                                     nsDOMRDB** aRDB,
                                     bool sync,
                                     bool refreshMetadata) {
  nsresult rv;

  nsRefPtr<nsDOMRDB> db = new nsDOMRDB(aWin);
  db->mAttr = aDBName;
  db->mName = aDBName;
  db->mRDBPath = NS_LITERAL_STRING(RDB_STORE_FILE_LOCATION);
  if (db->mName.Find("/", false, 0, -1) == kNotFound) {
    db->mRDBPath.Append(RDBGetAppNameById(db->AppId()));
    db->mRDBPath.Append(NS_ConvertASCIItoUTF16("/"));
    db->mDirectAccess = true;
  }
  db->mRDBPath.Append(aDBName);
  db->mBlobPath = db->mRDBPath;
  db->mDirPath = db->mRDBPath;
  db->mRDBPath.Append(NS_ConvertASCIItoUTF16(".rdb"));

  nsCOMPtr<nsIFile> f = do_CreateInstance(NS_LOCAL_FILE_CONTRACTID);
  f->InitWithPath(db->mRDBPath);
  bool exists;
  rv = f->Exists(&exists);
  if (!exists) {
    rv = f->Create(nsIFile::NORMAL_FILE_TYPE, 00600);
  }

  db->mBlobPath.Append(NS_ConvertASCIItoUTF16("_blob/"));
  db->mDirPath.Append(NS_ConvertASCIItoUTF16("_dir/"));
  mozilla::HoldJSObjects(db.get());

  if (XRE_GetProcessType() != GeckoProcessType_Default) {
    ContentChild* contentChild = ContentChild::GetSingleton();
    NS_ASSERTION(contentChild, "Null ContentChild!");

    RDBChild* actor = new RDBChild(contentChild, NS_LITERAL_CSTRING("fake"));
    contentChild->SendPRDBConstructor(actor);
    db->mActorChild = actor;
  }

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_OPEN,
        (RDBRequest*)nullptr, db, false, 0);

  r->mRefreshMetadata = refreshMetadata;

  if (sync) {
    rv = r->Run();
  } else {
    rv = NS_DispatchToMainThread(r);
  }

  if (NS_FAILED(rv)) {
    return rv;
  }
  
  db.forget(aRDB);

  return rv;
}

// static
nsresult nsDOMRDB::GetRDBFor(nsPIDOMWindow* aWin,
                             const nsAString& aDBName,
                             nsDOMRDB** aRDB) {
  return GetRDBForInternal(aWin, aDBName, aRDB, false, true);
}

void nsDOMRDB::Close() {
  // if (mConnection)
  //  mConnection->asyncClose();
}

JSObject*
nsDOMRDB::WrapObject(JSContext* aCx)
{
  return RDBBinding::Wrap(aCx, this);
}

nsDOMRDB::nsDOMRDB(nsPIDOMWindow* aWin)
  : RDBWrapperCache(aWin)
  , mSync(false)
  , mWindow(aWin)
  , mActorChild(nullptr)
  , mConnection(nullptr)
  , mMutex("nsDOMRDB.mMutex")
  , mAppId(-1)
  , mDirectAccess(false)
  , mLastWrite(0)
  , mLastOp(0)
  , mLastComplete(0)
  , mLastCompleteWithBlob(0)
  , mMonitor("nsDOMRDB.mMonitor")
  , mRequestOrder(true)
{
  SetIsDOMBinding();
}

nsDOMRDB::~nsDOMRDB()
{
  if (mActorChild)
    mActorChild->Send__delete__(mActorChild);
  // if (mPerms)
  //   delete mPerms;
  NS_ASSERTION(!mActorChild, "Should have cleared in Send__delete__!");
}

void nsDOMRDB::WaitForSeq(uint64_t seq)
{
  if (!mRequestOrder)
    return;
  while (true) {
    MonitorAutoLock l(mMonitor);
    if (mLastComplete >= seq) {
      break;
    } else {
      l.Wait();
    }
  }
}

void nsDOMRDB::WaitForSeqWithBlob(uint64_t seq)
{
  if (!mRequestOrder)
    return;
  while (true) {
    MonitorAutoLock l(mMonitor);
    if (mLastCompleteWithBlob >= seq) {
      break;
    } else {
      l.Wait();
    }
  }
}

void nsDOMRDB::NotifyComplete()
{
  if (!mRequestOrder)
    return;
  MonitorAutoLock l(mMonitor);
  mLastComplete++;
  mLastCompleteWithBlob++;
  l.NotifyAll();
}

void nsDOMRDB::NotifyCompleteNoBlob()
{
  if (!mRequestOrder)
    return;
  MonitorAutoLock l(mMonitor);
  mLastComplete++;
  l.NotifyAll();
}

void nsDOMRDB::NotifyCompleteForBlob()
{
  if (!mRequestOrder)
    return;
  MonitorAutoLock l(mMonitor);
  mLastCompleteWithBlob++;
  l.NotifyAll();
}


NS_IMPL_CYCLE_COLLECTION_CLASS(nsDOMRDB)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(nsDOMRDB, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mWindow)
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mConnection)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(nsDOMRDB, RDBWrapperCache)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mWindow)
  //NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mConnection)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(nsDOMRDB, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(nsDOMRDB)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(nsDOMRDB, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(nsDOMRDB, RDBWrapperCache)


already_AddRefed<RDBRequest>
nsDOMRDB::Test(const nsAString &aName,
               ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(cx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }


  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mRDB = this;

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_TEST,
        request, nullptr, mSync, 0);

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return request.forget();
}

nsresult
nsDOMRDB::CreateSchemaInfoTab()
{
  return GetConnection()->ExecuteSimpleSQL(NS_LITERAL_CSTRING(
    "CREATE TABLE IF NOT EXISTS " RDB_SUBSCHEMA_TAB "(" RDB_COL_APPID
    " INTEGER, tab TEXT, "
    "insertable INTEGER DEFAULT 1, queryable INTEGER DEFAULT 1,"
    "updatable INTEGER DEFAULT 1, deletable INTEGER DEFAULT 1,"
    "closed_cols TEXT DEFAULT \'\' , extrawhere TEXT DEFAULT \'\',"
    "fixed_cols TEXT DEFAULT \'\')" ));
}

void
nsDOMRDB::FillTabInfo(nsCString aTab, bool aForced)
{
  MutexAutoLock lock(mMutex);
  FillTabInfoLocked(aTab, aForced);
}

void
nsDOMRDB::FillTabInfoLocked(nsCString aTab, bool aForced)
{
  if (aTab == nsCString(RDB_SUBSCHEMA_TAB))
    return;
  if (aForced || mBlobCols.find(aTab) == mBlobCols.end()) {
    nsCString s("PRAGMA TABLE_INFO(");
    s.Append(aTab);
    s.Append(")");
    mBlobCols[aTab];
    mTabs[aTab];

    nsCOMPtr<mozIStorageStatement> stmt;
    nsresult rv = GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
    if (NS_FAILED(rv))
      return;

    bool res;
    char tmp[512];
    bool hasAppId = false;
    PerTableCapInfo& info = mTabs[aTab];
    while (NS_SUCCEEDED(stmt->ExecuteStep(&res)) && res) {
      nsCString colName;
      rv = stmt->GetUTF8String(1, colName);
      // NS_ENSURE_SUCCESS(rv, rv);
      if (RDBColIsMeta(colName)) {
        continue;
      }

      if (0 == strcmp(colName.BeginReading(), RDB_COL_APPID)) {
        hasAppId = true;
        
        if (!mDirectAccess) {
          sprintf(tmp, RDB_COL_APPID "=0 OR " RDB_COL_APPID "=%ld", (long)AppId());
          info.mWhere.Assign(tmp);
        }
      }

      if (RDBColIsBlob(colName)) {
        mBlobCols[aTab].insert(colName);
      }
      info.mCols.insert(colName);
    }
    stmt->Reset();
    if (!hasAppId) {
      info.mInsertable = false;
      info.mQueryable = false;
      info.mUpdatable = false;
      info.mDeletable = false;
    }

    sprintf(tmp, "%ld", (long)AppId());
    s.AssignLiteral("SELECT insertable, queryable, updatable, deletable, "
      " closed_cols, extrawhere, fixed_cols FROM " RDB_SUBSCHEMA_TAB " WHERE ("
      RDB_COL_APPID "=0 OR " RDB_COL_APPID "=");
    s.Append(tmp);
    s.Append(") AND tab=\'");
    s.Append(aTab);
    s.Append("\' ORDER BY " RDB_COL_APPID " DESC");
    rv = GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
    if (NS_FAILED(rv))
      return;

    if (NS_SUCCEEDED(stmt->ExecuteStep(&res)) && res) {
      nsCString str;
      int64_t intval; 
      stmt->GetInt64(0, (&intval));
      if (intval)
        info.mInsertable = true;
      else
        info.mInsertable = false;

      stmt->GetInt64(1, (&intval));
      if (intval)
        info.mQueryable = true;
      else
        info.mQueryable = false;

      stmt->GetInt64(2, (&intval));
      if (intval)
        info.mUpdatable = true;
      else
        info.mUpdatable = false;

      stmt->GetInt64(3, (&intval));
      if (intval)
        info.mDeletable = true;
      else
        info.mDeletable = false;

      stmt->GetUTF8String(4, str);
      while (str.Length() > 0) {
        PRInt32 pos = str.Find(",", false, 0, -1);
        if (pos == kNotFound) {
          info.mCols.erase(str);
          break;
        }
        memcpy(tmp, str.BeginReading(), pos);
        tmp[pos] = '\0';
        info.mCols.erase(nsCString(tmp));
        str = nsCString(str.BeginReading() + pos + 1);
      }

      stmt->GetUTF8String(5, str);
      if (str.Length() > 0) {
        nsCString where("(");
        where.Append(info.mWhere);
        where.Append(") AND (");
        where.Append(str);
        where.Append(")");
        info.mWhere = where;
      }

      stmt->GetUTF8String(6, str);
      while (str.Length() > 0) {
        PRInt32 pos = str.Find(",", false, 0, -1);
        if (pos == kNotFound) {
          PRInt32 cpos = str.Find(":", false, 0, -1);
          if (cpos == kNotFound)
            continue;
          strcpy(tmp, str.BeginReading());
          tmp[cpos] = '\0';
          info.mFixedStringCols[nsCString(tmp)] = NS_ConvertASCIItoUTF16(tmp + cpos + 1);
          break;
        }

        PRInt32 cpos = str.Find(":", false, 0, pos);
        if (cpos != kNotFound) {
          memcpy(tmp, str.BeginReading(), pos);
          tmp[pos] = '\0';
          tmp[cpos] = '\0';
          info.mFixedStringCols[nsCString(tmp)] = NS_ConvertASCIItoUTF16(tmp + cpos + 1);
        }
        str = nsCString(str.BeginReading() + pos + 1);
      }
    }
    stmt->Reset();
  }
}

void
nsDOMRDB::FillTabInfo(bool mForced)
{
    nsCString s("SELECT name FROM sqlite_master WHERE "
      " type=\'table\' AND name != \'sqlite_sequence\';");
    nsCOMPtr<mozIStorageStatement> stmt;
    nsresult rv = GetConnection()->CreateStatement(s, getter_AddRefs(stmt));
    // NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);

    bool res;
    MutexAutoLock lock(mMutex);
    while (NS_SUCCEEDED(stmt->ExecuteStep(&res)) && res) {
      nsCString tab;
      rv = stmt->GetUTF8String(0, tab);
      // NS_ENSURE_SUCCESS(rv, rv);
      FillTabInfoLocked(tab, mForced);
    }
    stmt->Reset();
}

already_AddRefed<RDBRequest>
nsDOMRDB::Insert(const nsACString& aTab,
       const Sequence<nsCString>& aCols,
       const Sequence<nsString>& aVals,
       ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(cx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }

  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mTab = aTab;
  request->mRDB = this;

  for (uint32_t i = 0; i < aCols.Length(); i++) {
    request->mColumns.AppendElement(aCols[i]);
    request->mValTypes.AppendElement(RDB_VAL_TYPE_STRING);
    request->mStringVals.AppendElement(aVals[i]);
  }

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_INSERT,
        request, nullptr, mSync, mLastOp++);
  mLastWrite = mLastOp;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return request.forget();
}

static void fillRequestValues(JSContext* cx,
                              JS::Handle<JSObject*>& aVals,
                              RDBRequest* request)
{
  JS::AutoIdArray ids(cx, JS_Enumerate(cx, aVals));
  for (uint32_t i = 0; i < ids.length(); i++) {
    JS::RootedId id(cx);
    id = ids[i];
    JS::RootedValue v(cx);
    if (!JS_IdToValue(cx, id, &v) || !v.isString())
      continue;
    JS::RootedString str(cx, v.toString());
    if (!str)
      continue;
    nsString col;
    if (!AssignJSString(cx, col, str))
      continue;

    nsCString ccol = NS_LossyConvertUTF16toASCII(col);

    JS::RootedValue vv(cx);
    if (!JS_GetPropertyById(cx, aVals, id, &vv)) {
      continue;
    }

    if (RDBColIsDir(ccol)) {
      request->mValTypes.AppendElement(RDB_VAL_TYPE_DIR);
      request->mDirNames.AppendElement(RDBGetRandNum());
    } else if (RDBColIsBlob(ccol)) {
      nsIDOMBlob* tmp;
      nsRefPtr<nsIDOMBlob> tmp_holder;
      JS::Rooted<JS::Value> tmpVal(cx, vv);
      if (!vv.isObject()) {
        continue;
      }
      if (NS_FAILED(UnwrapArg<nsIDOMBlob>(cx, vv, &tmp, static_cast<nsIDOMBlob**>(getter_AddRefs(tmp_holder)), &tmpVal))) {
        continue;  // ?
      }
      request->mBlobVals.AppendElement(tmp);
      request->mValTypes.AppendElement(RDB_VAL_TYPE_BLOB);
      request->mBlobNames.AppendElement(RDBGetRandNum());
    } else if (vv.isNumber()) {
      request->mValTypes.AppendElement(RDB_VAL_TYPE_NUMBER);
      request->mNumVals.AppendElement(vv.toNumber());
    } else if (vv.isString()) {
      request->mValTypes.AppendElement(RDB_VAL_TYPE_STRING);
      nsString tmp;
      JS::RootedString str(cx, vv.toString());
      AssignJSString(cx, tmp, str);
      request->mStringVals.AppendElement(tmp);
    } else if (vv.isNull()) {
      request->mValTypes.AppendElement(RDB_VAL_TYPE_NULL);
    }
    request->mColumns.AppendElement(ccol);
  }
}

already_AddRefed<RDBRequest>
nsDOMRDB::InsertInternal(JSContext* aCx,
                         const nsACString& aTab,
                         JS::Handle<JSObject*> aVals,
                         ErrorResult& aRv,
                         RDBSubsetDesc* aSrcDesc)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  //AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(aCx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }

  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mTab = aTab;
  fillRequestValues(aCx, aVals, request.get());
  request->mSrcDesc = aSrcDesc;
  request->mRDB = this;

  nsresult rv;
  nsCOMPtr<nsIRunnable> r = new RDBRunnable(RDB_REQUEST_INSERT,
        request, nullptr, mSync, mLastOp++);
  mLastWrite = mLastOp;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    //rv = NS_DispatchToCurrentThread(r);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }
  return request.forget();
}

already_AddRefed<RDBRequest>
nsDOMRDB::Insert(JSContext* aCx,
                 const nsACString& aTab,
                 JS::Handle<JSObject*> aVals,
                 ErrorResult& aRv)
{
  return InsertInternal(aCx, aTab, aVals, aRv, nullptr);
}


already_AddRefed<RDBCursor>
nsDOMRDB::Query(const Sequence<nsCString>& aTabs,
      const Sequence<nsCString>& aCols,
      const nsACString& aWhere,
      const Nullable<Sequence<nsString>>& aParams,
      const nsACString& aOrderBy,
      ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(cx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }

  nsRefPtr<RDBCursor> cursor =
    RDBCursor::Create(this, window, scriptOwner, nullptr);

  cursor->mTabs = aTabs;
  cursor->mCols = aCols;
  cursor->mWhere = aWhere;
  cursor->mOrderBy = aOrderBy;

  if (!aParams.IsNull()) {
    for (uint32_t i = 0; i < aParams.Value().Length(); i++) {
      cursor->mParamTypes.AppendElement(RDB_VAL_TYPE_STRING);
      cursor->mStringParams.AppendElement(aParams.Value()[i]);
    }
  }

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_QUERY,
        cursor, nullptr, mSync, mLastWrite);
  mLastOp++;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return cursor.forget();
}

static bool
getColCol(JSContext* cx, JS::Handle<JSObject*> obj,
          const char* connection, nsCString& res)
{

  JS::AutoIdArray ids(cx, JS_Enumerate(cx, obj));
  for (uint32_t i = 0; i < ids.length(); i++) {
    JS::RootedId id(cx);
    id = ids[i];
    JS::RootedValue v(cx);
    if (!JS_IdToValue(cx, id, &v) || !v.isString())
      continue;
    JS::RootedString str(cx, v.toString());
    if (!str)
      continue;
    nsString tmp;
    if (!AssignJSString(cx, tmp, str))
      continue;

    if (tmp.LowerCaseEqualsASCII("type", 4) ||
        tmp.LowerCaseEqualsASCII("visited", 7)) {
      continue;
    }

    res = NS_LossyConvertUTF16toASCII(tmp);

    JS::RootedValue vv(cx);
    if (!JS_GetPropertyById(cx, obj, id, &vv)) {
      continue;
    }

    if (vv.isString()) {
      JS::RootedString str(cx, vv.toString());
      AssignJSString(cx, tmp, str);
      res.Append(connection);
      res.Append(NS_LossyConvertUTF16toASCII(tmp));
      return true;
    }
    return false;
  }
  return false;
}

//static
bool
nsDOMRDB::GetTerms(JSContext* cx, JS::Handle<JSObject*> obj,
                   nsTArray<short>& aParamTypes,
                   nsTArray<nsString>& aStringParams,
                   nsTArray<double>& aNumParams,
                   const char* connection, nsCString& res)
{
  char tmp[8];
  JS::RootedValue vv(cx);
  for (uint32_t i = 1; i < 100; i++) {
    sprintf(tmp, "term%d", i);

    if (!JS_GetProperty(cx, obj, tmp, &vv) || vv.isUndefined())
      return i > 1;

    if (i > 1 && strcmp("NOT", connection) == 0)
      return false;

    if (i == 1) {
      if (strcmp("NOT", connection) == 0)
        res.AssignLiteral("NOT (");
      else
        res.AssignLiteral("(");
    } else {
      res.Append(connection);
      res.Append("(");
    }
    
    if (!vv.isObject()) {
      return false;
    }

    nsCString stmp;

    JS::RootedObject vo(cx, &vv.toObject());
    if (ConstructWhereInternal(cx, vo, aParamTypes, aStringParams, aNumParams, stmp)) {
      res.Append(stmp);
      res.Append(")");
    }
  }
  return false;
}

static bool
getColVal(JSContext* cx, JS::Handle<JSObject*> obj,
          nsTArray<short>& aParamTypes,
          nsTArray<nsString>& aStringParams,
          nsTArray<double>& aNumParams,
          const char* connection, nsCString& res)
{

  JS::AutoIdArray ids(cx, JS_Enumerate(cx, obj));
  for (uint32_t i = 0; i < ids.length(); i++) {
    JS::RootedId id(cx);
    id = ids[i];
    JS::RootedValue v(cx);
    if (!JS_IdToValue(cx, id, &v) || !v.isString())
      continue;
    JS::RootedString str(cx, v.toString());
    if (!str)
      continue;
    nsString tmp;
    if (!AssignJSString(cx, tmp, str))
      continue;

    if (tmp.LowerCaseEqualsASCII("type", 4) ||
        tmp.LowerCaseEqualsASCII("visited", 7)) {
      continue;
    }

    res = NS_LossyConvertUTF16toASCII(tmp);
    char buf[16];
    sprintf(buf, "%s?%lu", connection, aParamTypes.Length() + 1);
    res.Append(buf);

    JS::RootedValue vv(cx);
    if (!JS_GetPropertyById(cx, obj, id, &vv)) {
      continue;
    }

    if (vv.isString()) {
      JS::RootedString str(cx, vv.toString());
      AssignJSString(cx, tmp, str);
      aParamTypes.AppendElement(RDB_VAL_TYPE_STRING);
      aStringParams.AppendElement(tmp);
      return true;
    } else if (vv.isNumber()) {
      aParamTypes.AppendElement(RDB_VAL_TYPE_NUMBER);
      aNumParams.AppendElement(vv.toNumber());
      return true;
    } else if (vv.isNull()){
      aParamTypes.AppendElement(RDB_VAL_TYPE_NULL);
      return true;
    } else {
      return false;
    }
  }
  return false;
}

// static
bool
nsDOMRDB::ConstructWhereInternal(JSContext* aCx, JS::Handle<JSObject*> aWhere,
                                 nsTArray<short>& aParamTypes,
                                 nsTArray<nsString>& aStringParams,
                                 nsTArray<double>& aNumParams,
                                 nsCString& res)
{
  if (aWhere.get() == nullptr) {
    res.AssignLiteral("1");
    return true;
  }
  JS::RootedValue vv(aCx);
  if (JS_GetProperty(aCx, aWhere, "visited", &vv) && !vv.isUndefined())
    return false;
  vv = BOOLEAN_TO_JSVAL(true);
  JS_SetProperty(aCx, aWhere, "visited", vv);

  JS::RootedValue vt(aCx);
  if (!JS_GetProperty(aCx, aWhere, "type", &vt))
    return false;

  if (!vt.isString())
      return false;
  JS::RootedString typestr(aCx, vt.toString());

  nsString type;
  if (!AssignJSString(aCx, type, typestr))
    return false;

  nsString tmp;

  if (type.LowerCaseEqualsASCII("and", 3)) {
    return GetTerms(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, "AND", res);
  } else if (type.LowerCaseEqualsASCII("or", 2)) {
    return GetTerms(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, "OR", res);
  } else if (type.LowerCaseEqualsASCII("not", 3)) {
    return GetTerms(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, "NOT", res);
  } else if (type.LowerCaseEqualsASCII("=", 1)) {
    return getColVal(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, "=", res);
  } else if (type.LowerCaseEqualsASCII(">", 1)) {
    return getColVal(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, ">", res);
  } else if (type.LowerCaseEqualsASCII("<", 1)) {
    return getColVal(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, "<", res);
  } else if (type.LowerCaseEqualsASCII("<=", 2)) {
    return getColVal(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, "<=", res);
  } else if (type.LowerCaseEqualsASCII(">=", 2)) {
    return getColVal(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, ">=", res);
  } else if (type.LowerCaseEqualsASCII("!=", 2)) {
    return getColVal(aCx, aWhere,
      aParamTypes, aStringParams, aNumParams, "!=", res);
  } else if (type.LowerCaseEqualsASCII("=col", 4)) {
    return getColCol(aCx, aWhere, "=", res);
  } else if (type.LowerCaseEqualsASCII(">col", 4)) {
    return getColCol(aCx, aWhere, ">", res);
  } else if (type.LowerCaseEqualsASCII("<col", 4)) {
    return getColCol(aCx, aWhere, "<", res);
  } else if (type.LowerCaseEqualsASCII("<=col", 5)) {
    return getColCol(aCx, aWhere, "<=", res);
  } else if (type.LowerCaseEqualsASCII(">=col", 5)) {
    return getColCol(aCx, aWhere, ">=", res);
  } else if (type.LowerCaseEqualsASCII("!=col", 5)) {
    return getColCol(aCx, aWhere, "!=", res);
  }

  return false;
}

static void
clearVisited(JSContext* aCx, JS::Handle<JSObject*> aWhere)
{
  if (aWhere.get() == nullptr)
    return;
  JS_DeleteProperty(aCx, aWhere, "visited");

  JS::RootedValue vt(aCx);
  if (!JS_GetProperty(aCx, aWhere, "type", &vt))
    return;
  if (!vt.isString())
      return;
  JS::RootedString typestr(aCx, vt.toString());
  nsString type;
  if (!AssignJSString(aCx, type, typestr))
    return;

  if (type.LowerCaseEqualsASCII("and", 3) ||
      type.LowerCaseEqualsASCII("not", 3) ||
      type.LowerCaseEqualsASCII("or", 2)) {
    char tmp[8];
    JS::RootedValue vv(aCx);
    for (uint32_t i = 1; i < 100; i++) {
      sprintf(tmp, "term%d", i);
      if (!JS_GetProperty(aCx, aWhere, tmp, &vv) || vv.isUndefined())
        return;
      JS::RootedObject vo(aCx, &vv.toObject());
      clearVisited(aCx, vo);
    }
  }
}

// static
bool
nsDOMRDB::ConstructWhere(JSContext* aCx, JS::Handle<JSObject*> aWhere,
                         nsTArray<short>& aParamTypes,
                         nsTArray<nsString>& aStringParams,
                         nsTArray<double>& aNumParams,
                         nsCString& res)
{
  bool success = ConstructWhereInternal(aCx, aWhere, aParamTypes,
                  aStringParams, aNumParams, res);
  clearVisited(aCx, aWhere);
  return success;
}

// Internal use only
already_AddRefed<RDBCursor>
nsDOMRDB::QueryInternalRaw(JSContext* aCx,
                   const Sequence<nsCString>& aTabs,
                   const Sequence<nsCString>& aCols,
                   JS::Handle<JSObject*> aWhere,
                   const nsACString& aOrderBy,
                   ErrorResult& aRv,
                   nsCString* aExtraWhere,
                   nsTArray<short>* aParamTypes,
                   nsTArray<nsString>* aStringParams,
                   nsTArray<double>* aNumParams)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  //AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(aCx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }

  nsRefPtr<RDBCursor> cursor =
    RDBCursor::Create(this, window, scriptOwner, nullptr);

  cursor->mTabs = aTabs;
  cursor->mCols = aCols;
  nsCString tmp;
  if (aExtraWhere) {
    cursor->mWhere.AssignLiteral("(");
    cursor->mWhere.Append(*aExtraWhere); // TODO change index
    cursor->mWhere.Append(") AND (");
    uint32_t ns = 0, nn = 0;
    for (uint32_t j = 0; j < aParamTypes->Length(); j++) {
      switch ((*aParamTypes)[j]) {
        case RDB_VAL_TYPE_STRING:
          cursor->mParamTypes.AppendElement(RDB_VAL_TYPE_STRING);
          cursor->mStringParams.AppendElement((*aStringParams)[ns++]);
          break;
        case RDB_VAL_TYPE_NUMBER:
          cursor->mParamTypes.AppendElement(RDB_VAL_TYPE_NUMBER);
          cursor->mNumParams.AppendElement((*aNumParams)[nn++]);
          break;
      }
    }
  }

  if (!ConstructWhere(aCx, aWhere, cursor->mParamTypes,
    cursor->mStringParams, cursor->mNumParams, tmp)) {
    aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
    return nullptr;
  }

  if (aExtraWhere) {
    cursor->mWhere.Append(tmp);
    cursor->mWhere.Append(")");
  } else {
    cursor->mWhere = tmp;
  }
  cursor->mOrderBy = aOrderBy;

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_QUERY,
        cursor, nullptr, mSync, mLastWrite);
  mLastOp++;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return cursor.forget();
}

// Internal use
already_AddRefed<RDBCursor>
nsDOMRDB::QueryInternal(JSContext* aCx,
                        const Sequence<nsCString>& aTabs,
                        const Sequence<nsCString>& aCols,
                        JS::Handle<JSObject*> aWhere,
                        const nsACString& aOrderBy,
                        ErrorResult& aRv,
                        RDBSubsetDesc* aSrcDesc)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  //AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(aCx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }

  nsRefPtr<RDBCursor> cursor =
    RDBCursor::Create(this, window, scriptOwner, aSrcDesc);

  cursor->mTabs = aTabs;
  cursor->mCols = aCols;
  nsCString tmp;
  if (aSrcDesc) {
    cursor->mWhere.AssignLiteral("(");
    for (uint32_t i = 0; i <aTabs.Length(); i++) {
      PerTableCapInfo& info = aSrcDesc->mTabs[aTabs[i]];
      cursor->mWhere.Append(info.mWhere); // TODO change index
      cursor->mWhere.Append(") AND (");
      uint32_t ns = 0, nn = 0;
      for (uint32_t j = 0; j < info.mParamTypes.Length(); j++) {
        switch (info.mParamTypes[j]) {
          case RDB_VAL_TYPE_STRING:
            cursor->mParamTypes.AppendElement(RDB_VAL_TYPE_STRING);
            cursor->mStringParams.AppendElement(info.mStringParams[ns++]);
            break;
          case RDB_VAL_TYPE_NUMBER:
            cursor->mParamTypes.AppendElement(RDB_VAL_TYPE_NUMBER);
            cursor->mNumParams.AppendElement(info.mNumParams[nn++]);
            break;
        }
      }
    }
  }

  if (!ConstructWhere(aCx, aWhere, cursor->mParamTypes,
    cursor->mStringParams, cursor->mNumParams, tmp)) {
    aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
    return nullptr;
  }

  if (aSrcDesc) {
    cursor->mWhere.Append(tmp);
    cursor->mWhere.Append(")");
  } else {
    cursor->mWhere = tmp;
  }
  cursor->mOrderBy = aOrderBy;

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_QUERY,
        cursor, nullptr, mSync, mLastWrite);
  mLastOp++;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return cursor.forget();
}

// Query with WHERE object
already_AddRefed<RDBCursor>
nsDOMRDB::Query(JSContext* aCx,
      const Sequence<nsCString>& aTabs,
      const Sequence<nsCString>& aCols,
      JS::Handle<JSObject*> aWhere,
      const nsACString& aOrderBy,
      ErrorResult& aRv)
{
  return QueryInternal(aCx, aTabs, aCols, aWhere, aOrderBy,
            aRv, nullptr);
}



already_AddRefed<RDBRequest>
nsDOMRDB::Update(const nsACString& aTab,
       const nsACString& aWhere,
       const Nullable<Sequence<nsString>>& aParams,
       const Sequence<nsCString>& aCols,
       const Sequence<nsString>& aVals,
       ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(cx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }


  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mTab = aTab;
  request->mWhere = aWhere;
  request->mRDB = this;
  
  for (uint32_t i = 0; i < aCols.Length(); i++) {
    request->mColumns.AppendElement(aCols[i]);
    request->mValTypes.AppendElement(RDB_VAL_TYPE_STRING);
    request->mStringVals.AppendElement(aVals[i]);
  }

  if (aParams.IsNull()) {
    request->nullParams = true;
  } else {
    request->nullParams = false;
    request->mParams = aParams.Value();
  }


  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_UPDATE,
        request, nullptr, mSync, mLastOp++);
  mLastWrite = mLastOp;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return request.forget();
}

// Internal use only
already_AddRefed<RDBRequest>
nsDOMRDB::UpdateInternal(JSContext* aCx,
                         const nsACString& aTab,
                         JS::Handle<JSObject*> aWhere,
                         JS::Handle<JSObject*> aVals,
                         ErrorResult& aRv,
                         const PerTableCapInfo* aDescInfo)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  //AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(aCx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }

  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mTab = aTab;

  if (aDescInfo) {
    request->mWhere.AssignLiteral("(");
    request->mWhere.Append(aDescInfo->mWhere);
    request->mWhere.Append(") AND (");
    uint32_t ns = 0, nn = 0;
    for (uint32_t j = 0; j < aDescInfo->mParamTypes.Length(); j++) {
      switch (aDescInfo->mParamTypes[j]) {
        case RDB_VAL_TYPE_STRING:
          request->mValTypes.AppendElement(RDB_VAL_TYPE_STRING);
          request->mStringVals.AppendElement(aDescInfo->mStringParams[ns++]);
          break;
        case RDB_VAL_TYPE_NUMBER:
          request->mValTypes.AppendElement(RDB_VAL_TYPE_NUMBER);
          request->mNumVals.AppendElement(aDescInfo->mNumParams[nn++]);
          break;
      }
    }
  }

  nsCString tmp;
  if (!ConstructWhere(aCx, aWhere, request->mValTypes,
    request->mStringVals, request->mNumVals, tmp)) {
    aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
    return nullptr;
  }

  if (aDescInfo) {
    request->mWhere.Append(tmp);
    request->mWhere.Append(")");
  } else {
    request->mWhere = tmp;
  }
  request->mRDB = this;

  fillRequestValues(aCx, aVals, request.get());

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_UPDATE,
        request, nullptr, mSync, mLastOp++);
  mLastWrite = mLastOp;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return request.forget();
}

already_AddRefed<RDBRequest>
nsDOMRDB::Update(JSContext* aCx,
                 const nsACString& aTab,
                 JS::Handle<JSObject*> aWhere,
                 JS::Handle<JSObject*> aVals,
                 ErrorResult& aRv)
{
  return UpdateInternal(aCx, aTab, aWhere, aVals, aRv, nullptr);
}

already_AddRefed<RDBRequest>
nsDOMRDB::Delete(const nsACString& aTab,
       const nsACString& aWhere,
       const Nullable<Sequence<nsString>>& aParams,
       ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(cx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }


  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mTab = aTab;
  request->mWhere = aWhere;
  request->mRDB = this;

  if (!aParams.IsNull()) {
    for (uint32_t i = 0; i < aParams.Value().Length(); i++) {
      request->mValTypes.AppendElement(RDB_VAL_TYPE_STRING);
      request->mStringVals.AppendElement(aParams.Value()[i]);
    }
  }

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_DELETE,
        request, nullptr, mSync, mLastOp++);
  mLastWrite = mLastOp;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return request.forget();
}


already_AddRefed<RDBRequest>
nsDOMRDB::Delete(JSContext* aCx,
                 const nsACString& aTab,
                 JS::Handle<JSObject*> aWhere,
                 ErrorResult& aRv)
{
  return DeleteInternal(aCx, aTab, aWhere, aRv, nullptr);
}

already_AddRefed<RDBRequest>
nsDOMRDB::DeleteInternal(JSContext* aCx,
                         const nsACString& aTab,
                         JS::Handle<JSObject*> aWhere,
                         ErrorResult& aRv,
                         const PerTableCapInfo* aDescInfo)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(aCx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }

  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mTab = aTab;
  if (aDescInfo) {
    request->mWhere.AssignLiteral("(");
    request->mWhere.Append(aDescInfo->mWhere);
    request->mWhere.Append(") AND (");
    uint32_t ns = 0, nn = 0;
    for (uint32_t j = 0; j < aDescInfo->mParamTypes.Length(); j++) {
      switch (aDescInfo->mParamTypes[j]) {
        case RDB_VAL_TYPE_STRING:
          request->mValTypes.AppendElement(RDB_VAL_TYPE_STRING);
          request->mStringVals.AppendElement(aDescInfo->mStringParams[ns++]);
          break;
        case RDB_VAL_TYPE_NUMBER:
          request->mValTypes.AppendElement(RDB_VAL_TYPE_NUMBER);
          request->mNumVals.AppendElement(aDescInfo->mNumParams[nn++]);
          break;
      }
    }
  }

  nsCString tmp;
  if (!ConstructWhere(aCx, aWhere, request->mValTypes,
    request->mStringVals, request->mNumVals, tmp)) {
    aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
    return nullptr;
  }

  if (aDescInfo) {
    request->mWhere.Append(tmp);
    request->mWhere.Append(")");
  } else {
    request->mWhere = tmp;
  }
  request->mRDB = this;

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_DELETE,
        request, nullptr, mSync, mLastOp++);
  mLastWrite = mLastOp;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return request.forget();
}

already_AddRefed<RDBRequest>
nsDOMRDB::CreateTable(const nsACString& aTab,
                      const Sequence<nsCString>& aCols,
                      const Sequence<nsCString>& aTypes,
                      ErrorResult& aRv)
{
  if (aCols.Length() <= 0 || aCols.Length() != aTypes.Length()) {
    aRv.Throw(NS_ERROR_DOM_RDB_DATA_ERR);
    return nullptr;
  }
  nsCString stmt = NS_LITERAL_CSTRING("CREATE TABLE IF NOT EXISTS ");
  stmt.Append(aTab);
  stmt.Append("(pk INTEGER PRIMARY KEY AUTOINCREMENT");

  for (uint32_t i = 0; i < aCols.Length(); i++) {
    stmt.Append(",");
    stmt.Append(aCols[i]);
    stmt.Append(" ");
    if (aTypes[i].LowerCaseEqualsASCII("fileblob")) {
      // col name must start with BLOB
      if (!RDBColIsBlob(aCols[i])) {
        aRv.Throw(NS_ERROR_DOM_RDB_DATA_ERR);
        return nullptr;
      }
      stmt.Append("INTEGER DEFAULT 0");
    } else if (aTypes[i].LowerCaseEqualsASCII("dir")) {
      // col name must start with DIR
      if (!RDBColIsDir(aCols[i])) {
        aRv.Throw(NS_ERROR_DOM_RDB_DATA_ERR);
        return nullptr;
      }
      stmt.Append("INTEGER DEFAULT 0");
    } else {
      // col name must not start with BLOB or DIR
      if (RDBColIsBlob(aCols[i]) || RDBColIsDir(aCols[i])) {
        aRv.Throw(NS_ERROR_DOM_RDB_DATA_ERR);
        return nullptr;
      }
      stmt.Append(aTypes[i]);
    }
  }

  stmt.Append(");");

  Nullable<Sequence<nsString>> nullParams;
  nullParams.SetNull();

  nsRefPtr<RDBRequest> req = ExecRaw(stmt, nullParams, true, aRv);

  return req.forget();
}


already_AddRefed<RDBRequest>
nsDOMRDB::StartTx(ErrorResult& aRv)
{
  
  Nullable<Sequence<nsString>> nullParams;
  nullParams.SetNull();

  nsRefPtr<RDBRequest> req =
      ExecRaw(NS_LITERAL_CSTRING("BEGIN;"), nullParams, aRv);

  return req.forget();
}

already_AddRefed<RDBRequest>
nsDOMRDB::AbortTx(ErrorResult& aRv)
{
  
  Nullable<Sequence<nsString>> nullParams;
  nullParams.SetNull();

  nsRefPtr<RDBRequest> req =
      ExecRaw(NS_LITERAL_CSTRING("ROLLBACK;"), nullParams, aRv);

  return req.forget();
}

already_AddRefed<RDBRequest>
nsDOMRDB::CommitTx(ErrorResult& aRv)
{
  
  Nullable<Sequence<nsString>> nullParams;
  nullParams.SetNull();

  nsRefPtr<RDBRequest> req =
      ExecRaw(NS_LITERAL_CSTRING("COMMIT;"), nullParams, aRv);

  return req.forget();
}

already_AddRefed<RDBRequest>
nsDOMRDB::ExecRaw(const nsACString& aStmt,
                  const Nullable<Sequence<nsString>>& aParams,
                  ErrorResult& aRv)
{
  return ExecRaw(aStmt, aParams, false, aRv);
}

already_AddRefed<RDBRequest>
nsDOMRDB::ExecRaw(const nsACString& aStmt,
                  const Nullable<Sequence<nsString>>& aParams,
                  bool aRefreshMetadata,
                  ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mWindow, "Must have one of these!");

  AutoJSContext cx;
  nsCOMPtr<nsPIDOMWindow> window;
  JS::Rooted<JSObject*> scriptOwner(cx);

  if (mWindow) {
    window = mWindow;
    scriptOwner =
      static_cast<nsGlobalWindow*>(window.get())->FastGetGlobalJSObject();
  } else {
    scriptOwner = nullptr;
  }


  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(this, window, scriptOwner);

  request->mStmt = aStmt;

  if (aParams.IsNull()) {
    request->nullParams = true;
  } else {
    request->nullParams = false;
    request->mParams = aParams.Value();
  }

  request->mRDB = this;

  nsresult rv;

  nsRefPtr<RDBRunnable> r = new RDBRunnable(RDB_REQUEST_EXECRAW,
        request, nullptr, mSync, mLastOp++);
  mLastWrite = mLastOp;

  r->mRefreshMetadata = aRefreshMetadata;

  if (mSync) {
    rv = r->Run();
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    rv = GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
    }
  }

  return request.forget();
}

already_AddRefed<RDBSubsetDesc>
nsDOMRDB::GetDesc(ErrorResult& aRv)
{
  nsRefPtr<RDBSubsetDesc> res(new RDBSubsetDesc(nsRefPtr<nsDOMRDB>(this)));
  return res.forget();
}

uint32_t nsDOMRDB::AppId() {
  if (mAppId < 0) {
    uint32_t id;
    nsCOMPtr<nsIDocument> doc = mWindow->GetDoc();
    if (!doc)
      return 0;
    doc->NodePrincipal()->GetAppId(&id);
    mAppId = id;
  }
  return (uint32_t)mAppId;
}

//static
nsIThreadPool* nsDOMRDB::GetThreadPool()
{
  nsresult rv;
  if (!gThreadPool) {
    gThreadPool = do_CreateInstance(NS_THREADPOOL_CONTRACTID, &rv);
    if (NS_FAILED(rv)) { goto failed; }
    rv = gThreadPool->SetName(NS_LITERAL_CSTRING("RDB"));
    if (NS_FAILED(rv)) { goto failed; }
    rv = gThreadPool->SetThreadLimit(20);
    if (NS_FAILED(rv)) { goto failed; }
    rv = gThreadPool->SetIdleThreadLimit(5);
    if (NS_FAILED(rv)) { goto failed; }
    rv = gThreadPool->SetIdleThreadTimeout(30000);
    if (NS_FAILED(rv)) { goto failed; }
  }

  return gThreadPool;

failed:
  gThreadPool = nullptr;
  return nullptr;
}
