/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef RDB_REQUEST_H__
#define RDB_REQUEST_H__

#include "RDB.h"
#include "RDBWrapperCache.h"

#include "js/StructuredClone.h"
#include "mozilla/Attributes.h"
#include "mozilla/EventForwards.h"
#include "mozilla/dom/DOMError.h"
#include "mozilla/dom/TypedArray.h"
#include "mozilla/ErrorResult.h"
#include "nsCycleCollectionParticipant.h"
#include "nsWrapperCache.h"
#include "mozilla/dom/RDBRequestBinding.h"
#include "mozilla/Monitor.h"

class nsIScriptContext;
class nsPIDOMWindow;

namespace mozilla {
class EventChainPostVisitor;
class EventChainPreVisitor;
class ErrorResult;
namespace dom {
struct ErrorEventInit;
}
}

class nsDOMRDB;
class RDBOwnershipToken;
class RDBSubsetDesc;

using mozilla::EventChainPostVisitor;
using mozilla::EventChainPreVisitor;
using mozilla::ErrorResult;
using mozilla::dom::ErrorEventInit;
using mozilla::dom::DOMError;

class HelperBase;

class RDBRequest : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBRequest,
                                                         RDBWrapperCache)

  static
  already_AddRefed<RDBRequest> Create(nsDOMRDB* aRDB,
                                      nsPIDOMWindow* aOwner,
                                      JS::Handle<JSObject*> aScriptOwner);

  // nsIDOMEventTarget
  virtual nsresult PreHandleEvent(EventChainPreVisitor& aVisitor) MOZ_OVERRIDE;

  void Reset();

  nsresult NotifyHelperCompleted(HelperBase* aHelper);
  void NotifyHelperSentResultsToChildProcess(nsresult aRv);

  void SetError(nsresult aRv);

  nsresult
  GetErrorCode() const
#ifdef DEBUG
  ;
#else
  {
    return mErrorCode;
  }
#endif

  void NotifyTestComplete();

  DOMError* GetError(ErrorResult& aRv);

#if 0
  void
  SetActor(RDBRequestParentBase* aActorParent)
  {
    NS_ASSERTION(!aActorParent || !mActorParent,
                 "Shouldn't have more than one!");
    mActorParent = aActorParent;
  }

  RDBRequestParentBase*
  GetActorParent() const
  {
    return mActorParent;
  }
#endif

  void CaptureCaller();

  void FillScriptErrorEvent(ErrorEventInit& aEventInit) const;

  bool
  IsPending() const
  {
    return !mHaveResultOrErrorCode;
  }

#ifdef MOZ_ENABLE_PROFILER_SPS
  uint64_t
  GetSerialNumber() const
  {
    return mSerialNumber;
  }
#endif

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
  GetResult(JS::MutableHandle<JS::Value> aResult, ErrorResult& aRv) const;

  void
  GetResult(JSContext* aCx, JS::MutableHandle<JS::Value> aResult,
            ErrorResult& aRv) const
  {
    GetResult(aResult, aRv);
  }

  void
  GetTestRes(nsString& retval, ErrorResult& aRv) const;

  mozilla::dom::RDBRequestReadyState
  ReadyState() const;

  IMPL_EVENT_HANDLER(success);
  IMPL_EVENT_HANDLER(error);

  void NotifyCompleteStep();
  void WaitForComplete();
  
  void SetCompletionNum(uint32_t n) {
    mCompletionNum = n;
  }

  void SetInsertPK(uint64_t aPK) {
    mPK = aPK;
  }
  void EnableInsertToken() {
    mHasInsertToken = true;
  }

  already_AddRefed<RDBOwnershipToken>
  GetToken(ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetDesc(ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetPropDesc(const nsCString& aPropTab, ErrorResult& aRv);

  // already_AddRefed<RDBSubsetDesc>
  // GetCapDesc(const nsCString& aCapTab, ErrorResult& aRv);

  // SQL statement
  nsCString mTab;
  nsCString mWhere;
  mozilla::dom::Sequence<nsCString> mCols;
  mozilla::dom::Sequence<nsString> mParams;
  nsTArray<short> mValTypes;
  nsTArray<nsCString> mColumns;
  nsTArray<nsRefPtr<nsIDOMBlob>> mBlobVals;
  nsTArray<uint64_t> mBlobNames;
  nsTArray<uint64_t> mDirNames;
  nsTArray<double> mNumVals;
  nsTArray<nsString> mStringVals;
  bool nullParams;
  nsCString mStmt;
  // JS::Heap<JSObject*> mObjVals;
  // JSContext* mCx;

  nsRefPtr<nsDOMRDB> mRDB;
  nsRefPtr<RDBSubsetDesc> mSrcDesc;

private:
  mozilla::Monitor mMonitor;
  uint32_t mCompletionCnt;
  uint32_t mCompletionNum;
  bool mHasInsertToken;
  uint64_t mPK;

protected:
  explicit RDBRequest(nsDOMRDB* aRDB);
  explicit RDBRequest(nsPIDOMWindow* aOwner);
  ~RDBRequest();


  JS::Heap<JS::Value> mResultVal;
  nsRefPtr<mozilla::dom::DOMError> mError;
  // RDBRequestParentBase* mActorParent;
  nsString mFilename;
#ifdef MOZ_ENABLE_PROFILER_SPS
  uint64_t mSerialNumber;
#endif
  nsresult mErrorCode;
  uint32_t mLineNo;
  bool mHaveResultOrErrorCode;

  nsString mTestRes;

};

#endif
