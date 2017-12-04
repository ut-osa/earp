/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef RDB_CURSOR_H__
#define RDB_CURSOR_H__

#include "RDB.h"
#include "RDBRow.h"
#include "RDBWrapperCache.h"
#include "RDBSubsetDesc.h"

#include "mozilla/Attributes.h"
#include "mozilla/EventForwards.h"
#include "mozilla/dom/DOMError.h"
#include "mozilla/ErrorResult.h"
#include "nsCycleCollectionParticipant.h"
#include "nsWrapperCache.h"

#include "mozilla/storage.h"

class nsIScriptContext;
class nsPIDOMWindow;
class nsDOMDeviceStorage;

namespace mozilla {
class EventChainPostVisitor;
class EventChainPreVisitor;
class ErrorResult;
namespace dom {
struct ErrorEventInit;
}
}

class nsDOMRDB;
class RDBRow;
class RDBSubsetDesc;
class RDBOwnershipToken;
class RDBDirHandle;

using mozilla::EventChainPostVisitor;
using mozilla::EventChainPreVisitor;
using mozilla::ErrorResult;
using mozilla::dom::ErrorEventInit;
using mozilla::dom::DOMError;

class RDBCursor : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBCursor,
                                                         RDBWrapperCache)

  static
  already_AddRefed<RDBCursor> Create(nsDOMRDB* aRDB,
                                     nsPIDOMWindow* aOwner,
                                     JS::Handle<JSObject*> aScriptOwner,
                                     RDBSubsetDesc* aSrcDesc);


  // nsIDOMEventTarget
  virtual nsresult PreHandleEvent(EventChainPreVisitor& aVisitor) MOZ_OVERRIDE;

  void FillScriptErrorEvent(ErrorEventInit& aEventInit) const;
  void CaptureCaller();

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

  DOMError* GetError(ErrorResult& aRv);

#if 0
  void
  SetActor(RDBCursorParentBase* aActorParent)
  {
    NS_ASSERTION(!aActorParent || !mActorParent,
                 "Shouldn't have more than one!");
    mActorParent = aActorParent;
  }

  RDBCursorParentBase*
  GetActorParent() const
  {
    return mActorParent;
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

  IMPL_EVENT_HANDLER(success);
  IMPL_EVENT_HANDLER(error);

  void
  SetStmt(mozIStorageStatement* stmt);

  void Reset();

  // API

  bool
  Next(ErrorResult& aRv);

  int64_t
  GetColumnCount(ErrorResult& aRv);

  void
  GetColumnName(const int64_t colIndex, nsCString& retVal, ErrorResult& aRv);
  
  int64_t
  GetColumnIndex(const nsACString& colName, ErrorResult& aRv);

  void
  GetByIndex(JSContext* cx,
             const int64_t colIndex,
             JS::MutableHandle<JS::Value> retval,
             ErrorResult& aRv);

  void
  GetByIndex(JSContext* cx,
             const int64_t colIndex,
             JS::MutableHandle<JS::Value> retval,
             ErrorResult& aRv,
             nsCString& colName);

  void
  GetByName(JSContext* cx,
            const nsACString& colName,
            JS::MutableHandle<JS::Value> retval,
            ErrorResult& aRv);

  // nsresult
  // GetString(int64_t colIndex, nsString& retVal, ErrorResult& aRv);

  // nsresult
  // GetInteger(int64_t colIndex, bool& retVal, ErrorResult& aRv);

  // nsresult
  // GetReal(int64_t colIndex, double& retVal, ErrorResult& aRv);

  already_AddRefed<nsIDOMBlob>
  GetFile(const nsCString& aTab, const nsACString& colName, ErrorResult& aRv);

  already_AddRefed<nsIDOMBlob>
  GetFile(const nsACString& colName, ErrorResult& aRv);

  already_AddRefed<nsDOMDeviceStorage>
  GetDirDS(const nsCString& aTab, const nsACString& colName, ErrorResult& aRv);

  already_AddRefed<nsDOMDeviceStorage>
  GetDirDS(const nsACString& colName, ErrorResult& aRv);

  already_AddRefed<RDBDirHandle>
  GetDir(const nsCString& aTab, const nsACString& colName, ErrorResult& aRv);

  already_AddRefed<RDBDirHandle>
  GetDir(const nsACString& colName, ErrorResult& aRv);

  RDBRow* GetRow();

  already_AddRefed<RDBSubsetDesc>
  GetPropDesc(const nsCString& aTab, const nsACString& aAttrTab, ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetPropDesc(const nsACString& aAttrTab, ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetCapDesc(const nsCString& aTab, const nsACString& aCap, ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetCapDesc(const nsACString& aCap, ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetSelfDesc(const nsCString& aTab, ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  GetSelfDesc(ErrorResult& aRv);

  already_AddRefed<RDBOwnershipToken>
  GetToken(const nsCString& aTab, ErrorResult& aRv);

  already_AddRefed<RDBOwnershipToken>
  GetToken(ErrorResult& aRv);

  // Internal use only
  nsDOMRDB* GetRDB() { return mRDB.get(); }

  // SQL
  nsCString mWhere;
  mozilla::dom::Sequence<nsCString> mTabs;
  mozilla::dom::Sequence<nsCString> mCols;
  nsTArray<nsString> mStringParams;
  nsTArray<double> mNumParams;
  nsTArray<short> mParamTypes;
  nsCString mOrderBy;

  nsString mBlobPath;
  nsString mDirPath;

  nsRefPtr<RDBSubsetDesc> mSrcDesc;
  nsRefPtr<nsDOMRDB> mRDB;

protected:
  //explicit RDBCursor(nsDOMRDB* aRDB);
  explicit RDBCursor(nsPIDOMWindow* aOwner, nsDOMRDB *aRDB, RDBSubsetDesc* aSrcDesc);
  ~RDBCursor();

  nsRefPtr<mozilla::dom::DOMError> mError;
  nsString mFilename;
#ifdef MOZ_ENABLE_PROFILER_SPS
  uint64_t mSerialNumber;
#endif
  nsresult mErrorCode;
  uint32_t mLineNo;
  bool mHaveResultOrErrorCode;
  nsRefPtr<mozIStorageStatement> mStmt;
  nsRefPtr<RDBRow> mRow;
  bool mHasRow;
  bool mFinished;
};

#endif
