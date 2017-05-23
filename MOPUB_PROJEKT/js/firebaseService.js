carbonListApp.factory('FirebaseAccount',function ($resource, $cookieStore, $cookies, $firebaseObject, $firebaseArray, $firebaseAuth) {

  var _this = this;

  this.InitializeUser = function(user_id, username) {
    // item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var users = firebase.database().ref("users");
    var usersRef = users.child(user_id).set({
      username: username,
      user_id: user_id
    });
  };

  this.EditProfile = function(user_id, updatedInfo) {
    // item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var users = firebase.database().ref("users");
    var usersRef = users.child(user_id).update(
      updatedInfo
    );
  };

  this.CreateGroup = function(group_id, group_name, group_description) {
    // item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var groups = firebase.database().ref("groups");
    var groupsRef = groups.child(group_id).set({
      group_id: group_id,
      group_name: group_name,
      group_description: group_description
    });
  };

  this.CreateEvent = function(event_id, event_name, event_description, lat, long, user, strLoc) {
    // item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var events = firebase.database().ref("events");
    var eventsRef = events.child(event_id).set({
      event_id: event_id,
      event_name: event_name,
      event_description: event_description,
      event_creator:user,
      event_address:strLoc
    });

    var eventsLocationRef = events.child(event_id).child("location").set({
      latitude: lat,
      longitude: long
    });
  };

  this.AddEventToGroup = function(event_id, event_name, group_id) {
    // item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var groups = firebase.database().ref("groups");
    var groupsRef = groups.child(group_id).child("events").child(event_id).set({
      event_id: event_id,
      event_name: event_name
    });
  };

  this.AddUserToGroup = function(user_id, username, group_id) {
    // item = this.editItem(item);
    console.log(user_id)
    console.log(username)
    console.log(group_id)

    // create a reference to the database node where we will store our data
    var groups = firebase.database().ref("groups");
    var groupsRef = groups.child(group_id).child("members").child(user_id).set({
      user_id: user_id,
      username: username
    });

    var users = firebase.database().ref("users");
    var usersRef = users.child(user_id).child("groups").child(group_id).set({
      group_id: group_id
    });
  };

  this.RemoveUserFromGroup = function(user_id, group_id) {
    console.log("MOPUB - RemoveUserFromGroup PP")
    // item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var groups = firebase.database().ref("groups");
    var groupsRef = groups.child(group_id).child("members").child(user_id).remove();

    var users = firebase.database().ref("users");
    var usersRef = users.child(user_id).child("groups").child(group_id).remove();
  };

  this.DeleteEvent = function(event_id, group_id) {
    console.log("MOPUB - RemoveUserFromGroup PP")
    // item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var events = firebase.database().ref("events");
    var eventsRef = events.child(event_id).remove();

    var groups = firebase.database().ref("groups");
    var groupsRef = groups.child(group_id).child("events").child(event_id).remove();
  };



  this.DownloadUsers = function() {
    console.log("FirebaseAccount.DownloadUsers")
    // create a reference to the database node where we will store our data
    var users = firebase.database().ref("users");

    return $firebaseArray(users);
  };

  this.DownloadGroups = function() {
    console.log("FirebaseAccount.DownloadUsers")
    // create a reference to the database node where we will store our data
    var groups = firebase.database().ref("groups");

    return $firebaseArray(groups);
  };

  this.DownloadEvents = function() {
    console.log("FirebaseAccount.DownloadUsers")
    // create a reference to the database node where we will store our data
    var events = firebase.database().ref("events");

    return $firebaseArray(events);
  };


  this.Auth = function() {
    console.log("FirebaseAccount.Auth")
    return $firebaseAuth();
  };


  this.editItem = function(item) {
    console.log("editar detta item")
    delete item.$promise;
    delete item.$resolved;
    delete item.$$hashKey;
    return item;
  };

  return this;
})



carbonListApp.factory("Auth", ["$firebaseAuth",
function($firebaseAuth) {
  return $firebaseAuth();
}
]);
