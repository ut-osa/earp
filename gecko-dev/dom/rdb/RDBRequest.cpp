/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "RDBRequest.h"

#include "nsIScriptContext.h"

#include "mozilla/ContentEvents.h"
#include "mozilla/EventDispatcher.h"
#include "mozilla/dom/ErrorEventBinding.h"
#include "mozilla/dom/RDBRequestBinding.h"
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

//#include "AsyncConnectionHelper.h"
#include "RDBUtils.h"
#include "RDBOwnershipToken.h"
#include "ReportInternalError.h"

#ifdef MOZ_ENABLE_PROFILER_SPS
uint64_t gNextRequestSerialNumber = 1;
#endif



using mozilla::dom::ErrorEventInit;
using mozilla::dom::RDBRequestReadyState;

using namespace mozilla;
using namespace mozilla::dom;

RDBRequest::RDBRequest(nsPIDOMWindow* aOwner)
  : RDBWrapperCache(aOwner)
  , mRDB(nullptr)
  , mSrcDesc(nullptr)
  , mMonitor("RDBRequest.mMonitor")
  , mCompletionCnt(0)
  , mCompletionNum(0)
  , mHasInsertToken(false)
  , mResultVal(JSVAL_VOID)
    //mActorParent(nullptr),
#ifdef MOZ_ENABLE_PROFILER_SPS
  , mSerialNumber(gNextRequestSerialNumber++)
#endif
  , mErrorCode(NS_OK)
  , mLineNo(0)
  , mHaveResultOrErrorCode(false)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
}

RDBRequest::~RDBRequest()
{
  mResultVal = JSVAL_VOID;
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  // for (uint32_t i = 0; i < mBlobVals.Length(); i++) {
  //   delete mBlobVals[i];
  // }
}

// static
already_AddRefed<RDBRequest>
RDBRequest::Create(nsDOMRDB* aRDB,
                   nsPIDOMWindow* aOwner,
                   JS::Handle<JSObject*> aScriptOwner)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  nsRefPtr<RDBRequest> request(new RDBRequest(aOwner));

  request->SetScriptOwner(aScriptOwner);

  // TODO
//  if (!aRDB->FromIPC()) {
  if (true) {
    request->CaptureCaller();
  }

  return request.forget();
}

void
RDBRequest::Reset()
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  mResultVal = JSVAL_VOID;
  mHaveResultOrErrorCode = false;
  mError = nullptr;
}

void
RDBRequest::NotifyTestComplete()
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(!mHaveResultOrErrorCode, "Already called!");
  NS_ASSERTION(mResultVal.isUndefined(), "Should be undefined!");

  if (NS_FAILED(CheckInnerWindowCorrectness())) {
    return;
  }

  mHaveResultOrErrorCode = true;
  mTestRes.AssignLiteral("Async Test Success!");
}

void
RDBRequest::SetError(nsresult aRv)
{
  NS_ASSERTION(NS_FAILED(aRv), "Er, what?");
  NS_ASSERTION(!mError, "Already have an error?");

  mHaveResultOrErrorCode = true;
  mError = new mozilla::dom::DOMError(GetOwner(), aRv);
  mErrorCode = aRv;

  mResultVal = JSVAL_VOID;
}

#ifdef DEBUG
nsresult
RDBRequest::GetErrorCode() const
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");
  NS_ASSERTION(mHaveResultOrErrorCode, "Don't call me yet!");
  return mErrorCode;
}
#endif

void
RDBRequest::CaptureCaller()
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
RDBRequest::FillScriptErrorEvent(ErrorEventInit& aEventInit) const
{
  aEventInit.mLineno = mLineNo;
  aEventInit.mFilename = mFilename;
}

RDBRequestReadyState
RDBRequest::ReadyState() const
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  if (IsPending()) {
    return RDBRequestReadyState::Pending;
  }

  return RDBRequestReadyState::Done;
}

JSObject*
RDBRequest::WrapObject(JSContext* aCx)
{
  return RDBRequestBinding::Wrap(aCx, this);
}

void
RDBRequest::GetResult(JS::MutableHandle<JS::Value> aResult,
                      ErrorResult& aRv) const
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  if (!mHaveResultOrErrorCode) {
    // XXX Need a real error code here.
    aRv.Throw(NS_ERROR_DOM_RDB_NOT_ALLOWED_ERR);
  }

  JS::ExposeValueToActiveJS(mResultVal);
  aResult.set(mResultVal);
}

void
RDBRequest::GetTestRes(nsString& retval, ErrorResult& aRv) const
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  if (!mHaveResultOrErrorCode) {
    // XXX Need a real error code here.
    aRv.Throw(NS_ERROR_DOM_RDB_NOT_ALLOWED_ERR);
  }

  retval = mTestRes;
}

mozilla::dom::DOMError*
RDBRequest::GetError(mozilla::ErrorResult& aRv)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  if (!mHaveResultOrErrorCode) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  return mError;
}


void
RDBRequest::NotifyCompleteStep()
{
  MonitorAutoLock lock(mMonitor);
  mCompletionCnt++;
  if (mCompletionCnt == mCompletionNum) {
    lock.Notify();
  }
}

void
RDBRequest::WaitForComplete()
{
  MonitorAutoLock lock(mMonitor);
  while (mCompletionCnt != mCompletionNum)
    lock.Wait();
}


already_AddRefed<RDBOwnershipToken>
RDBRequest::GetToken(ErrorResult& aRv)
{
  if (!mHasInsertToken) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  nsRefPtr<RDBOwnershipToken> token(
      new RDBOwnershipToken(GetOwner(), mRDB->mName, mTab, mPK));
  return token.forget();
}


already_AddRefed<RDBSubsetDesc>
RDBRequest::GetDesc(ErrorResult& aRv)
{
  if (!mHasInsertToken) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  nsRefPtr<RDBSubsetDesc> sub(mSrcDesc ?
      new RDBSubsetDesc(mSrcDesc) : new RDBSubsetDesc(mRDB));

  char buf[128];
  sprintf(buf, ".pk=%lld", mPK);
  nsCString where = mTab;
  where.Append(buf);
  //sub->CloseAllWhere();
  sub->CloseAllOps();
  PerTableCapInfo& info = sub->mTabs[mTab];
  info.mWhere = where;
  if (mSrcDesc) {
    PerTableCapInfo& srcInfo = mSrcDesc->mTabs[mTab];
    info.mDeletable = srcInfo.mDeletable;
    info.mUpdatable = srcInfo.mUpdatable;
    info.mQueryable = srcInfo.mQueryable;
  } else {
    info.mDeletable = true;
    info.mUpdatable = true;
    info.mQueryable = true;
  }
  info.mInsertable = false;
  return sub.forget();
}

already_AddRefed<RDBSubsetDesc>
RDBRequest::GetPropDesc(const nsCString& aPropTab, ErrorResult& aRv) {
  if (!mHasInsertToken) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  nsCString col = RDBPropColName(mTab);
  nsCString where(aPropTab);
  where.Append(".");
  where.Append(col);
  char buf[128];
  sprintf(buf, "=%lld", mPK);
  where.Append(buf);
  nsRefPtr<RDBSubsetDesc> sub(mSrcDesc ?
      new RDBSubsetDesc(mSrcDesc) : new RDBSubsetDesc(mRDB));
  //sub->CloseAllWhere();
  sub->CloseAllOps();
  PerTableCapInfo& info = sub->mTabs[nsCString(aPropTab)];
  info.mWhere = where;
  info.mFixedNumCols[col] = mPK; // can only insert attr for this row
  if (mSrcDesc) {
    PerTableCapInfo& srcInfo = mSrcDesc->mTabs[nsCString(mTab)];
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

// already_AddRefed<RDBSubsetDesc>
// RDBRequest::GetCapDesc(const nsCString& aCapTab, ErrorResult& aRv) {
//   return nullptr;
// }

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBRequest)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBRequest, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mError)
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mRDB)
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mSrcDesc)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBRequest, RDBWrapperCache)
  tmp->mResultVal = JSVAL_VOID;
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mError)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mRDB)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mSrcDesc)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBRequest, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRACE_JSVAL_MEMBER_CALLBACK(mResultVal)
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBRequest)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBRequest, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBRequest, RDBWrapperCache)

nsresult
RDBRequest::PreHandleEvent(EventChainPreVisitor& aVisitor)
{
  NS_ASSERTION(NS_IsMainThread(), "Wrong thread!");

  aVisitor.mCanHandle = true;
  // ???
  //aVisitor.mParentTarget = mRDB;
  return NS_OK;
}

