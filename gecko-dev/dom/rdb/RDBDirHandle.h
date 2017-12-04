#ifndef NS_RDB_DIR_HANDLE_H__
#define NS_RDB_DIR_HANDLE_H__

#include "mozilla/DOMEventTargetHelper.h"
#include "mozilla/RefPtr.h"
#include "mozilla/StaticPtr.h"
#include "nsWrapperCache.h"
#include "RDBWrapperCache.h"
#include "nsCycleCollectionParticipant.h"
#include "RDBRequest.h"

#include "nsIVariant.h"
#include "nsCOMPtr.h"

#include "mozilla/dom/TypedArray.h"
#include "mozilla/dom/DOMError.h"
#include "mozilla/ErrorResult.h"

namespace mozilla {
class EventListenerManager;
class ErrorResult;
namespace dom {
class DOMRequest;
} // namespace dom
} // namespace mozilla

using mozilla::ErrorResult;
using mozilla::dom::Nullable;

class RDBDirHandle : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBDirHandle,
                                                         RDBWrapperCache)

  RDBDirHandle(nsPIDOMWindow* aOwner, const nsString& aPath)
    : RDBWrapperCache(aOwner)
    , mPath(aPath)
  {
  }

  already_AddRefed<nsIDOMBlob>
  GetFile(const nsAString& aFileName, ErrorResult &aRv);

  already_AddRefed<RDBRequest>
  StoreFile(const nsAString& aFileName, nsIDOMBlob* aBlob, ErrorResult& aRv);
  
  already_AddRefed<RDBRequest>
  DeleteFile(const nsAString& aFileName, ErrorResult &aRv);
  
  nsString mPath;

  // nsWrapperCache
  virtual JSObject*
  WrapObject(JSContext* aCx) MOZ_OVERRIDE;

  // WebIDL
  nsPIDOMWindow*
  GetParentObject() const
  {
    return GetOwner();
  }

private:
  ~RDBDirHandle(){}
};

#endif