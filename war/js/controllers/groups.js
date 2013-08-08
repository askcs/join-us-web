/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Groups', [])


/**
 * Groups controller
 */
.controller('groups',
[
	'$rootScope', '$scope', '$location', 'data', 'Groups', 'Profile', '$route', '$routeParams', 'Storage', 'Slots',
	function ($rootScope, $scope, $location, data, Groups, Profile, $route, $routeParams, Storage, Slots)
	{
		/**
		 * Fix styles
		 */
		$rootScope.fixStyles();


		/**
		 * Self this
		 */
		var self = this,
				params = $location.search();


		/**
		 * Init search query
		 */
		$scope.search = {
			query: ''
		};


		/**
		 * Reset selection
		 */
		$scope.selection = {};


		/**
		 * Set groups
		 */
		$scope.data = data;


		/**
		 * Grab and set roles for view
		 */
		$scope.roles = $rootScope.config.roles;


		/**
		 * Groups for dropdown
		 */
		$scope.groups = data.groups;


		var uuid, view;

		/**
		 * If no params or hashes given in url
		 */
		if (!params.uuid && !$location.hash())
		{
			uuid = data.groups[0].uuid;
			view = 'view';

			$location.search({uuid: data.groups[0].uuid}).hash('view');
		}
		else
		{
			uuid = params.uuid;
			view = $location.hash();
		}


		/**
		 * Set group
		 */
		setGroupView(uuid);


		/**
		 * Set view
		 */
		setView(view);


		/**
		 * Set given group for view
		 */
		function setGroupView (id)
		{
			angular.forEach(data.groups, function (group, index)
			{
				if (group.uuid == id) $scope.group = group;
			});

			$scope.members = data.members[id];

			$scope.current = id;

			wisher(id);
		}


		function wisher (id)
		{
			$scope.wished = false;

			Groups.wish(id)
			.then(function (wish)
			{
				$scope.wished = true;

				$scope.wish = wish.count;

				$scope.popover = {
					id: id,
					wish: wish.count
				};
			});
		}


		/**
		 * Set wish for the group
		 */
		$scope.saveWish = function (id, wish)
		{
			// console.warn('setting the wish:' + wish + ' for the group:', id);

			$rootScope.statusBar.display($rootScope.ui.planboard.changingWish);

			Slots.setWish(
			{
				id:     id,
				start:  255600,
				end:    860400,
				recursive:  true,
				wish:   wish
			})
			.then(
				function (result)
				{
					if (result.error)
					{
						$rootScope.notifier.error($rootScope.ui.errors.groups.saveWish);
						console.warn('error ->', result);
					}
					else
					{
						$rootScope.notifier.success($rootScope.ui.planboard.wishChanged);
					}

					wisher(id);
				}
			);

		};


		/**
		 * Request for a group
		 */
		$scope.requestGroup = function (current, switched)
		{
			setGroupView(current);

			$scope.$watch($location.search(), function ()
			{
				$location.search({uuid: current});
			});

			if (switched)
			{
				if ($location.hash() != 'view') $location.hash('view');

				setView('view');
			}
		};


		/**
		 * View setter
		 */
		function setView (hash)
		{
			$scope.views = {
				view:   false,
				add:    false,
				edit:   false,
				search: false,
				member: false
			};

			$scope.views[hash] = true;
		}


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
		 * Toggle new group button
		 */
		$scope.addGroupForm = function ()
		{
			if ($scope.views.add)
			{
				$scope.closeTabs();
			}
			else
			{
				$scope.groupForm = {};

				$scope.setViewTo('add');
			}
		};


		/**
		 * New member
		 */
		$scope.newMemberForm = function ()
		{
			if ($scope.views.member)
			{
				$scope.closeTabs();
			}
			else
			{
				$scope.memberForm = {};

				$scope.setViewTo('member');
			}
		};


		/**
		 * Edit a group
		 */
		$scope.editGroup = function (group)
		{
			$scope.setViewTo('edit');

			$scope.groupForm = {
				id: group.uuid,
				name: group.name
			};
		};


		/**
		 * Close inline form
		 */
		$scope.closeTabs = function ()
		{
			$scope.groupForm = {};

			$scope.memberForm = {};

			$scope.setViewTo('view');
		};


		/**
		 * Search for members
		 */
		$scope.searchMembers = function (query)
		{
			$rootScope.statusBar.display($rootScope.ui.groups.searchingMembers);

			Groups.search(query).
			then(function (result)
			{
				if (result.error)
				{
					$rootScope.notifier.error($rootScope.ui.errors.groups.searchMembers);
					console.warn('error ->', result);
				}
				else
				{
					$scope.search = {
						query: '',
						queried: query
					};

					$scope.candidates = result;

					$scope.setViewTo('search');

					$rootScope.statusBar.off();
				}
			});
		};


		/**
		 * Add member to a group
		 */
		$scope.addMember = function (candidate)
		{
			$rootScope.statusBar.display($rootScope.ui.groups.addingNewMember);

			Groups.addMember(candidate).
			then(function (result)
			{
				if (result.error)
				{
					$rootScope.notifier.error($rootScope.ui.errors.groups.addMember);
					console.warn('error ->', result);
				}
				else
				{
					$rootScope.notifier.success($rootScope.ui.groups.memberAdded);

					$rootScope.statusBar.display($rootScope.ui.groups.refreshingGroupMember);

					Groups.query().
					then(function (data)
					{
						if (data.error)
						{
							$rootScope.notifier.error($rootScope.ui.errors.groups.query);
							console.warn('error ->', data);
						}
						else
						{
							$scope.data = data;

							$rootScope.statusBar.off();
						}
					});
				}
			});
		};


		/**
		 * Remove member from a group
		 */
		$scope.removeMember = function (member, group)
		{
			$rootScope.statusBar.display($rootScope.ui.groups.removingMember);

			Groups.removeMember(member, group).
			then(function (result)
			{
				if (result.error)
				{
					$rootScope.notifier.error($rootScope.ui.errors.groups.removeMember);
					console.warn('error ->', result);
				}
				else
				{
					$rootScope.notifier.success($rootScope.ui.groups.memberRemoved);

					$rootScope.statusBar.display($rootScope.ui.groups.refreshingGroupMember);

					Groups.query().
					then(function (data)
					{
						if (data.error)
						{
							$rootScope.notifier.error($rootScope.ui.errors.groups.query);
							console.warn('error ->', data);
						}
						else
						{
							$scope.data = data;

							$rootScope.statusBar.off();
						}
					});
				}
			});
		};


		/**
		 * Remove members
		 */
		$scope.removeMembers = function (selection, group)
		{
			$rootScope.statusBar.display($rootScope.ui.groups.removingSelected);

			Groups.removeMembers(selection, group).
			then(function (result)
			{
				if (result.error)
				{
					$rootScope.notifier.error($rootScope.ui.errors.groups.removeMembers);
					console.warn('error ->', result);
				}
				else
				{
					$rootScope.notifier.success($rootScope.ui.groups.removed);

					$rootScope.statusBar.display($rootScope.ui.groups.refreshingGroupMember);

					$scope.selection = {};

					Groups.query().
					then(function (data)
					{
						if (data.error)
						{
							$rootScope.notifier.error($rootScope.ui.errors.groups.query);
							console.warn('error ->', data);
						}
						else
						{
							$scope.data = data;

							$rootScope.statusBar.off();
						}
					});
				}
			});

			/**
			 * TODO
			 * not working to reset master checkbox!
			 */
			//$scope.selectionMaster = {};
		};


		/**
		 * Save a group
		 */
		$scope.groupSubmit = function (group)
		{
			$rootScope.statusBar.display($rootScope.ui.groups.saving);

			Groups.save(group).
			then(function (returned)
			{
				if (returned.error)
				{
					$rootScope.notifier.error($rootScope.ui.errors.groups.groupSubmit);
					console.warn('error ->', returned);
				}
				else
				{
					$rootScope.notifier.success($rootScope.ui.groups.groupSaved);

					$rootScope.statusBar.display($rootScope.ui.groups.refreshingGroupMember);

					Groups.query().
					then(function (data)
					{
						if (data.error)
						{
							$rootScope.notifier.error($rootScope.ui.errors.groups.query);
							console.warn('error ->', data);
						}
						else
						{
							$scope.closeTabs();

							$scope.data = data;

							angular.forEach(data.groups, function (group, index)
							{
							if (group.uuid == returned)
							{
								$scope.groups = data.groups;

								angular.forEach(data.groups, function (g, index)
								{
									if (g.uuid == group.uuid) $scope.group = g;
								});

								$scope.members = data.members[group.uuid];

								$scope.current = group.uuid;

								$scope.$watch($location.search(), function ()
								{
									$location.search({uuid: group.uuid});
								}); // end of watch

							} // end of if

							}); // end of foreach

							$rootScope.statusBar.off();
						}
					});
				}
			});
		};


		/**
		 * Save a member
		 */
		$scope.memberSubmit = function (member)
		{
			$rootScope.statusBar.display($rootScope.ui.groups.registerNew);

			Profile.register(member).
			then(function (result)
			{
				if (result.error)
				{
					if (result.error.status === 409)
					{
						$rootScope.notifier.error($rootScope.ui.errors.groups.memberSubmitRegistered);

						// $scope.memberForm = {};

						$rootScope.statusBar.off();
					}
					else
					{
						$rootScope.notifier.error($rootScope.ui.errors.groups.memberSubmitRegister);
					}
					
					console.warn('error ->', result);
				}
				else
				{
					$rootScope.notifier.success($rootScope.ui.groups.memberRegstered);

					$rootScope.statusBar.display($rootScope.ui.groups.refreshingGroupMember);

					Groups.query().
					then(function (data)
					{
						if (data.error)
						{
							$rootScope.notifier.error($rootScope.ui.errors.groups.query);
							console.warn('error ->', data);
						}
						else
						{
							$scope.data = data;

							$location.path('/profile/' + member.username).hash('profile');

							$rootScope.statusBar.off();
						}
					});
				}
			});
		};


		/**
		 * Delete a group
		 */
		$scope.deleteGroup = function (id)
		{
			$rootScope.statusBar.display($rootScope.ui.groups.deleting);

			Groups.remove(id).
			then(function (result)
			{
				if (result.error)
				{
					$rootScope.notifier.error($rootScope.ui.errors.groups.deleteGroup);
					console.warn('error ->', result);
				}
				else
				{
					$rootScope.notifier.success($rootScope.ui.groups.deleted);

					$rootScope.statusBar.display($rootScope.ui.groups.refreshingGroupMember);

					Groups.query().
					then(function (data)
					{
						if (data.error)
						{
							$rootScope.notifier.error($rootScope.ui.errors.groups.query);
							console.warn('error ->', data);
						}
						else
						{
							$scope.data = data;

							angular.forEach(data.groups, function (group, index)
							{
								$scope.groups = data.groups;

								$scope.group = data.groups[0];

								$scope.members = data.members[data.groups[0].uuid];

								$scope.current = data.groups[0].uuid;

								$scope.$watch($location.search(),
									function ()
									{
										$location.search({uuid: data.groups[0].uuid});
									}
								); // end of watch
							}); // end of foreach

							$rootScope.statusBar.off();
						}
					});
				}
			});
		};


		/**
		 * Selection toggler
		 */
		$scope.toggleSelection = function (group, master)
		{
			var flag = (master) ? true : false,
					members = angular.fromJson(Storage.get(group.uuid));

			angular.forEach(members, function (member, index)
			{
				$scope.selection[member.uuid] = flag;
			});
		};


		/**
		 * Not used in groups yet but login uses modal call..
		 * 
		 * Fetch parent groups
		 */
		$scope.fetchParent = function ()
		{
			Groups.parents()
			.then(function (result)
			{
				console.warn('parent -> ', result);
			});
		};

		/**
		 * Not used in groups yet..
		 * 
		 * Fetch parent groups
		 */
		$scope.fetchContainers = function (id)
		{
			Groups.containers(id)
			.then(function (result)
			{
				console.warn('containers -> ', result);
			});
		};










      // var filesTreeGrid;
      // var foldersTreeGrid;

      // // Called when the page is loaded
      // function draw() {
      //   // randomly generate some files
      //   var files = [];
      //   for (var i = 0; i < 50; i++) {
      //     files.push({
      //       'name': 'File ' + i,
      //       'size': (Math.round(Math.random() * 50) * 10 + 100) + ' kB',
      //       'date': (new Date()).toDateString(),
      //       '_id': i     // this is a hidden field, as it starts with an underscore
      //     });
      //   }
        
      //   // randomly generate folders, containing a dataconnector which supports
      //   // drag and drop
      //   var folders = [];
      //   var chars = 'ABCDE';
      //   for (var i in chars) {
      //     var c = chars[i];
      //     var options = {
      //       'dataTransfer' : {
      //         'allowedEffect': 'move',
      //         'dropEffect': 'move'
      //       }
      //     };
      //     var dataConnector = new links.DataTable([], options);
      //     var item = {
      //       'name': 'Folder ' + c, 
      //       'files': dataConnector, 
      //       '_id': c
      //     };
      //     folders.push(item);
      //   }
      //   folders.push({'name': 'File X', '_id': 'X'});
      //   folders.push({'name': 'File Y', '_id': 'Y'});
      //   folders.push({'name': 'File Z', '_id': 'Z'});

      //   // specify options
      //   var treeGridOptions = {
      //     'width': '350px',
      //     'height': '400px'
      //   };  

      //   // Instantiate treegrid object with files
      //   var filesContainer = document.getElementById('files');
      //   var filesOptions = {
      //     'columns': [
      //       {'name': 'name', 'text': 'Name', 'title': 'Name of the files'},
      //       {'name': 'size', 'text': 'Size', 'title': 'Size of the files in kB (kilo bytes)'},
      //       {'name': 'date', 'text': 'Date', 'title': 'Date the file is last updated'}
      //     ],
      //     'dataTransfer' : {
      //       'allowedEffect': 'move',
      //       'dropEffect': 'none'
      //     }
      //   };
      //   filesTreeGrid = new links.TreeGrid(filesContainer, treeGridOptions);
      //   var filesDataConnector = new links.DataTable(files, filesOptions);
      //   /*
      //   filesDataConnector.setFilters([{
      //     'field': 'size',
      //     'order': 'ASC'
      //     //'startValue': '300 kB',
      //     //'endValue': '500 kB',
      //   }]);
      //   //*/
      //   filesTreeGrid.draw(filesDataConnector);    

      //   // Instantiate treegrid object with folders
      //   var foldersOptions = {};
      //   //* TDOO: cleanup temporary foldersOptions
      //   var foldersOptions = {
      //     'dataTransfer' : {
      //       'allowedEffect': 'move',
      //       'dropEffect': 'move'
      //     }
      //   };
      //   //*/
      //   var foldersContainer = document.getElementById('folders');
      //   var foldersDataConnector = new links.DataTable(folders, foldersOptions);
      //   foldersTreeGrid = new links.TreeGrid(foldersContainer, treeGridOptions);
      //   foldersTreeGrid.draw(foldersDataConnector);
      // }

      // draw();

	}
]);