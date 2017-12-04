/* global LazyLoader, AppWindowManager, applications, ManifestHelper*/
/* global Template*/
'use strict';
(function(exports) {

  /**
   * Handle Web API oauths such as geolocation, getUserMedia
   * @class OauthManager
   * @requires Applications
   */
  function OauthManager() {
  }

  OauthManager.prototype = {

    container: undefined,

    currentOrigin: undefined,
    fullscreenRequest: undefined,
    /**
     * special dialog for camera selection while in app mode and
     * oauth is granted
     */
    isCamSelector: false,
    /**
     * A queue of pending requests. Callers of requestOauth() must be
     * careful not to create an infinite loop!
     */
    pending: [],

    /**
     * The ID of the request currently visible on the screen. This has the value
     * "undefined" when there is no request visible on the screen.
     */
    currentRequestId: undefined,

    /**
     * start the OauthManager to init variables and listeners
     * @memberof OauthManager.prototype
     */
    start: function pm_start() {
      // Div over in which the oauth UI resides.
      this.overlay = document.getElementById('oauth-screen');
      this.dialog = document.getElementById('oauth-dialog');
      this.title = document.getElementById('oauth-title');
      this.container = document.getElementById('oauth-window-holder');
      
      this.buttons = document.getElementById('oauth-buttons');
      this.abort   = document.getElementById('oauth-close');

      window.addEventListener('mozChromeEvent', this);
      window.addEventListener('attentionopening', this);
      window.addEventListener('attentionopened', this);
      window.addEventListener('lockscreen-appopened', this);

      this.discardOauthRequest = this.discardOauthRequest.bind(this);
      window.addEventListener('home', this.discardOauthRequest);
      window.addEventListener('holdhome', this.discardOauthRequest);

      /* If an application that is currently running needs to get killed for
       * whatever reason we want to discard it's request for oauths.
       */
      window.addEventListener('appterminated', (function(evt) {
        if (evt.detail.origin == this.currentOrigin) {
          this.discardOauthRequest();
        }
      }).bind(this));

      // Ensure that the focus is not stolen by the oauth overlay, as
      // it may appears on top of a <select> element, and just cancel it.
      this.overlay.addEventListener('mousedown', function onMouseDown(evt) {
        evt.preventDefault();
      });
    },

    /**
     * stop the OauthManager to reset variables and listeners
     * @memberof OauthManager.prototype
     */
    stop: function pm_stop() {
      this.currentOrigin = null;
      this.fullscreenRequest = null;
      this.isCamSelector = false;

      this.pending = [];
      this.currentRequestId = null;

      this.overlay = null;
      this.dialog = null;

      this.buttons=null;
      this.abort=null;

      window.removeEventListener('mozChromeEvent', this);
      window.removeEventListener('attentionopening', this);
      window.removeEventListener('attentionopened', this);
      window.removeEventListener('lockscreen-appopened', this);
      window.removeEventListener('home', this.discardOauthRequest);
      window.removeEventListener('holdhome', this.discardOauthRequest);
    },

    /**
     * Reset current values
     * @memberof OauthManager.prototype
     */
    cleanDialog: function pm_cleanDialog() {
       // called before a new request comes in
    },

    /**
     * Event handler interface for mozChromeEvent.
     * @memberof OauthManager.prototype
     * @param {DOMEvent} evt The event.
     */
    handleEvent: function pm_handleEvent(evt) {
      var detail = evt.detail;
      switch (detail.type) {
        case 'oauth-prompt':
          this.cleanDialog();
          this.currentOrigin = detail.origin;
          this.handleOauthPrompt(detail);
          break;
        case 'cancel-oauth-prompt':
          this.discardOauthRequest();
          break;
        case 'fullscreenoriginchange':
          delete this.overlay.dataset.type;
          this.cleanDialog();
          this.handleFullscreenOriginChange(detail);
          break;
      }

      switch (evt.type) {
        case 'attentionopened':
        case 'attentionopening':
          if (this.currentOrigin !== evt.detail.origin) {
            this.discardOauthRequest();
          }
          break;
        case 'lockscreen-appopened':
          if (this.currentRequestId == 'fullscreen') {
            this.discardOauthRequest();
          }
          break;
      }
    },

    /**
     * Show the request for the new domain
     * @memberof OauthManager.prototype
     * @param {Object} detail The event detail object.
     */
    handleFullscreenOriginChange:
      function pm_handleFullscreenOriginChange(detail) {
      // If there's already a fullscreen request visible, cancel it,
      // we'll show the request for the new domain.
      if (this.fullscreenRequest !== undefined) {
        this.cancelRequest(this.fullscreenRequest);
        this.fullscreenRequest = undefined;
      }
      if (detail.fullscreenorigin !== AppWindowManager.getActiveApp().origin) {
        var _ = navigator.mozL10n.get;
        // The message to be displayed on the approval UI.
        var message =
          _('fullscreen-request', { 'origin': detail.fullscreenorigin });
        this.fullscreenRequest =
          this.requestOauth('fullscreen', detail.origin, detail.oauth,
                                 message, '',
                                              /* yesCallback */ null,
                                              /* noCallback */ function() {
                                                document.mozCancelFullScreen();
                                              });
      }
    },

    /**
     * Prepare for oauth prompt
     * @memberof OauthManager.prototype
     * @param {Object} detail The event detail object.
     */
    handleOauthPrompt: function pm_handleOauthPrompt(detail) {

      this.requestOauth(detail.id, detail.target, detail.params,
        function pm_callback(params){
          this.dispatchResponse(detail.id, params);
        }.bind(this)
      );
    },

    /**
     * Send oauth choice to gecko
     * @memberof OauthManager.prototype
     */
    dispatchResponse: function pm_dispatchResponse(id, params) {

      var response = {
        id: id
      };
      if(params) 
        response.params = params;

      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('mozContentEvent', true, true, response);
      window.dispatchEvent(event);
    },

    /**
     * Hide prompt
     * @memberof OauthManager.prototype
     */
    hideOauthPrompt: function pm_hideOauthPrompt() {
      this.overlay.classList.remove('visible');
      this.currentRequestId = undefined;
      if(this.oauth_window){
         this.oauth_window.terminate();
         this.oauth_window = undefined;
      }
      this.abort.removeEventListener('click', this.abortHandler)
      this.abort.callback = null;
      
      // XXX: This is telling AppWindowManager to focus the active app.
      // After we are moving into AppWindow, we need to remove that
      // and call this.app.focus() instead.
      this.publish('oauthdialoghide');
    },

    publish: function(eventName, detail) {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, detail);
      window.dispatchEvent(event);
    },

    /**
     * Show the next request, if we have one.
     * @memberof OauthManager.prototype
     */
    showNextPendingRequest: function pm_showNextPendingRequest() {
      if (this.pending.length === 0) {
        return;
      }
      var request = this.pending.shift();
      this.showOauthPrompt(request.id,
                           request.target,
                           request.params,
                           request.callback)
    },
    clickHandler: function(evt){
      var callback = null;
      if(evt.target === this.abort && this.abort.callback){
        callback = this.abort.callback;
      }
      this.hideOauthPrompt();
      if(callback){
         window.setTimeout(callback, 0);
      }
      this.showNextPendingRequest();
    },

    /**
     * Queue or show the oauth prompt
     * @memberof OauthManager.prototype
     */
    requestOauth: function pm_requestOauth(id, target, params, callback) {
      if (this.currentRequestId !== undefined) {
        // There is already a oauth request being shown, queue this one.
        this.pending.push({
          id: id,
          target: target,
          params: params,
          callback: callback
        });
        return id;
      }
      this.showOauthPrompt(id, target, params, callback);

      return id;
    },

    /**
     * Put the message in the dialog.
     * @memberof OauthManager.prototype
     */
    showOauthPrompt: function pm_showOauthPrompt(id, target, params, callback) {
      // Note plain text since this may include text from
      // untrusted app manifests, for example.
      this.currentRequestId = id;

      // shared/js/oauthwindow.js
      if(! this.oauth_window ){
        console.log("Creating new oauth window");
        var owin = this.oauth_window = 
                   new OAuthWindow(this.container, target, params);
        owin.open();
         
        owin.oncomplete = function(params){
          this.oauth_window = undefined;// in this case it closes itself
          this.hideOauthPrompt();

          if (callback) {
            callback(params);
          }
          this.showNextPendingRequest();
        }.bind(this);

        owin.onabort = owin.oncomplete;

      }
      this.abortHandler = this.clickHandler.bind(this);
      this.abort.addEventListener('click', this.abortHandler);
      this.abort.callback = callback;

      // Make the screen visible
      this.overlay.classList.add('visible');
    },

    /**
     * Cancels a request with a specfied id. Request can either be
     * currently showing, or pending. If there are further pending requests,
     * the next is shown.
     * @memberof OauthManager.prototype
     */
    cancelRequest: function pm_cancelRequest(id) {
      if (this.currentRequestId === id) {
        // Request is currently being displayed. Hide the oauth prompt,
        // and show the next request, if we have any.
        this.hideOauthPrompt();
        this.oauth_window = undefined;
        this.showNextPendingRequest();
      } else {
        // The request is currently not being displayed. Search through the
        // list of pending requests, and remove it from the list if present.
        for (var i = 0; i < this.pending.length; i++) {
          if (this.pending[i].id === id) {
            this.pending.splice(i, 1);
            break;
          }
        }
      }
    },

    /**
     * Clean current request queue and
     * send refuse oauth request message to gecko
     * @memberof OauthManager.prototype
     */
    discardOauthRequest: function pm_discardOauthRequest() {
      this.dispatchResponse(this.currentRequestId, {});

      this.hideOauthPrompt();
      this.pending = [];
    }
  };

  exports.OauthManager = OauthManager;

})(window);
