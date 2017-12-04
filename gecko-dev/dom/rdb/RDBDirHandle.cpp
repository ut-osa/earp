#include "RDBDirHandle.h"
#include "RDBUtils.h"
#include "RDB.h"
#include "ReportInternalError.h"

#include "nsIThreadPool.h"
#include "nsNetCID.h"

#include "mozilla/dom/RDBDirHandleBinding.h"

#define RDB_DIR_REQUEST_GET 0
#define RDB_DIR_REQUEST_STORE 1
#define RDB_DIR_REQUEST_DELETE 2

class RDBDirHandle;
using namespace mozilla;
using namespace mozilla::dom;

class RDBDirRunnable MOZ_FINAL
  : public nsIRunnable
{
  public:
    NS_DECL_THREADSAFE_ISUPPORTS
    NS_DECL_NSIRUNNABLE

    RDBDirRunnable(RDBRequest* aRequest,
    	const int aRequestType,
    	const nsAString& aPath,
    	nsIDOMBlob* aBlob)
      : mRequest(aRequest)
      , mRequestType(aRequestType)
      , mPath(aPath)
      , mBlob(aBlob)
    {
    }

  private:
    ~RDBDirRunnable() {}

    nsRefPtr<RDBRequest> mRequest;
    int mRequestType;
    nsString mPath;
    nsIDOMBlob* mBlob;
};

NS_IMPL_ISUPPORTS(RDBDirRunnable, nsIRunnable)

nsresult RDBDirRunnable::Run()
{
  nsresult res = NS_OK;
  switch (mRequestType) {
    case RDB_DIR_REQUEST_GET:
      break;
    case RDB_DIR_REQUEST_STORE:
    {
      mRequest->SetCompletionNum(1);
      nsCOMPtr<nsIRunnable> nfevent(new RDBNewFileEvent(mRequest, mBlob, mPath, 0));
      nsCOMPtr<nsIEventTarget> target = do_GetService(NS_STREAMTRANSPORTSERVICE_CONTRACTID);
      target->Dispatch(nfevent, NS_DISPATCH_NORMAL);
      mRequest->WaitForComplete();
      RDBDispatchEventToJS("success", mRequest.forget());
      break;
    }
    case RDB_DIR_REQUEST_DELETE:
    {
      RDBDeleteFile(mPath, 0);
      RDBDispatchEventToJS("success", mRequest.forget());
      break;
    }
    default:
      break;
  }
  return res;
}

JSObject*
RDBDirHandle::WrapObject(JSContext* aCx)
{
  return RDBDirHandleBinding::Wrap(aCx, this);
}

already_AddRefed<nsIDOMBlob>
RDBDirHandle::GetFile(const nsAString& aFileName, ErrorResult& aRv) {
  nsString path(mPath);
  path.Append(NS_ConvertASCIItoUTF16("/"));
  path.Append(aFileName);
  nsRefPtr<nsIDOMBlob> blob = RDBGetDOMFile(path, 0);
  if (blob)
  	return blob.forget();
  return nullptr;
}

already_AddRefed<RDBRequest>
RDBDirHandle::StoreFile(const nsAString& aFileName, nsIDOMBlob* aBlob, ErrorResult& aRv) {
  nsString path(mPath);
  path.Append(NS_ConvertASCIItoUTF16("/"));
  path.Append(aFileName);

  AutoJSContext cx;
  JS::Rooted<JSObject*> scriptOwner(cx);
  scriptOwner = nullptr;

  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(nullptr, GetOwner(), scriptOwner);

  nsRefPtr<RDBDirRunnable> r = new RDBDirRunnable(
  	request, RDB_DIR_REQUEST_STORE, path, aBlob);
  nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }
  
  return request.forget();
}

already_AddRefed<RDBRequest>
RDBDirHandle::DeleteFile(const nsAString& aFileName, ErrorResult &aRv) {
  nsString path(mPath);
  path.Append(NS_ConvertASCIItoUTF16("/"));
  path.Append(aFileName);

  AutoJSContext cx;
  JS::Rooted<JSObject*> scriptOwner(cx);
  scriptOwner = nullptr;

  nsRefPtr<RDBRequest> request =
    RDBRequest::Create(nullptr, GetOwner(), scriptOwner);

  nsRefPtr<RDBDirRunnable> r = new RDBDirRunnable(
  	request, RDB_DIR_REQUEST_DELETE, path, nullptr);
  nsresult rv = nsDOMRDB::GetThreadPool()->Dispatch(r, NS_DISPATCH_NORMAL);
  if (NS_FAILED(rv)) {
    aRv.Throw(rv);
    return nullptr;
  }
  
  return request.forget();
}

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBDirHandle)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBDirHandle, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBDirHandle, RDBWrapperCache)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBDirHandle, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBDirHandle)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBDirHandle, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBDirHandle, RDBWrapperCache)