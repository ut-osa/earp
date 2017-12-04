/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface nsIVariant;

interface RDB {
  DOMString show();

  [Throws]
  RDBRequest? test(DOMString aName);

  [Throws]
  RDBRequest? execRaw(ByteString aStmt, sequence<DOMString>? aParams);

  [Throws]
  RDBRequest? execRaw(ByteString aStmt,
                      sequence<DOMString>? aParams,
                      boolean aRefreshMetadata);

  [Throws]
  RDBRequest? insert(ByteString aTab, sequence<ByteString> aCols, sequence<DOMString> aVals);

  [Throws]
  RDBRequest? insert(ByteString aTab, object aVals);

  [Throws]
  RDBCursor? query(sequence<ByteString> aTabs,
                   sequence<ByteString> aCols,
                   ByteString? aWhere,
                   sequence<DOMString>? aParams,
                   ByteString? aOrderBy);
  [Throws]
  RDBCursor? query(sequence<ByteString> aTabs,
                   sequence<ByteString> aCols,
                   object? aWhere,
                   ByteString? aOrderBy);

  [Throws]
  RDBRequest? delete(ByteString aTab,
                     ByteString? aWhere,
                     sequence<DOMString>? aParams);

  [Throws]
  RDBRequest? delete(ByteString aTab,
                   object? aWhere);

  [Throws]
  RDBRequest? update(ByteString aTab,
                     ByteString? aWhere,
                     sequence<DOMString>? aParams,
                     sequence<ByteString> aCols,
                     sequence<DOMString> aVals);

  [Throws]
  RDBRequest? update(ByteString aTab,
                     object? aWhere,
                     object aVals);

  [Throws]
  RDBRequest? createTable(ByteString aTab,
                          sequence<ByteString> aCols,
                          sequence<ByteString> aTypes);

  [Throws]
  RDBRequest? startTx();

  [Throws]
  RDBRequest? abortTx();

  [Throws]
  RDBRequest? commitTx();

  [Throws]
  RDBSubsetDesc? getDesc();

  attribute DOMString attr;
  attribute boolean sync;
  attribute boolean requestOrder;
  attribute EventHandler         onsuccess;
  attribute EventHandler         onerror;

  readonly attribute long appId;
};
