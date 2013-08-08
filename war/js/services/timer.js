'use strict';


angular.module('WebPaige.Services.Timer', ['ngResource'])

/**
 * Timer service
 *
 * Timer.start('timerExample', function () { console.warn('timer started') }, 5);
 * $scope.stopTimer = function () { Timer.stop('timerExample') };
 */
.factory('Timer', 
[
  '$rootScope', '$timeout',
  function ($rootScope, $timeout)
  {
    var initer = 0,
        timers = [];

    var addTimer = function (id, event, delay)
    {
      // console.log('adding a timer ->', id, event, delay);

      timers[id] = {
        event: event, 
        delay: delay, 
        counter: 0
      };

      var onTimeout = function ()
      {
        timers[id].counter++;

        console.log('counting ->', timers[id].counter);

        timers[id].mytimeout = $timeout(onTimeout, delay * 1000);

        if (timers[id].delay == timers[id].counter)
        {
          // console.log('calling timer event');

          // if (id == 'unreadCount')
          // {            
          //   $rootScope.$broadcast('unreadCount');
          // }
          // else
          // {
            timers[id].event.call();
          // }

          timers[id].counter = 0;
        };
      };

      timers[id].mytimeout = $timeout(onTimeout, delay * 1000);  
    };

    var stopTimer = function (id)
    {
      $timeout.cancel(timers[id].mytimeout);
    };

    return {
      start:  addTimer,
      stop:   stopTimer
    };
  }
]);