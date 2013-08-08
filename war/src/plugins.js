/**
 * Avoid `console` errors in browsers that lack a console
 */
(function ()
{
  var method,
      noop = function() {},
      methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
      ],
      length = methods.length,
      console = (window.console = window.console || {});

  while (length--)
  {
    method = methods[length];

    if (!console[method]) console[method] = noop;
  }
}());;/**
 * jQuery $.browser plugin
 * Depreciated since 1.9
 *
 * https://github.com/gabceb/jquery-browser-plugin
 */
(function (jQuery, window, undefined) 
{
  "use strict";

  var matched, browser;

  jQuery.uaMatch = function(ua) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

    var platform_match = /(ipad)/.exec(ua) ||
      /(iphone)/.exec(ua) ||
      /(android)/.exec(ua) || [];

    return {
      browser: match[1] || "",
      version: match[2] || "0",
      platform: platform_match[0] || ""
    };
  };

  matched = jQuery.uaMatch(window.navigator.userAgent);
  browser = {};

  if (matched.browser) 
  {
    browser[matched.browser] = true;
    browser.version = matched.version;
  };

  if (matched.platform) 
  {
    browser[matched.platform] = true
  };

  // Chrome is Webkit, but Webkit is also Safari.
  if (browser.chrome) 
  {
    browser.webkit = true;
  } 
  else if (browser.webkit) 
  {
    browser.safari = true;
  };

  // check for mobile
  if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(window.navigator.userAgent) )
  {
    browser.mobile = true;

    browser.android = (/Android/i.test(window.navigator.userAgent)) ? true : false;

    browser.ios     = (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) ? true : false;
  }
  else
  {
    browser.mobile = false;
  };

  jQuery.browser = browser;

})(jQuery, window);




/**
 * Detect IE version for blocking IE6 and IE7
 */
if ($.browser.msie)
{
  var ver = $.browser.version || $.browser.version[0];

  if (ver == '6.0' || ver == '7.0') window.location = 'browsers.html';
}


;/**
 * jQuery $.os plugin
 *
 * Author: Cengiz Ulusoy
 */
(function (jQuery, window, undefined) 
{
  "use strict";

  /**
   * Init vars
   */
  var os = {},
      navOS = window.navigator.appVersion;

  /**
   * Os tests
   */
  if (navOS.indexOf("Win") != -1)   os.windows = true;
  if (navOS.indexOf("Mac") != -1)   os.mac = true;
  if (navOS.indexOf("X11") != -1)   os.unix = true;
  if (navOS.indexOf("Linux") != -1) os.linux = true;

  /**
   * Pass to jQuery
   */
  jQuery.os = os;

})(jQuery, window);;/*!
* basket.js
* v0.3.0 - 2012-12-28
* http://addyosmani.github.com/basket.js
* (c) Addy Osmani; MIT License
* Created by: Addy Osmani, Sindre Sorhus, AndrÃ©e Hansson
* Contributors: Ironsjp, Mathias Bynens, Rick Waldron, Felipe Morais
* Uses rsvp.js, https://github.com/tildeio/rsvp.js
*/
if ('localStorage' in window && window['localStorage'] !== null)
{
  (function( window, document ) {
    'use strict';

    // Monkey-patching an "all" method onto RSVP
    // Returns a promise that will be fulfilled when the array of promises passed in are all
    // fulfilled
    RSVP.all = function( promises ) {
      var i, results = [];
      var allPromise = new RSVP.Promise();
      var remaining = promises.length;

      var resolver = function( index ) {
        return function( value ) {
          resolve( index, value );
        };
      };
      var resolve = function( index, value ) {
        results[ index ] = value;
        if ( --remaining === 0 ) {
          allPromise.resolve( results );
        }
      };
      var reject = function( error ) {
        allPromise.reject( error );
      };

      for ( i = 0; i < remaining; i++ ) {
        promises[ i ].then( resolver( i ), reject );
      }

      return allPromise;
    };

    var head = document.head || document.getElementsByTagName('head')[0];
    var storagePrefix = 'WebPaige.';
    var defaultExpiration = 5000;

    var addLocalStorage = function( key, storeObj ) {
      try {
        localStorage.setItem( storagePrefix + key, JSON.stringify( storeObj ) );
        return true;
      } catch( e ) {
        if ( e.name.toUpperCase().indexOf('QUOTA') >= 0 ) {
          var item;
          var tempScripts = [];

          for ( item in localStorage ) {
            if ( item.indexOf( storagePrefix ) === 0 ) {
              tempScripts.push( JSON.parse( localStorage[ item ] ) );
            }
          }

          if ( tempScripts.length ) {
            tempScripts.sort(function( a, b ) {
              return a.stamp - b.stamp;
            });

            basket.remove( tempScripts[ 0 ].key );

            return addLocalStorage( key, storeObj );

          } else {
            // no files to remove. Larger than available quota
            return;
          }

        } else {
          // some other error
          return;
        }
      }

    };

    var getUrl = function( url ) {
      var xhr = new XMLHttpRequest();
      var promise = new RSVP.Promise();
      xhr.open( 'GET', url );

      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
          if( xhr.status === 200 ) {
            promise.resolve( xhr.responseText );
          } else {
            promise.reject( new Error( xhr.statusText ) );
          }
        }
      };

      xhr.send();

      return promise;
    };

    var saveUrl = function( obj ) {
      return getUrl( obj.url ).then( function( text ) {
        var storeObj = wrapStoreData( obj, text );

        addLocalStorage( obj.key , storeObj );

        return text;
      });
    };

    var injectScript = function( text ) {
      var script = document.createElement('script');
      script.defer = true;
      // Have to use .text, since we support IE8,
      // which won't allow appending to a script
      script.text = text;
      head.appendChild( script );
    };

    var wrapStoreData = function( obj, data ) {
      var now = +new Date();
      obj.data = data;
      obj.stamp = now;
      obj.expire = now + ( ( obj.expire || defaultExpiration ) * 60 * 60 * 1000 );

      return obj;
    };

    var handleStackObject = function( obj ) {
      var source, promise;

      if ( !obj.url ) {
        return;
      }

      obj.key =  ( obj.key || obj.url );
      source = basket.get( obj.key );

      obj.execute = obj.execute !== false;

      if ( !source || source.expire - +new Date() < 0  || obj.unique !== source.unique ) {
        if ( obj.unique ) {
          // set parameter to prevent browser cache
          obj.url += ( ( obj.url.indexOf('?') > 0 ) ? '&' : '?' ) + 'basket-unique=' + obj.unique;
        }
        promise = saveUrl( obj );
      } else {
        promise = new RSVP.Promise();
        promise.resolve( source.data );
      }

      if( obj.execute ) {
        return promise.then( injectScript );
      } else {
        return promise;
      }
    };

    window.basket = {
      require: function() {
        var i, l, promises = [];

        for ( i = 0, l = arguments.length; i < l; i++ ) {
          promises.push( handleStackObject( arguments[ i ] ) );
        }

        return RSVP.all( promises );
      },

      remove: function( key ) {
        localStorage.removeItem( storagePrefix + key );
        return this;
      },

      get: function( key ) {
        var item = localStorage.getItem( storagePrefix + key );
        try {
          return JSON.parse( item || 'false' );
        } catch( e ) {
          return false;
        }
      },

      clear: function( expired ) {
        var item, key;
        var now = +new Date();

        for ( item in localStorage ) {
          key = item.split( storagePrefix )[ 1 ];
          if ( key && ( !expired || this.get( key ).expire <= now ) ) {
            this.remove( key );
          }
        }

        return this;
      }
    };

    // delete expired keys
    basket.clear( true );

  })( this, document );
};/**
 * Screenfull - Sindresorhus
 * 
 * https://github.com/sindresorhus/screenfull.js
 */
(function(window, document) {
  'use strict';

  var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element, // IE6 throws without typeof check

    fn = (function() {
      var val, valLength;
      var fnMap = [
        [
          'requestFullscreen',
          'exitFullscreen',
          'fullscreenElement',
          'fullscreenEnabled',
          'fullscreenchange',
          'fullscreenerror'
        ],
        // new WebKit
        [
          'webkitRequestFullscreen',
          'webkitExitFullscreen',
          'webkitFullscreenElement',
          'webkitFullscreenEnabled',
          'webkitfullscreenchange',
          'webkitfullscreenerror'

        ],
        // old WebKit (Safari 5.1)
        [
          'webkitRequestFullScreen',
          'webkitCancelFullScreen',
          'webkitCurrentFullScreenElement',
          'webkitCancelFullScreen',
          'webkitfullscreenchange',
          'webkitfullscreenerror'

        ],
        [
          'mozRequestFullScreen',
          'mozCancelFullScreen',
          'mozFullScreenElement',
          'mozFullScreenEnabled',
          'mozfullscreenchange',
          'mozfullscreenerror'
        ]
      ];
      var i = 0;
      var l = fnMap.length;
      var ret = {};

      for (; i < l; i++) {
        val = fnMap[i];
        if (val && val[1] in document) {
          for (i = 0, valLength = val.length; i < valLength; i++) {
            ret[fnMap[0][i]] = val[i];
          }
          return ret;
        }
      }
      return false;
    })(),

    screenfull = {
      request: function(elem) {

        var request = fn.requestFullscreen;

        elem = elem || document.documentElement;

        // Work around Safari 5.1 bug: reports support for
        // keyboard in fullscreen even though it doesn't.
        // Browser sniffing, since the alternative with
        // setTimeout is even worse
        if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
          elem[request]();
        } else {
          elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
        }
      },
      exit: function() {
        document[fn.exitFullscreen]();
      },
      toggle: function( elem ) {
        if (this.isFullscreen) {
          this.exit();
        } else {
          this.request(elem);
        }
      },
      onchange: function() {},
      onerror: function() {}
    };

  if (!fn) {
    return window.screenfull = false;
  }

  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: function() {
        return !!document[fn.fullscreenElement];
      }
    },
    element: {
      enumerable: true,
      get: function() {
        return document[fn.fullscreenElement];
      }
    },
    enabled: {
      enumerable: true,
      get: function() {
        // Coerce to boolean in case of old WebKit
        return !!document[fn.fullscreenEnabled];
      }
    }
  });

  document.addEventListener(fn.fullscreenchange, function(e) {
    screenfull.onchange.call(screenfull, e);
  });

  document.addEventListener(fn.fullscreenerror, function(e) {
    screenfull.onerror.call(screenfull, e);
  });

  window.screenfull = screenfull;

})(window, document);