/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "base/basictypes.h"

#include "RDBChild.h"

#include "nsIInputStream.h"

#include "mozilla/Assertions.h"
#include "mozilla/dom/ContentChild.h"

using namespace mozilla;
using namespace mozilla::dom;


/*******************************************************************************
 * RDBChild
 ******************************************************************************/

RDBChild::RDBChild(ContentChild* aContentChild,
                   const nsCString& aASCIIOrigin)
: mManagerContent(aContentChild)
, mManagerTab(nullptr)
, mASCIIOrigin(aASCIIOrigin)
#ifdef DEBUG
, mDisconnected(false)
#endif
{
  MOZ_ASSERT(aContentChild);
  MOZ_COUNT_CTOR(RDBChild);
}

RDBChild::RDBChild(TabChild* aTabChild,
                   const nsCString& aASCIIOrigin)
: mManagerContent(nullptr)
, mManagerTab(aTabChild)
, mASCIIOrigin(aASCIIOrigin)
#ifdef DEBUG
, mDisconnected(false)
#endif
{
  MOZ_ASSERT(aTabChild);
  MOZ_COUNT_CTOR(RDBChild);
}

RDBChild::~RDBChild()
{
  MOZ_COUNT_DTOR(RDBChild);
}

void
RDBChild::Disconnect()
{
#ifdef DEBUG
  MOZ_ASSERT(!mDisconnected);
  mDisconnected = true;
#endif

  const InfallibleTArray<PRDBRequestChild*>& reqs =
    ManagedPRDBRequestChild();
  for (uint32_t i = 0; i < reqs.Length(); ++i) {
    static_cast<RDBRequestChild*>(reqs[i])->Disconnect();
  }
}

void
RDBChild::ActorDestroy(ActorDestroyReason aWhy)
{
}

PRDBRequestChild*
RDBChild::AllocPRDBRequestChild(const RDBRequestConstructorParams& aParams)
{
  NS_NOTREACHED("Should never get here!");
  return nullptr;
}

bool
RDBChild::DeallocPRDBRequestChild(PRDBRequestChild* aActor)
{
  delete aActor;
  return true;
}


/*******************************************************************************
 * RDBRequestChild
 ******************************************************************************/

RDBRequestChild::RDBRequestChild(RDBRequest *aRequest,
                        const RDBRequestConstructorParams& aParams)
  : mRequestType(aParams.requestType())
  , mRequest(aRequest)
{
  MOZ_ASSERT(mRequest);
  MOZ_ASSERT(mRequestType);
  MOZ_COUNT_CTOR(RDBRequestChild);
}

RDBRequestChild::~RDBRequestChild()
{
  MOZ_COUNT_DTOR(RDBRequestChild);
}

void
RDBRequestChild::Disconnect()
{
}

void
RDBRequestChild::ActorDestroy(ActorDestroyReason aWhy)
{
}

bool RDBRequestChild::HandleTestResponse()
{
  nsresult rv;

  mRequest->NotifyTestComplete();
  nsCOMPtr<nsIDOMEvent> event;
  NS_NewDOMEvent(getter_AddRefs(event), mRequest, nullptr, nullptr);

  rv = event->InitEvent(NS_LITERAL_STRING("success"), false, false);
  //NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);
  event->SetTrusted(true);

  bool dummy;
  mRequest->DispatchEvent(event, &dummy);

  return dummy;
}

bool
RDBRequestChild::Recv__delete__(const PRDBRequestResponse& aResponse)
{
  
  switch (aResponse.type()) {
    case PRDBRequestResponse::TPRDBRequestTestResponse:
      return HandleTestResponse();
      break;
    default:
      break;
  }

  return true;
}