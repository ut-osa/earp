/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


interface RDBIASRequest {
  readonly attribute ByteString op;
  readonly attribute ByteString clientOp;
  readonly attribute ByteString tab; // for insert/delete/update
  readonly attribute object? securityWhere;
  readonly attribute object? originalWhere;
  readonly attribute object? val;
  readonly attribute object? updatedCols;
  readonly attribute unsigned long long sequenceNumber;

  sequence<ByteString> getTabs(); // for query
  sequence<ByteString> getCols(); // for query

  [Throws]
  void list(sequence<object> aRes);

  [Throws]
  void notifySuccess();

  [Throws]
  void notifyFailure();

  [Throws]
  void notifyIncomplete();

  void setNewPk(DOMString pk);

  void setNewPk(double pk);
};
