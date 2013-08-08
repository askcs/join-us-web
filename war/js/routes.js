/*jslint node: true */
/*global angular */
'use strict';


/**
 * Providers & Routes
 */
angular.module('WebPaige')
.config(
[
  '$locationProvider', '$routeProvider', '$httpProvider',
  function ($locationProvider, $routeProvider, $httpProvider)
  {
    /**
     * Login router
     */
    $routeProvider
    .when('/login',
    {
      templateUrl: 'dist/views/login.html',
      controller: 'login'
    })


    /**
     * Logout router
     */
    .when('/logout',
    {
      templateUrl: 'dist/views/logout.html',
      controller: 'logout'
    })


    /**
     * Dashboard router
     */
    .when('/dashboard',
    {
      templateUrl: 'dist/views/dashboard.html',
      controller: 'dashboard'
    })


    /**
     * Planboard router
     */
    .when('/planboard',
    {
      templateUrl: 'dist/views/planboard.html',
      controller: 'planboard',
      resolve: {
        data:
        [
          '$route', 'Slots', 'Storage', 'Dater',
          function ($route, Slots, Storage, Dater)
          {
            var periods   = Storage.local.periods(),
                current   = Dater.current.week(),
                initial   = periods.weeks[current],
                groups    = Storage.local.groups(),
                settings  = Storage.local.settings();

            return  Slots.all({
                      groupId:  settings.app.group,
                      division: 'all',
                      stamps: {
                        /**
                         * Initial start up is next 7 days
                         */
                        start:  periods.days[Dater.current.today()].last.timeStamp,
                        end:    periods.days[Dater.current.today() + 7].last.timeStamp
                      },
                      month: Dater.current.month(),
                      layouts: {
                        user:     true,
                        group:    true,
                        members:  false
                      }
                    });
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Messages router
     */
    .when('/messages',
    {
      templateUrl: 'dist/views/messages.html',
      controller: 'messages',
      resolve: {
        data: [
          '$route', 'Messages',
          function ($route, Messages)
          {
            return Messages.query();
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Groups router
     */
    .when('/groups',
    {
      templateUrl: 'dist/views/groups.html',
      controller: 'groups',
      resolve: {
        data: [
          'Groups',
          function (Groups)
          {
            return Groups.query();
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Profile (user specific) router
     */
    .when('/profile/:userId',
    {
      templateUrl: 'dist/views/profile.html',
      controller: 'profile',
      resolve: {
        data: [
          '$rootScope', 'Profile', '$route', '$location',
          function ($rootScope, Profile, $route, $location)
          {
            if ($route.current.params.userId != $rootScope.app.resources.uuid)
            {
              // IE route fix
              var onejan = new Date(new Date().getFullYear(),0,1);

              // var periods = Dater.getPeriods(),
              var periods = angular.fromJson(localStorage.getItem('WebPaige.periods')),
                  // current = Dater.current.week(),
                  // current = new Date().getWeek(),
                  current = Math.ceil((((new Date() - onejan) / 86400000) + onejan.getDay()+1)/7);

              // console.log('---->', current);

              var ranges  = {
                    start:  periods.weeks[current].first.timeStamp / 1000,
                    end:    periods.weeks[current].last.timeStamp / 1000
                  };

              return Profile.getWithSlots($route.current.params.userId, false, ranges);
            }
            else
            {
              return Profile.get($route.current.params.userId, false);
            }
          }
        ]
      },
      reloadOnSearch: false
    })


    /**
     * Profile (user hiself) router
     */
    .when('/profile',
    {
      templateUrl: 'dist/views/profile.html',
      controller: 'profile',
      resolve: {
        data: [
          '$rootScope', '$route', '$location',
          function ($rootScope, $route, $location)
          {
            if (!$route.current.params.userId || !$location.hash())
              $location.path('/profile/' + $rootScope.app.resources.uuid).hash('profile');
          }
        ]
      }
    })


    /**
     * Settings router
     */
    .when('/settings',
    {
      templateUrl: 'dist/views/settings.html',
      controller: 'settings',
      resolve: {
        data: [
          'Settings',
          function (Settings)
          {
            return angular.fromJson(Settings.get());
          }
        ]
      }
    })


    /**
     * Help router
     */
    .when('/help',
    {
      templateUrl: 'dist/views/help.html',
      controller: 'help'
    })


    /**
     * Router fallback
     */
    .otherwise({
      redirectTo: '/login'
    });


    /**
     * Define interceptor
     */
    $httpProvider.responseInterceptors.push('Interceptor');
  }
]);