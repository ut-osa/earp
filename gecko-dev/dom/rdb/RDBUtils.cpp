/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 sw=2 et tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "RDBUtils.h"
#include "nsRDB.h"

#include "mozilla/dom/FileSystemUtils.h"
#include "nsIFile.h"
#include "nsIDOMFile.h"
#include "nsAutoPtr.h"
#include "nsJSUtils.h"
#include "nsISupportsUtils.h"
#include "nsString.h"
#include "mozilla/Attributes.h"
#include "nsDOMFile.h"
#include "nsDOMBlobBuilder.h"
#include "nsNetUtil.h"
#include "nsIMIMEService.h"
#include "mozilla/Services.h"
#include "nsServiceManagerUtils.h"
#include "nsCExternalHandlerService.h"
#include "mozIApplication.h"
#include "nsIAppsService.h"

using namespace mozilla;
using namespace mozilla::dom;

nsresult RDBCreateFile(nsIFile* f, nsIDOMBlob* aBlob)
{
  DOMFile* blob = static_cast<DOMFile*>(aBlob);
  nsCOMPtr<nsIInputStream> ins;
  blob->Impl()->GetInternalStream(getter_AddRefs(ins));

  nsresult rv = f->Create(nsIFile::NORMAL_FILE_TYPE, 00600);

  nsCOMPtr<nsIOutputStream> outs;
  NS_NewLocalFileOutputStream(getter_AddRefs(outs), f);


  uint64_t bufSize = 0;
  ins->Available(&bufSize);

  nsCOMPtr<nsIOutputStream> bufferedOutputStream;
  rv = NS_NewBufferedOutputStream(getter_AddRefs(bufferedOutputStream),
                                  outs, 4096*4);
  NS_ENSURE_SUCCESS(rv, rv);

  while (bufSize) {
    uint32_t wrote;
    rv = bufferedOutputStream->WriteFrom(
        ins,
        static_cast<uint32_t>(std::min<uint64_t>(bufSize, UINT32_MAX)),
        &wrote);
    if (NS_FAILED(rv)) {
      break;
    }
    bufSize -= wrote;
  }

  // nsCOMPtr<nsIRunnable> iocomplete = new IOEventComplete(this, "modified");
  // rv = NS_DispatchToMainThread(iocomplete);
  // if (NS_WARN_IF(NS_FAILED(rv))) {
  //   return rv;
  // }

  bufferedOutputStream->Close();
  outs->Close();
  if (NS_WARN_IF(NS_FAILED(rv))) {
    return rv;
  }
  return NS_OK;
}

uint64_t RDBCreateFileWithRandomName(nsString& prefix, nsIDOMBlob* aBlob)
{
  bool ok = false;
  uint64_t res;
  char tmp[32];

  while (!ok) {
    nsString fname = prefix;
    res = RDBGetRandNum();
    if (res == 0)
      continue;
    sprintf(tmp, "%llx", res);
    fname.Append(NS_ConvertASCIItoUTF16(tmp));

    nsCOMPtr<nsIFile> f = do_CreateInstance(NS_LOCAL_FILE_CONTRACTID);
    f->InitWithPath(fname);
    nsresult rv = f->Exists(&ok);
    if (NS_FAILED(rv)) {
      return 0;
    }
    ok = !ok;

    if (ok) {
      RDBCreateFile(f, aBlob);
    }
  }

  return res;
}


void RDBDeleteFile(nsString& prefix, uint64_t r)
{
  nsString path = prefix;
  if (r) {
    char tmp[32];
    sprintf(tmp, "%llx", r);
    path.Append(NS_ConvertASCIItoUTF16(tmp));
  }

  nsCOMPtr<nsIFile> f = do_CreateInstance(NS_LOCAL_FILE_CONTRACTID);
  f->InitWithPath(path);
  
  f->Remove(false);
}

already_AddRefed<nsIDOMBlob>
RDBGetDOMFile(nsString& prefix, uint64_t r)
{
  nsString path = prefix;
  if (r) {  // r=-=0 means no suffix
    char tmp[32];
    sprintf(tmp, "%llx", r);
    path.Append(NS_ConvertASCIItoUTF16(tmp));
  }

  bool ok;

  nsCOMPtr<nsIFile> f = do_CreateInstance(NS_LOCAL_FILE_CONTRACTID);
  f->InitWithPath(path);
  nsresult rv = f->Exists(&ok);
  if (NS_FAILED(rv) || !ok) {
    return nullptr;
  }

  int64_t fileSize;
  rv = f->GetFileSize(&fileSize);
  if (NS_FAILED(rv)) {
    return nullptr;
  }

  PRTime modDate;
  rv = f->GetLastModifiedTime(&modDate);

  if (NS_FAILED(rv)) {
    return nullptr;
  }

  nsAutoCString mimeType;
  nsCOMPtr<nsIMIMEService> mimeService =
    do_GetService(NS_MIMESERVICE_CONTRACTID);
  if (mimeService) {
    rv = mimeService->GetTypeFromFile(f, mimeType);
    if (NS_FAILED(rv)) {
      mimeType.Truncate();
    }
  }

  nsAutoString tMimeType = NS_ConvertUTF8toUTF16(mimeType);
  
  nsRefPtr<nsIDOMBlob> blob = new DOMFile(
    new DOMFileImplFile(path, tMimeType,
                        fileSize, f,
                        modDate));

  return blob.forget();
}

bool RDBColIsBlob(const nsCString& col) {
  return strncmp(col.BeginReading(), RDB_COLPREFIX_BLOB, RDB_COLPREFIX_BLOB_LEN) == 0;
}

bool RDBColIsDir(const nsCString& col) {
  return strncmp(col.BeginReading(), RDB_COLPREFIX_DIR, RDB_COLPREFIX_DIR_LEN) == 0;
}

bool RDBColIsMeta(const nsCString& col) {
  return strncmp(col.BeginReading(), RDB_COLPREFIX_META, RDB_COLPREFIX_META_LEN) == 0;
}

nsCString
RDBPropColName(const nsACString& refTab) {
  nsCString ret(RDB_COLPREFIX_PROP);
  ret.Append(refTab);
  return ret;
}

bool
RDBColIsCap(const nsCString& col)
{
  return strncmp(col.BeginReading(), RDB_COLPREFIX_CAP, RDB_COLPREFIX_CAP_LEN) == 0;
}

nsresult
RDBCapTabName(const nsACString& refCol, nsCString& resTab)
{
  if (refCol.Length() <= RDB_COLPREFIX_CAP_LEN ||
    strncmp(refCol.BeginReading(), RDB_COLPREFIX_CAP, RDB_COLPREFIX_CAP_LEN) != 0)
    return NS_ERROR_DOM_RDB_CONSTRAINT_ERR;
  resTab.Assign(refCol.BeginReading() + RDB_COLPREFIX_CAP_LEN);
  return NS_OK;
}


nsCString
RDBCapColName(const nsACString& refTab) {
  nsCString ret(RDB_COLPREFIX_CAP);
  ret.Append(refTab);
  return ret;
}

nsString
RDBGetAppNameById(uint32_t id) {
  nsCOMPtr<nsIAppsService> appsService = do_GetService(APPS_SERVICE_CONTRACTID);
  nsCOMPtr<mozIApplication> app;
  nsresult rv = appsService->GetAppByLocalId(id, getter_AddRefs(app));
  if (NS_FAILED(rv) || !app)
    return NS_ConvertASCIItoUTF16("unknown");

  nsString orig;
  app->GetOrigin(orig);
  orig.ReplaceSubstring(NS_ConvertASCIItoUTF16("://"), NS_ConvertASCIItoUTF16("-"));

  return orig;
}


JS::Value
RDBInterfaceToJsval(nsPIDOMWindow* aWindow,
                    nsISupports* aObject,
                    const nsIID* aIID)
{
  nsCOMPtr<nsIScriptGlobalObject> sgo = do_QueryInterface(aWindow);
  if (!sgo) {
    return JS::NullValue();
  }

  JSObject *unrootedScopeObj = sgo->GetGlobalJSObject();
  NS_ENSURE_TRUE(unrootedScopeObj, JS::NullValue());
  JSRuntime *runtime = JS_GetObjectRuntime(unrootedScopeObj);
  JS::Rooted<JS::Value> someJsVal(runtime);
  JS::Rooted<JSObject*> scopeObj(runtime, unrootedScopeObj);
  nsresult rv;

  { // Protect someJsVal from moving GC in ~JSAutoCompartment
    AutoJSContext cx;
    JSAutoCompartment ac(cx, scopeObj);

    rv = nsContentUtils::WrapNative(cx, aObject, aIID, &someJsVal);
  }
  if (NS_FAILED(rv)) {
    return JS::NullValue();
  }

  return someJsVal;
}

void
RDBDispatchEventToJS(const char* aType,
           already_AddRefed<mozilla::dom::EventTarget> aTarget)
{
  nsString type = NS_ConvertASCIItoUTF16(aType);
  nsRefPtr<mozilla::dom::EventTarget> t(aTarget);
  nsCOMPtr<nsIRunnable> ep(new RDBEventPoster(type, t.forget()));
  if (NS_IsMainThread()) {
    ep->Run();
  } else {
    NS_DispatchToMainThread(ep);
  }
}

NS_IMPL_ISUPPORTS(RDBEventPoster, nsIRunnable)
NS_IMPL_ISUPPORTS(RDBNewFileEvent, nsIRunnable)
NS_IMPL_ISUPPORTS(RDBNewDirEvent, nsIRunnable)