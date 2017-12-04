#ifndef NS_RDB_OWNERSHIP_TOKEN_h
#define NS_RDB_OWNERSHIP_TOKEN_h

#include "mozilla/DOMEventTargetHelper.h"
#include "mozilla/RefPtr.h"
#include "mozilla/StaticPtr.h"
#include "mozilla/dom/DOMRequest.h"
#include "nsWrapperCache.h"
#include "RDBWrapperCache.h"
#include "nsCycleCollectionParticipant.h"

#include "nsIVariant.h"
#include "nsCOMPtr.h"

#include "mozilla/dom/TypedArray.h"
#include "mozilla/dom/DOMError.h"
#include "mozilla/ErrorResult.h"
#include "RDB.h"

#include "RDBRequest.h"
#include "RDBCursor.h"

namespace mozilla {
class EventListenerManager;
class ErrorResult;
namespace dom {
class DOMRequest;
} // namespace dom
} // namespace mozilla

class RDBRequest;
class RDBCursor;
class nsDOMRDB;

using mozilla::ErrorResult;
using mozilla::dom::Sequence;
using mozilla::dom::Nullable;

class RDBOwnershipToken : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBOwnershipToken,
                                                         RDBWrapperCache)

  RDBOwnershipToken(nsPIDOMWindow* aOwner, nsString& aRDB, nsCString aTab, uint64_t aPK)
    : RDBWrapperCache(aOwner)
    , mRDB(aRDB)
    , mTab(aTab)
    , mPK(aPK)
  {
  }
  nsString mRDB;
  nsCString mTab;
  uint64_t mPK;

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
  ~RDBOwnershipToken(){}
};

#endif