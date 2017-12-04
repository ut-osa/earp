#include "RDBOwnershipToken.h"
#include "nsRDB.h"
#include "nsIThreadPool.h"
#include "RDB.h"
#include "RDBUtils.h"

#include "mozilla/dom/RDBOwnershipTokenBinding.h"

class RDBOwnershipToken;
using namespace mozilla;
using namespace mozilla::dom;

JSObject*
RDBOwnershipToken::WrapObject(JSContext* aCx)
{
  return RDBOwnershipTokenBinding::Wrap(aCx, this);
}


NS_IMPL_CYCLE_COLLECTION_CLASS(RDBOwnershipToken)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBOwnershipToken, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBOwnershipToken, RDBWrapperCache)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBOwnershipToken, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBOwnershipToken)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBOwnershipToken, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBOwnershipToken, RDBWrapperCache)