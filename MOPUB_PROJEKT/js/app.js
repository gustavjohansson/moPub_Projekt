var carbonListApp = angular.module('carbonListApp', ['ngRoute','ngAnimate', 'ngResource', 'ngCookies', 'ngMaterial', 'firebase', 'onsen']);

carbonListApp.config(['$routeProvider',
function($routeProvider) {

  $routeProvider.

  when('/login', {
    templateUrl: 'partials/loginOnsen.html',
    controller: 'FirebaseCtrl'
  }).

  when('/register', {
    templateUrl: 'partials/register.html',
    controller: 'FirebaseCtrl'
  }).

  when('/menu', {
    templateUrl: 'partials/menu.html',
    controller: 'FirebaseCtrl'
  }).

  when('/events', {
    templateUrl: 'partials/events.html',
    controller: 'EventsCtrl'
  }).

  when('/groups', {
    templateUrl: 'partials/groups.html',
    controller: 'GroupsCtrl'
  }).

  when('/specific/:groupID', {
  templateUrl: 'partials/specific.html',
  controller: 'SpecificCtrl'
}).

  when('/profile', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileCtrl'

  }).

  when('/profilePage/:profileID', {
    templateUrl: 'partials/profilePage.html',
    controller: 'ProfilepageCtrl'

  }).

  otherwise({
    redirectTo: '/login'
  });
}]);
