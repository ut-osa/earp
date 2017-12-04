/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */


#include "RDBParent.h"

#include "nsIDOMEvent.h"
#include "nsIDOMFile.h"
#include "nsIXPConnect.h"

#include "mozilla/AppProcessChecker.h"
#include "mozilla/Assertions.h"
#include "mozilla/Attributes.h"
#include "mozilla/dom/ContentParent.h"
#include "mozilla/dom/RDBRequestBinding.h"
#include "mozilla/dom/ipc/Blob.h"
#include "mozilla/dom/TabParent.h"
#include "mozilla/unused.h"

#define CHROME_ORIGIN "chrome"
#define PERMISSION_PREFIX "indexedDB-chrome-"
#define PERMISSION_SUFFIX_READ "-read"
#define PERMISSION_SUFFIX_WRITE "-write"


using namespace mozilla;
using namespace mozilla::dom;

/*******************************************************************************
 * RDBParent
 ******************************************************************************/

RDBParent::RDBParent(ContentParent* aContentParent)
: mManagerContent(aContentParent), mManagerTab(nullptr), mDisconnected(false)
{
  MOZ_COUNT_CTOR(RDBParent);
  MOZ_ASSERT(aContentParent);
}

RDBParent::RDBParent(TabParent* aTabParent)
: mManagerContent(nullptr), mManagerTab(aTabParent), mDisconnected(false)
{
  MOZ_COUNT_CTOR(RDBParent);
  MOZ_ASSERT(aTabParent);
}

RDBParent::~RDBParent()
{
  MOZ_COUNT_DTOR(RDBParent);
}

void
RDBParent::Disconnect()
{
  if (mDisconnected) {
    return;
  }

  mDisconnected = true;

  const InfallibleTArray<PRDBRequestParent*>& reqs =
    ManagedPRDBRequestParent();
  for (uint32_t i = 0; i < reqs.Length(); ++i) {
    static_cast<RDBRequestParent*>(reqs[i])->Disconnect();
  }
}

bool
RDBParent::CheckReadPermission(const nsAString& aDatabaseName)
{
  // yxu TODO
  return true;
}

bool
RDBParent::CheckWritePermission(const nsAString& aDatabaseName)
{
  // yxu TODO
  return true;
}

mozilla::ipc::IProtocol*
RDBParent::CloneProtocol(Channel* aChannel,
                               mozilla::ipc::ProtocolCloneContext* aCtx)
{
  MOZ_ASSERT(mManagerContent != nullptr);
  MOZ_ASSERT(mManagerTab == nullptr);
  MOZ_ASSERT(!mDisconnected);

  ContentParent* contentParent = aCtx->GetContentParent();
  nsAutoPtr<PRDBParent> actor(contentParent->AllocPRDBParent());
  if (!actor || !contentParent->RecvPRDBConstructor(actor)) {
    return nullptr;
  }
  return actor.forget();
}

bool
RDBParent::CheckPermissionInternal(const nsAString& aDatabaseName,
                                         const nsACString& aPermission)
{
  // yxu TODO
  return true;
}

void
RDBParent::ActorDestroy(ActorDestroyReason aWhy)
{
  // ??
}

bool
RDBParent::RecvPRDBRequestConstructor(
                          PRDBRequestParent* aActor,
                          const RDBRequestConstructorParams& aParams)
{
  if (IsDisconnected()) {
    // We're shutting down, ignore this request.
    return true;
  }

  RDBRequestParent* actor =
    static_cast<RDBRequestParent*>(aActor);

  return actor->ProcessRequest();
}


PRDBRequestParent*
RDBParent::AllocPRDBRequestParent(
                    const RDBRequestConstructorParams& aParams)
{
  return new RDBRequestParent(aParams);
}

bool
RDBParent::DeallocPRDBRequestParent(PRDBRequestParent* aActor)
{
  delete aActor;
  return true;
}



/*******************************************************************************
 * RDBRequestParent
 ******************************************************************************/

RDBRequestParent::RDBRequestParent(
            const RDBRequestConstructorParams& aParams)
  : mRequestType(aParams.requestType())
{
  MOZ_COUNT_CTOR(RDBRequestParent);
}

RDBRequestParent::~RDBRequestParent()
{
  MOZ_COUNT_DTOR(RDBRequestParent);
}

void
RDBRequestParent::Disconnect()
{
}

bool
RDBRequestParent::ProcessTestRequest()
{
  PRDBRequestTestResponse tres;
  tres.res() = NS_OK;
  PRDBRequestResponse res = tres;
  return Send__delete__(this, res);
}

bool
RDBRequestParent::ProcessRequest()
{
  switch (mRequestType) {
    case RDB_REQUEST_TEST:
      return ProcessTestRequest();
      break;
    default:
      break;
  }

  return true;
}

void
RDBRequestParent::ActorDestroy(ActorDestroyReason aWhy)
{
  // ??
}