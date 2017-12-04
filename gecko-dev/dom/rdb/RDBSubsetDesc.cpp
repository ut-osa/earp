#include "RDBSubsetDesc.h"
#include "nsRDB.h"
#include "nsIThreadPool.h"
#include "RDB.h"
#include "RDBOwnershipToken.h"
#include "RDBUtils.h"
#include "nsIDocument.h"
#include "nsIPrincipal.h"
#include "mozilla/Mutex.h"

#include "mozilla/dom/RDBSubsetDescBinding.h"

class RDBSubsetDesc;
using namespace mozilla;
using namespace mozilla::dom;

std::map<uint64_t, nsRefPtr<RDBSubsetDesc>> RDBSubsetDesc::gSharedRepo;
mozilla::Mutex RDBSubsetDesc::gSharedRepoMutex("RDBSubsetDesc::gSharedRepoMutex");

// static
already_AddRefed<RDBSubsetDesc>
RDBSubsetDesc::GetFromSharedRepo(uint64_t aToken) {
  MutexAutoLock l(gSharedRepoMutex);
  auto it = gSharedRepo.find(aToken);
  if (it == gSharedRepo.end())
    return nullptr;

  nsRefPtr<RDBSubsetDesc> res = it->second;
  gSharedRepo.erase(it);
  return res.forget();
}

uint64_t RDBSubsetDesc::SaveForShare() {
  uint64_t token = RDBGetRandNum() >> 13;
  {
    MutexAutoLock l(gSharedRepoMutex);
    gSharedRepo[token] = this;
  }
  return token;
}

RDBSubsetDesc::RDBSubsetDesc(RDBSubsetDesc* aDesc, nsDOMRDB* aRDB)
  : RDBWrapperCache(aRDB->GetOwner())
  , mValid(aDesc->mValid)
  , mTabs(aDesc->mTabs)
  , mRDB(aRDB)
  , mAppId(aDesc->mAppId)
  , mDefaultPrivate(aDesc->mDefaultPrivate)
{
  aDesc->mChildDescs.insert(this);
}

RDBSubsetDesc::RDBSubsetDesc(RDBSubsetDesc* aDesc)
  : RDBWrapperCache(aDesc->GetOwner())
  , mValid(aDesc->mValid)
  , mTabs(aDesc->mTabs)
  , mRDB(aDesc->mRDB)
  , mAppId(aDesc->mAppId)
  , mDefaultPrivate(aDesc->mDefaultPrivate)
{
  aDesc->mChildDescs.insert(this);
}

RDBSubsetDesc::RDBSubsetDesc(nsDOMRDB* aRDB)
  : RDBWrapperCache(aRDB->GetOwner())
  , mValid(true)
  , mTabs(aRDB->mTabs)
  , mRDB(aRDB)
  , mDefaultPrivate(false)
{
  nsCOMPtr<nsIDocument> doc = GetOwner()->GetDoc();
  if (!doc)
    mAppId = 0; // OK?
  doc->NodePrincipal()->GetAppId(&mAppId);
}

void
RDBSubsetDesc::CloseAllWhere()
{
  for (auto it = mTabs.begin(); it != mTabs.end(); it++) {
    it->second.mWhere.Assign("0");
  }
}

void
RDBSubsetDesc::CloseAllInsert()
{
  for (auto it = mTabs.begin(); it != mTabs.end(); it++) {
    it->second.mInsertable = false;
  }
}

void
RDBSubsetDesc::CloseAllOps()
{
  for (auto it = mTabs.begin(); it != mTabs.end(); it++) {
    it->second.mInsertable = false;
    it->second.mQueryable = false;
    it->second.mUpdatable = false;
    it->second.mDeletable = false;
  }
}


void
RDBSubsetDesc::CloseColsForTab(const nsACString& aTab,
                               const Sequence<nsCString>& aCols)
{
  auto it = mTabs.find(nsCString(aTab));
  if (it == mTabs.end()) {
    return;
  }

  PerTableCapInfo& info = it->second;
  for (uint32_t i = 0; i < aCols.Length(); i++) {
    info.mCols.erase(aCols[i]);
  }
}

void
RDBSubsetDesc::AddWhereForTab(JSContext* aCx,
                              const nsACString& aTab,
                              JS::Handle<JSObject*> aWhere,
                              ErrorResult& aRv)
{
  auto it = mTabs.find(nsCString(aTab));
  if (it == mTabs.end()) {
    return;
  }

  PerTableCapInfo& info = it->second;
  nsCString tmp;
  if (!nsDOMRDB::ConstructWhere(aCx, aWhere, info.mParamTypes,
        info.mStringParams, info.mNumParams, tmp)) {
    aRv.Throw(NS_ERROR_DOM_RDB_UNKNOWN_ERR);
    return;
  }

  nsCString where("(");
  where.Append(info.mWhere);
  where.Append(") AND (");
  where.Append(tmp);
  where.Append(")");
  info.mWhere = where;
}

void
RDBSubsetDesc::SetFixedFieldForTab(JSContext* aCx,
                                   const nsACString& aTab,
                                   JS::Handle<JSObject*> aVals,
                                   ErrorResult& aRv)
{
  auto it = mTabs.find(nsCString(aTab));
  if (it == mTabs.end()) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return;
  }

  PerTableCapInfo& tabinfo = it->second;
  JS::AutoIdArray ids(aCx, JS_Enumerate(aCx, aVals));
  for (uint32_t i = 0; i < ids.length(); i++) {
    JS::RootedId id(aCx);
    id = ids[i];
    JS::RootedValue v(aCx);
    if (!JS_IdToValue(aCx, id, &v) || !v.isString())
      continue;
    JS::RootedString str(aCx, v.toString());
    if (!str)
      continue;
    nsString tmp;
    if (!AssignJSString(aCx, tmp, str))
      continue;

    nsCString col = NS_LossyConvertUTF16toASCII(tmp);

    JS::RootedValue vv(aCx);
    if (!JS_GetPropertyById(aCx, aVals, id, &vv)) {
      continue;
    }

    if (0 == strcmp(col.BeginReading(), RDB_COL_APPID)) {
      if (!vv.isNumber() || (vv.toNumber() != 0 && vv.toNumber() != mAppId)) {
        aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
        return;
      }
    }

    if (vv.isString()) {
      JS::RootedString str(aCx, vv.toString());
      AssignJSString(aCx, tmp, str);
      tabinfo.mFixedStringCols[col] = tmp;
    } else if (vv.isNumber()) {
      tabinfo.mFixedNumCols[col] = vv.toNumber();
    } else if (vv.isNull()){
      tabinfo.mFixedNullCols.insert(col);
    } else {
      aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
      return;
    }
  }
}

bool
RDBSubsetDesc::Insertable(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return false;
  }
  return it->second.mInsertable;
}

void
RDBSubsetDesc::DisableInsert(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return;
  }
  // can only downgrade
  it->second.mInsertable = false;
}

bool
RDBSubsetDesc::Queryable(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return false;
  }
  return it->second.mQueryable;
}

void
RDBSubsetDesc::DisableQuery(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return;
  }
  // can only downgrade
  it->second.mQueryable = false;
}

bool
RDBSubsetDesc::Updatable(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return false;
  }
  return it->second.mUpdatable;
}

void
RDBSubsetDesc::DisableUpdate(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return;
  }
  // can only downgrade
  it->second.mUpdatable = false;
}


bool
RDBSubsetDesc::Deletable(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return false;
  }
  return it->second.mDeletable;
}

void
RDBSubsetDesc::DisableDelete(const nsACString& aTab)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return;
  }
  // can only downgrade
  it->second.mDeletable = false;
}

bool
RDBSubsetDesc::TabHasCol(const nsACString& aTab, const nsACString& aCol)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    return false;
  }

  PerTableCapInfo& info = it->second;

  return info.mCols.find(nsCString(aCol)) != info.mCols.end();
}

void
RDBSubsetDesc::GetColsOfTab(const nsACString& aTab,
                            nsTArray<nsCString>& aResCols,
                            ErrorResult& aRv)
{
  nsCString tab(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end()) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return;
  }

  PerTableCapInfo& info = it->second;

  for (auto col = info.mCols.begin(); col != info.mCols.end(); col++) {
    aResCols.AppendElement(*col);
  } 
}

JSObject*
RDBSubsetDesc::WrapObject(JSContext* aCx)
{
  return RDBSubsetDescBinding::Wrap(aCx, this);
}

bool
RDBSubsetDesc::EnsureQuery(const Sequence<nsCString>& aTabs,
                           const Sequence<nsCString>& aCols,
                           const nsACString& aOrderBy)
{
  if (!mValid) {
    return false;
  }
  if (aTabs.Length() != 1)
    return false;

  auto it = mTabs.find(nsCString(aTabs[0]));
  if (it == mTabs.end() || !it->second.mQueryable)
    return false;

  for (uint32_t i = 0; i < aCols.Length(); i++) {
    if (it->second.mCols.find(aCols[i]) == it->second.mCols.end()) {
      return false;
    }
  }

  if (aOrderBy.Length() > 0) {
    if (it->second.mCols.find(nsCString(aOrderBy)) == it->second.mCols.end()) {
      return false;
    }
  }
  return true;
}


bool
RDBSubsetDesc::EnsureUpdate(JSContext* cx,
                            const nsACString& aTab,
                            JS::Handle<JSObject*> aVals)
{
  if (!mValid) {
    return false;
  }
  auto it = mTabs.find(nsCString(aTab));
  if (it == mTabs.end() || !it->second.mUpdatable)
    return false;

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
    nsString tmp;
    if (!AssignJSString(cx, tmp, str))
      continue;

    nsCString col = NS_LossyConvertUTF16toASCII(tmp);
    PerTableCapInfo& info = it->second;
    if (info.mCols.find(col) == info.mCols.end()
          || info.mFixedStringCols.find(col) != info.mFixedStringCols.end()
          || info.mFixedNumCols.find(col) != info.mFixedNumCols.end()
          || info.mFixedNullCols.find(col) != info.mFixedNullCols.end()
          || RDBColIsCap(col)
          || 0 == strcmp(col.BeginReading(), RDB_COL_APPID)) {
      return false;
    }
  }
  return true;
}

bool
RDBSubsetDesc::EnsureInsert(JSContext* cx,
                            const nsACString& aTab,
                            JS::Handle<JSObject*> aVals,
                            const Sequence<nsCString>* aCapCols,
                            const Sequence<OwningNonNull<RDBOwnershipToken>>* aCapTokens)
{
  if (!mValid) {
    return false;
  }
  auto it = mTabs.find(nsCString(aTab));
  if (it == mTabs.end() || !it->second.mInsertable)
    return false;

  PerTableCapInfo& tabinfo = it->second;

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
    nsString tmp;
    if (!AssignJSString(cx, tmp, str))
      continue;

    nsCString col = NS_LossyConvertUTF16toASCII(tmp);

    if (tabinfo.mCols.find(col) == tabinfo.mCols.end() || RDBColIsCap(col)) {
      return false;
    }
  }

  nsCString t;
  JS::RootedValue vv(cx);

  if (aCapCols) {
    if (aCapCols->Length() != aCapTokens->Length())
      return false;
    for (uint32_t i = 0; i < aCapCols->Length(); i++) {
      const nsCString& col = (*aCapCols)[i];
      if (NS_FAILED(RDBCapTabName(col, t))) {
        return false;
      }
      RDBOwnershipToken* tk = (*aCapTokens)[i].get();
      if (tk->mRDB != mRDB->mName || tk->mTab != t) {
        return false;
      }

      vv = DOUBLE_TO_JSVAL((double)tk->mPK);
      JS_SetProperty(cx, aVals, col.BeginReading(), vv);
    }
  }

  // sanitize
  for (auto it = tabinfo.mFixedStringCols.begin();
      it != tabinfo.mFixedStringCols.end(); it++) {
    JSString *str = ::JS_NewUCStringCopyN(cx, it->second.BeginReading(),
                                it->second.Length());
    vv = STRING_TO_JSVAL(str);
    JS_SetProperty(cx, aVals, it->first.BeginReading(), vv);
  }
  for (auto it = tabinfo.mFixedNumCols.begin(); it != tabinfo.mFixedNumCols.end(); it++) {
    vv = DOUBLE_TO_JSVAL(it->second);
    JS_SetProperty(cx, aVals, it->first.BeginReading(), vv);
  }
  for (auto it = tabinfo.mFixedNullCols.begin(); it != tabinfo.mFixedNullCols.end(); it++) {
    vv = JS::NullValue();
    JS_SetProperty(cx, aVals, it->BeginReading(), vv);
  }

  if (tabinfo.mCols.find(nsCString(RDB_COL_APPID)) != tabinfo.mCols.end()) {
    vv = DOUBLE_TO_JSVAL(mDefaultPrivate ? mAppId : 0);
    JS_SetProperty(cx, aVals, RDB_COL_APPID, vv);
  }
  return true;
}

bool
RDBSubsetDesc::EnsureDelete(const nsACString& aTab)
{
  if (!mValid) {
    return false;
  }
  auto it = mTabs.find(nsCString(aTab));
  if (it == mTabs.end() || !it->second.mDeletable)
    return false;
  return true;
}

bool RDBSubsetDesc::Sync() { return mRDB->Sync(); }
void RDBSubsetDesc::SetSync(bool val) { mRDB->SetSync(val); }

already_AddRefed<RDBRequest>
RDBSubsetDesc::Insert(JSContext* aCx,
                     const nsACString& aTab,
                     JS::Handle<JSObject*> aVals,
                     ErrorResult& aRv)
{
  if (!EnsureInsert(aCx, aTab, aVals, nullptr, nullptr)) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  return mRDB->InsertInternal(aCx, aTab, aVals, aRv, this);
}

already_AddRefed<RDBRequest>
RDBSubsetDesc::Insert(JSContext* aCx,
                      const nsACString& aTab,
                      JS::Handle<JSObject*> aVals,
                      const Sequence<nsCString>& aCapCols,
                      const Sequence<OwningNonNull<RDBOwnershipToken>>& aCapTokens,
                      ErrorResult& aRv)
{
  if (!EnsureInsert(aCx, aTab, aVals, &aCapCols, &aCapTokens)) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  return mRDB->InsertInternal(aCx, aTab, aVals, aRv, this);
}

// already_AddRefed<RDBCursor>
// RDBSubsetDesc::Query(const Sequence<nsCString>& aTabs,
//                      const Sequence<nsCString>& aCols,
//                      const nsACString& aWhere,
//                      const Nullable<Sequence<nsString>>& aParams,
//                      const nsACString& aOrderBy,
//                      ErrorResult& aRv)
// {
//   if (!EnsureTabCols(aTabs, aCols, RDB_REQUEST_QUERY)) {
//     aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
//     return nullptr;
//   }

//   nsCString where;
//   where.AssignLiteral("(");
//   where.Append(aWhere);
//   where.Append(") AND (");
//   where.Append(mWhereQuery);
//   where.Append(")");

//   return mRDB->Query(aTabs, aCols, where, aParams, aOrderBy, aRv);
// }

already_AddRefed<RDBCursor>
RDBSubsetDesc::Query(JSContext* aCx,
                     const Sequence<nsCString>& aTabs,
                     const Sequence<nsCString>& aCols,
                     JS::Handle<JSObject*> aWhere,
                     const nsACString& aOrderBy,
                     ErrorResult& aRv)
{
  if (!EnsureQuery(aTabs, aCols, aOrderBy)) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  return mRDB->QueryInternal(aCx, aTabs, aCols, aWhere, aOrderBy, aRv, this);
}

bool
RDBSubsetDesc::ConstrustPropCapJoin(JSContext* cx,
                                    JS::Handle<JSObject*> aTabs,
                                    Sequence<nsCString>& aResTabs,
                                    Sequence<nsCString>& aCols,
                                    // nsTArray<nsCString>& aStringParams,
                                    // nsTArray<nsCString>& aNumParams,
                                    // nsTArray<short>& aParamTypes,
                                    nsCString& aWhere,
                                    nsCString& aParentTab,
                                    int aTabType) // 0: first tab, 1: prop, 2: cap'ed
{  
  JS::RootedValue vv(cx);
  if (!JS_GetProperty(cx, aTabs, "tab", &vv) || !vv.isString()) {
    return false;
  }

  nsString tmp;
  JS::RootedString str(cx, vv.toString());
  AssignJSString(cx, tmp, str);
  nsCString tab = NS_LossyConvertUTF16toASCII(tmp);

  auto it = mTabs.find(tab);
  if (it == mTabs.end() || (!it->second.mQueryable && aTabType == 0))
    return false;

  PerTableCapInfo& info = it->second;
  aResTabs.AppendElement(tab);

  // extra where
  switch (aTabType) {
    case 0: // first
      aWhere.Assign(info.mWhere);
      break;
    case 1: // prop
      if (info.mCols.find(RDBPropColName(aParentTab))
            == info.mCols.end()) {
        return false;
      }
      aWhere.Assign(tab);
      aWhere.Append(".PROP_");
      aWhere.Append(aParentTab);
      aWhere.Append("=");
      aWhere.Append(aParentTab);
      aWhere.Append(".pk");
      break;
    case 2: // cap'ed
      if (mTabs[aParentTab].mCols.find(RDBCapColName(tab))
            == mTabs[aParentTab].mCols.end()) {
        return false;
      }
      aWhere.Assign(tab);
      aWhere.Append(".pk=");
      aWhere.Append(aParentTab);
      aWhere.Append(".CAP_");
      aWhere.Append(tab);
      break;
  }

  if (JS_GetProperty(cx, aTabs, "cols", &vv) && vv.isObject()) {
    JS::RootedObject vo(cx, &vv.toObject());
    JS::AutoIdArray ids(cx, JS_Enumerate(cx, vo));
    for (uint32_t i = 0; i < ids.length(); i++) {
      JS::RootedId id(cx);
      id = ids[i];
      JS::RootedValue v(cx);
      if (!JS_IdToValue(cx, id, &v) || !v.isNumber())
        continue;

      if (!JS_GetPropertyById(cx, vo, id, &v) || !v.isString())
        continue;

      JS::RootedString tmpcol(cx, v.toString());
      AssignJSString(cx, tmp, tmpcol);
      nsCString tmpcolstr = NS_LossyConvertUTF16toASCII(tmp);

      if (info.mCols.find(tmpcolstr) == info.mCols.end()) {
        return false;
      }

      nsCString col = tab;
      col.Append(".");
      col.Append(tmpcolstr);
      col.Append(" AS ");
      col.Append(tab);
      col.Append("__");
      col.Append(tmpcolstr);
      aCols.AppendElement(col);
    }
  }

  if (JS_GetProperty(cx, aTabs, "prop", &vv) && vv.isObject()) {
    nsCString childWhere;
    JS::RootedObject vo(cx, &vv.toObject());
    if (!ConstrustPropCapJoin(cx, vo, aResTabs, aCols,
          //aStringParams, aNumParams, aParamTypes,
          childWhere, tab, 1))
      return false;
    nsCString where("(");
    where.Append(aWhere);
    where.Append(")AND(");
    where.Append(childWhere);
    where.Append(")");
    aWhere = where;
  }

  if (JS_GetProperty(cx, aTabs, "cap", &vv) && vv.isObject()) {
    nsCString childWhere;
    JS::RootedObject vo(cx, &vv.toObject());
    if (!ConstrustPropCapJoin(cx, vo, aResTabs, aCols,
          // aStringParams, aNumParams, aParamTypes,
          childWhere, tab, 2))
      return false;
    nsCString where("(");
    where.Append(aWhere);
    where.Append(")AND(");
    where.Append(childWhere);
    where.Append(")");
    aWhere.Assign(where);
  }
  return true;
}

already_AddRefed<RDBCursor>
RDBSubsetDesc::JoinPropCap(JSContext* aCx,
                           JS::Handle<JSObject*> aTabs,
                           JS::Handle<JSObject*> aWhere,
                           const nsACString& aOrderBy,
                           ErrorResult& aRv)
{
  if (!mValid) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  Sequence<nsCString> tabs;
  Sequence<nsCString> cols;
  // nsTArray<nsCString> aStringParams;
  // nsTArray<nsCString> aNumParams;
  // nsTArray<short> aParamTypes;
  nsCString where;
  nsCString tmp;
  if (!ConstrustPropCapJoin(aCx, aTabs, tabs, cols, where, tmp, 0)) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  PerTableCapInfo& info = mTabs[tabs[0]];
  return mRDB->QueryInternalRaw(aCx, tabs, cols, aWhere, aOrderBy, aRv, &where,
                              &info.mParamTypes, &info.mStringParams, &info.mNumParams);
}


bool
RDBSubsetDesc::ConstrustJoinFlatProp(JSContext* cx,
                                     const nsACString& aRootTab,
                                     JS::Handle<JSObject*> aTabs,
                                     Sequence<nsCString>& aResTabs,
                                     Sequence<nsCString>& aCols,
                                     nsCString& aWhere)
{
  nsCString fkcol = RDBPropColName(aRootTab);
  bool hasRoot = false;

  nsCString root(aRootTab);
  //aResTabs.AppendElement(root);
  nsCString alltab(root);
  
  JS::AutoIdArray ids(cx, JS_Enumerate(cx, aTabs));
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

    nsCString tab = NS_LossyConvertUTF16toASCII(tmp);

    auto infoit = mTabs.find(tab);
    if (infoit == mTabs.end()) {
      return false;
    }

    PerTableCapInfo& info = infoit->second;

    if (!JS_GetPropertyById(cx, aTabs, id, &v) || !v.isObject())
      continue;

    JS::RootedObject cols(cx, &v.toObject());

    JS::AutoIdArray cids(cx, JS_Enumerate(cx, cols));
    for (uint32_t ci = 0; ci < cids.length(); ci++) {
      JS::RootedId cid(cx);
      cid = cids[ci];
      JS::RootedValue vv(cx);
      if (!JS_IdToValue(cx, cid, &vv) || !vv.isNumber())
        continue;

      if (!JS_GetPropertyById(cx, cols, cid, &vv) || !vv.isString())
        continue;

      JS::RootedString tmpcol(cx, vv.toString());
      AssignJSString(cx, tmp, tmpcol);
      nsCString tmpcolstr = NS_LossyConvertUTF16toASCII(tmp);

      if (info.mCols.find(tmpcolstr) == info.mCols.end()) {
        return false;
      }

      nsCString col = tab;
      col.Append(".");
      col.Append(tmpcolstr);
      col.Append(" AS ");
      col.Append(tab);
      col.Append("__");
      col.Append(tmpcolstr);
      aCols.AppendElement(col);
    }

    if (tab == root) {
      hasRoot = true;
      aWhere.Assign(info.mWhere);
    } else {
      alltab.Append(" LEFT OUTER JOIN ");
      alltab.Append(tab);
      alltab.Append(" ON ");
      alltab.Append(tab);
      alltab.Append(".");
      alltab.Append(fkcol);
      alltab.Append("=");
      alltab.Append(aRootTab);
      alltab.Append(".pk");
      
    }
  }
  aResTabs.AppendElement(alltab);
  return hasRoot;
}

already_AddRefed<RDBCursor>
RDBSubsetDesc::JoinFlatProp(JSContext* aCx,
                            const nsACString& aRootTab,
                            JS::Handle<JSObject*> aTabs,
                            JS::Handle<JSObject*> aWhere,
                            const nsACString& aOrderBy,
                            ErrorResult& aRv)
{
  if (!mValid) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  Sequence<nsCString> tabs;
  Sequence<nsCString> cols;
  nsCString where;
  nsCString tmp;
  if (!ConstrustJoinFlatProp(aCx, aRootTab, aTabs, tabs, cols, where)) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  PerTableCapInfo& info = mTabs[nsCString(aRootTab)];
  return mRDB->QueryInternalRaw(aCx, tabs, cols, aWhere, aOrderBy, aRv, &where,
                              &info.mParamTypes, &info.mStringParams, &info.mNumParams);
}

// already_AddRefed<RDBRequest>
// RDBSubsetDesc::Update(const nsACString& aTab,
//                       const nsACString& aWhere,
//                       const Nullable<Sequence<nsString>>& aParams,
//                       const Sequence<nsCString>& aCols,
//                       const Sequence<nsString>& aVals,
//                       ErrorResult& aRv)
// {
//   if (!EnsureTabCols(aTab, aCols, RDB_REQUEST_UPDATE)) {
//     aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
//     return nullptr;
//   }

//   nsCString where;
//   where.AssignLiteral("(");
//   where.Append(aWhere);
//   where.Append(") AND (");
//   where.Append(mWhereUpdate);
//   where.Append(")");

//   return mRDB->Update(aTab, where, aParams, aCols, aVals, aRv);
// }

already_AddRefed<RDBRequest>
RDBSubsetDesc::Update(JSContext* aCx,
                      const nsACString& aTab,
                      JS::Handle<JSObject*> aWhere,
                      JS::Handle<JSObject*> aVals,
                      ErrorResult& aRv)
{
  if (!EnsureUpdate(aCx, aTab, aVals)) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  PerTableCapInfo& info = mTabs[nsCString(aTab)];
  return mRDB->UpdateInternal(aCx, aTab, aWhere, aVals, aRv, &info);
}

already_AddRefed<RDBRequest>
RDBSubsetDesc::Delete(JSContext* aCx,
                      const nsACString& aTab,
                      JS::Handle<JSObject*> aWhere,
                      ErrorResult& aRv)
{
  if (!EnsureDelete(aTab)) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  PerTableCapInfo& info = mTabs[nsCString(aTab)];
  return mRDB->DeleteInternal(aCx, aTab, aWhere, aRv, &info);
}

already_AddRefed<RDBSubsetDesc>
RDBSubsetDesc::ExpandCap(const nsACString& aCapTab,
                         const nsACString& aResultTab,
                         ErrorResult& aRv)
{
  if (!mValid) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  nsCString captab(aCapTab);
  nsCString restab(aResultTab);
  auto it = mTabs.find(captab);
  if (it == mTabs.end()) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  PerTableCapInfo& capInfo = it->second;


  nsCString capCol = RDBCapColName(restab);
  if (capInfo.mCols.find(capCol) == capInfo.mCols.end()) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  
  nsRefPtr<RDBSubsetDesc> res(new RDBSubsetDesc(this));
  it = res->mTabs.find(restab);
  if (it == res->mTabs.end()) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  PerTableCapInfo& resInfo = it->second;
  //res->CloseAllOps();
  nsCString where("EXISTS(SELECT * FROM ");
  where.Append(captab);
  where.Append(" WHERE ");
  where.Append(capInfo.mWhere);
  where.Append(" AND ");
  where.Append(captab);
  where.Append(".");
  where.Append(capCol);
  where.Append("=");
  where.Append(restab);
  where.Append(".pk)");

  resInfo.mInsertable = capInfo.mInsertable;
  resInfo.mUpdatable = capInfo.mUpdatable;
  resInfo.mDeletable = capInfo.mDeletable;
  resInfo.mQueryable = capInfo.mQueryable;

  return res.forget();
}

void
RDBSubsetDesc::Revoke() {
  if (!mValid)
    return;
  mValid = false;
  for (auto it = mChildDescs.begin(); it != mChildDescs.end(); it++) {
    (*it)->Revoke();
  }
}

already_AddRefed<RDBSubsetDesc>
RDBSubsetDesc::Clone() {
  if (!mValid) {
    return nullptr;
  }
  nsRefPtr<RDBSubsetDesc> res(new RDBSubsetDesc(this));
  return res.forget();
}

already_AddRefed<RDBRequest>
RDBSubsetDesc::StartTx(ErrorResult& aRv) {
  if (!mValid) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  return mRDB->StartTx(aRv);
}

already_AddRefed<RDBRequest>
RDBSubsetDesc::AbortTx(ErrorResult& aRv) { return mRDB->AbortTx(aRv); }

already_AddRefed<RDBRequest>
RDBSubsetDesc::CommitTx(ErrorResult& aRv) { return mRDB->CommitTx(aRv); }

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBSubsetDesc)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBSubsetDesc, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mRDB)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBSubsetDesc, RDBWrapperCache)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mRDB)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBSubsetDesc, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBSubsetDesc)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBSubsetDesc, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBSubsetDesc, RDBWrapperCache)
