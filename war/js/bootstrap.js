/*jslint node: true */
/*global angular */
/*global $ */
/*global ui */
/*global screenfull */
'use strict';


/**
 * Initial run functions
 */
angular.module('WebPaige')
.run(
[
  '$rootScope', '$location', '$timeout', 'Session', 'Dater', 'Storage', 'Messages', '$config', '$window',
  function ($rootScope, $location, $timeout, Session, Dater, Storage, Messages, $config, $window)
  {
    /**
     * Pass config and init dynamic config values
     */
    $rootScope.config = $config;

    $rootScope.config.init();


    /**
     * TODO
     * Move these checks to jquery.browser
     * 
     * Pass Jquery browser data to angular
     */
    $rootScope.browser = $.browser;

    angular.extend($rootScope.browser, {
      screen: $window.screen
    });

    if ($rootScope.browser.ios)
    {
      angular.extend($rootScope.browser, {
        landscape:    Math.abs($window.orientation) == 90 ? true : false,
        portrait:     Math.abs($window.orientation) != 90 ? true : false
      });
    }
    else
    {
      angular.extend($rootScope.browser, {
        landscape:    Math.abs($window.orientation) != 90 ? true : false,
        portrait:     Math.abs($window.orientation) == 90 ? true : false
      });
    }

    $window.onresize = function () { $rootScope.browser.screen = $window.screen; };

    $window.onorientationchange = function ()
    {
      $rootScope.$apply(function ()
      {
        if ($rootScope.browser.ios)
        {
          angular.extend($rootScope.browser, {
            landscape:    Math.abs($window.orientation) == 90 ? true : false,
            portrait:     Math.abs($window.orientation) != 90 ? true : false
          });
        }
        else
        {
          angular.extend($rootScope.browser, {
            landscape:    Math.abs($window.orientation) != 90 ? true : false,
            portrait:     Math.abs($window.orientation) == 90 ? true : false
          });
        }
      });
    };


    /**
     * Default language and change language
     */
    $rootScope.changeLanguage = function (lang) { $rootScope.ui = ui[lang]; };
    $rootScope.ui = ui[$rootScope.config.lang];


    // console.log('-->', $rootScope.ui);


    /**
     * If periods are not present calculate them
     */
    if (!Storage.get('periods')) Dater.registerPeriods();


    /**
     * Set important info back if refreshed
     */
    $rootScope.app = $rootScope.app || {};


    /**
     * Set up resources
     */
    $rootScope.app.resources = angular.fromJson(Storage.get('resources'));


    /**
     * Count unread messages
     */
    if (!$rootScope.app.unreadMessages) Messages.unreadCount();


    /**
     * Show action loading messages
     */
    $rootScope.statusBar =
    {
      init: function ()
      {
        $rootScope.loading = {
          status: false,
          message: 'Aan het laden..'
        };

        $rootScope.app.preloader = {
          status: false,
          total:  0,
          count:  0
        };
      },

      display: function (message)
      {
        // $rootScope.app.preloader || {status: false};

        $rootScope.app.preloader.status = false;

        $rootScope.loading = {
          status:   true,
          message:  message
        };
      },

      off: function ()
      {
        $rootScope.loading.status = false;
      }
    };

    $rootScope.statusBar.init();



    $rootScope.notification = {
      status:   false,
      type:     '',
      message:  ''
    };


    /**
     * Show notifications
     */
    $rootScope.notifier =
    {
      init: function (status, type, message)
      {
        $rootScope.notification.status = true;

        if ($rootScope.browser.mobile && status == true)
        {
          $window.alert(message);
        }
        else
        {
          $rootScope.notification = {
            status:   status,
            type:     type,
            message:  message
          };
        }
      },

      success: function (message, permanent)
      {
        this.init(true, 'alert-success', message);

        if (!permanent) this.destroy();
      },

      error: function (message, permanent)
      {
        this.init(true, 'alert-danger', message);

        if (!permanent) this.destroy();
      },

      destroy: function ()
      {
        setTimeout(function ()
        {
          $rootScope.notification.status = false;
        }, 5000);
      }
    };

    $rootScope.notifier.init(false, '', '');


    /**
     * Allow webkit desktop notifications
     */
    // $rootScope.allowWebkitNotifications = function ()
    // {
    //   // Callback so it will work in Safari 
    //   $window.webkitNotifications.requestPermission(function () {});     
    // };


    /**
     * Set webkit notification
     */
    // $rootScope.setWebkitNotification = function (title, message, params)
    // {
    //   if ($window.webkitNotifications && $config.notifications.webkit.app)
    //   {
    //     var notification =  $window.webkitNotifications.createNotification(
    //                           location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + 
    //                           '/js/profiles/' + $config.profile.meta + '/img/ico/apple-touch-icon-144x144-precomposed.png', 
    //                           title, 
    //                           message
    //                         );

    //     notification.onclick = function () 
    //     {
    //       $rootScope.$apply(function ()
    //       {            
    //         if (params.search && !params.hash)
    //         {
    //           $location.path('/' + params.path).search(params.search);
    //         }
    //         else if (!params.search && params.hash)
    //         {
    //           $location.path('/' + params.path).hash(params.hash); 
    //         }
    //         else if (!params.search && !params.hash)
    //         {
    //           $location.path('/' + params.path); 
    //         }
    //         else if (params.search && params.hash)
    //         {
    //           $location.path('/' + params.path).search(params.search).hash(params.hash); 
    //         }
    //       });
    //     };

    //     notification.show();
    //   };     
    // };



    /**
     * Detect route change start
     */
    $rootScope.$on('$routeChangeStart', function (event, next, current)
    {
      function resetLoaders ()
      {
        $rootScope.loaderIcons = {
          general:    false,
          dashboard:  false,
          planboard:  false,
          messages:   false,
          groups:     false,
          profile:    false,
          settings:   false
        };
      }

      resetLoaders();

      switch ($location.path())
      {
        case '/dashboard':
          $rootScope.loaderIcons.dashboard = true;

          $rootScope.location = 'dashboard';
        break;

        case '/planboard':
          $rootScope.loaderIcons.planboard = true;

          $rootScope.location = 'planboard';
        break;

        case '/messages':
          $rootScope.loaderIcons.messages = true;

          $rootScope.location = 'messages';
        break;

        case '/groups':
          $rootScope.loaderIcons.groups = true;

          $rootScope.location = 'groups';
        break;

        case '/settings':
          $rootScope.loaderIcons.settings = true;

          $rootScope.location = 'settings';
        break;

        default:
          if ($location.path().match(/profile/))
          {
            $rootScope.loaderIcons.profile = true;

            $rootScope.location = 'profile';
          }
          else
          {
            $rootScope.loaderIcons.general = true;
          }
      }

      if (!Session.check()) $location.path("/login");

      $rootScope.loadingBig = true;

      $rootScope.statusBar.display('Aan het laden...');

      $('div[ng-view]').hide();
    });


    /**
     * Route change successfull
     */
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous)
    {
      $rootScope.newLocation = $location.path();

      $rootScope.loadingBig = false;

      $rootScope.statusBar.off();

      $('div[ng-view]').show();
    });


    /**
     * TODO
     * A better way of dealing with this error!
     * 
     * Route change is failed!
     */
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection)
    {
      $rootScope.notifier.error(rejection);
    });


    /**
     * Fix styles
     */
    $rootScope.fixStyles = function ()
    {
      $rootScope.timelineLoaded = false;

      var tabHeight = $('.tabs-left .nav-tabs').height();

      $.each($('.tab-content').children(), function () 
      {
        var $parent = $(this),
            $this = $(this).attr('id'),
            contentHeight = $('.tabs-left .tab-content #' + $this).height();

        /**
         * TODO
         * 
         * Append left border fix
         */
        // $parent.append('<div class="left-border-fix"></div>');
        // console.log('parent ->', $parent);
        // $('#' + $this + ' .left-border-fix').css({
        //   height: contentHeight
        // });
        /**
         * Check if one is bigger than another
         */

        if (tabHeight > contentHeight)
        {
          // console.log('tab is taller than content ->', $this);
          $('.tabs-left .tab-content #' + $this).css({
            height: $('.tabs-left .nav-tabs').height() - 41
          });
        }
        else if (contentHeight > tabHeight)
        {
          // console.log('content is taller than tabs ->', $this);
          // $('.tabs-left .nav-tabs').css( { height: contentHeight } );
        };
      });

      /**
       * Correct icon-font-library icons for mac and linux
       */
      if ($.os.mac || $.os.linux)
      {
        $('.nav-tabs-app li a span').css({
          paddingTop: '10px',
          marginBottom: '0px'
        });

        // $('#loading').css({
        //   //marginTop: '-160px'
        //   display: 'none'
        // });
      }
    };


    /**
     * Experimental full screen ability
     */
    $rootScope.fullScreen = function () { screenfull.toggle($('html')[0]); };


    /**
     * Detect OS for some specific styling issues
     */
    if ($.os.windows)
    {
      $('#loading p').css({
        paddingTop: '130px'
      });
    }


    /**
     * IE8 fix for inability of - not ready for angular by loading
     * especially for index.html
     */
    if ($.browser.msie && $.browser.version == '8.0')
    {
      document.title = $rootScope.config.profile.title;
    }





    if (!$config.profile.mobileApp.status) $('#copyrights span.muted').css({right: 0});

    $rootScope.downloadMobileApp = function ()
    {
      $rootScope.statusBar.display('Instructies aan het verzenden...');

      Messages.email()
      .then(function (result)
      {
        $rootScope.notifier.success('Controleer uw inbox voor de instructies.');

        $rootScope.statusBar.off();
      })
    }

  }
]);


/**
 * Sticky timeline header
 */
// $('#mainTimeline .timeline-frame div:first div:first').css({'top': '0px'})