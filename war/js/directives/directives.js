/*jslint node: true */
/*global angular */
/*global $ */
'use strict';


angular.module('WebPaige.Directives', ['ngResource'])


/**
 * Chosen
 */
.directive('chosen',
  function ()
  {
    var linker = function (scope,element,attr)
    {
      scope.$watch('receviersList', function ()
      {
         element.trigger('liszt:updated');
      });

      scope.$watch('message.receviers', function ()
      {
        $(element[0]).trigger('liszt:updated');
      });

      element.chosen();
    };

    return {
      restrict: 'A',
      link:     linker
    };
  }
)


/**
 * Notification item
 */
.directive('notificationItem',
  function ($compile)
  {
    return {
      restrict: 'E',
      rep1ace:  true,
      templateUrl: 'dist/views/messages-scheadule-item.html',
      link: function (scope, element, attrs)
      {
        /**
         * Pass the scheadule data
         */
        scope.s = scope.scheadule;

        // element.html(template).show();
        // $compile(element.contents())(scope);

        /**
         * Serve to the controller
         */
        scope.remover = function (key)
        {
          // console.log('coming to remover');

          scope.$parent.$parent.remover(key);
        };
      },
      scope: {
        scheadule: '='
      }
    };

  }
)


/**
 * Daterangepicker
 */
.directive('daterangepicker',
[
  '$rootScope',
  function ($rootScope)
  {
    return {
      restrict: 'A',

      link: function postLink(scope, element, attrs, controller)
      {
        // var startDate = Date.create().addDays(-6),
        //     endDate   = Date.create();       
        //element.val(startDate.format('{MM}-{dd}-{yyyy}') + ' / ' + endDate.format('{MM}-{dd}-{yyyy}'));

        var options = {
          // startDate: startDate,
          // endDate: endDate,
          ranges: {}
        };

        options.ranges[$rootScope.ui.planboard.daterangerToday]     = ['today', 'tomorrow'];
        options.ranges[$rootScope.ui.planboard.daterangerTomorrow]  = ['tomorrow', new Date.today().addDays(2)];
        options.ranges[$rootScope.ui.planboard.daterangerYesterday] = ['yesterday', 'today'];
        options.ranges[$rootScope.ui.planboard.daterangerNext3Days] = ['today', new Date.create().addDays(3)];
        options.ranges[$rootScope.ui.planboard.daterangerNext7Days] = ['today', new Date.create().addDays(7)];

        element.daterangepicker(options,
        function (start, end)
        {
          scope.$apply(function ()
          {
            var diff = end.getTime() - start.getTime();

            /**
             * Scope is a day
             */
            if (diff <= 86400000)
            {
              scope.timeline.range = {
                start:  start,
                end:    start
              };
              scope.timeline.scope = {
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
              scope.timeline.range = {
                start:  start,
                end:    end
              };
              scope.timeline.scope = {
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
              scope.timeline.range = {
                start:  start,
                end:    end
              };
              scope.timeline.scope = {
                day:    false,
                week:   false,
                month:  true
              };
            }

            $rootScope.$broadcast('timeliner', {
              start:  start,
              end:    end
            });

          });
        });

        /**
         * Set data toggle
         */
        element.attr('data-toggle', 'daterangepicker');

        /**
         * TODO
         * Investigate if its really needed!!
         */
        element.daterangepicker({
          autoclose: true
        });
      }
    };
  }
]);


/**
 * ???
 */
// .directive('wpName', 
// [
//   'Storage', 
//   function (Storage)
//   {
//     return {
//       restrict : 'A',
//       link : function linkfn(scope, element, attrs)
//       {
//         var getmemberName = function (uid)
//         {
//           var members = angular.fromJson(Storage.get('members')),
//               retName = uid;

//           angular.forEach(members , function (mem, i)
//           {
//             if (mem.uuid == uid)
//             {
//               retName = mem.name;

//               return false;
//             };
//           });

//           return retName;
//         };
//         scope.$watch(attrs.wpName, function (uid)
//         {
//           element.text(getmemberName(uid)); 
//         });
//       }
//     }
//   }
// ]);




