/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Modals.Messages', ['ngResource'])


/**
 * Messages model
 */
.factory('Messages',
[
	'$rootScope', '$config', '$resource', '$q', 'Storage', '$http', 
	function ($rootScope, $config, $resource, $q, Storage, $http)
	{
	  var Messages = $resource(
	    $config.host + '/question/:action',
	    {
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {
		        action: '', 
		        0: 'dm'
		        // 0: 'all', 
		        // status: 'READ',
		        // limit: 50,
		        // offset: 0
		      },
	        isArray: true
	      },
	      get: {
	        method: 'GET',
	        params: {}
	      },
	      send: {
	        method: 'POST',
	        params: {action: 'sendDirectMessage'}
	      },
	      save: {
	        method: 'POST',
	        params: {}
	      },
	      changeState: {
	        method: 'POST',
	        params: {action: 'changeState'}
	      },
	      remove: {
	        method: 'POST',
	        params: {action: 'deleteQuestions'}
	      }
	    }
	  );


	  var Notifications = $resource(
	    $config.host + '/notification/:uuid',
	    {
	    },
	    {
	      query: {
	        method: 'GET',
	        params: {},
	        isArray: true
	      },
	      get: {
	        method: 'GET',
	        params: {uuid: ''}
	      },
	      save: {
	        method: 'POST',
	        params: {}
	      },
	      edit: {
	        method: 'PUT',
	        params: {uuid: ''}
	      },
	      remove: {
	        method: 'DELETE',
	        params: {uuid: ''}
	      }
	    }
	  );
	  

	  /**
	   * Query messages from back-end
	   */
	  Messages.prototype.query = function () 
	  {
	    var deferred = $q.defer();

	    Messages.query(
	      function (result) 
	      {
	        Storage.add('messages', angular.toJson(result));

	        Messages.prototype.unreadCount();

	        Messages.prototype.scheaduled.list()
	        .then(function (scheadules)
	      	{
	        	deferred.resolve({
	        		messages: 			Messages.prototype.filter(result),
	        		scheadules: 		scheadules
	        	});
	      	});
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };
	  

	  /**
	   * Notifications
	   */
	  Messages.prototype.scheaduled = {

	  	/**
	  	 * List of the notifications
	  	 */
	  	list: function () 
		  {
		    var deferred = $q.defer();

		    Notifications.query(
		      function (result) 
		      {
		      	Storage.add('notifications', angular.toJson(result));

		      	angular.forEach(result, function (scheadule, index)
		      	{
		      		angular.forEach(scheadule.types, function (type, ind)
		      		{
		      			if (type == 'sms') scheadule.sms = true;
		      			if (type == 'email') scheadule.mail = true;
		      		});
		      	});

		        deferred.resolve(result);
		      },
		      function (error)
		      {
		        deferred.resolve({error: error});
		      }
		    );

		    return deferred.promise;
		  },

		  /**
		   * Create notifications
		   */
		  create: function (notification)
		  {
		  	// console.log('not ->', notification);
		  	
		    var deferred = $q.defer();

		    Notifications.save(null, angular.toJson(notification),
		      function (result) 
		      {
		        var returned = '';

		        angular.forEach(result, function (chr, i)
		        {
		          returned += chr;
		        });

		        deferred.resolve(returned);
		      },
		      function (error)
		      {
		        deferred.resolve({error: error});
		      }
		    );

		    return deferred.promise;		  	
		  },

		  /**
		   * Edit notification
		   */
		  edit: function (uuid, notification)
		  {		  	
		    var deferred = $q.defer();

		    Notifications.edit({uuid: uuid}, angular.toJson(notification),
		      function (result) 
		      {
		        deferred.resolve(result);
		      },
		      function (error)
		      {
		        deferred.resolve({error: error});
		      }
		    );

		    return deferred.promise;		  	
		  },

		  /**
		   * Get notification
		   */
		  get: function (uuid)
		  {		  	
		    var deferred = $q.defer();

		    Notifications.get({uuid: uuid},
		      function (result) 
		      {
		        deferred.resolve(result);
		      },
		      function (error)
		      {
		        deferred.resolve({error: error});
		      }
		    );

		    return deferred.promise;		  	
		  },

		  /**
		   * Get a local notification
		   */
		  find: function (id)
		  {
		    var gem;

		    angular.forEach(this.local(), function (notification, index)
		    {
		      if (notification.uuid == id) gem = notification;
		    });

		    return gem;	  	
		  },

		  /**
		   * Get local cache of notifications
		   */
		  local: function () { return angular.fromJson(Storage.get('notifications')); },

		  /**
		   * Delete notifications
		   */
		  remove: function (uuid)
		  {		  	
		    var deferred = $q.defer();

		    Notifications.remove({uuid: uuid},
		      function (result) 
		      {
		        deferred.resolve(result);
		      },
		      function (error)
		      {
		        deferred.resolve({error: error});
		      }
		    );

		    return deferred.promise;		  	
		  }

	  };


	  /**
	   * Filter messages based on box
	   */
	  Messages.prototype.filter = function (messages)
	  {
	    var filtered = {
	      inbox: [],
	      outbox: [],
	      trash: []
	    };

	    angular.forEach(messages, function (message, index)
	    {
	      if (message.subject == '') message.subject = '-No Subject-';

	      if (message.box == 'inbox' &&
	          message.state != 'TRASH')
	      {
	        filtered.inbox.push(message);
	      }
	      else if ( message.box == 'outbox' && 
	                message.state != 'TRASH')
	      {
	        filtered.outbox.push(message);
	      }
	      else if ( (message.box == 'inbox' || message.box == 'outbox') &&
	                message.state == 'TRASH')
	      {
	        filtered.trash.push(message);
	      };
	    });


	    var butcher = function (box)
	    {
		    var limit 	= 50,
		    		total 	= box.length,
		  			offset 	= 0,
		  			newarr 	= [];

		  	while (offset * limit < total)
		  	{
					newarr[offset] = box.slice( offset * limit, ( offset + 1 ) * limit );

					offset ++;
		  	};

		  	return newarr;
	    };

	    filtered.inbox 	= butcher(filtered.inbox);
	    filtered.outbox = butcher(filtered.outbox);
	    filtered.trash 	= butcher(filtered.trash);

	    return filtered;
	  };


	  /**
	   * Serve messages from localStorage
	   */
	  Messages.prototype.local = function () { return angular.fromJson(Storage.get('messages')) };


	  /**
	   * Find a message in cache
	   */
	  Messages.prototype.find = function (id)
	  {
	    var gem;

	    angular.forEach(Messages.prototype.local(), function (message, index)
	    {
	      if (message.uuid == id) gem = message;
	    });

	    return gem;
	  };


	  /**
	   * Serve receivers list
	   */
	  Messages.prototype.receviers = function ()
	  {
	    var members   = angular.fromJson(Storage.get('members')),
	        groups    = angular.fromJson(Storage.get('groups')),
	        receivers = [];

	    angular.forEach(members, function(member, index)
	    {
	        receivers.push({
	        id: member.uuid,
	        name: member.name,
	        group: $rootScope.ui.message.receiversUsers
	      });
	    });

	    angular.forEach(groups, function(group, index)
	    {
	        receivers.push({
	        id: group.uuid,
	        name: group.name,
	        group: $rootScope.ui.message.receiversGroups
	      });
	    });

	    return receivers;
	  };


	  /**
	   * Send a message
	   */
	  Messages.prototype.send = function (message, broadcast) 
	  {
	    var deferred = $q.defer(),
	        members = [],
	        types = [];

	    angular.forEach(message.receivers, function (receiver, index)
	    {
	      members.push(receiver.id);
	    });

	    types.push('paige');

	    if (broadcast.sms) types.push('sms');

	    if (broadcast.email) types.push('email');

	    var message = {
	      members: members,
	      content: message.body,
	      subject: message.subject,
	      types: types
	    };

	    Messages.send(null, message, 
	      function (result) 
	      {
	        var returned = '';

	        angular.forEach(result, function (chr, i)
	        {
	          returned += chr;
	        });

	        deferred.resolve(returned);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Send a message
	   */
	  Messages.prototype.email = function () 
	  {
	    var deferred 	= $q.defer();

	    $http({
			  method: 'GET', 
			  url: 		'../profiles/' + $config.profile.meta + '/mail/mobile_app.html'
			}).
		  success(function (content, status, headers, config)
		  {
		  	// content = content.replace('__download_link__', $config.profile.mobileApp.link);

		    var message = {
					content: 			content,
					subject: 			'Mobiele App Instructies',
					types: 				['email'],
					contenttype: 	'text/html'
				};

		    Messages.send(null, message, 
		      function (result) 
		      {
		        var returned = '';

		        angular.forEach(result, function (chr, i)
		        {
		          returned += chr;
		        });

		        deferred.resolve(returned);
		      },
		      function (error)
		      {
		        deferred.resolve({error: error});
		      }
		    );
		  }).
		  error(function (data, status, headers, config)
		  {
		  	console.log('smth went wrong');
		  });


	    return deferred.promise;
	  };


	  /**
	   * Get unread messages
	   */
	  Messages.prototype.unread = function ()
	  {
	    var messages = Messages.prototype.local(),
	        unread = [];

	    angular.forEach(messages, function (message, index)
	    {
	      if (message.box == 'inbox' && message.state == 'NEW') unread.push(message);
	    });

	    return unread;
	  };


	  /**
	   * Count unread messages
	   */
	  Messages.prototype.unreadCount = function ()
	  {
	  	var messages = Messages.prototype.local(),
	        counter = 0;

	    angular.forEach(messages, function (message, index)
	    {
	      if (message.box == 'inbox' && message.state == 'NEW')
	      {
		      counter++;

		      // if ($rootScope.browser.webkit)
		      // {
				    // $rootScope.setWebkitNotification(
				    //   'New message: ' + message.subject, 
				    //   message.question_text,
				    //   {
				    //     path: 'messages',
				    //     search: 
				    //     {
				    //       uuid: message.uuid,
				    //     },
				    //     hash: 'message'
				    //   }
				    // );
		      // };
		    };
	    });

	    $rootScope.app.unreadMessages = counter;
	  };


	  /**
	   * Change message state
	   */
	  Messages.prototype.changeState = function (ids, state)
	  {
	    var deferred = $q.defer();

	    Messages.changeState(null, 
	      {
	        ids: ids, 
	        state: state 
	      }, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    /**
	     * Change message state locally as well
	     * if it is READ
	     */
	    if (state == 'READ')
	    {
	      var messages = angular.fromJson(Storage.get('messages')),
	          converted = [];

	      angular.forEach(messages, function (message, index)
	      {
	        angular.forEach(ids, function (id, i)
	        {
	          if (message.uuid == id) message.state = 'READ';
	        });

	        converted.push(message);
	      });

	      Storage.remove('messages');

	      Storage.add(angular.toJson('messages', converted));

	      Messages.prototype.unreadCount();
	    };

	    return deferred.promise;
	  };


	  /**
	   * Delete message(s)
	   */
	  Messages.prototype.remove = function (id)
	  {
	    var deferred = $q.defer();

	    Messages.prototype.changeState(id, 'TRASH')
	    .then(function (result) 
	    {
	      deferred.resolve(result);
	    });

	    return deferred.promise;
	  };


	  /**
	   * Restore message(s)
	   */
	  Messages.prototype.restore = function (id)
	  {
	    var deferred = $q.defer();

	    Messages.prototype.changeState(id, 'SEEN')
	    .then(function (result) 
	    {
	      deferred.resolve(result);
	    });

	    return deferred.promise;
	  };


	  /**
	   * Delete forever
	   */
	  Messages.prototype.emptyTrash = function (ids)
	  {
	    var deferred = $q.defer(),
	        messages = Messages.prototype.local(),
	        bulk = [];

	    angular.forEach(messages, function(message, index)
	    {
	      if ((message.box == 'inbox' || message.box == 'outbox') && message.state == 'TRASH') bulk.push(message.uuid);
	    });

	    Messages.remove(null,
	      { 
	        members: bulk 
	      }, 
	      function (result) 
	      {
	        deferred.resolve(result);
	      },
	      function (error)
	      {
	        deferred.resolve({error: error});
	      }
	    );

	    return deferred.promise;
	  };


	  /**
	   * Clean the mailboxes
	   */
	  Messages.prototype.clean = function (box)
	  {
	    var deferred 	= $q.defer(),
	        calls 		= [];

	    angular.forEach(box, function (bulk, id)
	    {
	    	var ids = [];

	    	angular.forEach(bulk, function (message, index)
	    	{
	    		ids.push(message.uuid);
	    	});

	      calls.push(Messages.remove(null, {
	      	members: ids
	      }));
	    });

	    $q.all(calls)
	    .then(function (result)
	    {
	      deferred.resolve(result);
	    });

	    return deferred.promise;
	  }


	  return new Messages;
	}
]);