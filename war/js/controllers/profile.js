/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Profile', [])


/**
 * Profile controller
 */
.controller('profile', 
[
	'$rootScope', '$scope', '$q', '$location', '$window', '$route', 'data', 'Profile', 'Storage', 'Groups', 'Dater', 'MD5', 
	function ($rootScope, $scope, $q, $location, $window, $route, data, Profile, Storage, Groups, Dater, MD5) 
	{
	  /**
	   * Fix styles
	   */
	  $rootScope.fixStyles();


	  /**
	   * Pass the self
	   */
		$scope.self = this;


		// console.warn('data ->', data);


	  /**
	   * Pass periods
	   */
	  $scope.periods = Dater.getPeriods();


	  /**
	   * Pass current
	   */
	  $scope.current = {
      day:    Date.today().getDayOfYear() + 1,
      week:   new Date().getWeek(),
      month:  new Date().getMonth() + 1
    };


	  /**
	   * Set data for view
	   */
	  if (data.slots) 
	  	data.user = data.slots.data;


	  /**
	   * PAss data container
	   */
	  $scope.data = data;


	  /**
	   * Pass profile information
	   */
	  $scope.profilemeta = data.resources;


	  /**
	   * Get groups of user
	   */
	  $scope.groups = Groups.getMemberGroups($route.current.params.userId);


	  /**
	   * Default values for passwords
	   */
	  $scope.passwords = {
	    current: 	'',
	    new1: 		'',
	    new2: 		''
	  };


	  /**
	   * Default form views
	   */
	  $scope.forms = {
	    add:  false,
	    edit: false
	  };


	  /**
	   * Slot form toggler
	   */
	  $scope.toggleSlotForm = function ()
	  {
	    if ($scope.forms.add)
	    {
	      $scope.resetInlineForms();
	    }
	    else
	    {
	      $scope.slot = {};

	      $scope.slot = {
	        start: {
	          date: new Date().toString($rootScope.config.formats.date),
	          time: new Date().toString($rootScope.config.formats.time),
	          datetime: new Date().toISOString()
	        },
	        end: {
	          date: new Date().toString($rootScope.config.formats.date),
	          time: new Date().addHours(1).toString($rootScope.config.formats.time),
	          datetime: new Date().toISOString()
	        },
	        state:      '',
	        recursive:  false,
	        id:         ''
	      };

	      $scope.forms = {
	        add: 	true,
	        edit: false
	      };
	    }
	  };


	  /**
	   * Reset inline forms
	   */
	  $scope.resetInlineForms = function ()
	  {
	    $scope.slot = {};

	    $scope.original = {};

	    $scope.forms = {
	      add:  false,
	      edit: false
	    };
	  };


	  /**
	   * Extract view action from url and set view
	   */
	  setView($location.hash());


	  /**
	   * View setter
	   */
	  function setView (hash)
	  {
	    $scope.views = {
	      profile:  false,
	      edit:     false,
	      password: false,
	      timeline: false
	    };

	    $scope.views[hash] = true;

	    $scope.views.user = ($rootScope.app.resources.uuid == $route.current.params.userId) ? true : false;
	  }


	  /**
	   * Switch between the views and set hash ccordingly
	   */
	  $scope.setViewTo = function (hash)
	  {
	    $scope.$watch($location.hash(), function ()
	    {
	      $location.hash(hash);

	      setView(hash);
	    });
	  };


	  /**
	   * Save user
	   */
	  $scope.save = function (resources)
	  {
	    $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);

	    /**
	     * Convert given other user's password to MD5
	     */
	    if (resources.Password) resources.askPass = MD5(resources.Password);

	    Profile.save($route.current.params.userId, resources)
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error($rootScope.ui.errors.profile.save);
	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

	        var flag = ($route.current.params.userId == $rootScope.app.resources.uuid) ? true : false;

	        Profile.get($route.current.params.userId, flag)
	        .then(function (data)
	        {
	          if (data.error)
	          {
	            $rootScope.notifier.error($rootScope.ui.errors.profile.get);
	            console.warn('error ->', data);
	          }
	          else
	          {
	            $rootScope.notifier.success($rootScope.ui.profile.dataChanged);

	            $scope.data = data;

	            $rootScope.statusBar.off();
	          };
	        });
	      };
	    });

	  };


	  /**
	   * Change passwords
	   */
	  $scope.change = function (passwords)
	  {
	    if (passwords.new1 == '' || passwords.new2 == '')
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.pleaseFill, true);

	      return false;
	    };

	    if (passwords.new1 != passwords.new2)
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.passNotMatch, true);

	      return false;
	    }
	    else if ($rootScope.app.resources.askPass == MD5(passwords.current))
	    {
	      $rootScope.statusBar.display($rootScope.ui.profile.changingPass);

	      Profile.changePassword(passwords)
	      .then(function (result)
	      {
	        if (result.error)
	        {
	          $rootScope.notifier.error($rootScope.ui.errors.profile.changePassword);
	          console.warn('error ->', result);
	        }
	        else
	        {
	          $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

	          Profile.get($rootScope.app.resources.uuid, true)
	          .then(function (data)
	          {
	            if (data.error)
	            {
	              $rootScope.notifier.error($rootScope.ui.errors.profile.get);
	              console.warn('error ->', data);
	            }
	            else
	            {
	              $rootScope.notifier.success($rootScope.ui.profile.passChanged);

	              $scope.data = data;

	              $rootScope.statusBar.off();
	            };
	          });
	        };
	      });
	    }
	    else
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.passwrong, true);
	    };
	  };
	  

	  /**
	   * Render timeline if hash is timeline
	   */
	  // if ($location.hash() == 'timeline')
	  if ($rootScope.app.resources.uuid != $route.current.params.userId)
	  {
	  	timelinebooter();
	  };



	  /**
     * TODO
     * Is it really needed?
     * Since the timelinebooter is disabled
     *
	   * Redraw timeline
	   */
	  $scope.redraw = function ()
	  {
	  	setTimeout(function ()
	  	{
	  		//timelinebooter();
	  		if($scope.self.timeline)
	  			$scope.self.timeline.redraw();
		     //console.warn('timeline ->', $scope.timeline);
	  	}, 100);
	  	console.log("redraw timeline here??");
		};


	  function timelinebooter ()
	  {
      $scope.timeline = {
      	id: 'userTimeline',
      	main: false,
      	user: {
      		id: $route.current.params.userId
      	},
        current: $scope.current,
        options: {
          start:  new Date($scope.periods.weeks[$scope.current.week].first.day),
          end:    new Date($scope.periods.weeks[$scope.current.week].last.day),
          min:    new Date($scope.periods.weeks[$scope.current.week].first.day),
          max:    new Date($scope.periods.weeks[$scope.current.week].last.day)
        },
        range: {
          start: 	$scope.periods.weeks[$scope.current.week].first.day,
          end: 		$scope.periods.weeks[$scope.current.week].last.day
        },
        config: {
          legenda:    {},
          legendarer: $rootScope.config.timeline.config.legendarer,
          states:     $rootScope.config.timeline.config.states
        }
      };

      var states = {};

      angular.forEach($scope.timeline.config.states, function (state, key) { states[key] = state.label });

      $scope.states = states;

      angular.forEach($rootScope.config.timeline.config.states, function (state, index)
      {
        $scope.timeline.config.legenda[index] = true;
      });


	  /**
	   * Prepeare timeline range for dateranger widget
	   */
	  $scope.daterange =  Dater.readable.date($scope.timeline.range.start) + ' / ' + 
	                      Dater.readable.date($scope.timeline.range.end);

	                      

      $('#timeline').html('');
      $('#timeline').append('<div id="userTimeline"></div>');
	  };

	}
]);