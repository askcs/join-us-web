/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Services.Offsetter', ['ngResource'])


/**
 * Offsetter Service
 */
.factory('Offsetter',
[
  '$rootScope',
  function ($rootScope)
  {
		/**
		 * General offset constructor
		 */
		var constructor = {
			/**
			 * Produce offsets for the view
			 */
			factory: function (data)
			{
				/**
				 * Defaults
				 */
				var max     = 60 * 60 * 24 * 7,
						day     = 60 * 60 * 24,
						hour    = 60 * 60,
						minute  = 60,
						gmt 		= ((Math.abs(Number(Date.today().getUTCOffset())) * 1) / 100) * hour,
						offsets = [];

				/**
				 * Loop through array of offsets
				 */
				angular.forEach(data, function (offset, index)
				{
					/**
					 * Reset and calculate
					 */
					var days    = 0,
							hours   = 0,
							minutes = 0,
							offset_tmp;

					offset 	= offset + gmt;

					hours   = offset % day;
					days    = offset - hours;
					minutes = offset % hour;

					var total = {
								days:     Math.floor(days / day),
								hours:    Math.floor(hours / hour),
								minutes:  Math.floor(minutes / minute)
							};

					/**
					 * Buffer offset container
					 */
					offset_tmp = {
						value:	offset,
						exact:	offset % day,
						mon:		false,
						tue:		false,
						wed:		false,
						thu:		false,
						fri:		false,
						sat:		false,
						sun:		false,
						hour:		total.hours,
						minute: total.minutes
					};

					/**
					 * If one digit zero's
					 */
					if (total.hours < 10)	total.hours	= '0' + total.hours;
					if (total.minutes < 10) total.minutes = '0' + total.minutes;

					/**
					 * Construct time
					 */
					offset_tmp.time = total.hours + ':' + total.minutes;

					/**
					 * Day togglers
					 */
					switch (total.days)
					{
						case 1:   offset_tmp.mon = true;   break;
						case 2:   offset_tmp.tue = true;   break;
						case 3:   offset_tmp.wed = true;   break;
						case 4:   offset_tmp.thu = true;   break;
						case 5:   offset_tmp.fri = true;   break;
						case 6:   offset_tmp.sat = true;   break;
						case 7:   offset_tmp.sun = true;   break;
					}

					/**
					 * Push the temp offset
					 */
					offsets.push(offset_tmp);
				});

				/**
				 * New offsets in onbject form
				 */
				var noffs = {};

				/**
				 * Loop through the offsets array for contrcuting the new offsets object
				 */
				angular.forEach(offsets, function (offset, index)
				{
					/**
					 * Check whether key(exact) is defined in the obejct otherwise create it
					 */
					noffs[offset.exact]					= noffs[offset.exact] || {};

					/**
					 * Pass time's
					 */
					noffs[offset.exact].hour		=	offset.hour;
					noffs[offset.exact].minute	= offset.minute;
					noffs[offset.exact].time		= offset.time;

					/**
					 * If no exact value is defined
					 */
					noffs[offset.exact].exact		= offset.exact;

					/**
					 * Pass day togglers if they exist or overwrite or create
					 */
					noffs[offset.exact].mon			= (noffs[offset.exact].mon) ? noffs[offset.exact].mon : offset.mon;
					noffs[offset.exact].tue			= (noffs[offset.exact].tue) ? noffs[offset.exact].tue : offset.tue;
					noffs[offset.exact].wed			= (noffs[offset.exact].wed) ? noffs[offset.exact].wed : offset.wed;
					noffs[offset.exact].thu			= (noffs[offset.exact].thu) ? noffs[offset.exact].thu : offset.thu;
					noffs[offset.exact].fri			= (noffs[offset.exact].fri) ? noffs[offset.exact].fri : offset.fri;
					noffs[offset.exact].sat			= (noffs[offset.exact].sat) ? noffs[offset.exact].sat : offset.sat;
					noffs[offset.exact].sun			= (noffs[offset.exact].sun) ? noffs[offset.exact].sun : offset.sun;
				});

				/**
				 * Return the beauty
				 */
				return noffs;
			},


			/**
			 * Convert to back-end friendly array
			 */
			arrayed: function (offsets)
			{
				/**
				 * Defaults
				 */
				var day     = 60 * 60 * 24,
						hour    = 60 * 60,
						minute  = 60,
						arrayed = [];

				/**
				 * Loop through array of offsets
				 */
				angular.forEach(offsets, function (offset, index)
				{
					var gmt 		= (Math.abs( Number(Date.today().getUTCOffset()) ) * -1 ) / 100,
							hours		= (Number(offset.hour) + gmt) * hour,
							minutes	= Number(offset.minute) * minute,
							diff		= hours + minutes;

					if (offset.mon) { arrayed.push(diff + day); }
					if (offset.tue) { arrayed.push(diff + (day * 2)); }
					if (offset.wed) { arrayed.push(diff + (day * 3)); }
					if (offset.thu) { arrayed.push(diff + (day * 4)); }
					if (offset.fri) { arrayed.push(diff + (day * 5)); }
					if (offset.sat) { arrayed.push(diff + (day * 6)); }
					if (offset.sun) { arrayed.push(diff + (day * 7)); }
				});

				return arrayed;
			}
		};

		return {
			factory: constructor.factory,
			arrayed: constructor.arrayed
		};
  }
]);