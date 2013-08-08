'use strict';


angular.module('WebPaige.Services.Interceptor', ['ngResource'])


/**
 * TODO
 * Implement a call registering system with general error handling
 * 
 * Intercepts *all* angular ajax http calls
 */
.factory('Interceptor', 
[
  '$q', '$location', 
  function ($q, $location)
  {
    return function (promise)
    {
      return promise.then(
      /**
       * Succeded
       */
      function (response) 
      {
        // console.log('call ->', arguments[0].config.url, 'method ->', arguments[0].config.method, arguments);
        return response;
      },
      /**
       * Failed
       */
      function (response) 
      {
        /**
         * TODO
         * Possible bug !
         */
        // if (response.status == 403)
        // {
        //   alert("Session timeout , please re-login");
        //   $location.path("/login");
        // };

        return $q.reject(response);
      });
    }
  }
]);