carbonListApp.controller('ProfilepageCtrl', function ($scope, $timeout, $window, $http, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {

  Carbon.setCurrentProfile($routeParams.profileID);

  $timeout(function() {
    $scope.specificGroup = Carbon.getGroupForBack();
    $scope.specificProfile = Carbon.getCurrentProfile();
}, 1000);



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
