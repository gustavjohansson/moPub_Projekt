carbonListApp.controller('ProfileCtrl', function ($scope, $timeout, $window, $http, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {

  $scope.specificProfile = Carbon.getCurrentUser();
  $timeout(function() {
    $scope.currentUserEvents = Carbon.getUserEvents();
}, 1300);


$scope.profileAge = $scope.specificProfile.age;
$scope.profileCity = $scope.specificProfile.city;
$scope.profileDescription = $scope.specificProfile.description;

$scope.deleteOwnEvent = function(event_id) {
  Carbon.deleteEvent(event_id);
};

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

  $scope.currentUser = Carbon.getCurrentUser();


  $scope.toggleGroup = function(groupname) {
    Carbon.addOrRemoveGroup(groupname);
  }

  $scope.editProfile = function(id, age, city, description) {
    Carbon.editUserProfile(age, city, description);
    document.getElementById(id).hide();
  };





});
