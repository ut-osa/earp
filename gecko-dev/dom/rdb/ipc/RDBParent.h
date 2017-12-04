/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef PRDB_PARENT_h__
#define PRDB_PARENT_h__

#include "mozilla/Attributes.h"
#include "mozilla/DebugOnly.h"

#include "RDB.h"
#include "nsRDB.h"
#include "PRDBParent.h"
#include "PRDBRequestParent.h"

#include "nsIDOMEventListener.h"
#include "mozilla/dom/ContentParent.h"
#include "mozilla/dom/TabParent.h"

namespace mozilla {
namespace dom {
class ContentParent;
class TabParent;
}
}

class nsIDOMBlob;
class nsIDOMEvent;

using mozilla::dom::ContentParent;
using mozilla::dom::TabParent;


/*******************************************************************************
 * RDBParent
 ******************************************************************************/

class RDBParent : private PRDBParent
{
  friend class mozilla::dom::ContentParent;
  friend class mozilla::dom::TabParent;

  nsCString mASCIIOrigin;

  ContentParent* mManagerContent;
  TabParent* mManagerTab;

  bool mDisconnected;

public:
  explicit RDBParent(ContentParent* aContentParent);
  explicit RDBParent(TabParent* aTabParent);

  virtual ~RDBParent();

  const nsCString&
  GetASCIIOrigin() const
  {
    return mASCIIOrigin;
  }

  void
  Disconnect();

  bool
  IsDisconnected() const
  {
    return mDisconnected;
  }

  ContentParent*
  GetManagerContent() const
  {
    return mManagerContent;
  }

  TabParent*
  GetManagerTab() const
  {
    return mManagerTab;
  }

  bool
  CheckReadPermission(const nsAString& aDatabaseName);

  bool
  CheckWritePermission(const nsAString& aDatabaseName);

  mozilla::ipc::IProtocol*
  CloneProtocol(Channel* aChannel,
                mozilla::ipc::ProtocolCloneContext* aCtx) MOZ_OVERRIDE;

protected:
  bool
  CheckPermissionInternal(const nsAString& aDatabaseName,
                          const nsACString& aPermission);

  virtual void
  ActorDestroy(ActorDestroyReason aWhy) MOZ_OVERRIDE;

  virtual bool
  RecvPRDBRequestConstructor(PRDBRequestParent* aActor,
                             const RDBRequestConstructorParams& aParams)
                             MOZ_OVERRIDE;

  virtual PRDBRequestParent*
  AllocPRDBRequestParent(const RDBRequestConstructorParams& aParams)
                         MOZ_OVERRIDE;

  virtual bool
  DeallocPRDBRequestParent(PRDBRequestParent* aActor) MOZ_OVERRIDE;
};


/*******************************************************************************
 * RDBRequestParent
 ******************************************************************************/

class RDBRequestParent : private PRDBRequestParent
{
  friend class RDBParent;


public:
  RDBRequestParent(const RDBRequestConstructorParams& aParams);

  virtual ~RDBRequestParent();

  void
  Disconnect();


  bool ProcessRequest();

protected:
  virtual void
  ActorDestroy(ActorDestroyReason aWhy) MOZ_OVERRIDE;

private:
  bool
  ProcessTestRequest();

  int mRequestType;
};

#endif
