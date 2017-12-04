// vim: set filetype=javascript shiftwidth=2 tabstop=2:
"use strict";

const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1", "nsIXMLHttpRequest");
this.EXPORTED_SYMBOLS = ["Oauth"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "SystemAppProxy",
                                  "resource://gre/modules/SystemAppProxy.jsm");

this.Oauth = function(target, client_id, redirectURI, scopes, aWindow,
                      onsuccess, onerror) 
{
  this.target  = target;
  this.clientId = client_id;
  this.redirectURI = redirectURI;
  this.scopes = scopes;
  this._window = aWindow;
  this.onsuccess = onsuccess;
  this.onerror = onerror;
}

this.Oauth.prototype = {
  get scope(){
    if(typeof this.scopes === "string"){
      return this.scopes;
    }
    return this.scopes.join(' ');
  },

  ready: function(){
    if(this.onsuccess){
      this.onsuccess();
    }
  },

  failed: function(){
    if(this.onerror){
      this.onerror();
    }
  },

  searchDB: function searchDB(callback){
    callback(null); //I'll punt on this part for now,
                    //will be easier when subdescriptors
                    //are working
    return;
    var self = this;

    self.withStorage(function lookup_token(db){
      
      var where_ob = {type: "="};
      where_ob[CLIENT_ID] = clientID;

      var req = db.query([TABLE], [TOKEN], where_ob, null);
      req.onsuccess = function(e){
        if(req.next()){
          var obj = {};
          obj[CLIENT_ID] = clientID;
          obj[TOKEN] = req.row[TOKEN];
          callback(obj);
        }
        else{
          callback(null);
        }
        req.reset();
      };
      req.onerror = function(e){
        throw new Error("Something went wrong trying to access the token DB");
      };
    });
  },
   validate: function(cb){
     var self = this;
     var uri = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" +
               self.token;
     self.do_xhr(uri, 'POST', 'json', null, null, function(status, response){
      
       if(!cb){
         return;
       }
       if(status === 200 && response.audience === self.clientId)
         cb(true, response);
       else
         cb(false, response);
     });
   },

  init: function(){
    var self = this;
    
    self.searchDB(function handleDBToken(token){
      if(token){
         self.check(token);
      }
      else{
        self.doOauthFlow(function handleFlowToken(token){
          if(token){
            self.check(token);
          }
          else{
            throw new Error("All atempts to get a token have failed");
          }
        });
      }
    });
  },

  check: function(token){
    var self = this;
    self.token = token;
    self.validate(function(good, response){
      if(good){
        self.ready();
      }
      else{
        self.oauth_manager = undefined;
        self.failed();
      }
    });
  },
   
  /*
   * Initiate an oauth flow handled by some system app in the gaia leve;
   * @param callback: function(token) token contains a token on success
   *                                  null otherwise
   */
  doOauthFlow: function doOauthFlow(callback){
    let self = this;

    let requestId = Cc["@mozilla.org/uuid-generator;1"]
                    .getService(Ci.nsIUUIDGenerator).generateUUID().toString();

    SystemAppProxy.addEventListener("mozContentEvent", function promptCB(evt){
      let detail = evt.detail;
      if (detail.id != requestId){
        // this is not the request you are looking for
        return;
      }
      SystemAppProxy.removeEventListener("mozContentEvent", promptCB);

      if(detail.params)
        callback(detail.params.access_token);
      else
        callback(null);
    });

    let details = {
      type: "oauth-prompt",
      target: self.target,
      params: {
        client_id:     self.clientId,
        redirect_uri:  self.redirectURI, //
        response_type: "token",
        scope:         self.scope        //"profile"
      },
      id: requestId
    };

    // This code I stole from the permissions module,
    // it walks up the element tree to find the apropriate
    // entity to send the event
    let targetElement = null;
    let targetWindow = self._window;
    while (targetWindow.realFrameElement) {
      targetElement = targetWindow.realFrameElement;
      targetWindow = targetElement.ownerDocument.defaultView;
    }

    SystemAppProxy.dispatchEvent(details, targetElement);
  },

  do_json_get: function(uri, cb){
      this.do_xhr(uri, 'GET', 'json', null, null, function(status, response){
         if(status === 200)
            cb(response);
          else
            cb(null);
      });
  },
  do_xhr: function(uri, method, responseType, requestHeaders, data, callback){
      //var req = new this._window.XMLHttpRequest();
      var req = new XMLHttpRequest();
      req.open(method, uri, true);
      req.onload = function (e) {
         callback(req.status, req.response);
      };
      if(responseType){
        req.responseType = responseType;
      }
      if(requestHeaders){
        for(var key in requestHeaders){
           req.setRequestHeader(key, requestHeaders[key]);
        }
      }
      req.setRequestHeader("Authorization", "Bearer " + this.token);
      req.send(data);
  }
};
