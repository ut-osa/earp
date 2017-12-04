/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

enum RDBRequestReadyState {
    "pending",
    "done"
};

interface RDBRequest : EventTarget {
    [Throws]
    readonly    attribute any                  result;

    [Throws]
    readonly    attribute DOMString            testRes;

    [Throws]
    readonly    attribute DOMError?            error;

    readonly    attribute RDBRequestReadyState readyState;

                attribute EventHandler         onsuccess;

                attribute EventHandler         onerror;

    [Throws]
    RDBOwnershipToken? getToken();

    [Throws]
    RDBSubsetDesc? getDesc();

    [Throws]
    RDBSubsetDesc? getPropDesc(ByteString tab);

    //[Throws]
    //RDBSubsetDesc? getCapDesc(ByteString tab);
};
