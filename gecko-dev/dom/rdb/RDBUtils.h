/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 sw=2 et tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef RDB_UTILS_h
#define RDB_UTILS_h

#include "mozilla/dom/FileSystemUtils.h"
#include "nsIFile.h"
#include "nsIDOMFile.h"
#include "nsAutoPtr.h"
#include "nsJSUtils.h"
#include "nsISupportsPrimitives.h"
//#include "nsGlobalWindow.h"
#include "nsIDOMEvent.h"
#include "RDBRequest.h"
#include "Crypto.h"

inline uint64_t
RDBGetRandNum() {
  uint64_t res;
  uint8_t* buf = mozilla::dom::Crypto::GetRandomValues(8);
  res = *(uint64_t*)(buf);
  NS_Free(buf);
  return res;
}

nsresult RDBCreateFile(nsIFile* f, nsIDOMBlob* aBlob);

uint64_t RDBCreateFileWithRandomName(nsString& prefix, nsIDOMBlob* aBlob);

void RDBDeleteFile(nsString& prefix, uint64_t r);

already_AddRefed<nsIDOMBlob>
RDBGetDOMFile(nsString& prefix, uint64_t r);

bool
RDBColIsBlob(const nsCString& col);

bool
RDBColIsDir(const nsCString& col);

bool
RDBColIsMeta(const nsCString& col);

nsCString
RDBPropColName(const nsACString& refTab);

bool
RDBColIsCap(const nsCString& col);

nsresult
RDBCapTabName(const nsACString& refCol, nsCString& resTab);

nsCString
RDBCapColName(const nsACString& refTab);

JS::Value
RDBInterfaceToJsval(nsPIDOMWindow* aWindow,
                    nsISupports* aObject,
                    const nsIID* aIID);

nsString
RDBGetAppNameById(uint32_t id);

void
RDBDispatchEventToJS(const char* aType,
					 already_AddRefed<mozilla::dom::EventTarget> aTarget);

class RDBEventPoster : public nsRunnable
{
  public:
  NS_DECL_THREADSAFE_ISUPPORTS
  // NS_DECL_CYCLE_COLLECTING_ISUPPORTS
  // NS_DECL_CYCLE_COLLECTION_CLASS(RDBEventPoster)

  RDBEventPoster(nsAString& aEventType,
                 already_AddRefed<mozilla::dom::EventTarget> aTarget)
    : mTarget(aTarget)
  {
    mEventType.Assign(aEventType);
  }

  NS_IMETHOD Run()
  {
    nsCOMPtr<nsIDOMEvent> event;
    NS_NewDOMEvent(getter_AddRefs(event), mTarget, nullptr, nullptr);

    nsresult rv = event->InitEvent(mEventType, false, false);
    NS_ENSURE_SUCCESS(rv, NS_ERROR_DOM_RDB_UNKNOWN_ERR);
    
    event->SetTrusted(true);

    bool dummy;
    mTarget->DispatchEvent(event, &dummy);
    return NS_OK;
  }

private:
  ~RDBEventPoster() {}
  nsRefPtr<mozilla::dom::EventTarget> mTarget;
  nsString mEventType;
};

class RDBNewFileEvent : public nsRunnable
{
public:
  NS_DECL_THREADSAFE_ISUPPORTS

  RDBNewFileEvent(RDBRequest* aRequest,
  			   nsIDOMBlob* aBlob,
  			   nsString& aPrefix,
  			   uint64_t aName)
    : mRequest(aRequest)
    , mBlob(aBlob)
    , mPrefix(aPrefix)
    , mName(aName)
  {
  }

  NS_IMETHOD Run()
  {
    nsCOMPtr<nsIFile> f = do_CreateInstance(NS_LOCAL_FILE_CONTRACTID);
    nsString fname = mPrefix;
    if (mName) {  // 0 means no suffix
      char tmp[32];
      sprintf(tmp, "%llx", mName);
      fname.Append(NS_ConvertASCIItoUTF16(tmp));
    }
    f->InitWithPath(fname);
    RDBCreateFile(f, mBlob);

    mRequest->NotifyCompleteStep();
    return NS_OK;
  }

private:
~RDBNewFileEvent() {}
  RDBRequest* mRequest;
  nsIDOMBlob* mBlob;
  nsString mPrefix;
  uint64_t mName;
};

class RDBNewDirEvent : public nsRunnable
{
public:
  NS_DECL_THREADSAFE_ISUPPORTS

  RDBNewDirEvent(RDBRequest* aRequest,
           nsString& aPrefix,
           uint64_t aName)
    : mRequest(aRequest)
    , mPrefix(aPrefix)
    , mName(aName)
  {
  }

  NS_IMETHOD Run()
  {
    nsCOMPtr<nsIFile> f = do_CreateInstance(NS_LOCAL_FILE_CONTRACTID);
    nsString fname = mPrefix;
    char tmp[32];
    sprintf(tmp, "%llx", mName);
    fname.Append(NS_ConvertASCIItoUTF16(tmp));
    f->InitWithPath(fname);
    nsresult rv = f->Create(nsIFile::DIRECTORY_TYPE, 00700);
    mRequest->NotifyCompleteStep();
    return rv;
  }

private:
~RDBNewDirEvent() {}
  RDBRequest* mRequest;
  nsString mPrefix;
  uint64_t mName;
};
#endif