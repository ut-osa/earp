/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

interface RDBCursor : EventTarget {
    [Throws]
    readonly    attribute DOMError?            error;

                attribute EventHandler         onsuccess;

                attribute EventHandler         onerror;

    readonly    attribute RDBRow?              row;

    [Throws]
    boolean next();

    [Throws]
    ByteString getColumnName(long long colIndex);

    [Throws]
    long long getColumnIndex(ByteString colName);

    [Throws]
    long long getColumnCount();

    [Throws]
    any getByIndex(long long colIndex);

    [Throws]
    any getByName(ByteString colName);

    [Throws]
    Blob? getFile(ByteString colName);

    [Throws]
    Blob? getFile(ByteString tab, ByteString colName);

    [Throws]
    DeviceStorage? getDirDS(ByteString colName);

    [Throws]
    DeviceStorage? getDirDS(ByteString tab, ByteString colName);


    [Throws]
    RDBDirHandle? getDir(ByteString colName);

    [Throws]
    RDBDirHandle? getDir(ByteString tab, ByteString colName);

    void reset();

    [Throws]
    RDBSubsetDesc? getPropDesc(ByteString aAttrTab);

    [Throws]
    RDBSubsetDesc? getPropDesc(ByteString aTab, ByteString aAttrTab);

    [Throws]
    RDBSubsetDesc? getCapDesc(ByteString aCap);

    [Throws]
    RDBSubsetDesc? getCapDesc(ByteString aTab, ByteString aCap);

    [Throws]
    RDBSubsetDesc? getSelfDesc();

    [Throws]
    RDBSubsetDesc? getSelfDesc(ByteString aTab);

    [Throws]
    RDBOwnershipToken? getToken();

    [Throws]
    RDBOwnershipToken? getToken(ByteString aTab);
//
//    [Throws]
//    DOMString getString(int colIndex);
//
//    [Throws]
//    int getInteger(int colIndex);
//
//    [Throws]
//    DOMString getReal(int colIndex);
};
