/**
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

})(jQuery, window);