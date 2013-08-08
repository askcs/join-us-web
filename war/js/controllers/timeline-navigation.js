/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Timeline.Navigation', [])


.controller('timeline-navigation', 
[
	'$rootScope', '$scope', '$window', 
	function ($rootScope, $scope, $window) 
	{
	  /**
	   * Day & Week & Month toggle actions
	   */
	  $scope.timelineScoper = function (period)
	  {
	    $scope.timeline.current.day   = $scope.current.day;
	    $scope.timeline.current.week  = $scope.current.week;
	    $scope.timeline.current.month = $scope.current.month;

	    switch (period)
	    {
	      case 'day':
	        $scope.timeline.scope = {
	          day:    true,
	          week:   false,
	          month:  false
	        };

	        $scope.timeliner.load({
	          start:  $scope.periods.days[$scope.timeline.current.day].first.timeStamp,
	          end:    $scope.periods.days[$scope.timeline.current.day].last.timeStamp,
	        });
	      break;

	      case 'week':
	        $scope.timeline.scope = {
	          day:    false,
	          week:   true,
	          month:  false
	        };

	        $scope.timeliner.load({
	          start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	          end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	        });
	      break;

	      case 'month':
	        $scope.timeline.scope = {
	          day:    false,
	          week:   false,
	          month:  true
	        };

	        $scope.timeliner.load({
	          start:  $scope.periods.months[$scope.timeline.current.month].first.timeStamp,
	          end:    $scope.periods.months[$scope.timeline.current.month].last.timeStamp,
	        });
	      break;
	    };
	  };


	  /**
	   * Go one period in past
	   */
	  $scope.timelineBefore = function (timelineScope)
	  {
	    if ($scope.timeline.scope.day)
	    {
	      if ($scope.timeline.current.day != 1)
	      {
	        $scope.timeline.current.day--;

	        $scope.timeliner.load({
	          start:  $scope.periods.days[$scope.timeline.current.day].first.timeStamp,
	          end:    $scope.periods.days[$scope.timeline.current.day].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.week)
	    {
	      if ($scope.timeline.current.week != 1)
	      {
	        $scope.timeline.current.week--;

	        $scope.timeliner.load({
	          start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	          end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.month)
	    {
	      if ($scope.timeline.current.month != 1)
	      {
	        $scope.timeline.current.month--;

	        $scope.timeliner.load({
	          start:  $scope.periods.months[$scope.timeline.current.month].first.timeStamp,
	          end:    $scope.periods.months[$scope.timeline.current.month].last.timeStamp,
	        });
	      };
	    };
	  };


	  /**
	   * Go one period in future
	   */
	  $scope.timelineAfter = function (timelineScope)
	  {
	    if ($scope.timeline.scope.day)
	    {
	      /**
	       * Total days in a month can change so get it start periods cache
	       */
	      if ($scope.timeline.current.day != $scope.periods.days.total)
	      {
	        $scope.timeline.current.day++;

	        $scope.timeliner.load({
	          start:  $scope.periods.days[$scope.timeline.current.day].first.timeStamp,
	          end:    $scope.periods.days[$scope.timeline.current.day].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.week)
	    {
	      if ($scope.timeline.current.week != 53)
	      {
	        $scope.timeline.current.week++;

	        $scope.timeliner.load({
	          start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	          end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	        });
	      };
	    }
	    else if ($scope.timeline.scope.month)
	    {
	      if ($scope.timeline.current.month != 12)
	      {
	        $scope.timeline.current.month++;

	        $scope.timeliner.load({
	          start:  $scope.periods.months[$scope.timeline.current.month].first.timeStamp,
	          end:    $scope.periods.months[$scope.timeline.current.month].last.timeStamp,
	        });
	      };
	    };
	  };



	  /**
	   * Go to this week
	   */
	  $scope.timelineThisWeek = function ()
	  {
	    if ($scope.timeline.current.week != new Date().getWeek())
	    {
	      $scope.timeliner.load({
	        start:  $scope.periods.weeks[new Date().getWeek()].first.timeStamp,
	        end:    $scope.periods.weeks[new Date().getWeek()].last.timeStamp
	      });

	      $scope.timeline.range = {
	        start:  $scope.periods.weeks[new Date().getWeek()].first.day,
	        end:    $scope.periods.weeks[new Date().getWeek()].last.day
	      };
	    }
	  };


	  /**
	   * Go one week in past
	   */
	  $scope.timelineWeekBefore = function ()
	  {
	    if ($scope.timeline.current.week != 1)
	    {
	      $scope.timeline.current.week--;

	      $scope.timeliner.load({
	        start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	        end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	      });
	    };

	    $scope.timeline.range = {
	      start:  $scope.periods.weeks[$scope.timeline.current.week].first.day,
	      end:    $scope.periods.weeks[$scope.timeline.current.week].last.day
	    };
	  };


	  /**
	   * Go one week in future
	   */
	  $scope.timelineWeekAfter = function ()
	  {
	  	if ($scope.timeline.current.week != 53)
	    {
	      $scope.timeline.current.week++;

	      $scope.timeliner.load({
	        start:  $scope.periods.weeks[$scope.timeline.current.week].first.timeStamp,
	        end:    $scope.periods.weeks[$scope.timeline.current.week].last.timeStamp,
	      });
	    };

	  	$scope.timeline.range = {
	      start:  $scope.periods.weeks[$scope.timeline.current.week].first.day,
	      end:    $scope.periods.weeks[$scope.timeline.current.week].last.day
	    };
	  };


	  /**
	   * Timeline zoom in
	   */
	  $scope.timelineZoomIn = function ()
	  {
		  $scope.self.timeline.zoom($rootScope.config.timeline.config.zoom, Date.now());
		};


	  /**
	   * Timeline zoom out
	   */
	  $scope.timelineZoomOut = function ()
	  {
		  $scope.self.timeline.zoom(-$rootScope.config.timeline.config.zoom, Date.now());
		};


	  /**
	   * Redraw timeline on window resize
	   */
	  $window.onresize = function ()
	  {
		  $scope.self.timeline.redraw();
		};
		
		$scope.fullWidth = function ()
		{
			$scope.self.timeline.redraw();
		}
	}
]);