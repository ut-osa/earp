/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 * vim: sw=2 ts=2 et lcs=trail\:.,tab\:>~ :
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "nsMemory.h"
#include "nsString.h"

#include "RDBRow.h"
#include "RDBCursor.h"
#include "mozilla/dom/RDBRowBinding.h"

#include "jsapi.h"

using namespace mozilla;
using namespace mozilla::dom;

class RDBCursor;

RDBRow::RDBRow(nsPIDOMWindow* aOwner, RDBCursor* aCursor)
  : RDBWrapperCache(aOwner)
  , mCursor(aCursor)
{
}

void
RDBRow::NamedGetter(JSContext*& cx,
                    const nsAString& aName,
                    bool& aFound,
                    JS::MutableHandle<JS::Value> retval,
                    ErrorResult& aRv)
{
  int64_t ind =
    mCursor->GetColumnIndex(NS_LossyConvertUTF16toASCII(aName), aRv);
  int64_t cnt =
    mCursor->GetColumnCount(aRv);
  if (ind >= 0 && ind < cnt) {
    aFound = true;
    mCursor->GetByIndex(cx, ind, retval, aRv);
  } else {
    aFound = false;
  }
}

bool
RDBRow::NameIsEnumerable(const nsAString& aName)
{
  ErrorResult rv;
  int64_t ind =
    mCursor->GetColumnIndex(NS_LossyConvertUTF16toASCII(aName), rv);
  int64_t cnt =
    mCursor->GetColumnCount(rv);
  
  return ind >= 0 && ind < cnt;
}

void
RDBRow::GetSupportedNames(unsigned aFlags, nsTArray<nsString>& aNames)
{
  ErrorResult rv;
  nsCString s;
  for (uint32_t i = 0; i < mCursor->GetColumnCount(rv); i++) {
    mCursor->GetColumnName(i, s, rv);
    aNames.AppendElement(NS_ConvertUTF8toUTF16(s));
  }
}

JSObject*
RDBRow::WrapObject(JSContext* aCx)
{
  return RDBRowBinding::Wrap(aCx, this);
}

NS_IMPL_CYCLE_COLLECTION_CLASS(RDBRow)

NS_IMPL_CYCLE_COLLECTION_TRAVERSE_BEGIN_INHERITED(RDBRow, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRAVERSE_SCRIPT_OBJECTS because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRAVERSE_END

NS_IMPL_CYCLE_COLLECTION_UNLINK_BEGIN_INHERITED(RDBRow, RDBWrapperCache)
NS_IMPL_CYCLE_COLLECTION_UNLINK_END

NS_IMPL_CYCLE_COLLECTION_TRACE_BEGIN_INHERITED(RDBRow, RDBWrapperCache)
  // Don't need NS_IMPL_CYCLE_COLLECTION_TRACE_PRESERVED_WRAPPER because
  // DOMEventTargetHelper does it for us.
NS_IMPL_CYCLE_COLLECTION_TRACE_END

NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION_INHERITED(RDBRow)
NS_INTERFACE_MAP_END_INHERITING(RDBWrapperCache)

NS_IMPL_ADDREF_INHERITED(RDBRow, RDBWrapperCache)
NS_IMPL_RELEASE_INHERITED(RDBRow, RDBWrapperCache)
