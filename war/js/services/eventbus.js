'use strict';


angular.module('WebPaige.Services.EventBus', ['ngResource'])


/**
 * EventBus Service
 */
.factory('EventBus', 
[
  '$rootScope', 
  function ($rootScope)
  {
    var self      = this,
        listeners = {},
        history   = {};
   
    self.emit = function (eventName) 
    {
      var args = Array.prototype.slice.call(arguments, 1);

      angular.forEach(listeners, function(fns, eventName) 
      {
        angular.forEach(fns, function(fn, key)
        {
          if (!args.length)
          {
            $rootScope.$emit(eventName, fn());
          }
          else
          {
            $rootScope.$emit(eventName, fn(args));
          };
        });
      });
    };
   
    self.on = function (eventName, fn) 
    {
      if (!(listeners[eventName] instanceof Array)) listeners[eventName] = [];

      listeners[eventName].push(fn);

      $rootScope.$on(listeners[eventName], fn);
    };
   
    self.remove = function (eventName, fn) 
    {
      var lsnrs = listeners[eventName],
          ind   = lsnrs instanceof Array ? lsnrs.indexOf(fn) : -1;

      if (ind > -1) listeners[eventName].splice(ind,1);
    };
   
    self.removeAll = function (eventName) 
    {
      if (eventName)
      {
        listeners[eventName] = [];
      }
      else
      {
        listeners = {};
      }
    };
  }
]);