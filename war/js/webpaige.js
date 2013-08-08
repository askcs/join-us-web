/*jslint node: true */
/*global angular */
/*global basket */
'use strict';


/**
 * Declare app level module which depends on filters, and services
 */
angular.module('WebPaige',[
  'ngResource',
  // modals
  'WebPaige.Modals.User',
  'WebPaige.Modals.Dashboard',
  'WebPaige.Modals.Slots',
  'WebPaige.Modals.Messages',
  'WebPaige.Modals.Groups',
  'WebPaige.Modals.Profile',
  'WebPaige.Modals.Settings',
  // controller
  'WebPaige.Controllers.Login',
  'WebPaige.Controllers.Logout',
  'WebPaige.Controllers.Dashboard',
  'WebPaige.Controllers.Planboard',
  'WebPaige.Controllers.Timeline',
  'WebPaige.Controllers.Timeline.Navigation',
  'WebPaige.Controllers.Messages',
  'WebPaige.Controllers.Scheaduler',
  'WebPaige.Controllers.Groups',
  'WebPaige.Controllers.Profile',
  'WebPaige.Controllers.Settings',
  'WebPaige.Controllers.Help',
  // services
  'WebPaige.Services.Timer',
  'WebPaige.Services.Session',
  'WebPaige.Services.Dater',
  'WebPaige.Services.EventBus',
  'WebPaige.Services.Interceptor',
  'WebPaige.Services.MD5',
  'WebPaige.Services.Storage',
  'WebPaige.Services.Strings',
  'WebPaige.Services.Announcer',
  'WebPaige.Services.Sloter',
  'WebPaige.Services.Stats',
  'WebPaige.Services.Offsetter',
  // directives
  'WebPaige.Directives',
  '$strap.directives',
  // filters
  'WebPaige.Filters'
]);


/**
 * Fetch libraries with AMD (if they are not present) and save in localStorage
 * If a library is presnet it wont be fetched from server
 */
if ('localStorage' in window && window['localStorage'] !== null)
{
  basket
    .require(
      { url: 'libs/chosen/chosen.jquery.min.js' },
      // { url: 'libs/chaps/timeline/2.4.0/timeline_modified.js' },
      { url: 'libs/bootstrap-datepicker/bootstrap-datepicker.min.js' },
      { url: 'libs/bootstrap-timepicker/bootstrap-timepicker.min.js' },
      { url: 'libs/daterangepicker/1.1.0/daterangepicker.min.js' },
      { url: 'libs/sugar/1.3.7/sugar.min.js' },
      { url: 'libs/raphael/2.1.0/raphael-min.js' }
    )
    .then(function ()
      {
        basket
          .require(
            { url: 'libs/g-raphael/0.5.1/g.raphael-min.js' },
            { url: 'libs/g-raphael/0.5.1/g.pie-min.js' }
          )
          .then(function ()
          {
            // console.warn('basket parsed scripts..');
        });
      }
    );
}