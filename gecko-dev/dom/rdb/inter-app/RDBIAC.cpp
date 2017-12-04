#include "RDBIAC.h"
#include "RDBIACRequest.h"
#include "nsRDB.h"
#include "nsIThreadPool.h"
#include "RDB.h"
#include "nsRDB.h"
#include "RDBUtils.h"
#include "mozilla/Mutex.h"
#include "nsIDocument.h"

#include "mozilla/dom/RDBIACBinding.h"
#include "mozilla/dom/RDBIASBinding.h"

#include <vector>

class RDBIAC;
class RDBIAS;
using namespace mozilla;
using namespace mozilla::dom;

std::map<nsString, nsRefPtr<RDBIAS>> RDBIAS::gRegisteredServers;
Mutex RDBIAS::gRegisteredServersMutex("RDBIAS::gRegisteredServersMutex");


JSObject*
RDBIAC::WrapObject(JSContext* aCx)
{
  return RDBIACBinding::Wrap(aCx, this);
}

RDBIAC::RDBIAC(nsPIDOMWindow* aOwner, RDBIAS* aServer)
  : RDBWrapperCache(aOwner)
  , mServer(aServer)
{
  uint32_t id;
  nsCOMPtr<nsIDocument> doc = aOwner->GetDoc();
  if (!doc)
    id = 0;
  else
    doc->NodePrincipal()->GetAppId(&id);
  mAppId = id;
  aServer->GetPolicyForApp(this, RDBGetAppNameById(id));
}

RDBIAC::RDBIAC(nsPIDOMWindow* aOwner, RDBIAS* aServer, uint32_t aAppId)
  : RDBWrapperCache(aOwner)
  , mServer(aServer)
  , mAppId(aAppId)
{
  aServer->GetPolicyForApp(this, RDBGetAppNameById(aAppId));
}

RDBIAC::RDBIAC(RDBIAC* aClone, bool aInheritWhere)
  : RDBWrapperCache(aClone->GetOwner())
  , mServer(aClone->mServer)
  , mAppId(aClone->mAppId)
{
  for (auto it = aClone->mTabs.begin(); it != aClone->mTabs.end(); it++) {
    mTabs[it->first] = it->second;
    IACPerTableCapInfo& info = mTabs[it->first];
    if (aInheritWhere && info.mWhere)
      info.mWhere = info.mWhere->Clone();
    else
      info.mWhere = nullptr;
  }
}

already_AddRefed<RDBIAC>
RDBIAC::CreateRDBIACWithServer(nsPIDOMWindow* aWin, RDBIAS* aServer, uint32_t aAppId)
{
  nsRefPtr<RDBIAC> client(new RDBIAC(aWin, aServer, aAppId));
  return client.forget();
}

already_AddRefed<RDBIAC>
RDBIAC::CreateRDBIAC(nsPIDOMWindow* aWin, const nsAString& aName, uint32_t aAppId)
{
  nsRefPtr<RDBIAS> s = RDBIAS::GetRegistered(nsString(aName), aAppId);
  if (!s)
    return nullptr;
  nsRefPtr<RDBIAC> c = new RDBIAC(aWin, s, aAppId);
  return c.forget();
}

void RDBIAC::CloseAllOps() {
  for (auto it = mTabs.begin(); it != mTabs.end(); it++) {
    IACPerTableCapInfo& info = it->second;
    info.mInsertable = false;
    info.mQueryable = false;
    info.mDeletable = false;
    info.mUpdatable = false;
  }
}


void
RDBIAC::Send(const nsAString& aMsg, ErrorResult& aRv)
{
  nsRefPtr<RDBIAS> s = mServer;
  s->SetClient(this);
  RDBDispatchEventToJS("received", s.forget());
}


already_AddRefed<RDBIACRequest>
RDBIAC::Query(JSContext* aCx,
              const Sequence<nsCString>& aTabs,
              const Sequence<nsCString>& aCols,
              JS::Handle<JSObject*> aWhere,
              const nsACString& aOrderBy,
              ErrorResult& aRv)
{
  if (aTabs.Length() != 1) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  auto it = mTabs.find(aTabs[0]);
  if (it == mTabs.end() || !it->second.mQueryable) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  IACPerTableCapInfo& info = it->second;
  nsRefPtr<RDBIACRequest> req = new RDBIACRequest(GetOwner());
  req->mOp = RDB_REQUEST_QUERY;
  for (uint32_t i = 0; i < aCols.Length(); i++) {
    if (info.mCols.find(aCols[i]) == info.mCols.end()) {
      aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
      return nullptr;
    }
    req->mCols.insert(aCols[i]);
  }
  req->mClient = this;
  for (uint32_t i = 0; i < aTabs.Length(); i++) {
    req->mTabs.AppendElement(aTabs[i]);
  }

  req->mSecurityWhereWeak = info.mWhere;
  if (aWhere.get() != nullptr) {
    req->mOriginalWhere = new RDBObjectClone(aCx, aWhere);
  }

  mServer->EnqueueRequest(req, "list");

  nsRefPtr<RDBIAS> ref = mServer;
  RDBDispatchEventToJS("received", ref.forget());

  nsRefPtr<RDBIACRunnable> r = new RDBIACRunnable(req);

  nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
  }

  return req.forget();
}

already_AddRefed<RDBIACRequest>
RDBIAC::Insert(JSContext* aCx,
               const nsACString& aTab,
               JS::Handle<JSObject*> aVals,
               ErrorResult& aRv)
{
  nsCString tab;
  tab.Assign(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end() || !it->second.mInsertable) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }

  IACPerTableCapInfo& info = it->second;

  nsRefPtr<RDBIACRequest> req = new RDBIACRequest(GetOwner());
  req->mOp = RDB_REQUEST_INSERT;
  if (aVals.get() == nullptr) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  req->mVal = RDBObjectClone::CreateWithRestriction(aCx, aVals, info, RDB_REQUEST_INSERT);
  if (!req->mVal) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  req->mClient = this;
  req->mTab = tab;

  mServer->EnqueueRequest(req, "add");

  nsRefPtr<RDBIAS> ref = mServer;
  RDBDispatchEventToJS("received", ref.forget());

  nsRefPtr<RDBIACRunnable> r = new RDBIACRunnable(req);
  nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
  }

  return req.forget();
}

already_AddRefed<RDBIACRequest>
RDBIAC::Update(JSContext* aCx,
               const nsACString& aTab,
               JS::Handle<JSObject*> aWhere,
               JS::Handle<JSObject*> aVals,
               ErrorResult& aRv)
{
  nsCString tab;
  tab.Assign(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end() || !it->second.mUpdatable) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  IACPerTableCapInfo& info = it->second;

  nsRefPtr<RDBIACRequest> req = new RDBIACRequest(GetOwner());
  req->mOp = RDB_REQUEST_UPDATE;
  req->mTab = tab;
  req->mTabs.AppendElement(tab);
  req->mClient = this;

  req->mSecurityWhereWeak = info.mWhere;
  if (aWhere.get() != nullptr) {
    req->mOriginalWhere = new RDBObjectClone(aCx, aWhere);
  }

  if (aVals.get() == nullptr) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  req->mVal = RDBObjectClone::CreateWithRestriction(aCx, aVals, info, RDB_REQUEST_UPDATE);
  if (!req->mVal) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }

  mServer->EnqueueRequest(req, "list");

  nsRefPtr<RDBIAS> ref = mServer;
  RDBDispatchEventToJS("received", ref.forget());

  nsRefPtr<RDBIACRunnable> r = new RDBIACRunnable(req);
  nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
  }
  return req.forget();
}

already_AddRefed<RDBIACRequest>
RDBIAC::Delete(JSContext* aCx,
               const nsACString& aTab,
               JS::Handle<JSObject*> aWhere,
               ErrorResult& aRv)
{
  nsCString tab;
  tab.Assign(aTab);
  auto it = mTabs.find(tab);
  if (it == mTabs.end() || !it->second.mDeletable) {
    aRv.Throw(NS_ERROR_DOM_RDB_CONSTRAINT_ERR);
    return nullptr;
  }
  IACPerTableCapInfo& info = it->second;
  nsRefPtr<RDBIACRequest> req = new RDBIACRequest(GetOwner());
  req->mOp = RDB_REQUEST_DELETE;
  req->mTab = tab;
  req->mTabs.AppendElement(tab);
  req->mClient = this;

  req->mSecurityWhereWeak = info.mWhere;
  if (aWhere.get() != nullptr) {
    req->mOriginalWhere = new RDBObjectClone(aCx, aWhere);
  }

  mServer->EnqueueRequest(req, "list");

  nsRefPtr<RDBIAS> ref = mServer;
  RDBDispatchEventToJS("received", ref.forget());

  nsRefPtr<RDBIACRunnable> r = new RDBIACRunnable(req);

  nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
  }

  return req.forget();
}


NS_IMPL_CYCLE_COLLECTION_CLASS(RDBIAC)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBIAC, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mServer)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBIAC, RDBWrapperCache)
  NS_IMPL_CYCLE_COLLECTION_UNLINK(mServer)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBIAC, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBIAC)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBIAC, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBIAC, RDBWrapperCache)


RDBIAS::RDBIAS(nsPIDOMWindow* aOwner, const nsAString& aName)
  : RDBWrapperCache(aOwner)
  , mMutex("RDBIAS.mMutex")
{
  uint32_t id;
  nsCOMPtr<nsIDocument> doc = aOwner->GetDoc();
  if (!doc)
    id = 0;
  else
    doc->NodePrincipal()->GetAppId(&id);
  mAppId = id;

  mName.Assign(RDBGetAppNameById(mAppId));
  mName.Append(NS_ConvertASCIItoUTF16("/"));
  mName.Append(aName);
}

already_AddRefed<RDBIAC>
RDBIAS::CreateClientFor(uint32_t aAppId, ErrorResult& aRv)
{
  nsRefPtr<RDBIAC> client = RDBIAC::CreateRDBIACWithServer(GetOwner(), this, aAppId);
  return client.forget();
}

JSObject*
RDBIAS::WrapObject(JSContext* aCx)
{
  return RDBIASBinding::Wrap(aCx, this);
}

RDBIAS*
RDBIAS::CreateRDBIAS(nsPIDOMWindow* aWin, const nsAString& aName)
{
  RDBIAS* s = new RDBIAS(aWin, nsString(aName));
  MutexAutoLock l(gRegisteredServersMutex);
  gRegisteredServers[s->mName] = s;
  return s;
}


void
RDBIAS::EnqueueRequest(RDBIACRequest* aClientReq, const char *op)
{
  MutexAutoLock l(mMutex);
  mQueue.push(new RDBIASRequest(GetOwner(), aClientReq, op));
}

already_AddRefed<RDBIASRequest>
RDBIAS::GetNextRequest(ErrorResult& aRv)
{
  MutexAutoLock l(mMutex);
  if (mQueue.empty()) {
    aRv.Throw(NS_ERROR_DOM_INVALID_STATE_ERR);
    return nullptr;
  }
  nsRefPtr<RDBIASRequest> s = mQueue.front();
  mQueue.pop();
  return s.forget();
}

void
RDBIAS::Send(const nsAString& aMsg, ErrorResult& aRv)
{
  nsRefPtr<RDBIAC> c = mClient;
  RDBDispatchEventToJS("received", c.forget());
}



void
RDBIAS::SetDefaultPolicy(JSContext* aCx, JS::Handle<JSObject*> aPolicy, ErrorResult& aRv)
{
  SetPolicyForApp(aCx, NS_ConvertASCIItoUTF16("default"), aPolicy, aRv);
}

void
RDBIAS::SetPolicyForMyself(JSContext* aCx, JS::Handle<JSObject*> aPolicy, ErrorResult& aRv)
{
  SetPolicyForApp(aCx, RDBGetAppNameById(mAppId), aPolicy, aRv);
}

void
RDBIAS::SetPolicyForApp(JSContext* aCx,
                        const nsAString& aAppName,
                        JS::Handle<JSObject*> aPolicy,
                        ErrorResult& aRv)
{
  char tmp[512];
  MutexAutoLock l(mMutex);
  RDBObjectClone* p = new RDBObjectClone(aCx, aPolicy);
  nsString app(aAppName);
  mPolicyRepo[app];
  for (auto it = p->objMembers.begin(); it != p->objMembers.end(); it++) {
    const nsCString& tab = it->first;
    mPolicyRepo[app][tab];
    IACPerTableCapInfo& info = mPolicyRepo[app][tab];
    RDBObjectClone* tp = it->second;
    if (tp->numMembers.find(nsCString("insertable")) != tp->numMembers.end()) {
      info.mInsertable = tp->numMembers[nsCString("insertable")];
    }
    if (tp->numMembers.find(nsCString("updatable")) != tp->numMembers.end()) {
      info.mUpdatable = tp->numMembers[nsCString("updatable")];
    }
    if (tp->numMembers.find(nsCString("queryable")) != tp->numMembers.end()) {
      info.mQueryable = tp->numMembers[nsCString("queryable")];
    }
    if (tp->numMembers.find(nsCString("deletable")) != tp->numMembers.end()) {
      info.mDeletable = tp->numMembers[nsCString("deletable")];
    }

    if (tp->strMembers.find(nsCString("cols")) != tp->strMembers.end()) {
      nsCString cols = NS_ConvertUTF16toUTF8(tp->strMembers[nsCString("cols")]);
      while (cols.Length() > 0) {
        PRInt32 pos = cols.Find(",", false, 0, -1);
        if (pos == kNotFound) {
          info.mCols.insert(cols);
          break;
        }
        memcpy(tmp, cols.BeginReading(), pos);
        tmp[pos] = '\0';
        info.mCols.insert(nsCString(tmp));
        cols = nsCString(cols.BeginReading() + pos + 1);
      }
    }

    if (tp->objMembers.find(nsCString("where")) != tp->objMembers.end()) {
      info.mWhere = tp->objMembers[nsCString("where")];
      tp->objMembers[nsCString("where")] = nullptr;
    }

    if (tp->objMembers.find(nsCString("fixedCols")) != tp->objMembers.end()) {
      RDBObjectClone* fixed = tp->objMembers[nsCString("fixedCols")];
      for (auto iit = fixed->strMembers.begin(); iit != fixed->strMembers.end(); iit++) {
        info.mFixedStringCols[iit->first] = iit->second;
      }
      for (auto iit = fixed->numMembers.begin(); iit != fixed->numMembers.end(); iit++) {
        info.mFixedNumCols[iit->first] = iit->second;
      }
    }
  }

  delete p;
}

void
RDBIAS::GetPolicyForApp(RDBIAC* aClient, const nsString& aAppName) {
  MutexAutoLock l(mMutex);
  auto it = mPolicyRepo.find(aAppName);
  if (it == mPolicyRepo.end()) {
    it = mPolicyRepo.find(NS_ConvertASCIItoUTF16("default"));
  }
  if (it != mPolicyRepo.end()) {
    for (auto iit = it->second.begin(); iit != it->second.end(); iit++) {
      aClient->mTabs[iit->first] = iit->second;
      if (iit->second.mWhere)
        iit->second.mWhere = iit->second.mWhere->Clone();
    }
  }
}

// static
already_AddRefed<RDBIAS>
RDBIAS::GetRegistered(const nsString& aName, uint32_t aAppId)
{
  nsString name;
  if (aName.Find("/", false, 0, -1) == kNotFound) {
    // open my own service
    name.Assign(RDBGetAppNameById(aAppId));
    name.Append(NS_ConvertASCIItoUTF16("/"));
    name.Append(aName);
  } else {
    name.Assign(aName);
  }
  MutexAutoLock l(gRegisteredServersMutex);
  auto it = gRegisteredServers.find(name);
  if (it == gRegisteredServers.end())
    return nullptr;
  nsRefPtr<RDBIAS> s = it->second;
  return s.forget();
}

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBIAS)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBIAS, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
  // NS_IMPL_CYCLE_COLLECTION_TRAVERSE(mClient)
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBIAS, RDBWrapperCache)
  // NS_IMPL_CYCLE_COLLECTION_UNLINK(mClient)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBIAS, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBIAS)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBIAS, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBIAS, RDBWrapperCache)


RDBIACRunnable::RDBIACRunnable(RDBIACRequest* req)
  : mRequest(req), mParentRequest(nullptr), mVal(nullptr)
{
  if (req) {
    mOp = req->mOp;
  }
}

nsresult
RDBIACRunnable::Run()
{
  switch (mOp) {
    case RDB_REQUEST_INSERT:
      if (mRequest->WaitForComplete()) {
        RDBDispatchEventToJS("success", mRequest.forget());
      } else {
        RDBDispatchEventToJS("error", mRequest.forget());
      }
      break;
    case RDB_REQUEST_QUERY:
      if (mRequest->WaitForComplete()) {
        // do filtering
        mRequest->FilterAll();
        RDBDispatchEventToJS("success", mRequest.forget());
      } else {
        RDBDispatchEventToJS("error", mRequest.forget());
      }
      break;
    case RDB_REQUEST_DELETE:
    {
      bool success = true;
      do {
        if (mRequest->WaitForComplete()) {
          int count = 0;
          bool more = mRequest->HasMore();
          mRequest->ResetStatus();
          while (!mRequest->mResultSet.empty()) {
            RDBObjectClone* tmp = mRequest->mResultSet.front();
            mRequest->mResultSet.pop_front();
            if (tmp->FilterWhere(mRequest->mSecurityWhereWeak) &&
                tmp->FilterWhere(mRequest->mOriginalWhere)) {
              nsRefPtr<RDBIACRunnable> run = new RDBIACRunnable(nullptr);
              run->mOp = RDB_REQUEST_IAC_STEP_REMOVE;
              run->mParentRequest = mRequest;
              run->mVal = tmp;
              NS_DispatchToMainThread(run);
              count++;
            } else {
              delete tmp;
            }
          }
          if (!mRequest->WaitForComplete(count)) {
            success = false;
          }
          if (!more) {
            break;
          }
          nsRefPtr<RDBIACRunnable> run = new RDBIACRunnable(nullptr);
          run->mOp = RDB_REQUEST_IAC_CONTINUE;
          run->mParentRequest = mRequest;
          mRequest->ResetStatus();
          NS_DispatchToMainThread(run);
        } else {
          success = false;
          break;
        }
      } while (true);

      if (success) {
        RDBDispatchEventToJS("success", mRequest.forget());
      } else {
        RDBDispatchEventToJS("error", mRequest.forget());
      }
      break;
    }
    case RDB_REQUEST_UPDATE:
    {
      bool success = true;
      do {
        if (mRequest->WaitForComplete()) {
          int count = 0;
          bool more = mRequest->HasMore();
          mRequest->ResetStatus();
          while (!mRequest->mResultSet.empty()) {
            RDBObjectClone* tmp = mRequest->mResultSet.front();
            mRequest->mResultSet.pop_front();
            if (tmp->FilterWhere(mRequest->mSecurityWhereWeak) &&
                tmp->FilterWhere(mRequest->mOriginalWhere)) {
              nsRefPtr<RDBIACRunnable> run = new RDBIACRunnable(nullptr);
              run->mOp = RDB_REQUEST_IAC_STEP_ALTER;
              run->mParentRequest = mRequest;
              run->mVal = tmp;
              NS_DispatchToMainThread(run);
              count++;
            } else {
              delete tmp;
            }
          }
          if (!mRequest->WaitForComplete(count)) {
            success = false;
          }
          if (!more) {
            break;
          }
          nsRefPtr<RDBIACRunnable> run = new RDBIACRunnable(nullptr);
          run->mOp = RDB_REQUEST_IAC_CONTINUE;
          run->mParentRequest = mRequest;
          mRequest->ResetStatus();
          NS_DispatchToMainThread(run);
        } else {
          success = false;
          break;
        }
      } while (true);

      if (success) {
        RDBDispatchEventToJS("success", mRequest.forget());
      } else {
        RDBDispatchEventToJS("error", mRequest.forget());
      }
      break;
    }
    case RDB_REQUEST_IAC_STEP_REMOVE:
    {
      nsRefPtr<RDBIACRequest> req = new RDBIACRequest(mParentRequest->GetOwner());
      req->mVal = mVal;
      req->mTab = mParentRequest->mTab;
      nsRefPtr<RDBIAS> ref = mParentRequest->mClient->mServer;
      ref->EnqueueRequest(req, "remove");
      RDBDispatchEventToJS("received", ref.forget());

      req->mOp = RDB_REQUEST_IAC_WAIT_FOR_COMPLETE;
      nsRefPtr<RDBIACRunnable> run = new RDBIACRunnable(req);
      run->mParentRequest = mParentRequest;

      nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(run, NS_DISPATCH_NORMAL);
      if (NS_FAILED(rv)) {
        mParentRequest->Notify(false);
      }
      break;
    }
    case RDB_REQUEST_IAC_STEP_ALTER:
    {
      nsRefPtr<RDBIACRequest> req = new RDBIACRequest(mParentRequest->GetOwner());
      req->mVal = mVal;
      req->mTab = mParentRequest->mTab;
      req->mNewValWeak = mParentRequest->mVal;
      nsRefPtr<RDBIAS> ref = mParentRequest->mClient->mServer;
      ref->EnqueueRequest(req, "alter");
      RDBDispatchEventToJS("received", ref.forget());

      req->mOp = RDB_REQUEST_IAC_WAIT_FOR_COMPLETE;
      nsRefPtr<RDBIACRunnable> run = new RDBIACRunnable(req);
      run->mParentRequest = mParentRequest;

      nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(run, NS_DISPATCH_NORMAL);
      if (NS_FAILED(rv)) {
        mParentRequest->Notify(false);
      }
      break;
    }
    case RDB_REQUEST_IAC_WAIT_FOR_COMPLETE:
      mParentRequest->Notify(mRequest->WaitForComplete());
      mOp = RDB_REQUEST_IAC_FREE;
      NS_DispatchToMainThread(this);
      break;
    case RDB_REQUEST_IAC_CONTINUE:
    {
      nsRefPtr<RDBIAS> ref = mParentRequest->mClient->mServer;
      ref->EnqueueRequest(mParentRequest, "list");
      RDBDispatchEventToJS("received", ref.forget());
      break;
    }
    case RDB_REQUEST_IAC_FREE:
      break;
    default:
      break;
  }

  return NS_OK;
}


NS_IMPL_ISUPPORTS(RDBIACRunnable, nsIRunnable)
