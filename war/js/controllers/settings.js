/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Settings', [])


/**
 * Settings controller
 */
.controller('settings', 
[
	'$rootScope', '$scope', '$window', 'data', 'Settings', 'Profile', 'Storage', 
	function ($rootScope, $scope, $window, data, Settings, Profile, Storage) 
	{
		/**
		 * Fix styles
		 */
		$rootScope.fixStyles();


	  /**
	   * Pass the settings
	   */
	  $scope.settings = angular.fromJson(data);


	  /**
	   * User settings: Languages
	   */
	  var languages = {};

	  angular.forEach(ui, function (lang, index) { languages[lang.meta.name] = lang.meta.label; });

	  $scope.languages = languages;


	  /**
	   * Pass the groups
	   */
	   var groups = {};

	   angular.forEach(Storage.local.groups(), function (group, index)
	   {
	     groups[group.uuid] = group.name;
	   });

	   $scope.groups = groups;


	  /**
	   * Save user settings
	   */
	  $scope.save = function (settings)
	  {
	    $rootScope.statusBar.display($rootScope.ui.settings.saving);

	    Settings.save($rootScope.app.resources.uuid, settings)
	    .then(function (saved)
	    {
	      $rootScope.notifier.success($rootScope.ui.settings.saved);

	      $rootScope.statusBar.display($rootScope.ui.settings.refreshing);

	      Profile.get($rootScope.app.resources.uuid, true)
	      .then(function (result)
	      {
	        if (result.error)
	        {
	          $rootScope.notifier.error($rootScope.ui.errors.settings.save);
	          console.warn('error ->', result);
	        }
	        else
	        {
	          $scope.settings = angular.fromJson(result.resources.settingsWebPaige);

	          $rootScope.changeLanguage(angular.fromJson(result.resources.settingsWebPaige).user.language);

	          $rootScope.statusBar.off();
	        };
	      })
	    });
	  };


	  /**
	   * Google authorization
	   */
	  $scope.authGoogle = function ()
	  {               
	    window.location = 'http://3rc2.ask-services.appspot.com/auth/google' + 
	                      '?agentUrl=http://3rc2.ask-services.appspot.com/eveagents/personalagent/' + 
	                      $rootScope.app.resources.uuid + 
	                      '/' + 
	                      '&agentMethod=createGoogleAgents' +
	                      '&applicationCallback=' + 
	                      location.protocol + "//" + location.hostname + (location.port && ":" + location.port) + 
	                      '/index.html' + 
	                      /**
	                       * Fix a return value
	                       */
	                      '?account=' +
	                      $rootScope.app.resources.uuid +
	                      encodeURIComponent('#') + 
	                      '/settings';
	  };

	}
]);