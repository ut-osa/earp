/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 * vim: sw=2 ts=2 et lcs=trail\:.,tab\:>~ :
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef RDB_ROW_H
#define RDB_ROW_H

#include "RDB.h"
#include "RDBCursor.h"
#include "mozilla/Attributes.h"
#include "mozilla/ErrorResult.h"
#include "mozilla/storage.h"

class RDBCursor;

using mozilla::ErrorResult;

class RDBRow MOZ_FINAL
  : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBRow,
                                                         RDBWrapperCache)

  explicit RDBRow(nsPIDOMWindow* aOwner, RDBCursor* aCursor);

  virtual JSObject*
  WrapObject(JSContext* aCx) MOZ_OVERRIDE;

  // WebIDL
  nsPIDOMWindow*
  GetParentObject() const
  {
    return GetOwner();
  }

  void
  NamedGetter(JSContext*& cx,
  			  const nsAString& aName,
  			  bool& aFound,
  			  JS::MutableHandle<JS::Value> retval,
  			  ErrorResult& aRv);
  
  bool NameIsEnumerable(const nsAString& aName);
  void GetSupportedNames(unsigned aFlags, nsTArray<nsString>& aNames);

protected:

  ~RDBRow() {}

  RDBCursor* mCursor;
};

#endif /* RDB_ROW_H */
