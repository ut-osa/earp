/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "RDBCursor.h"
#include "RDBRow.h"

#include "nsIScriptContext.h"

#include "mozilla/ContentEvents.h"
#include "mozilla/EventDispatcher.h"
#include "mozilla/dom/ErrorEventBinding.h"
#include "mozilla/dom/RDBCursorBinding.h"
#include "mozilla/dom/ScriptSettings.h"
#include "mozilla/dom/UnionTypes.h"
#include "nsComponentManagerUtils.h"
#include "nsDOMClassInfoID.h"
#include "nsDOMJSUtils.h"
#include "nsContentUtils.h"
#include "nsJSUtils.h"
#include "nsPIDOMWindow.h"
#include "nsString.h"
#include "nsThreadUtils.h"
#include "nsWrapperCacheInlines.h"
#include "DeviceStorage.h"

//#include "AsyncConnectionHelper.h"
//#include "RDBEvents.h"
#include "ReportInternalError.h"

#include "RDBDirHandle.h"
#include "RDBUtils.h"
#include "RDBSubsetDesc.h"
#include "RDBOwnershipToken.h"
#include "nsRDB.h"


using mozilla::dom::ErrorEventInit;

class RDBCursor;
using namespace mozilla;
using namespace mozilla::dom;


RDBCursor::RDBCursor(nsPIDOMWindow* aOwner, nsDOMRDB *aRDB, RDBSubsetDesc* aSrcDesc)
: RDBWrapperCache(aOwner),
  mSrcDesc(aSrcDesc),
  mRDB(aRDB),
  mErrorCode(NS_OK),
  mLineNo(0),
  mHaveResultOrErrorCode(false),
  mStmt(nullptr),
  mRow(new RDBRow(aOwner, this)),
  mHasRow(false),
  mFinished(false)
  //mActorParent(nullptr),
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
}

RDBCursor::~RDBCursor()
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
}

// static
already_AddRefed<RDBCursor>
RDBCursor::Create(nsDOMRDB* aRDB,
                  nsPIDOMWindow* aOwner,
                  JS::Handle<JSObject*> aScriptOwner,
                  RDBSubsetDesc* aSrcDesc)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  nsRefPtr<RDBCursor> cursor(new RDBCursor(aOwner, aRDB, aSrcDesc));

  cursor->SetScriptOwner(aScriptOwner);

  // TODO
//  if (!aRDB->FromIPC()) {
  if (true) {
    cursor->CaptureCaller();
  }

  cursor->mBlobPath = aRDB->mBlobPath;
  cursor->mDirPath = aRDB->mDirPath;

  return cursor.forget();
}

void
RDBCursor::Reset()
{
  if (!mFinished && !mRDB->Sync()) {
    mFinished = true;
    mRDB->NotifyComplete();
  }
  mStmt->Reset();
}

void
RDBCursor::SetError(nsresult aRv)
{
  NS_ASSERTION(NS_FAILED(aRv), "Er, what?");
  NS_ASSERTION(!mError, "Already have an error?");

  mHaveResultOrErrorCode = true;
  mError = new mozilla::dom::DOMError(GetOwner(), aRv);
  mErrorCode = aRv;
}



JSObject*
RDBCursor::WrapObject(JSContext* aCx)
{
  return RDBCursorBinding::Wrap(aCx, this);
}

void
RDBCursor::CaptureCaller()
{
  AutoJSContext cx;

  const char* filename = nullptr;
  uint32_t lineNo = 0;
  if (!nsJSUtils::GetCallingLocation(cx, &filename, &lineNo)) {
    NS_WARNING("Failed to get caller.");
    return;
  }

  mFilename.Assign(NS_ConvertUTF8toUTF16(filename));
  mLineNo = lineNo;
}

void
RDBCursor::FillScriptErrorEvent(ErrorEventInit& aEventInit) const
{
  aEventInit.mLineno = mLineNo;
  aEventInit.mFilename = mFilename;
}

DOMError*
RDBCursor::GetError(mozilla::ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  if (!mHaveResultOrErrorCode) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  return mError;
}

bool
RDBCursor::Next(ErrorResult& aRv)
{
  nsresult rv;
  if (!mStmt) {
    aRv.Throw(NS_ERROR_NOT_INITIALIZED);
    return false;
  }
  if (mFinished) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return false;
  }
  bool res;
  rv = mStmt->ExecuteStep(&res);
  if (NS_SUCCEEDED(rv)) {
    if (!res) {
      mStmt->Reset();
      mHasRow = false;
      if (!mRDB->Sync()) {
        mFinished = true;
        mRDB->NotifyComplete();
      }
    } else {
      mHasRow = true;
    }
    return res;
  }
  if (!mRDB->Sync()) {
    mFinished = true;
    mRDB->NotifyComplete();
  }
  mHasRow = false;
  aRv.Throw(rv);
  return false;
}

int64_t
RDBCursor::GetColumnCount(ErrorResult& aRv)
{
  if (!mStmt) {
    aRv.Throw(NS_ERROR_NOT_INITIALIZED);
    return -1;
  }

  uint32_t res;
  nsresult rv = mStmt->GetColumnCount(&res);

  if (NS_FAILED(rv))
    aRv.Throw(rv);
  return (int64_t)res;
}

void
RDBCursor::GetColumnName(const int64_t colIndex,
                         nsCString& retVal,
                         ErrorResult& aRv)
{
  nsresult rv;
  if (!mStmt) {
    aRv.Throw(NS_ERROR_NOT_INITIALIZED);
    return;
  }
  rv = mStmt->GetColumnName(colIndex, retVal);
  
  if (NS_FAILED(rv))
    aRv.Throw(rv);
}

int64_t
RDBCursor::GetColumnIndex(const nsACString& colName,
                          ErrorResult& aRv)
{
  nsresult rv;
  if (!mStmt) {
    aRv.Throw(NS_ERROR_NOT_INITIALIZED);
    return -1;
  }
  uint32_t res;
  rv = mStmt->GetColumnIndex(colName, &res);
  if (NS_FAILED(rv))
    aRv.Throw(rv);
  return (int64_t)res;
}

void
RDBCursor::GetByIndex(JSContext* aCtx,
                      const int64_t colIndex,
                      JS::MutableHandle<JS::Value> retval,
                      ErrorResult& aRv)
{
  nsresult rv;
  nsCString colName;
  rv = mStmt->GetColumnName(colIndex, colName);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    retval.set(JSVAL_NULL);
    return;
  }
  GetByIndex(aCtx, colIndex, retval, aRv, colName);
}

void
RDBCursor::GetByIndex(JSContext* aCtx,
                      const int64_t colIndex,
                      JS::MutableHandle<JS::Value> retval,
                      ErrorResult& aRv,
                      nsCString& colName)
{
  nsresult rv;
  if (!mStmt) {
    aRv.Throw(NS_ERROR_NOT_INITIALIZED);
    return;
  }

  int32_t type;
  rv = mStmt->GetTypeOfIndex(colIndex, &type);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return;
  }

  if (RDBColIsBlob(colName)) {
    uint64_t rn;
    rv = mStmt->GetInt64((int32_t)colIndex, (int64_t*)&rn);
    if (NS_FAILED(rv)) {
      retval.set(JSVAL_NULL);
      aRv.Throw(rv);
      return;
    }
    if (rn == 0) {
      retval.set(JSVAL_NULL);
      return;
    }

    nsRefPtr<nsIDOMBlob> blob = RDBGetDOMFile(mBlobPath, rn);
    
    if (!blob) {
      retval.set(JSVAL_NULL);
      aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
      return;
    }
    JS::Value vv =
      RDBInterfaceToJsval(GetOwner(), blob, &NS_GET_IID(nsIDOMBlob));
    retval.set(vv);
    return;
  }

  if (type == mozIStorageValueArray::VALUE_TYPE_INTEGER ||
      type == mozIStorageValueArray::VALUE_TYPE_FLOAT) {
    double dval;
    rv = mStmt->GetDouble(colIndex, &dval);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return;
    }
    retval.set(JS_NumberValue(dval));
  }
  else if (type == mozIStorageValueArray::VALUE_TYPE_TEXT) {
    uint32_t bytes;
    const jschar *sval = reinterpret_cast<const jschar *>(
      mStmt->AsSharedWString(colIndex, &bytes)
    );
    JSString *str = ::JS_NewUCStringCopyN(aCtx, sval, bytes / 2);
    if (!str) {
      aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
      return;
    }
    retval.set(STRING_TO_JSVAL(str));
  }
  else if (type == mozIStorageValueArray::VALUE_TYPE_BLOB) {
    uint32_t length;
    const uint8_t *blob = mStmt->AsSharedBlob(colIndex, &length);
    JSObject *obj = ::JS_NewArrayObject(aCtx, length);
    if (!obj) {
      aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
      return;
    }
    retval.set(OBJECT_TO_JSVAL(obj));

    // Copy the blob over to the JS array.
    JS::RootedObject scope(aCtx, obj);
    for (uint32_t i = 0; i < length; i++) {
      if (!::JS_SetElement(aCtx, scope, i, blob[i])) { // yxu XXX ???
        aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
        return;
      }
    }
  }
  else if (type == mozIStorageValueArray::VALUE_TYPE_NULL) {
    retval.set(JSVAL_NULL);
  }
  else {
    NS_ERROR("unknown column type returned, what's going on?");
  }
}

void
RDBCursor::GetByName(JSContext* cx,
                     const nsACString& colName,
                     JS::MutableHandle<JS::Value> retval,
                     ErrorResult& aRv)
{
  nsresult rv;
  if (!mStmt) {
    aRv.Throw(NS_ERROR_NOT_INITIALIZED);
    return;
  }
  uint32_t index;
  rv = mStmt->GetColumnIndex(colName, &index);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return;
  }

  nsCString c;
  c.Assign(colName);

  GetByIndex(cx, index, retval, aRv, c);
}
// nsresult
// RDBCursor::GetString(int colIndex, nsString& retVal, ErrorResult& aRv);

// nsresult
// RDBCursor::GetInteger(int colIndex, bool& retVal, ErrorResult& aRv);

// nsresult
// RDBCursor::GetReal(int colIndex, double& retVal, ErrorResult& aRv);

already_AddRefed<nsIDOMBlob>
RDBCursor::GetFile(const nsCString& aTab, const nsACString& colName, ErrorResult& aRv)
{
  uint64_t rn;
  uint32_t index;

  nsCString c;
  c.Assign(colName);

  if (!RDBColIsBlob(c)) {
    aRv.Throw(NS_ERROR_DOM_RDB_DATA_ERR);
    return nullptr;
  }

  if (mTabs.Length() > 1) {
    c.Assign(aTab);
    c.Append("__");
    c.Append(colName);
  }

  nsresult rv = mStmt->GetColumnIndex(c, &index);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  rv = mStmt->GetInt64(index, (int64_t*)&rn);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }
  if (rn == 0)
    return nullptr;

  nsRefPtr<nsIDOMBlob> blob = RDBGetDOMFile(mBlobPath, rn);
  
  if (blob)
    return blob.forget();
  return nullptr;
}

already_AddRefed<nsIDOMBlob>
RDBCursor::GetFile(const nsACString& colName, ErrorResult& aRv)
{
  return GetFile(mTabs[0], colName, aRv);
}

already_AddRefed<nsDOMDeviceStorage>
RDBCursor::GetDirDS(const nsCString& aTab, const nsACString& colName, ErrorResult& aRv)
{
  uint64_t rn;
  uint32_t index;

  nsCString c;
  c.Assign(colName);

  if (!RDBColIsDir(c)) {
    aRv.Throw(NS_ERROR_DOM_RDB_DATA_ERR);
    return nullptr;
  }

  if (mTabs.Length() > 1) {
    c.Assign(aTab);
    c.Append("__");
    c.Append(colName);
  }

  nsresult rv = mStmt->GetColumnIndex(c, &index);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  rv = mStmt->GetInt64(index, (int64_t*)&rn);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }
  if (rn == 0)
    return nullptr;

  nsString path(mDirPath);
  char tmp[32];
  sprintf(tmp, "%llx", rn);
  path.Append(NS_ConvertASCIItoUTF16(tmp));
  nsRefPtr<nsDOMDeviceStorage> dir;
  nsDOMDeviceStorage::CreateDeviceStorageForRDB(GetOwner(), path, getter_AddRefs(dir));
  
  if (dir)
    return dir.forget();
  return nullptr;
}

already_AddRefed<nsDOMDeviceStorage>
RDBCursor::GetDirDS(const nsACString& colName, ErrorResult& aRv)
{
  return GetDirDS(mTabs[0], colName, aRv);
}



already_AddRefed<RDBDirHandle>
RDBCursor::GetDir(const nsCString& aTab, const nsACString& colName, ErrorResult& aRv)
{
  uint64_t rn;
  uint32_t index;

  nsCString c;
  c.Assign(colName);

  if (!RDBColIsDir(c)) {
    aRv.Throw(NS_ERROR_DOM_RDB_DATA_ERR);
    return nullptr;
  }

  if (mTabs.Length() > 1) {
    c.Assign(aTab);
    c.Append("__");
    c.Append(colName);
  }

  nsresult rv = mStmt->GetColumnIndex(c, &index);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  rv = mStmt->GetInt64(index, (int64_t*)&rn);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }
  if (rn == 0)
    return nullptr;

  nsString path(mDirPath);
  char tmp[32];
  sprintf(tmp, "%llx", rn);
  path.Append(NS_ConvertASCIItoUTF16(tmp));
  nsRefPtr<RDBDirHandle> dir(new RDBDirHandle(GetOwner(), path));
  
  if (dir)
    return dir.forget();
  return nullptr;
}

already_AddRefed<RDBDirHandle>
RDBCursor::GetDir(const nsACString& colName, ErrorResult& aRv)
{
  return GetDir(mTabs[0], colName, aRv);
}

already_AddRefed<RDBSubsetDesc>
RDBCursor::GetPropDesc(const nsCString& aTab, const nsACString& aAttrTab, ErrorResult& aRv)
{
  nsCString col = RDBPropColName(aTab);
  int64_t pk;
  uint32_t pkcolindex = 0;
  nsresult rv;

  if (aTab != mTabs[0]) {
    nsCString pkcol = aTab;
    pkcol.Append("__pk");
    rv = mStmt->GetColumnIndex(pkcol, &pkcolindex);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  }

  rv = mStmt->GetInt64(pkcolindex, (int64_t*)&pk);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  nsCString where(aAttrTab);
  where.Append(".");
  where.Append(col);
  char buf[128];
  sprintf(buf, "=%lld", pk);
  where.Append(buf);
  nsRefPtr<RDBSubsetDesc> sub(mSrcDesc ?
      new RDBSubsetDesc(mSrcDesc) : new RDBSubsetDesc(mRDB));
  //sub->CloseAllWhere();
  sub->CloseAllOps();
  PerTableCapInfo& info = sub->mTabs[nsCString(aAttrTab)];
  info.mWhere = where;
  info.mFixedNumCols[col] = pk; // can only insert attr for this pk
  if (mSrcDesc) {
    PerTableCapInfo& srcInfo = mSrcDesc->mTabs[nsCString(aTab)];
    info.mInsertable = srcInfo.mUpdatable;
    info.mDeletable = srcInfo.mUpdatable;
    info.mUpdatable = srcInfo.mUpdatable;
  } else {
    info.mInsertable = true;
    info.mDeletable = true;
    info.mUpdatable = true;
  }
  info.mQueryable = true;
  return sub.forget();
}

already_AddRefed<RDBSubsetDesc>
RDBCursor::GetPropDesc(const nsACString& aAttrTab, ErrorResult& aRv)
{
  return GetPropDesc(mTabs[0], aAttrTab, aRv);
}

already_AddRefed<RDBSubsetDesc>
RDBCursor::GetCapDesc(const nsCString& aTab, const nsACString& aCap, ErrorResult& aRv)
{
  uint32_t ind;
  nsCString col;

  if (mTabs.Length() > 1) {
    col.Assign(aTab);
    col.Append("__");
    col.Append(RDBCapColName(aCap));
  } else {
    col = RDBCapColName(aCap);
  }

  nsresult rv = mStmt->GetColumnIndex(col, &ind);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  int64_t rn = 0;
  rv = mStmt->GetInt64(ind, &rn);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  char buf[128];
  sprintf(buf, ".pk=%lld", rn);
  nsCString where(aCap);
  where.Append(buf);
  nsRefPtr<RDBSubsetDesc> sub(mSrcDesc ?
      new RDBSubsetDesc(mSrcDesc) : new RDBSubsetDesc(mRDB));
  //sub->CloseAllWhere();
  sub->CloseAllOps();
  PerTableCapInfo& info = sub->mTabs[nsCString(aCap)];
  info.mWhere = where;
  if (mSrcDesc) {
    PerTableCapInfo& srcInfo = mSrcDesc->mTabs[nsCString(aTab)];
    info.mDeletable = srcInfo.mDeletable;
    info.mUpdatable = srcInfo.mUpdatable;
  } else {
    info.mDeletable = true;
    info.mUpdatable = true;
  }
  info.mQueryable = true;
  return sub.forget();
}

already_AddRefed<RDBSubsetDesc>
RDBCursor::GetCapDesc(const nsACString& aCap, ErrorResult& aRv)
{
  return GetCapDesc(mTabs[0], aCap, aRv);
}

already_AddRefed<RDBSubsetDesc>
RDBCursor::GetSelfDesc(const nsCString& aTab, ErrorResult& aRv)
{
  int64_t pk;
  uint32_t pkcolindex = 0;
  nsresult rv;
  if (aTab != mTabs[0]) {
    nsCString pkcol = aTab;
    pkcol.Append("__pk");
    rv = mStmt->GetColumnIndex(pkcol, &pkcolindex);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  }

  rv = mStmt->GetInt64(pkcolindex, (int64_t*)&pk);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  char buf[128];
  nsCString where(aTab);
  sprintf(buf, ".pk=%lld", pk);
  where.Append(buf);
  nsRefPtr<RDBSubsetDesc> sub(mSrcDesc ?
      new RDBSubsetDesc(mSrcDesc) : new RDBSubsetDesc(mRDB));
  //sub->CloseAllWhere();
  sub->CloseAllOps();
  PerTableCapInfo& info = sub->mTabs[aTab];
  info.mWhere = where;
  if (mSrcDesc) {
    PerTableCapInfo& srcInfo = mSrcDesc->mTabs[nsCString(aTab)];
    info.mDeletable = srcInfo.mDeletable;
    info.mUpdatable = srcInfo.mUpdatable;
  } else {
    info.mDeletable = true;
    info.mUpdatable = true;
  }
  info.mQueryable = true;
  info.mInsertable = false;
  return sub.forget();
}

already_AddRefed<RDBSubsetDesc>
RDBCursor::GetSelfDesc(ErrorResult& aRv)
{
  return GetSelfDesc(mTabs[0], aRv);
}

already_AddRefed<RDBOwnershipToken>
RDBCursor::GetToken(const nsCString& aTab, ErrorResult& aRv)
{
  int64_t pk;
  uint32_t pkcolindex = 0;
  nsresult rv;
  if (aTab != mTabs[0]) {
    nsCString pkcol = aTab;
    pkcol.Append("__pk");
    rv = mStmt->GetColumnIndex(pkcol, &pkcolindex);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  }

  rv = mStmt->GetInt64(pkcolindex, (int64_t*)&pk);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  nsRefPtr<RDBOwnershipToken> token(
    new RDBOwnershipToken(GetOwner(), mRDB->mName, aTab, pk));

  if (!mSrcDesc) {
    return token.forget();
  }

  uint32_t appidindex;
  if (mTabs.Length() == 1) {
    rv = mStmt->GetColumnIndex(nsCString(RDB_COL_APPID), &appidindex);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  } else {
    nsCString col = aTab;
    col.Append("__" RDB_COL_APPID);
    rv = mStmt->GetColumnIndex(col, &appidindex);
    if (NS_FAILED(rv)) {
      aRv.Throw(rv);
      return nullptr;
    }
  }

  int64_t appid;
  rv = mStmt->GetInt64(appidindex, (int64_t*)&appid);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }

  if (appid != 0 && appid != mSrcDesc->AppId()) {
    aRv.Throw(rv);
    return nullptr;
  }

  return token.forget();
}

already_AddRefed<RDBOwnershipToken>
RDBCursor::GetToken(ErrorResult& aRv)
{
  return GetToken(mTabs[0], aRv);
}

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBCursor)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBCursor, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mSrcDesc)
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mError)
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mStmt)
  //NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mRow)
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mRDB)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBCursor, RDBWrapperCache)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mSrcDesc)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mError)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mStmt)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mRow)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mRDB)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBCursor, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBCursor)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBCursor, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBCursor, RDBWrapperCache)

nsresult
RDBCursor::PreHandleEvent(EventChainPreVisitor& aVisitor)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  aVisitor.mCanHandle = true;
  // ???
  //aVisitor.mParentTarget = mRDB;
  return NS_OK;
}

void
RDBCursor::SetStmt(mozIStorageStatement* stmt)
{
  mStmt = stmt;
  //mRow->SetStatement(stmt);
}

RDBRow* RDBCursor::GetRow()
{
  if (!mHasRow)
    return nullptr;
  return mRow;
}
