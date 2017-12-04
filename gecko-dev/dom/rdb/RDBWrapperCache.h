/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef RDB_WRAPPERCACHE_h__
#define RDB_WRAPPERCACHE_h__

#include "js/RootingAPI.h"
#include "mozilla/DOMEventTargetHelper.h"
#include "nsCycleCollectionParticipant.h"
#include "nsWrapperCache.h"


class nsPIDOMWindow;


class RDBWrapperCache
  : public mozilla::DOMEventTargetHelper
{

public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBWrapperCache,
                                                         DOMEventTargetHelper)

  JSObject*
  GetScriptOwner() const
  {
    return mScriptOwner;
  }

  void
  SetScriptOwner(JSObject* aScriptOwner);

  void AssertIsRooted() const
#ifdef DEBUG
  ;
#else
  { }
#endif

protected:
  explicit RDBWrapperCache(DOMEventTargetHelper* aOwner)
    : DOMEventTargetHelper(aOwner), mScriptOwner(nullptr)
  { }
  explicit RDBWrapperCache(nsPIDOMWindow* aOwner)
    : DOMEventTargetHelper(aOwner), mScriptOwner(nullptr)
  { }


  virtual ~RDBWrapperCache();

private:
  JS::Heap<JSObject*> mScriptOwner;
};


#endif // RDB_WRAPPERCACHE_h__
