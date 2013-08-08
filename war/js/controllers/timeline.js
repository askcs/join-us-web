/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Timeline', [])


.controller('timeline',
[
	'$rootScope', '$scope', '$q', '$location', '$route', '$window', 'Slots', 'Dater', 'Storage', 'Sloter', 'Profile',
	function ($rootScope, $scope, $q, $location, $route, $window, Slots, Dater, Storage, Sloter, Profile)
	{
		var range, diff;


		/**
		 * Watch for changes in timeline range
		 */
		$scope.$watch(function ()
		{
			/**
			 * If main timeline
			 */
			if ($scope.timeline && $scope.timeline.main)
			{
				range = $scope.self.timeline.getVisibleChartRange();

				diff  = Dater.calculate.diff(range);

				/**
				 * Scope is a day
				 * 
				 * TODO
				 * try later on!
				 * new Date(range.start).toString('d') == new Date(range.end).toString('d')
				 */
				if (diff <= 86400000)
				{
					$scope.timeline.scope = {
						day:    true,
						week:   false,
						month:  false
					};
				}
				/**
				 * Scope is less than a week
				 */
				else if (diff < 604800000)
				{
					$scope.timeline.scope = {
						day:    false,
						week:   true,
						month:  false
					};
				}
				/**
				 * Scope is more than a week
				 */
				else if (diff > 604800000)
				{
					$scope.timeline.scope = {
						day:    false,
						week:   false,
						month:  true
					};
				}

				$scope.timeline.range = {
					start:  new Date(range.start).toString(),
					end:    new Date(range.end).toString()
				};

				$scope.daterange =  Dater.readable.date($scope.timeline.range.start) +
														' / ' +
														Dater.readable.date($scope.timeline.range.end);
			}
			/**
			 * User timeline
			 * Allow only if it is not user
			 */
			else if ($route.current.params.userId != $rootScope.app.resources.uuid)
			{
				if ($scope.self.timeline)
				{
					range = $scope.self.timeline.getVisibleChartRange();

					$scope.timeline.range = {
						start:  new Date(range.start).toString(),
						end:    new Date(range.end).toString()
					};
				}
			}
		});

	  /**
	   * Timeliner listener
	   */
	  $rootScope.$on('slotInitials', function () 
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
        state:      'com.ask-cs.State.Available',
        recursive:  false,
        id:         ''
      };
	  });


	  /**
	   * Timeline (The big boy)
	   */
	  $scope.timeliner = {

	    /**
	     * Init timeline
	     */
	    init: function ()
	    {
	      $scope.self.timeline = new links.Timeline(document.getElementById($scope.timeline.id));

	      links.events.addListener($scope.self.timeline, 'rangechanged',  this.getRange);
	      links.events.addListener($scope.self.timeline, 'add',           this.onAdd);
	      links.events.addListener($scope.self.timeline, 'delete',        this.onRemove);
	      links.events.addListener($scope.self.timeline, 'change',        this.onChange);
	      links.events.addListener($scope.self.timeline, 'select',        this.onSelect);

	      this.render($scope.timeline.options);      
	    },

	    getRange: function () { $scope.timelineGetRange() },

	    onAdd: 		function () { $scope.timelineOnAdd() },

	    onRemove: function () { $scope.timelineOnRemove() },

	    onChange: function () { $scope.timelineChanging() },

	    onSelect: function () { $scope.timelineOnSelect() },

	    /**
	     * (Re-)Render timeline
	     */
	    render: function (options, remember)
	    {
	    	/**
	    	 * Hotfix for not converted Date objects initally given by timeline
	    	 */
	    	if (typeof $scope.timeline.range.start != Date) $scope.timeline.range.start = new Date($scope.timeline.range.start);
	    	if (typeof $scope.timeline.range.end != Date) $scope.timeline.range.end = new Date($scope.timeline.range.end);

	    	$scope.timeline = {
	      	id: 			$scope.timeline.id,
	      	main: 		$scope.timeline.main,
	      	user: 		$scope.timeline.user,
	        current:  $scope.timeline.current,
	        scope: 		$scope.timeline.scope,
	        config:   $scope.timeline.config,
	        options: {
	          start:  (remember) ? $scope.timeline.range.start : new Date(options.start),
	          end:    (remember) ? $scope.timeline.range.end : new Date(options.end),
	          min:    new Date(options.start),
	          max:    new Date(options.end)
	        }
	      };

			  /**
			   * IE8 fix for inability of - signs in date object
			   */
			  if ($.browser.msie && $.browser.version == '8.0')
			  {
			  	$scope.timeline.options.start = new Date(options.start);
			  	$scope.timeline.options.end 	= new Date(options.end);
			  }

	      angular.extend($scope.timeline.options, $rootScope.config.timeline.options);

	      if ($scope.timeline.main)
	      {
		      $scope.self.timeline.draw(
		        Sloter.process(
		          $scope.data,
		          $scope.timeline.config,
		          $scope.divisions,
		          $scope.timeline.user.role
		        ),
		        $scope.timeline.options
		      );
		    }
		    else
		    {
		    	var timeout = ($location.hash() == 'timeline') ? 100 : 2000;

		    	

          $rootScope.timelineLoaded = false;

			    setTimeout( function () 
		      {
		      	console.log('komt hier');


            $rootScope.timelineLoaded = true;
            $rootScope.$apply();

		        $scope.self.timeline.draw(
		          Sloter.profile(
		            $scope.data.slots.data, 
		            $scope.timeline.config
		          ), $scope.timeline.options);
		      }, timeout);
		    };

	      $scope.self.timeline.setVisibleChartRange($scope.timeline.options.start, $scope.timeline.options.end);
	      
	    },

	    /**
	     * Grab new timeline data from backend and render timeline again
	     */
	    load: function (stamps, remember)
	    {
	      var _this = this;

	      $rootScope.statusBar.display($rootScope.ui.planboard.refreshTimeline);

	      if ($scope.timeline.main)
	      {
		      Slots.all({
		        groupId:  $scope.timeline.current.group,
		        division: $scope.timeline.current.division,
		        layouts:  $scope.timeline.current.layouts,
		        month:    $scope.timeline.current.month,
		        stamps:   stamps
		      })
		      .then(function (data)
		      {
		        if (data.error)
		        {
		          $rootScope.notifier.error($rootScope.ui.errors.timeline.query);
		          console.warn('error ->', data);
		        }
		        else
		        {
		          $scope.data = data;

		          _this.render(stamps, remember);
		        };

		        $rootScope.statusBar.off();

		        if ($scope.timeline.config.wishes) getWishes();
		      });
		    }
	      else
	      {
	      	Profile.getSlots($scope.timeline.user.id, stamps)
		      .then(function (data)
		      {
		        if (data.error)
		        {
		          $rootScope.notifier.error($rootScope.ui.errors.timeline.query);
		          console.warn('error ->', data);
		        }
		        else
		        {
			      	data.user 	= data.slots.data;

			        $scope.data = data;

			        _this.render(stamps, remember);

			        $rootScope.statusBar.off();
		        };
		      });
		    };

	    },

	    /**
	     * Refresh timeline as it is
	     */
	    refresh: function ()
	    {
	      $scope.slot = {};

	      if ($scope.timeline.main)
	      {
	      	$rootScope.$broadcast('resetPlanboardViews');
	      }
	      else
	      {
		      $scope.forms = {
		        add:  true,
		        edit: false
		      };
		    }

	      this.load({
	        start:  $scope.data.periods.start,
	        end:    $scope.data.periods.end
	      }, true);
	    },

	    /**
	     * Redraw timeline
	     */
	    redraw: function ()
	    {
	      $scope.self.timeline.redraw();
	    },

	    isAdded: function ()
	    {
	    	// return $('.timeline-event-content')
	     //            .contents()
	     //            .filter(function ()
	     //            { 
	     //              return this.nodeValue == 'New' 
	     //            }).length;
	    	return $('.state-new').length;
	    },

	    /**
	     * Cancel add
	     */
	    cancelAdd: function ()
	    {
	      $scope.self.timeline.cancelAdd();
		  }
	  };
	 

	  /**
	   * Init timeline
	   */
	  if ($scope.timeline) $scope.timeliner.init();


	  /**
	   * Timeliner listener
	   */
	  $rootScope.$on('timeliner', function () 
	  {
	    $scope.timeliner.load({
	      start:  new Date(arguments[1].start).getTime(),
	      end:    new Date(arguments[1].end).getTime()
	    });
	  });


	  /**
	   * Handle new requests for timeline
	   */
	  $scope.requestTimeline = function (section)
	  {
	    switch (section)
	    {
	      case 'group':
	        $scope.timeline.current.layouts.group = !$scope.timeline.current.layouts.group;

	        if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
	          $scope.timeline.current.layouts.members = false;
	      break;

	      case 'members':
	        $scope.timeline.current.layouts.members = !$scope.timeline.current.layouts.members;

	        if ($scope.timeline.current.layouts.members && !$scope.timeline.current.layouts.group)
	          $scope.timeline.current.layouts.group = true;
	      break;
	    }

	    $scope.timeliner.load({
	      start:  $scope.data.periods.start,
	      end:    $scope.data.periods.end
	    });
	  };


	  /**
	   * Timeline get ranges
	   */
	  $scope.timelineGetRange = function ()
	  {
	    var range = $scope.self.timeline.getVisibleChartRange();

	    $scope.$apply(function ()
	    {
	      $scope.timeline.range = {
	        start:  new Date(range.from).toString(),
	        end:    new Date(range.till).toString()
	      };

	      if ($scope.timeline.main)
	      {
		      $scope.daterange = {
		        start:  Dater.readable.date(new Date(range.start).getTime()),
		        end:    Dater.readable.date(new Date(range.end).getTime())
		      };
	      };

	    });
	  };


	  /**
	   * Get information of the selected slot
	   */
	  $scope.selectedSlot = function ()
	  {
	    var selection;

	    // if ($scope.mode == 'edit')
	    // {
	    // 	console.log('in edit mode');
	    // }
	    // else
	    // {
	    // 	console.log('not in editing mode');
	    // }

	    /**
	     * TODO
	     * 
	     * Not working!!
	     */
	    // $scope.self.timeline.cancelAdd();

	    if ($scope.timeliner.isAdded() > 0)
	    {
	    	// console.log('there is one newly added slot');
	      // $scope.self.timeline.prototype.cancelAdd();
	      // links.Timeline.prototype.cancelAdd();
	      // $scope.self.timeline.applyAdd = false;
	      // $scope.resetInlineForms();
	    }

	    if (selection = $scope.self.timeline.getSelection()[0])
	    {
	      var values  = $scope.self.timeline.getItem(selection.row),
	          content = angular.fromJson(values.content.match(/<span class="secret">(.*)<\/span>/)[1]) || null;

	      $scope.original = {
	        start:        values.start,
	        end:          values.end,
	        content: {
	          recursive:  content.recursive,
	          state:      content.state
	          // ,
	          // id:         content.id
	        }
	      };

	      if ($scope.timeline.main)
	      {
	      	$rootScope.$broadcast('resetPlanboardViews');
		    }
		    else
		    {
		      /**
		       * TODO
		       * Convert to resetview?
		       */
		      $scope.forms = {
		        add:  false,
		        edit: true
		      };
		    };

	      if (content.type)
	      {
	      	if ($scope.timeline.main)
	      	{
			      switch (content.type)
			      {
			        case 'slot': 		$scope.views.slot.edit 	= true; 	break;
			        case 'group': 	$scope.views.group 			= true; 	break;
			        case 'wish': 		$scope.views.wish 			= true; 	break;
			        case 'member': 	$scope.views.member 		= true; 	break;
			      };
	      	};

		      $scope.slot = {
		        start: {
		          date: new Date(values.start).toString($rootScope.config.formats.date),
		          time: new Date(values.start).toString($rootScope.config.formats.time),
		          datetime: new Date(values.start).toISOString()
		        },
		        end: {
		          date: new Date(values.end).toString($rootScope.config.formats.date),
		          time: new Date(values.end).toString($rootScope.config.formats.time),
		          datetime: new Date(values.end).toISOString()
		        },
		        state:      content.state,
		        recursive:  content.recursive,
		        id:         content.id
		      };

		      /**
		       * TODO
		       * Check if this can be combined with switch later on!
		       * Set extra data based slot type for inline form
		       */
		      if ($scope.timeline.main)
		      {
			      switch (content.type)
			      {
			        case 'group':
			          $scope.slot.diff  = content.diff;
			          $scope.slot.group = content.group;
			        break;

			        case 'wish':
			          $scope.slot.wish    = content.wish;
			          $scope.slot.group   = content.group;
			          $scope.slot.groupId = content.groupId;
			        break;

			        case 'member':
			          $scope.slot.member = content.mid;
			        break;
			      };
		      };
	      };

	      return values;
	    };
	  };


	  /**
	   * Timeline on select
	   */
	  $scope.timelineOnSelect = function ()
	  {
		  $rootScope.planboardSync.clear();

	    $scope.$apply(function ()
	    {
	      $scope.selectedOriginal = $scope.selectedSlot();
	    });
	  };


	  /**
	   * Prevent re-rendering issues with timeline
	   */
	  $scope.destroy = {
	    timeline: function ()
	    {
	      // Not working !! :(
	      // Sloter.pies($scope.data);
	    },
	    statistics: function ()
	    {
	      setTimeout(function ()
	      {
	        $scope.timeliner.redraw();
	      }, 10);
	    }
	  };


	  /**
	   * Group aggs barCharts toggler
	   */
	  $scope.barCharts = function ()
	  {
	    $scope.timeline.config.bar = !$scope.timeline.config.bar;

	    $scope.timeliner.render({
	      start:  $scope.timeline.range.start,
	      end:    $scope.timeline.range.end
	    });
	  };
	  

	  /**
	   * Group wishes toggler
	   */
	  $scope.groupWishes = function ()
	  {
	    if ($scope.timeline.config.wishes)
	    {
	    	$scope.timeline.config.wishes = false;

	  		delete $scope.data.aggs.wishes;

	  		$scope.timeliner.render({
	        start:  	$scope.timeline.range.start,
	        end:    	$scope.timeline.range.end
		    }, true);
	    }
	    else
	    {
	    	$scope.timeline.config.wishes = true;

	    	getWishes();
	    }
	  };


	  /**
	   * Get wishes
	   */
	  function getWishes ()
	  {
    	$rootScope.statusBar.display($rootScope.ui.message.getWishes);

	    Slots.wishes({
	    	id:  			$scope.timeline.current.group,
        start:  	$scope.data.periods.start / 1000,
        end:    	$scope.data.periods.end / 1000
	    }).then(function (wishes)
	  	{
	  		$rootScope.statusBar.off();

	  		$scope.data.aggs.wishes = wishes;

	  		$scope.timeliner.render({
	        start:  	$scope.timeline.range.start,
	        end:    	$scope.timeline.range.end
		    }, true);
	  	});
	  }
	  

	  /**
	   * Timeline legenda toggler
	   */
	  $scope.showLegenda = function ()
	  {
		  $scope.timeline.config.legendarer = !$scope.timeline.config.legendarer;
		};


	  /**
	   * Alter legenda settings
	   */
	  $scope.alterLegenda = function (legenda)
	  {
	    $scope.timeline.config.legenda = legenda;

	    $scope.timeliner.render({
	      start:  $scope.timeline.range.start,
	      end:    $scope.timeline.range.end
	    });
	  };


	  /**
	   * Add slot trigger start view
	   */
	  $scope.timelineOnAdd = function (form, slot)
	  {
	  	$rootScope.planboardSync.clear();

	  	/**
	  	 * Make view for new slot
	  	 */
	  	if (!form)
	  	{
	  		var values = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row);

		    if ($scope.timeliner.isAdded() > 1) $scope.self.timeline.cancelAdd();

		    $scope.$apply(function ()
		    {
		    	if ($scope.timeline.main)
		    	{
			      $rootScope.$broadcast('resetPlanboardViews');

			      $scope.views.slot.add = true;
		    	}
		    	else
		    	{
			      $scope.forms = {
			        add:  true,
			        edit: false
			      };
			    };

		      $scope.slot = {
		        start: {
		          date: new Date(values.start).toString($rootScope.config.formats.date),
		          time: new Date(values.start).toString($rootScope.config.formats.time),
		          datetime: new Date(values.start).toISOString()
		        },
		        end: {
		          date: new Date(values.end).toString($rootScope.config.formats.date),
		          time: new Date(values.end).toString($rootScope.config.formats.time),
		          datetime: new Date(values.end).toISOString()
		        },
		        recursive: (values.group.match(/recursive/)) ? true : false,
		        /**
		         * INFO
		         * First state is hard-coded
		         * Maybe use the first one from array later on?
		         */
		        state: 'com.ask-cs.State.Available'
		      };
		    });
	  	}
	  	/**
	  	 * Add new slot
	  	 */
	  	else
	  	{
	  		var now     = Date.now().getTime(),
		        values  = {
		                    start:      ($rootScope.browser.mobile) ? 
		                                  new Date(slot.start.datetime).getTime() / 1000 :
		                                  Dater.convert.absolute(slot.start.date, slot.start.time, true),
		                    end:        ($rootScope.browser.mobile) ? 
		                                  new Date(slot.end.datetime).getTime() / 1000 : 
		                                  Dater.convert.absolute(slot.end.date, slot.end.time, true),
		                    recursive:  (slot.recursive) ? true : false,
		                    text:       slot.state
		                  };

		    /**
		     * Two minutes waiting time to take an action
		     */
		    if ((values.start * 1000) + 60000 * 2 < now && values.recursive == false)
		    {
		      $rootScope.notifier.error($rootScope.ui.errors.timeline.pastAdding);

		      $scope.timeliner.refresh();
		    }
		    else
		    {
		      $rootScope.statusBar.display($rootScope.ui.planboard.addTimeSlot);

		      Slots.add(values, $scope.timeline.user.id)
		      .then(
		        function (result)
		        {
		        	$rootScope.$broadcast('resetPlanboardViews');

		          if (result.error)
		          {
		            $rootScope.notifier.error($rootScope.ui.errors.timeline.add);
		            console.warn('error ->', result);
		          }
		          else
		          {
		            $rootScope.notifier.success($rootScope.ui.planboard.slotAdded);
		          };

		          $scope.timeliner.refresh();

		          $rootScope.planboardSync.start();
		        }
		      );

		    };
	  	}
	  };


	  /**
	   * Timeline on change
	   */
	  $scope.timelineChanging = function ()
	  {
	  	$rootScope.planboardSync.clear();

      var values  = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row),
          options = {
            start:    values.start,
            end:      values.end,
            content:  angular.fromJson(values.content.match(/<span class="secret">(.*)<\/span>/)[1])
          };

      $scope.$apply(function ()
    	{    		
	      $scope.slot = {
	        start: {
	          date: 		new Date(values.start).toString($rootScope.config.formats.date),
	          time: 		new Date(values.start).toString($rootScope.config.formats.time),
	          datetime: new Date(values.start).toISOString()
	        },
	        end: {
	          date: 		new Date(values.end).toString($rootScope.config.formats.date),
	          time: 		new Date(values.end).toString($rootScope.config.formats.time),
	          datetime: new Date(values.end).toISOString()
	        },
	        state:      options.content.state,
	        recursive:  options.content.recursive,
	        id:         options.content.id
	      };
    	});


    	/**
    	 * DEPRECIATED
    	 */
    	
			// console.log('content ->', options.content);

			// if ($scope.mode == 'edit')
			// {
			// 	if (options.content.id != $scope.slotid)
			// 	{
			// 		$scope.self.timeline.cancelChange();
			// 	}
			// }
			// else
			// {
			// 	$scope.mode = 'edit';
			// 	$scope.slotid = options.content.id;
			// }

	  }



	  /**
	   * Timeline on change
	   */
	  $scope.timelineOnChange = function (direct, original, slot, options)
	  {
	  	$rootScope.planboardSync.clear();

	    if (!direct)
	    {
	    	/**
	    	 * Through timeline
	    	 */
	      var values  = $scope.self.timeline.getItem($scope.self.timeline.getSelection()[0].row),
	          options = {
	            start:    values.start,
	            end:      values.end,
	            content:  angular.fromJson(values.content.match(/<span class="secret">(.*)<\/span>/)[1])
	          };
	    }
	    else
	    {
	    	/**
	    	 * Through form
	    	 */
	    	var options = {
		      start:  ($rootScope.browser.mobile) ?
		                new Date(slot.start.datetime).getTime() : 
		                Dater.convert.absolute(slot.start.date, slot.start.time, false),
		      end:    ($rootScope.browser.mobile) ? 
		                new Date(slot.end.datetime).getTime() :
		                Dater.convert.absolute(slot.end.date, slot.end.time, false),
		      content: {
		        recursive:  slot.recursive, 
		        state:      slot.state 
		      }
		    };
	    }

	    var isChangeAllowed = function (old, curr)
	    {
	    	var now = Date.now().getTime();

	    	if (old == curr) return true;

	    	if (old < now) return false;

	    	if (curr < now) return false;

	    	return true;
	    }

	    /**
	     * If slot start was in past and end in the future has been moved to
	     * future completely right than now() then slice it with now and leave
	     * the past as it is
	     */
	    if (options.content.recursive == false && 
		    	(
			    	new Date($scope.original.start).getTime() < options.start && 
			    	new Date($scope.original.end).getTime() < options.end
			    ) && 
			    $scope.original.start < Date.now().getTime()
		     )
	    {
	    	// change slot
	      Slots.change($scope.original, {

		      start:  new Date($scope.original.start).getTime(),
		      end:    Date.now().getTime(),
		      content: {
		        recursive:  slot.recursive, 
		        state:      slot.state 
		      }

		    }, $scope.timeline.user.id)
	      .then(
	        function (result)
	        {
	        	$rootScope.$broadcast('resetPlanboardViews');

	          if (result.error)
	          {
	            $rootScope.notifier.error($rootScope.ui.errors.timeline.change);
	            console.warn('error ->', result);
	          }
	          else
	          {
		          // add new slot
				      Slots.add(
					      {
	                start:      options.start / 1000,
	                end:        options.end / 1000,
	                recursive:  (slot.recursive) ? true : false,
	                text:       slot.state
	              }, $scope.timeline.user.id)
				      .then(
				        function (result)
				        {
				          $rootScope.$broadcast('resetPlanboardViews');

				          if (result.error)
				          {
				            $rootScope.notifier.error($rootScope.ui.errors.timeline.add);
				            console.warn('error ->', result);
				          }
				          else
				          {
				            $rootScope.notifier.success($rootScope.ui.planboard.slotChanged);
				          };

				          $scope.timeliner.refresh();

				          $rootScope.planboardSync.start();
				        }
				      );
	          };
	        }
	      );


	    }
	   	else
	   	{
		    if (options.content.recursive == true || 
			    	(
				    	isChangeAllowed(new Date($scope.original.start).getTime(), options.start) && 
				    	isChangeAllowed(new Date($scope.original.end).getTime(), options.end)
				    )
			     )
		    {
		      $rootScope.statusBar.display($rootScope.ui.planboard.changingSlot);

		      console.log('changing allowed!');

		      Slots.change($scope.original, options, $scope.timeline.user.id)
		      .then(
		        function (result)
		        {
		        	$rootScope.$broadcast('resetPlanboardViews');

		          if (result.error)
		          {
		            $rootScope.notifier.error($rootScope.ui.errors.timeline.change);
		            console.warn('error ->', result);
		          }
		          else
		          {
		            $rootScope.notifier.success($rootScope.ui.planboard.slotChanged);
		          };

		          $scope.timeliner.refresh();

		          $rootScope.planboardSync.start();
		        }
		      );

		    }
		    else
		    {
		    	console.log('->', $rootScope.ui.errors);
		    	
		      $rootScope.notifier.error($rootScope.ui.errors.timeline.pastChanging);

		      $scope.timeliner.refresh();
		    }
	   	}

	  };


	  /**
	   * Timeline on remove
	   */
	  $scope.timelineOnRemove = function ()
	  {
	  	$rootScope.planboardSync.clear();

	    if ($scope.timeliner.isAdded() > 0)
	    {
	      $scope.self.timeline.cancelAdd();

	      $scope.$apply(function ()
	      {
	        $scope.resetInlineForms();
	      });
	    }
	    else
	    {
	      var now = Date.now().getTime();

	      if ($scope.original.end.getTime() <= now && $scope.original.content.recursive == false)
	      {
	        $rootScope.notifier.error($rootScope.ui.errors.timeline.pastDeleting);

	        $scope.timeliner.refresh();
	      }
	      else
	      {
	      	$rootScope.statusBar.display($rootScope.ui.planboard.deletingTimeslot);

	        Slots.remove($scope.original, $scope.timeline.user.id)
	        .then(
	          function (result)
	          {
	          	$rootScope.$broadcast('resetPlanboardViews');

	            if (result.error)
	            {
	              $rootScope.notifier.error($rootScope.ui.errors.timeline.remove);
	              console.warn('error ->', result);
	            }
	            else
	            {
	              $rootScope.notifier.success($rootScope.ui.planboard.timeslotDeleted);
	            };

	            $scope.timeliner.refresh();

	            $rootScope.planboardSync.start();
	          }
	        );
	      };
	    };
	  };


	  /**
	   * Set wish
	   */
	  $scope.wisher = function (slot)
	  {
	    $rootScope.statusBar.display($rootScope.ui.planboard.changingWish);

	    Slots.setWish(
	    {
	      id:     slot.groupId,
	      start:  ($rootScope.browser.mobile) ? 
	                new Date(slot.start.datetime).getTime() / 1000 : 
	                Dater.convert.absolute(slot.start.date, slot.start.time, true),
	      end:    ($rootScope.browser.mobile) ? 
	                new Date(slot.end.datetime).getTime() / 1000 : 
	                Dater.convert.absolute(slot.end.date, slot.end.time, true),
	      recursive:  false,
	      wish:       slot.wish
	    })
	    .then(
	      function (result)
	      {
	      	$rootScope.$broadcast('resetPlanboardViews');

	        if (result.error)
	        {
	          $rootScope.notifier.error($rootScope.ui.errors.timeline.wisher);
	          console.warn('error ->', result);
	        }
	        else
	        {
	          $rootScope.notifier.success($rootScope.ui.planboard.wishChanged);
	        };

	        $scope.timeliner.refresh();
	      }
	    );
	  };


	  /**
	   * TODO
	   * Stress-test this!
	   * 
	   * hotfix against not-dom-ready problem for timeline
	   */
	  if ($scope.timeline && $scope.timeline.main)
		{
			setTimeout(function () 
	    {
	      $scope.self.timeline.redraw();
	    }, 100);
	  }


	  /**
	   * Background sync in every 60 sec
	   */
	  $rootScope.planboardSync = {
	  	/**
	  	 * Start planboard sync
	  	 */
	  	start: function ()
		  {
				$window.planboardSync = $window.setInterval(function ()
				{
					// console.log('planboard sync started..');

					/**
					 * Update planboard only in planboard is selected
					 */
					if ($location.path() == '/planboard')
					{
						$scope.slot = {};

						$rootScope.$broadcast('resetPlanboardViews');
						// $scope.resetViews();

						// if ($scope.views.slot.add) $scope.views.slot.add = true;
						// if ($scope.views.slot.edit) $scope.views.slot.edit = true;

						$scope.timeliner.load({
						  start:  $scope.data.periods.start,
						  end:    $scope.data.periods.end
						}, true);
					}
				// Sync periodically for a minute
				}, 60000); // 1 minute
				// }, 5000); // 5 seconds
			},

			/**
			 * Clear planboard sync
			 */
			clear: function ()
			{
				// console.log('planboard sync STOPPED');

				// if ($window.planboardSync)
				// {
				// 	console.log('it exists', $window);
				// }
				// else
				// {
				// 	console.log('NOT existing !');
				// }

				$window.clearInterval($window.planboardSync);
			}
	  }


	  /**
	   * Start planboard sync
	   */
		$rootScope.planboardSync.start();
	}
]);