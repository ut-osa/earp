// vim: set filetype=idl shiftwidth=2 tabstop=2:
/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 */
[ChromeConstructor(), JSImplementation="@mozilla.org/rRDBcursor;1"]
interface mozrRDBCursor : EventTarget{
  boolean next();

  any getByName(DOMString name);

  [ChromeOnly]
  void set_cache(sequence<any> cache);
  
  attribute EventHandler onsuccess;
  attribute EventHandler onerror;
};

[Constructor(DOMString name, DOMString clientId, 
                   DOMString redirectURI, any scopes), 
 JSImplementation="@mozilla.org/rRDB;1"]
interface mozrRDB : EventTarget {
  DOMRequest? insert(DOMString aTab, object aVals);

  mozrRDBCursor? query(sequence<DOMString> aTabs,
                       sequence<DOMString> aCols,
                       object? aWhere,
                       DOMString? aOrderBy);

  DOMRequest? delete(DOMString aTab,
                     object? aWhere );
  
  DOMRequest? update(DOMString aTab,
                     object? aWhere,
                     object  aVals);

  attribute EventHandler onsuccess; // same as onready
  attribute EventHandler onready; 
  attribute EventHandler onerror;
};
