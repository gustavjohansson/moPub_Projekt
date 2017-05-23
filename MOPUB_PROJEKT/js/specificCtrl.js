carbonListApp.controller('SpecificCtrl', function ($scope, $timeout, $window, $http, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {

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

  Carbon.setCurrentGroup($routeParams.groupID);
  $scope.userGroups = Carbon.getCurrentGroups();
  // $scope.specificGroup = Carbon.getCurrentGroup();
  $timeout(function() {
    $scope.specificGroup = Carbon.getCurrentGroup($scope.userGroups);
}, 1000);



  $scope.currentLocation = function() {
    return Carbon.getCurrentLocation();
  }

  $scope.toggleGroup = function(groupname) {
    Carbon.addOrRemoveGroup(groupname);
  }

  $scope.addMemberToGroup = function(id, name) {
    Carbon.addMember(name);
    document.getElementById(id).hide();
  };




});
