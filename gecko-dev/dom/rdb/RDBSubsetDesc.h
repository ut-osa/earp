#ifndef NS_RDB_DESC_h
#define NS_RDB_DESC_h


#include "mozilla/DOMEventTargetHelper.h"
#include "mozilla/RefPtr.h"
#include "mozilla/StaticPtr.h"
#include "mozilla/dom/DOMRequest.h"
#include "nsWrapperCache.h"
#include "RDBWrapperCache.h"
#include "nsCycleCollectionParticipant.h"

#include "nsIVariant.h"
#include "nsCOMPtr.h"

#include "mozilla/dom/TypedArray.h"
#include "mozilla/dom/DOMError.h"
#include "mozilla/ErrorResult.h"
#include "RDB.h"

#include "RDBRequest.h"
#include "RDBCursor.h"

#include <map>
#include <set>

namespace mozilla {
class EventListenerManager;
class ErrorResult;
class Mutex;
namespace dom {
class DOMRequest;
} // namespace dom
} // namespace mozilla

class RDBOwnershipToken;
class RDBRequest;
class RDBCursor;
class nsDOMRDB;

using mozilla::ErrorResult;
using mozilla::dom::Sequence;
using mozilla::dom::Nullable;
using mozilla::dom::OwningNonNull;


struct PerTableCapInfo;

class RDBSubsetDesc : public RDBWrapperCache
{
public:
  NS_DECL_ISUPPORTS_INHERITED
  NS_DECL_CYCLE_COLLECTION_SCRIPT_HOLDER_CLASS_INHERITED(RDBSubsetDesc,
                                                         RDBWrapperCache)

  RDBSubsetDesc(RDBSubsetDesc* aDesc);
  RDBSubsetDesc(nsDOMRDB* aRDB);
  RDBSubsetDesc(RDBSubsetDesc* aDesc, nsDOMRDB* aRDB);

  bool Insertable(const nsACString& aTab);
  void DisableInsert(const nsACString& aTab);

  bool Queryable(const nsACString& aTab);
  void DisableQuery(const nsACString& aTab);

  bool Updatable(const nsACString& aTab);
  void DisableUpdate(const nsACString& aTab);

  bool Deletable(const nsACString& aTab);
  void DisableDelete(const nsACString& aTab);

  bool TabHasCol(const nsACString& aTab, const nsACString& aCol);
  void GetColsOfTab(const nsACString& aTab,
                    nsTArray<nsCString>& aResCols,
                    ErrorResult& aRv);

  void CloseAllWhere();
  void CloseAllInsert();
  void CloseAllOps();

  void CloseColsForTab(const nsACString& aTab,
                       const Sequence<nsCString>& aCols);

  void AddWhereForTab(JSContext* aCx,
                      const nsACString& aTab,
                      JS::Handle<JSObject*> aWhere,
                      ErrorResult& aRv);

  void SetFixedFieldForTab(JSContext* aCx,
                           const nsACString& aTab,
                           JS::Handle<JSObject*> aVals,
                           ErrorResult& aRv);

  // nsWrapperCache
  virtual JSObject*
  WrapObject(JSContext* aCx) MOZ_OVERRIDE;

  // WebIDL
  nsPIDOMWindow*
  GetParentObject() const
  {
    return GetOwner();
  }

  bool
  EnsureQuery(const Sequence<nsCString>& aTabs,
              const Sequence<nsCString>& aCols,
              const nsACString& aOrderBy);

  bool
  EnsureDelete(const nsACString& Tab);

  bool
  EnsureInsert(JSContext* cx,
               const nsACString& aTab,
               JS::Handle<JSObject*> aVals,
               const Sequence<nsCString>* aCapCols,
               const Sequence<OwningNonNull<RDBOwnershipToken>>* aCapTokens);

  bool
  EnsureUpdate(JSContext* cx,
               const nsACString& aTab,
               JS::Handle<JSObject*> aVals);

  bool Sync();
  void SetSync(bool val);

  bool ConstrustPropCapJoin(JSContext* cx,
                            JS::Handle<JSObject*> aTabs,
                            Sequence<nsCString>& aResTabs,
                            Sequence<nsCString>& aCols,
                            // nsTArray<nsCString>& aStringParams,
                            // nsTArray<nsCString>& aNumParams,
                            // nsTArray<short>& aParamTypes,
                            nsCString& aWhere,
                            nsCString& aParentTab,
                            int aTabType); // 0: first tab, 1: prop, 2: cap'ed


  already_AddRefed<RDBCursor>
  JoinPropCap(JSContext* aCx,
              JS::Handle<JSObject*> aTabs,
              JS::Handle<JSObject*> aWhere,
              const nsACString& aOrderBy,
              ErrorResult& aRv);

  bool
  ConstrustJoinFlatProp(JSContext* cx,
                        const nsACString& aRootTab,
                        JS::Handle<JSObject*> aTabs,
                        Sequence<nsCString>& aResTabs,
                        Sequence<nsCString>& aCols,
                        nsCString& aWhere);

  already_AddRefed<RDBCursor>
  JoinFlatProp(JSContext* aCx,
               const nsACString& aRootTab,
               JS::Handle<JSObject*> aTabs,
               JS::Handle<JSObject*> aWhere,
               const nsACString& aOrderBy,
               ErrorResult& aRv);
  
  already_AddRefed<RDBCursor>
  Query(JSContext* aCx,
        const Sequence<nsCString>& aTabs,
        const Sequence<nsCString>& aCols,
        JS::Handle<JSObject*> aWhere,
        const nsACString& aOrderBy,
        ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  Update(JSContext* aCx,
         const nsACString& aTab,
         JS::Handle<JSObject*> aWhere,
         JS::Handle<JSObject*> aVals,
         ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  Insert(JSContext* aCx,
         const nsACString& aTab,
         JS::Handle<JSObject*> aVals,
         ErrorResult& aRv);

  already_AddRefed<RDBRequest>
  Insert(JSContext* aCx,
         const nsACString& aTab,
         JS::Handle<JSObject*> aVals,
         const Sequence<nsCString>& aCapCols,
         const Sequence<OwningNonNull<RDBOwnershipToken>>& aCapTokens,
         ErrorResult& aRv);


  already_AddRefed<RDBRequest>
  Delete(JSContext* aCx,
        const nsACString& aTab,
        JS::Handle<JSObject*> aWhere,
        ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc>
  getSetUsingCap(nsACString aCapTab, nsACString aResultTab);


  already_AddRefed<RDBSubsetDesc>
  ExpandCap(const nsACString& aCapTab,
            const nsACString& aResultTab,
            ErrorResult& aRv);


  already_AddRefed<RDBRequest> StartTx(ErrorResult& aRv);

  already_AddRefed<RDBRequest> AbortTx(ErrorResult& aRv);

  already_AddRefed<RDBRequest> CommitTx(ErrorResult& aRv);

  already_AddRefed<RDBSubsetDesc> Clone();

  bool DefaultPrivate() {
    return mDefaultPrivate;
  }

  void SetDefaultPrivate(bool val) {
    mDefaultPrivate = val;
  }

  uint32_t AppId() {
    return mAppId;
  }

  void Revoke();

  static already_AddRefed<RDBSubsetDesc>
  GetFromSharedRepo(uint64_t aToken);

  uint64_t SaveForShare();

  IMPL_EVENT_HANDLER(success);
  IMPL_EVENT_HANDLER(error);

  std::map<nsCString, PerTableCapInfo> mTabs;

  nsRefPtr<nsDOMRDB> mRDB;
  private:
    ~RDBSubsetDesc(){}
    bool mValid;
    uint32_t mAppId;
    bool mDefaultPrivate;
    std::set<nsRefPtr<RDBSubsetDesc>> mChildDescs;
    static std::map<uint64_t, nsRefPtr<RDBSubsetDesc>> gSharedRepo;
    static mozilla::Mutex gSharedRepoMutex;
};


#endif