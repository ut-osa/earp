/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


interface RDBIAS {
  [Throws]
  void send(DOMString msg);

  attribute EventHandler         onreceived;
  attribute EventHandler         onerror;

  readonly attribute DOMString   name;

  [Throws]
  RDBIASRequest? getNextRequest();

  [Throws]
  void setPolicyForApp(DOMString aAppName, object aPolicy);

  [Throws]
  void setPolicyForMyself(object aPolicy);

  [Throws]
  void setDefaultPolicy(object aPolicy);

  [Throws]
  RDBIAC? createClientFor(unsigned long aAppId);
};

[NoInterfaceObject, NavigatorProperty="portRDBIASManager",
  JSImplementation="@mozilla.org/PortRDBIASManager;1"]
interface PortRDBIASManager {
  [Throws]
  PortRDBIAS? registerService(DOMString aName, object? schema);
};

[JSImplementation="@mozilla.org/PortRDBIAS;1"]
interface PortRDBIAS: EventTarget {
  attribute EventHandler         onreceived;
  attribute EventHandler         onerror;
  readonly attribute DOMString   name;

  [Throws]
  RDBIASRequest? getNextRequest();

  [Throws]
  void setPolicyForApp(DOMString aAppName, object aPolicy);

  [Throws]
  void setPolicyForMyself(object aPolicy);

  [Throws]
  void setDefaultPolicy(object aPolicy);
};
