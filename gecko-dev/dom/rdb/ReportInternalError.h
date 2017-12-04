/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef RDB_REPORT_INTERNAL_ERROR_H
#define RDB_REPORT_INTERNAL_ERROR_H

#include "nsDebug.h"

#define RDB_WARNING(x)                                                         \
  RDBReportInternalError(__FILE__, __LINE__, x);                                  \
  NS_WARNING(x)

#define RDB_REPORT_INTERNAL_ERR()                                              \
  RDBReportInternalError(__FILE__, __LINE__,                                      \
                                               "UnknownErr")

// Based on NS_ENSURE_TRUE
#define RDB_ENSURE_TRUE(x, ret)                                                \
  do {                                                                         \
    if (MOZ_UNLIKELY(!(x))) {                                                  \
       RDB_REPORT_INTERNAL_ERR();                                              \
       NS_WARNING("RDB_ENSURE_TRUE(" #x ") failed");                           \
       return ret;                                                             \
    }                                                                          \
  } while(0)

// Based on NS_ENSURE_SUCCESS
#define RDB_ENSURE_SUCCESS(res, ret)                                           \
  do {                                                                         \
    nsresult __rv = res; /* Don't evaluate |res| more than once */             \
    if (NS_FAILED(__rv)) {                                                     \
      RDB_REPORT_INTERNAL_ERR();                                               \
      NS_ENSURE_SUCCESS_BODY(res, ret)                                         \
      return ret;                                                              \
    }                                                                          \
  } while(0)


void
RDBReportInternalError(const char* aFile, uint32_t aLine, const char* aStr);

#endif
