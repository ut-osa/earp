this.OAuthWindow = (function() {
  'use strict';

  /**
   * Creates a oAuth dialog given a set of parameters.
   *
   *    var oauth = new OAuthWindow(
   *      elementContainer,
   *      'https://accounts.google.com/o/oauth2/auth',
   *      {
   *        response_type: 'code',
   *        client_id: 'xxx',
   *        scope: 'https://www.googleapis.com/auth/calendar',
   *        redirect_uri: 'xxx',
   *        state: 'foobar',
   *        access_type: 'offline',
   *        approval_prompt: 'force'
   *      },
   *      id_prop
   *    );
   *
   *    oauth.oncomplete = function(params) {
   *      if (params) {
   *        // success
   *      }
   *    };
   *
   *    oauth.onabort = function() {
   *      // oauth was aborted
   *    };
   *
   *
   */
  function OAuthWindow(container, server, params) {
    if (!params.redirect_uri) {
      throw new Error(
        'must provide params.redirect_uri so oauth flow can complete'
      );
    }

    this.params = {};
    for (var key in params) {
      this.params[key] = params[key];
    }

    this._element = container;

    View.call(this);
    this.target = server + '?' + QueryString.stringify(params);

    this._handleUserTriggeredClose =
      this._handleUserTriggeredClose.bind(this);
  }

  OAuthWindow.prototype = {
    __proto__: View.prototype,

    get element() {
      return this._element;
    },

    get isOpen() {
      return !!this.browserFrame;
    },

    selectors: {
      browserHeader: 'gaia-header',
      browserTitle: 'gaia-header > h1',
      browserContainer: '.browser-container'
    },

    get browserContainer() {
      return this._findElement('browserContainer', this.element);
    },

    get browserTitle() {
      return this._findElement('browserTitle', this.element);
    },

    get browserHeader() {
      return this._findElement('browserHeader', this.element);
    },
    _extractURIparams: function(uri){
        // find query string
        var queryStringIdx = uri.indexOf('?');
        var hashStringIdx  = uri.indexOf('#');
        var parse_loc = [];
        var params, ret = {};
       
        switch(queryStringIdx + hashStringIdx){
          case queryStringIdx - 1: // query string only
            parse_loc.push(queryStringIdx);
            break;
          case hashStringIdx - 1:  // hash string only
            parse_loc.push(hashStringIdx);
            break;
          case -2:                 // no uri params
            break;
          default:                 // both
            parse_loc.push(hashStringIdx);
            parse_loc.push(queryStringIdx);
        }
        
        // XXX this creates an object which contains all query and hash
        // i.e. there is no way to tell where a parameter came from after
        // this point
        for(var idx in parse_loc){
          if(idx === parse_loc.length)
            params = QueryString.parse(uri.slice(parse_loc[idx] + 1));
          else
            params = QueryString.parse(uri.slice(parse_loc[idx] + 1, parse_loc[idx+1]));
          for(var prop in params)
             ret[prop] = params[prop];
        }
        return ret;
    },

    _handleFinalRedirect: function(url) {
      this.close();

      if (this.oncomplete) {
        this.oncomplete(this._extractURIparams(url));
      }
    },

    _handleLocationChange: function(url) {
      //this.browserTitle.textContent = url;
    },

    _handleUserTriggeredClose: function() {
      // close the oauth flow
      this.close();

      // trigger an event so others can cleanup
      if (this.onabort) {
        this.onabort();
      }
    },

    terminate: function(){
       this._handleUserTriggeredClose();
    },

    handleEvent: function(event) {
      switch (event.type) {
        case 'mozbrowserlocationchange':
          var url = event.detail;
          console.log(url);
          if (url.indexOf(this.params.redirect_uri) === 0) {
            return this._handleFinalRedirect(url);
          }
          this._handleLocationChange(url);
          break;
      }
    },

    open: function() {
      if (this.browserFrame) {
        throw new Error('attempting to open frame while another is open');
      }

      // setup browser iframe
      var iframe = this.browserFrame =
        document.createElement('iframe');

      iframe.setAttribute('mozbrowser', true);
      iframe.setAttribute('src', this.target);
      iframe.setAttribute('allowfullscreen', true);
      iframe.setAttribute('frameBorder', 0);
      
      
      this.element.appendChild(iframe);


      iframe.addEventListener('mozbrowserlocationchange', this);
    },

    close: function() {
      if (!this.isOpen) {
        return;
      }

      this.browserFrame.removeEventListener(
        'mozbrowserlocationchange', this
      );
/*
      this.browserHeader.removeEventListener(
        'action', this._handleUserTriggeredClose
      );
*/
      this.element.classList.remove(View.ACTIVE);

      this.browserFrame.parentNode.removeChild(
        this.browserFrame
      );

      this.browserFrame = undefined;
    }
  };

  return OAuthWindow;
}());
