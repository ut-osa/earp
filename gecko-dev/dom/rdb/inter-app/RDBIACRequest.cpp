#include "RDBIAC.h"
#include "RDBIACRequest.h"
#include "RDBUtils.h"
#include "nsRDB.h"
#include "nsIThreadPool.h"
#include "RDB.h"

#include "mozilla/Monitor.h"
#include "mozilla/Mutex.h"
#include "mozilla/dom/RDBIACRequestBinding.h"
#include "mozilla/dom/RDBIASRequestBinding.h"

#include "nsCycleCollector.h"


using namespace mozilla;
using namespace mozilla::dom;

Mutex RDBIACRequest::gSequenceNumberMutex("RDBIACRequest::gSequenceNumberMutex");
uint64_t RDBIACRequest::gNextSequenceNumber = 0;


uint64_t RDBIACRequest::GenerateSequenceNumber() {
  MutexAutoLock l(gSequenceNumberMutex);
  return gNextSequenceNumber++;
}


RDBObjectClone* RDBObjectClone::Clone() {
  RDBObjectClone* res = new RDBObjectClone();
  for (auto it = strMembers.begin(); it != strMembers.end(); it++) {
    res->strMembers[it->first] = it->second;
  }
  for (auto it = numMembers.begin(); it != numMembers.end(); it++) {
    res->numMembers[it->first] = it->second;
  }
  for (auto it = objMembers.begin(); it != objMembers.end(); it++) {
    res->objMembers[it->first] = it->second->Clone();
  }
  return res;
}

// static
RDBObjectClone*
RDBObjectClone::CreateWithRestriction(JSContext* cx,
                                      JS::Handle<JSObject*> obj,
                                      IACPerTableCapInfo& info,
                                      int op)
{
  RDBObjectClone* val = new RDBObjectClone(cx, obj);
  for (auto it = val->strMembers.begin(); it != val->strMembers.end(); it++) {
    if (info.mCols.find(it->first) == info.mCols.end()) {
      goto failure;
    }
  }
  for (auto it = val->numMembers.begin(); it != val->numMembers.end(); it++) {
    if (info.mCols.find(it->first) == info.mCols.end()) {
      goto failure;
    }
  }
  for (auto it = val->objMembers.begin(); it != val->objMembers.end(); it++) {
    if (info.mCols.find(it->first) == info.mCols.end()) {
      goto failure;
    }
  }
  for (auto it = val->blobMembers.begin(); it != val->blobMembers.end(); it++) {
    if (info.mCols.find(it->first) == info.mCols.end()) {
      goto failure;
    }
  }

  switch (op) {
    case RDB_REQUEST_INSERT:
      for (auto it = info.mFixedStringCols.begin(); it != info.mFixedStringCols.end(); it++) {
        val->strMembers[it->first] = it->second;
        if (val->numMembers.find(it->first) != val->numMembers.end()) {
          goto failure;
        }
        if (val->objMembers.find(it->first) != val->objMembers.end()) {
          goto failure;
        }
        if (val->blobMembers.find(it->first) != val->blobMembers.end()) {
          goto failure;
        }
      }
      for (auto it = info.mFixedNumCols.begin(); it != info.mFixedNumCols.end(); it++) {
        val->numMembers[it->first] = it->second;
        if (val->strMembers.find(it->first) != val->strMembers.end()) {
          goto failure;
        }
        if (val->objMembers.find(it->first) != val->objMembers.end()) {
          goto failure;
        }
        if (val->blobMembers.find(it->first) != val->blobMembers.end()) {
          goto failure;
        }
      }
      for (auto it = info.mFixedNullCols.begin(); it != info.mFixedNullCols.end(); it++) {
        val->numMembers[*it] = 0;
        if (val->strMembers.find(*it) != val->strMembers.end()) {
          goto failure;
        }
        if (val->objMembers.find(*it) != val->objMembers.end()) {
          goto failure;
        }
        if (val->blobMembers.find(*it) != val->blobMembers.end()) {
          goto failure;
        }
      }
      break;

    case RDB_REQUEST_UPDATE:
      for (auto it = info.mFixedStringCols.begin(); it != info.mFixedStringCols.end(); it++) {
        if (val->strMembers.find(it->first) != val->strMembers.end()) {
          goto failure;
        }
        if (val->numMembers.find(it->first) != val->numMembers.end()) {
          goto failure;
        }
        if (val->objMembers.find(it->first) != val->objMembers.end()) {
          goto failure;
        }
        if (val->blobMembers.find(it->first) != val->blobMembers.end()) {
          goto failure;
        }
      }
      for (auto it = info.mFixedNumCols.begin(); it != info.mFixedNumCols.end(); it++) {
        if (val->strMembers.find(it->first) != val->strMembers.end()) {
          goto failure;
        }
        if (val->numMembers.find(it->first) != val->numMembers.end()) {
          goto failure;
        }
        if (val->objMembers.find(it->first) != val->objMembers.end()) {
          goto failure;
        }
        if (val->blobMembers.find(it->first) != val->blobMembers.end()) {
          goto failure;
        }
      }
      for (auto it = info.mFixedNullCols.begin(); it != info.mFixedNullCols.end(); it++) {
        if (val->strMembers.find(*it) != val->strMembers.end()) {
          goto failure;
        }
        if (val->numMembers.find(*it) != val->numMembers.end()) {
          goto failure;
        }
        if (val->objMembers.find(*it) != val->objMembers.end()) {
          goto failure;
        }
        if (val->blobMembers.find(*it) != val->blobMembers.end()) {
          goto failure;
        }
      }
      break;
    default:
      goto failure;
  }

  return val;

failure:
  delete val;
  return nullptr;
}

RDBObjectClone::RDBObjectClone(JSContext* cx, JS::Handle<JSObject*> obj)
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
    nsString col;
    if (!AssignJSString(cx, col, str))
      continue;

    JS::RootedValue vv(cx);
    if (!JS_GetPropertyById(cx, obj, id, &vv)) {
      continue;
    }

    nsCString ccol = NS_LossyConvertUTF16toASCII(col);
    // might be set by fixed columns
    if (numMembers.find(ccol) != numMembers.end())
      return;
    if (strMembers.find(ccol) != strMembers.end())
      return;
    if (objMembers.find(ccol) != objMembers.end())
      return;

    JS::RootedValue nv(cx);

    if (vv.isBoolean()) {
      numMembers[ccol] = vv.toBoolean() ? 1 : 0;
    } else if (vv.isNumber()) {
      numMembers[ccol] = vv.toNumber();
    } else if (vv.isString()) {
      nsString tmp;
      JS::RootedString str(cx, vv.toString());
      AssignJSString(cx, tmp, str);
      strMembers[ccol] = tmp;
    } else if (vv.isObject()) {
      nsCOMPtr<nsIXPConnectWrappedNative> wrappedNative;
      nsContentUtils::XPConnect()->
        GetWrappedNativeOfJSObject(cx, &vv.toObject(), getter_AddRefs(wrappedNative));
      if (wrappedNative) {
        nsISupports* supports = wrappedNative->Native();
        nsCOMPtr<nsIDOMBlob> blob = do_QueryInterface(supports);
        if (blob) {
          blobMembers[ccol] = blob;
        }
      } else {
        JS::Rooted<JSObject*> tmp(cx, &vv.toObject());
        objMembers[ccol] = new RDBObjectClone(cx, tmp);
      }
    }
  }
}

RDBObjectClone::~RDBObjectClone()
{
  for (auto it = objMembers.begin(); it != objMembers.end(); it++) {
    delete it->second;
  }
}

void
RDBObjectClone::ToObject(JSContext* cx, JS::MutableHandle<JSObject*> retval)
{
  JS::Rooted<JSObject*> res(cx, JS_NewObject(cx, nullptr, JS::NullPtr(), JS::NullPtr()));
  JS::RootedValue nv(cx);

  for (auto it = strMembers.begin(); it != strMembers.end(); it++) {
    JSString *str = JS_NewUCStringCopyN(cx, it->second.BeginReading(), it->second.Length());
    nv = STRING_TO_JSVAL(str);
    JS_SetProperty(cx, res, it->first.BeginReading(), nv);
  }

  for (auto it = numMembers.begin(); it != numMembers.end(); it++) {
    nv = DOUBLE_TO_JSVAL(it->second);
    JS_SetProperty(cx, res, it->first.BeginReading(), nv);
  }

  for (auto it = objMembers.begin(); it != objMembers.end(); it++) {
    JS::Rooted<JSObject*> tmp(cx);
    it->second->ToObject(cx, &tmp);
    nv = OBJECT_TO_JSVAL(tmp);
    JS_SetProperty(cx, res, it->first.BeginReading(), nv);
  }

  for (auto it = blobMembers.begin(); it != blobMembers.end(); it++) {
    if (NS_SUCCEEDED(nsContentUtils::WrapNative(cx, it->second, &nv))) {
      JS_SetProperty(cx, res, it->first.BeginReading(), nv);
    }
  }

  retval.set(res);
}

bool
RDBObjectClone::FilterWhere(RDBObjectClone* aWhere) {
  if (!aWhere)
    return true;
  auto typeit = aWhere->strMembers.find(nsCString("type"));
  if (typeit == aWhere->strMembers.end())
    return false;
  nsString& type = typeit->second;

  if (type.LowerCaseEqualsASCII("and", 3)) {
    char tmp[8];
    for (uint32_t i = 1; i < 100; i++) {
      sprintf(tmp, "term%d", i);
      auto it = aWhere->objMembers.find(nsCString(tmp));
      if (it == aWhere->objMembers.end())
        break;
      if (!FilterWhere(it->second))
        return false;
    }
    return true;
  } else if (type.LowerCaseEqualsASCII("or", 2)) {
    char tmp[8];
    for (uint32_t i = 1; i < 100; i++) {
      sprintf(tmp, "term%d", i);
      auto it = aWhere->objMembers.find(nsCString(tmp));
      if (it == aWhere->objMembers.end())
        break;
      if (FilterWhere(it->second))
        return true;
    }
    return false;
  } else if (type.LowerCaseEqualsASCII("not", 3)) {
    auto it = aWhere->objMembers.find(nsCString("term1"));
    if (it == aWhere->objMembers.end())
      return false;
    return !FilterWhere(it->second);
  } else if (type.LowerCaseEqualsASCII("=", 1)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto msit = strMembers.find(col);
      if (msit == strMembers.end()) {
        return false;
      } else {
        return msit->second == sit->second;
      }
    }
    for (auto nit = aWhere->numMembers.begin(); nit != aWhere->numMembers.end(); nit++) {
      const nsCString& col = nit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto mnit = numMembers.find(col);
      if (mnit == numMembers.end()) {
        return false;
      } else {
        return mnit->second == nit->second;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII(">", 1)) {
    for (auto nit = aWhere->numMembers.begin(); nit != aWhere->numMembers.end(); nit++) {
      const nsCString& col = nit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto mnit = numMembers.find(col);
      if (mnit == numMembers.end()) {
        return false;
      } else {
        return mnit->second > nit->second;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII("<", 1)) {
    for (auto nit = aWhere->numMembers.begin(); nit != aWhere->numMembers.end(); nit++) {
      const nsCString& col = nit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto mnit = numMembers.find(col);
      if (mnit == numMembers.end()) {
        return false;
      } else {
        return mnit->second < nit->second;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII("<=", 2)) {
    for (auto nit = aWhere->numMembers.begin(); nit != aWhere->numMembers.end(); nit++) {
      const nsCString& col = nit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto mnit = numMembers.find(col);
      if (mnit == numMembers.end()) {
        return false;
      } else {
        return mnit->second <= nit->second;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII(">=", 2)) {
    for (auto nit = aWhere->numMembers.begin(); nit != aWhere->numMembers.end(); nit++) {
      const nsCString& col = nit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto mnit = numMembers.find(col);
      if (mnit == numMembers.end()) {
        return false;
      } else {
        return mnit->second >= nit->second;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII("!=", 2)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto msit = strMembers.find(col);
      if (msit == strMembers.end()) {
        return false;
      } else {
        return msit->second != sit->second;
      }
    }
    for (auto nit = aWhere->numMembers.begin(); nit != aWhere->numMembers.end(); nit++) {
      const nsCString& col = nit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      auto mnit = numMembers.find(col);
      if (mnit == numMembers.end()) {
        return false;
      } else {
        return mnit->second != nit->second;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII("=col", 4)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      nsCString col2 = NS_LossyConvertUTF16toASCII(sit->second);
      auto msit = strMembers.find(col);
      auto msit2 = strMembers.find(col2);
      if (msit != strMembers.end() && msit2 != strMembers.end()) {
        return msit->second == msit2->second;
      }

      auto mnit = numMembers.find(col);
      auto mnit2 = numMembers.find(col2);
      if (mnit != numMembers.end() && mnit2 != numMembers.end()) {
        return mnit->second == mnit2->second;
      } else {
        return false;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII(">col", 4)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      nsCString col2 = NS_LossyConvertUTF16toASCII(sit->second);
      auto mnit = numMembers.find(col);
      auto mnit2 = numMembers.find(col2);
      if (mnit != numMembers.end() && mnit2 != numMembers.end()) {
        return mnit->second > mnit2->second;
      } else {
        return false;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII("<col", 4)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      nsCString col2 = NS_LossyConvertUTF16toASCII(sit->second);
      auto mnit = numMembers.find(col);
      auto mnit2 = numMembers.find(col2);
      if (mnit != numMembers.end() && mnit2 != numMembers.end()) {
        return mnit->second < mnit2->second;
      } else {
        return false;
      }
    }
    return false;
  } else if (type.LowerCaseEqualsASCII("<=col", 5)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      nsCString col2 = NS_LossyConvertUTF16toASCII(sit->second);
      auto mnit = numMembers.find(col);
      auto mnit2 = numMembers.find(col2);
      if (mnit != numMembers.end() && mnit2 != numMembers.end()) {
        return mnit->second <= mnit2->second;
      } else {
        return false;
      }
    }
  } else if (type.LowerCaseEqualsASCII(">=col", 5)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      nsCString col2 = NS_LossyConvertUTF16toASCII(sit->second);
      auto mnit = numMembers.find(col);
      auto mnit2 = numMembers.find(col2);
      if (mnit != numMembers.end() && mnit2 != numMembers.end()) {
        return mnit->second >= mnit2->second;
      } else {
        return false;
      }
    }
  } else if (type.LowerCaseEqualsASCII("!=col", 5)) {
    for (auto sit = aWhere->strMembers.begin(); sit != aWhere->strMembers.end(); sit++) {
      const nsCString& col = sit->first;
      if (col.LowerCaseEqualsASCII("type")) {
        continue;
      }
      nsCString col2 = NS_LossyConvertUTF16toASCII(sit->second);
      auto msit = strMembers.find(col);
      auto msit2 = strMembers.find(col2);
      if (msit != strMembers.end() && msit2 != strMembers.end()) {
        return msit->second != msit2->second;
      }

      auto mnit = numMembers.find(col);
      auto mnit2 = numMembers.find(col2);
      if (mnit != numMembers.end() && mnit2 != numMembers.end()) {
        return mnit->second != mnit2->second;
      } else {
        return false;
      }
    }
    return false;
  }

  return false;
}

void
RDBObjectClone::FilterCols(std::set<nsCString>& aCols)
{
  for (auto it = strMembers.begin(); it != strMembers.end();) {
    auto cur = it++;
    if (aCols.find(cur->first) == aCols.end()) {
      strMembers.erase(cur);
    }
  }
  for (auto it = numMembers.begin(); it != numMembers.end();) {
    auto cur = it++;
    if (aCols.find(cur->first) == aCols.end()) {
      numMembers.erase(cur);
    }
  }
  for (auto it = objMembers.begin(); it != objMembers.end();) {
    auto cur = it++;
    if (aCols.find(cur->first) == aCols.end()) {
      delete cur->second;
      objMembers.erase(cur);
    }
  }
  for (auto it = blobMembers.begin(); it != blobMembers.end();) {
    auto cur = it++;
    if (aCols.find(cur->first) == aCols.end()) {
      blobMembers.erase(cur);
    }
  }
}

JSObject*
RDBIACRequest::WrapObject(JSContext* aCx)
{
  return RDBIACRequestBinding::Wrap(aCx, this);
}

void
RDBIACRequest::FilterAll()
{
  int size = mResultSet.size();
  for (int i = 0; i < size; i++) {
    RDBObjectClone* tmp = mResultSet.front();
    mResultSet.pop_front();
    if (tmp->FilterWhere(mOriginalWhere)
          && tmp->FilterWhere(mSecurityWhereWeak)) {
      tmp->FilterCols(mCols);
      mResultSet.push_back(tmp);
    } else {
      delete tmp;
    }
  }
  mProcessed = true;
}

void
RDBIACRequest::GetRow(JSContext* cx, JS::MutableHandle<JSObject*> retval)
{
  if (!mSuccess || !mStarted || !mProcessed || mResultSet.empty()) {
    return;
  }

  RDBObjectClone* tmp = mResultSet.front();
  tmp->ToObject(cx, retval);
}

bool
RDBIACRequest::Next(ErrorResult& aRv)
{
  if (mOp != RDB_REQUEST_QUERY || !mProcessed) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return false;
  }
  if (!mSuccess || mResultSet.empty()) {
    return false;
  }

  if (!mStarted) {
    mStarted = true;
  } else {
    delete mResultSet.front();
    mResultSet.pop_front();
  }
  return !mResultSet.empty();
}

bool
RDBIACRequest::Continue(ErrorResult& aRv)
{
  if (mOp != RDB_REQUEST_QUERY || !mProcessed) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return false;
  }

  if (!mContinue)
    return false;

  while (!mResultSet.empty()) {
    delete mResultSet.front();
    mResultSet.pop_front();
  }

  ResetStatus();
  mClient->mServer->EnqueueRequest(this, "list");
  nsRefPtr<RDBIAS> ref = mClient->mServer;
  RDBDispatchEventToJS("received", ref.forget());

  nsRefPtr<RDBIACRunnable> r = new RDBIACRunnable(this);

  nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return false;
  }
  return true;
}

already_AddRefed<RDBIAC>
RDBIACRequest::GetPropDesc(const nsACString& aAttrTab, ErrorResult& aRv)
{
  if (!mSuccess) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  if (mOp != RDB_REQUEST_INSERT && (mOp != RDB_REQUEST_QUERY || !mProcessed || !mStarted
        || mResultSet.empty())) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  nsCString ctab;
  if (mOp == RDB_REQUEST_INSERT) {
    ctab = mTab;
  } else {
    ctab = mTabs[0];
  }
  nsCString col = RDBPropColName(ctab);
  nsCString ptab(aAttrTab);

  nsRefPtr<RDBIAC> res = new RDBIAC(mClient, false);
  auto it = res->mTabs.find(ptab);
  auto sit = mClient->mTabs.find(ctab);
  if (it == res->mTabs.end() || sit == mClient->mTabs.end()) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  res->CloseAllOps();

  IACPerTableCapInfo& info = it->second;

  if (info.mCols.find(col) == info.mCols.end()) {
    return nullptr;
  }
  IACPerTableCapInfo& sinfo = sit->second;
  info.mQueryable = sinfo.mQueryable;
  info.mDeletable = sinfo.mUpdatable;
  info.mUpdatable = sinfo.mUpdatable;
  info.mInsertable = sinfo.mUpdatable;

  RDBObjectClone* where = new RDBObjectClone();
  info.mWhere = where;

  switch (mOp) {
    case RDB_REQUEST_QUERY:
    {
      RDBObjectClone* row = mResultSet.front();
      nsCString pk("pk");
      where->strMembers[nsCString("type")].AssignLiteral("=");
      if (row->numMembers.find(pk) != row->numMembers.end()) {
        where->numMembers[col] = row->numMembers[pk];
        info.mFixedNumCols[col] = row->numMembers[pk];
      } else if (row->strMembers.find(pk) != row->strMembers.end()) {
        where->strMembers[col] = row->strMembers[pk];
        info.mFixedStringCols[col] = row->strMembers[pk];
      } else {
        //aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
        return nullptr;
      }
    }
    break;
    case RDB_REQUEST_INSERT:
    {
      if (mStrNewPk.Length() > 0) {
        where->strMembers[col] = mStrNewPk;
        info.mFixedStringCols[col] = mStrNewPk;
      } else {
        where->numMembers[col] = mNumNewPk;
        info.mFixedNumCols[col] = mNumNewPk;
      }
    }
  }
  return res.forget();
}

already_AddRefed<RDBIAC>
RDBIACRequest::GetCapDesc(const nsACString& aCap, ErrorResult& aRv)
{
  if (mOp != RDB_REQUEST_QUERY || !mProcessed || !mSuccess || !mStarted
        || mResultSet.empty()) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  nsCString cap(aCap);

  nsCString col = RDBCapColName(cap);

  nsRefPtr<RDBIAC> res = new RDBIAC(mClient, false);
  auto it = res->mTabs.find(cap);
  auto sit = mClient->mTabs.find(mTabs[0]);
  if (it == res->mTabs.end() || sit == mClient->mTabs.end()) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  res->CloseAllOps();

  IACPerTableCapInfo& info = it->second;
  IACPerTableCapInfo& sinfo = sit->second;
  info.mQueryable = true;
  info.mDeletable = sinfo.mDeletable;
  info.mUpdatable = sinfo.mUpdatable;

  RDBObjectClone* where = new RDBObjectClone();
  info.mWhere = where;

  RDBObjectClone* row = mResultSet.front();
  nsCString pk("pk");
  where->strMembers[nsCString("type")].AssignLiteral("=");
  if (row->numMembers.find(col) != row->numMembers.end()) {
    where->numMembers[pk] = row->numMembers[col];
  } else if (row->strMembers.find(col) != row->strMembers.end()) {
    where->strMembers[pk] = row->strMembers[col];
  } else {
    //aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }
  return res.forget();
}

already_AddRefed<RDBIAC>
RDBIACRequest::GetSelfDesc(ErrorResult& aRv)
{
  if (mOp != RDB_REQUEST_QUERY || !mProcessed || !mSuccess || !mStarted
        || mResultSet.empty()) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  nsRefPtr<RDBIAC> res = new RDBIAC(mClient, false);
  auto it = res->mTabs.find(mTabs[0]);
  auto sit = mClient->mTabs.find(mTabs[0]);
  if (it == res->mTabs.end() || sit == mClient->mTabs.end()) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }

  res->CloseAllOps();

  IACPerTableCapInfo& info = it->second;
  IACPerTableCapInfo& sinfo = sit->second;
  info.mQueryable = true;
  info.mDeletable = sinfo.mDeletable;
  info.mUpdatable = sinfo.mUpdatable;

  RDBObjectClone* where = new RDBObjectClone();
  info.mWhere = where;

  RDBObjectClone* row = mResultSet.front();
  nsCString pk("pk");
  where->strMembers[nsCString("type")].AssignLiteral("=");
  if (row->numMembers.find(pk) != row->numMembers.end()) {
    where->numMembers[pk] = row->numMembers[pk];
  } else if (row->strMembers.find(pk) != row->strMembers.end()) {
    where->strMembers[pk] = row->strMembers[pk];
  } else {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }
  return res.forget();
}

RDBIACRequest::~RDBIACRequest() {
  while (!mResultSet.empty()) {
    delete mResultSet.front();
    mResultSet.pop_front();
  }

  if (mOriginalWhere)
    delete mOriginalWhere;
  if (mVal)
    delete mVal;
}

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBIACRequest)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBIACRequest, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mClient)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBIACRequest, RDBWrapperCache)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mClient)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBIACRequest, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBIACRequest)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBIACRequest, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBIACRequest, RDBWrapperCache)


JSObject*
RDBIASRequest::WrapObject(JSContext* aCx)
{
  return RDBIASRequestBinding::Wrap(aCx, this);
}


void RDBIASRequest::GetClientOp(nsCString& ret)
{
  switch (mClientRequest->mOp) {
    case RDB_REQUEST_QUERY:
      ret.Assign("query");
      break;
    case RDB_REQUEST_DELETE:
      ret.Assign("delete");
      break;
    case RDB_REQUEST_UPDATE:
      ret.Assign("update");
      break;
    case RDB_REQUEST_INSERT:
      ret.Assign("insert");
      break;
    case RDB_REQUEST_IAC_STEP_REMOVE:
      ret.Assign("delete");
      break;
    case RDB_REQUEST_IAC_STEP_ALTER:
      ret.Assign("update");
      break;
    default:
      ret.Assign("unknown");
  }
}

void RDBIASRequest::GetCols(nsTArray<nsCString>& ret)
{
  for (auto it = mClientRequest->mCols.begin(); it != mClientRequest->mCols.end(); it++) {
    ret.AppendElement(*it);
  }
}

void RDBIASRequest::GetTabs(nsTArray<nsCString>& ret)
{
  for (uint32_t i = 0; i < mClientRequest->mTabs.Length(); i++) {
    ret.AppendElement(mClientRequest->mTabs[i]);
  }
}

void RDBIASRequest::GetSecurityWhere(JSContext* cx, JS::MutableHandle<JSObject*> retval)
{
  if (mClientRequest->mSecurityWhereWeak)
    mClientRequest->mSecurityWhereWeak->ToObject(cx, retval);
}

void RDBIASRequest::GetOriginalWhere(JSContext* cx, JS::MutableHandle<JSObject*> retval)
{
  if (mClientRequest->mOriginalWhere)
    mClientRequest->mOriginalWhere->ToObject(cx, retval);
}

void RDBIASRequest::GetVal(JSContext* cx, JS::MutableHandle<JSObject*> retval)
{
  if (mClientRequest->mVal)
    mClientRequest->mVal->ToObject(cx, retval);
}

void RDBIASRequest::GetUpdatedCols(JSContext* cx, JS::MutableHandle<JSObject*> retval)
{
  if (mClientRequest->mNewValWeak)
    mClientRequest->mNewValWeak->ToObject(cx, retval);
}

void RDBIASRequest::List(JSContext* cx,
                         const Sequence<JSObject*>& aRes,
                         ErrorResult& aRv)
{
  AutoJSContext tcx;
  JS::Rooted<JSObject*> tmp(tcx);
  for (uint32_t i = 0; i < aRes.Length(); i++) {
    tmp = aRes[i];
    mClientRequest->mResultSet.push_back(new RDBObjectClone(cx, tmp));
  }
}

void RDBIASRequest::NotifySuccess(ErrorResult& aRv)
{
  mClientRequest->Notify(true);
}

void RDBIASRequest::NotifyIncomplete(ErrorResult& aRv)
{
  mClientRequest->NotifyIncomplete();
}

void RDBIASRequest::NotifyFailure(ErrorResult& aRv)
{
  mClientRequest->Notify(false);
}

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBIASRequest)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBIASRequest, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mClientRequest)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBIASRequest, RDBWrapperCache)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mClientRequest)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBIASRequest, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBIASRequest)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBIASRequest, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBIASRequest, RDBWrapperCache)