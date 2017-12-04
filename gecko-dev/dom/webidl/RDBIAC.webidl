/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


interface RDBIAC {

  [Throws]
  RDBIACRequest? insert(ByteString aTab, object aVals);

  [Throws]
  RDBIACRequest? query(sequence<ByteString> aTabs,
                      sequence<ByteString> aCols,
                      object? aWhere,
                      ByteString? aOrderBy);

  [Throws]
  RDBIACRequest? delete(ByteString aTab,
                        object? aWhere);

  [Throws]
  RDBIACRequest? update(ByteString aTab,
                        object? aWhere,
                        object aVals);

  [Throws]
  void send(DOMString msg);

  attribute EventHandler         onreceived;
  attribute EventHandler         onerror;
};

[NoInterfaceObject, NavigatorProperty="portRDBIACManager",
  JSImplementation="@mozilla.org/PortRDBIACManager;1"]
interface PortRDBIACManager {
    PortRDBIAC connect(DOMString aName);
};

[JSImplementation="@mozilla.org/PortRDBIAC;1"]
interface PortRDBIAC: EventTarget {
  [Throws]
  PortRDBIACRequest? insert(ByteString aTab, object aVals);

  [Throws]
  PortRDBIACRequest? query(sequence<ByteString> aTabs,
                      sequence<ByteString> aCols,
                      object? aWhere,
                      ByteString? aOrderBy);

  [Throws]
  PortRDBIACRequest? delete(ByteString aTab,
                        object? aWhere);

  [Throws]
  PortRDBIACRequest? update(ByteString aTab,
                        object? aWhere,
                        object aVals);

  [Throws]
  PortRDBIACRequest? objOps(object aArgs);

  attribute EventHandler         onsuccess;
  attribute EventHandler         onerror;

  attribute DOMString error;
};
