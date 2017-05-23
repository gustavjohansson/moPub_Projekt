carbonListApp.controller('EventsCtrl', function ($scope, $window, $http, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {


  $window.map = Carbon.initMap();

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

  $scope.currentLocation = function() {
    return Carbon.getCurrentLocation();
  }

  $scope.toggleGroup = function(groupname) {
    Carbon.addOrRemoveGroup(groupname);
  }

  $scope.createEvent = function(id, title, description) {
    Carbon.createNewEvent(title, description);
    // Här kan vi, för att tömma fälten i CREATE-rutan, fiska upp "value" i inputfälten
    // och sätte de till "".
    document.getElementById(id).hide();
  };




});
