/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef PRDB_CHILD_h__
#define PRDB_CHILD_h__

#include "mozilla/Attributes.h"
#include "mozilla/DebugOnly.h"

#include "../RDB.h"
#include "../nsRDB.h"

#include "PRDBChild.h"
#include "PRDBRequestChild.h"
#include "mozilla/dom/ContentChild.h"
#include "mozilla/dom/TabChild.h"

namespace mozilla {
namespace dom {
class ContentChild;
class TabChild;
} // dom
} // mozilla


class RDBChild : public PRDBChild
{
  friend class mozilla::dom::ContentChild;
  friend class mozilla::dom::TabChild;

  mozilla::dom::ContentChild* mManagerContent;
  mozilla::dom::TabChild* mManagerTab;

  nsCString mASCIIOrigin;

#ifdef DEBUG
  bool mDisconnected;
#endif

public:
  RDBChild(mozilla::dom::ContentChild* aContentChild, const nsCString& aASCIIOrigin);
  RDBChild(mozilla::dom::TabChild* aTabChild, const nsCString& aASCIIOrigin);
  virtual ~RDBChild();

  const nsCString&
  ASCIIOrigin() const
  {
    return mASCIIOrigin;
  }

  mozilla::dom::ContentChild*
  GetManagerContent() const
  {
    return mManagerContent;
  }

  mozilla::dom::TabChild*
  GetManagerTab() const
  {
    return mManagerTab;
  }


  void
  Disconnect();

protected:
  virtual void
  ActorDestroy(ActorDestroyReason aWhy) MOZ_OVERRIDE;

  virtual PRDBRequestChild*
  AllocPRDBRequestChild(const RDBRequestConstructorParams& aParams) MOZ_OVERRIDE;

  virtual bool
  DeallocPRDBRequestChild(PRDBRequestChild* aActor) MOZ_OVERRIDE;
};



class RDBRequestChild : public PRDBRequestChild
{

  friend class RDBChild;

public:
  RDBRequestChild(RDBRequest *aRequest,
                  const RDBRequestConstructorParams& aParams);
  virtual ~RDBRequestChild();

  void
  Disconnect();

protected:
  virtual void
  ActorDestroy(ActorDestroyReason aWhy) MOZ_OVERRIDE;

  virtual bool
  Recv__delete__(const PRDBRequestResponse& aResponse) MOZ_OVERRIDE;

private:
  int mRequestType;
  nsRefPtr<RDBRequest> mRequest;
  bool
  HandleTestResponse();
};



#endif