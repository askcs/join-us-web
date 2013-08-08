/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Help', [])


/**
 * Help controller
 */
.controller('help',
[
	'$rootScope', '$scope', '$location',
	function ($rootScope, $scope, $location)
	{
		/**
		 * Fix styles
		 */
		$rootScope.fixStyles();


	  /**
	   * View setter
	   */
	  function setView (hash)
	  {
	    $scope.views = {
	      dashboard:false,
	      planboard:false,
	      messages: false,
	      groups:  	false,
	      profile:  false,
	      settings: false,
	      support: 	false
	    };

	    $scope.views[hash] = true;
	  };


	  /**
	   * Switch between the views and set hash accordingly
	   */
	  $scope.setViewTo = function (hash)
	  {
	    $scope.$watch(hash, function ()
	    {
	      $location.hash(hash);

	      setView(hash);
	    });
	  };


	  /**
	   * If no params or hashes given in url
	   */
	  if (!$location.hash())
	  {
	    var view = 'dashboard';

	    $location.hash('dashboard');
	  }
	  else
	  {
	    var view = $location.hash();
	  }


	  /**
	   * Set view
	   */
	  setView(view);
	}
]);