/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Planboard', [])


.controller('planboard', 
[
	'$rootScope', '$scope', '$q', '$window', '$location', 'data', 'Slots', 'Dater', 'Storage',
	function ($rootScope, $scope, $q, $window, $location, data, Slots, Dater, Storage)
	{
	  /**
	   * Fix styles
	   */
		$rootScope.fixStyles();


	  /**
	   * Pass the self
	   */
		$scope.self = this;


	  /**
	   * Pass time slots data
	   */
	  $scope.data = data;

	  
	  /**
	   * Get groups and settings
	   */
	  var groups  	= Storage.local.groups(),
	      settings 	= Storage.local.settings();


	  /**
	   * Pass current
	   */
	  $scope.current = {
      layouts: {
        user:     true,
        group:    true,
        members:  false
      },
      /**
       * Fix for timeline scoper to day
       */
      day:      Dater.current.today() + 1,
      week:     Dater.current.week(),
      month:    Dater.current.month(),
      group:    settings.app.group,
      division: 'all'
    };


	  /**
	   * Pass periods
	   */
	  $scope.periods = Dater.getPeriods();


	  /**
	   * Reset and init slot container which
	   * is used for adding or changing slots
	   */
	  $scope.slot = {};


	  /**
	   * Set defaults for timeline
	   */
	  $scope.timeline = {
	  	id: 'mainTimeline',
	  	main: true,
	  	user: {
	  		id: 	$rootScope.app.resources.uuid,
	  		role: $rootScope.app.resources.role
	  	},
	    current: $scope.current,
	    /**
	     * Initial start up is next 7 days
	     */
	    options: {
        start:  $scope.periods.days[Dater.current.today()].last.day,
        end:    $scope.periods.days[Dater.current.today() + 7].last.day,
        min:  	$scope.periods.days[Dater.current.today()].last.day,
        max:    $scope.periods.days[Dater.current.today() + 7].last.day
	    },
	    range: {
        start:  $scope.periods.days[Dater.current.today()].last.day,
        end:    $scope.periods.days[Dater.current.today() + 7].last.day
	    },
	    scope: {
	      day:    false,
	      week:   true,
	      month:  false
	    },
	    config: {
	      bar:        $rootScope.config.timeline.config.bar,
	      layouts:    $rootScope.config.timeline.config.layouts,
	      wishes:     $rootScope.config.timeline.config.wishes,
	      legenda:    {},
	      legendarer: $rootScope.config.timeline.config.legendarer,
	      states:     $rootScope.config.timeline.config.states,
	      divisions:  $rootScope.config.timeline.config.divisions,
	      densities:  $rootScope.config.timeline.config.densities
	    }
	  };
	  

	  /**
	   * IE8 fix for inability of - signs in date object
	   */
	  if ($.browser.msie && $.browser.version == '8.0')
	  {
	  	$scope.timeline.options = {
        start:  $scope.periods.days[Dater.current.today()].last.timeStamp,
        end:    $scope.periods.days[Dater.current.today() + 7].last.timeStamp,
        min:    $scope.periods.days[Dater.current.today()].last.timeStamp,
        max:    $scope.periods.days[Dater.current.today() + 7].last.timeStamp
	    };
	  }


	  /**
	   * Legenda defaults
	   */
	  angular.forEach($rootScope.config.timeline.config.states, function (state, index)
	  {
	    $scope.timeline.config.legenda[index] = true;
	  });


	  /**
	   * Timeline group legenda default configuration
	   */
	  $scope.timeline.config.legenda.groups = {
	    more: true,
	    even: true,
	    less: true
	  };


	  /**
	   * Prepeare timeline range for dateranger widget
	   */
	  $scope.daterange =  Dater.readable.date($scope.timeline.range.start) +
                        ' / ' +
	                      Dater.readable.date($scope.timeline.range.end);


	  /**
	   * States for dropdown
	   */
	  var states = {};

	  angular.forEach($scope.timeline.config.states, function (state, key)
    {
      // show only user editable states
      if (state.display)
        states[key] = state.label;
    });

	  $scope.states = states;


	  /**
	   * Groups for dropdown
	   */
	  $scope.groups = groups;


	  /**
	   * Groups for dropdown
	   */
	  $scope.divisions = $scope.timeline.config.divisions;


	  /**
	   * Reset views for default views
	   */
	  $scope.resetViews = function ()
	  {
	    $scope.views = {
	      slot: {
	        add:  false,
	        edit: false
	      },
	      group:  false,
	      wish:   false,
	      member: false
	    };
	  };

	  $scope.resetViews();


	  /**
	   * Reset planboard views
	   */
	  $rootScope.$on('resetPlanboardViews', function () 
	  {
	  	$scope.resetViews();
	  });


	  /**
	   * Slot form toggler
	   */
	  $scope.toggleSlotForm = function ()
	  {
	    if ($scope.views.slot.add)
	    {
	    	$rootScope.planboardSync.start();

	      $scope.resetInlineForms();
	    }
	    else
	    {
	    	$rootScope.planboardSync.clear();

	    	/**
	    	 * Broadcast for slot initials
	    	 */
	    	$rootScope.$broadcast('slotInitials');

	      $scope.resetViews();

	      $scope.views.slot.add = true;
	    }
	  };


	  /**
	   * Reset inline forms
	   */
	  $scope.resetInlineForms = function ()
	  {
	    $scope.slot = {};

	    $scope.original = {};

	    $scope.resetViews();
	  };


	  /**
	   * Send shortage message
	   */
	  $scope.sendShortageMessage = function (slot)
	  {
	    $rootScope.statusBar.display($rootScope.ui.planboard.preCompilingStortageMessage);

	    Storage.session.add('escalation', angular.toJson({
	      group: slot.group,
	      start: {
	        date: slot.start.date,
	        time: slot.start.time
	      },
	      end: {
	        date: slot.end.date,
	        time: slot.end.time
	      },
	      diff: slot.diff
	    }));

	    $location.path('/messages').search({ escalate: true }).hash('compose');
	  };



	  /**
	   * DEPRECIATED
	   * 
	   * Not used probably?
	   */
	  // $scope.modifySlot = function (slot)
	  // {
	  // 	console.log('changing state ->', slot);
	  // }

	}
]);