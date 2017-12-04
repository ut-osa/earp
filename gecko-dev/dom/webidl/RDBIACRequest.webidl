/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// can be used as the request object for insert/delete/update,
// or as the cursor for query

interface RDBIACRequest {
  attribute EventHandler         onsuccess;
  attribute EventHandler         onerror;

  readonly attribute ByteString  backend;
  readonly attribute boolean     hasMore;

  [Throws]
  boolean next(); // sync

  [Throws]
  boolean continue(); // async for next batch

  readonly attribute object?     row;

  [Throws]
  any getByName(ByteString colName);

  [Throws]
  RDBIAC? getPropDesc(ByteString aAttrTab);

  [Throws]
  RDBIAC? getCapDesc(ByteString aCap);

  [Throws]
  RDBIAC? getSelfDesc();
};

[JSImplementation="@mozilla.org/PortRDBIACRequest;1"]
interface PortRDBIACRequest: EventTarget {
  attribute EventHandler         onsuccess;
  attribute EventHandler         onerror;

  attribute DOMString error;

  readonly attribute ByteString  backend;

  [Throws]
  boolean next(); // sync

  [Throws]
  boolean continue(); // async for next batch

  readonly attribute object?     row;

  [Throws]
  any getByName(ByteString colName);

  [Throws]
  PortRDBIAC? getPropDesc(ByteString aAttrTab);

  [Throws]
  PortRDBIAC? getCapDesc(ByteString aCap);

  [Throws]
  PortRDBIAC? getSelfDesc();
};
