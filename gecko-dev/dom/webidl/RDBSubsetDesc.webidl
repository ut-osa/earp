/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface nsIVariant;

interface RDBSubsetDesc {
  [Throws]
  RDBRequest? insert(ByteString aTab, object aVals);

  [Throws]
  RDBRequest? insert(ByteString aTab,
                     object aVals,
                     sequence<ByteString> aCapCols,
                     sequence<RDBOwnershipToken> aCapTokens);

  [Throws]
  RDBCursor? query(sequence<ByteString> aTabs,
                   sequence<ByteString> aCols,
                   object? aWhere,
                   ByteString? aOrderBy);

  [Throws]
  RDBCursor? joinPropCap(object mTabs,
                         object? aWhere,
                         ByteString? aOrder);

  [Throws]
  RDBCursor? joinFlatProp(ByteString aRootTab,
                          object mTabs,
                          object? aWhere,
                          ByteString? aOrder);

  [Throws]
  RDBRequest? delete(ByteString aTab,
                     object? aWhere);

  [Throws]
  RDBRequest? update(ByteString aTab,
                     object? aWhere,
                     object aVals);

  attribute EventHandler         onsuccess;
  attribute EventHandler         onerror;

  boolean insertable(ByteString aTab);
  boolean queryable(ByteString aTab);
  boolean updatable(ByteString aTab);
  boolean deletable(ByteString aTab);

  void disableInsert(ByteString aTab);
  void disableQuery(ByteString aTab);
  void disableUpdate(ByteString aTab);
  void disableDelete(ByteString aTab);

  boolean tabHasCol(ByteString aTab, ByteString aCol);

  [Throws]
  sequence<ByteString> getColsOfTab(ByteString aTab);

  void closeColsForTab(ByteString aTab, sequence<ByteString> aCols);

  [Throws]
  void addWhereForTab(ByteString aTab, object aWhere);

  [Throws]
  void setFixedFieldForTab(ByteString aTab, object aVals);


  [Throws]
  RDBSubsetDesc? expandCap(ByteString aCapTab,
                           ByteString aResultTab);

  [Throws]
  RDBRequest? startTx();

  [Throws]
  RDBRequest? abortTx();

  [Throws]
  RDBRequest? commitTx();

  unsigned long long saveForShare();

  RDBSubsetDesc clone();

  void revoke();

  attribute boolean sync;

  attribute boolean defaultPrivate;

  readonly attribute unsigned long appId;
};
