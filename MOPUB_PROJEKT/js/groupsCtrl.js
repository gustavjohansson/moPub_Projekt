carbonListApp.controller('GroupsCtrl', function ($scope, $timeout, $window, $http, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {

  //öppnar dialogfönster
  $scope.showDialog = function(id) {
    document.getElementById(id).show();
  };

  //Stänger dialogfönster
  $scope.hideDialog = function(id) {
    document
    .getElementById(id)
    .hide();
  };

  $scope.userGroups = Carbon.getCurrentGroups();
  $timeout(function() {
    // $scope.specificGroup = Carbon.getCurrentGroup($scope.userGroups);
}, 1000);

  $scope.currentLocation = function() {
    return Carbon.getCurrentLocation();
  }

  $scope.toggleGroup = function(groupname) {
    Carbon.addOrRemoveGroup(groupname);
  }

  $scope.createGroup = function(id, title, description) {
    Carbon.createNewGroup(title, description);
    document.getElementById(id).hide();
  };





});
