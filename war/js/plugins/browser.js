/**
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


