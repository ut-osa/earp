/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 sw=2 et tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef NS_RDB_h
#define NS_RDB_h

#include "mozilla/DOMEventTargetHelper.h"
#include "mozilla/RefPtr.h"
#include "mozilla/StaticPtr.h"
#include "mozilla/dom/DOMRequest.h"
#include "RDB.h"
#include "nsWrapperCache.h"
#include "nsCOMPtr.h"
#include "nsCycleCollectionParticipant.h"


#define RDB_REQUEST_CREATE 1
#define RDB_REQUEST_QUERY 2
#define RDB_REQUEST_INSERT 3
#define RDB_REQUEST_DELETE 4
#define RDB_REQUEST_UPDATE 5
#define RDB_REQUEST_TEST 6
#define RDB_REQUEST_EXECRAW 7
#define RDB_REQUEST_INSERT_OBJ 8

#define RDB_REQUEST_IAC_STEP_REMOVE 11
#define RDB_REQUEST_IAC_STEP_ALTER 12
#define RDB_REQUEST_IAC_WAIT_FOR_COMPLETE 13
#define RDB_REQUEST_IAC_CONTINUE 14
#define RDB_REQUEST_IAC_FREE 15

#define RDB_REQUEST_OPEN 20

#define RDB_REQUEST_DISPATCH_RESULT 30

// 0 number, 1 string, 2 blob, 3 null
#define RDB_VAL_TYPE_NUMBER 0
#define RDB_VAL_TYPE_STRING 1
#define RDB_VAL_TYPE_BLOB 2
#define RDB_VAL_TYPE_NULL 3
#define RDB_VAL_TYPE_DIR 4

#define RDB_COLNAME_PK "pk"
#define RDB_COLPREFIX_BLOB "BLOB"
#define RDB_COLPREFIX_BLOB_LEN 4
#define RDB_COLPREFIX_DIR "DIR"
#define RDB_COLPREFIX_DIR_LEN 3
#define RDB_COLPREFIX_CAP "CAP_"
#define RDB_COLPREFIX_CAP_LEN 4
#define RDB_COLPREFIX_PROP "PROP_"
#define RDB_COLPREFIX_PROP_LEN 5
#define RDB_COLPREFIX_META "META_"
#define RDB_COLPREFIX_META_LEN 5

#define RDB_COL_APPID "APPID"
#define RDB_COL_APPID_LEN 5

#define RDB_SUBSCHEMA_TAB "rdb_subschema"

#ifdef ANDROID
#define RDB_STORE_FILE_LOCATION "/data/b2g/mozilla/rdb/"
#else
#define RDB_STORE_FILE_LOCATION "/tmp/rdb/"
#endif

#endif
