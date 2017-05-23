
carbonListApp.factory('Carbon',function ($resource, $cookieStore, $cookies, $firebaseObject, $firebaseAuth, FirebaseAccount) {

  // -------------VARIABLES-------------
  // -------------VARIABLES-------------

  // USERBASED
  var currentItem;
  var user;
  var current_user;
  var currentLocation;
  var map;
  var currentGroup;
  var currentProfile;

  var userGroups = [];
  var userEvents = [];
  var allUsers = [];

  // var complexGroupData;

  var complexUser = [];
  var checkedGroups = [];

  this.checkIfCorrectUsername = function(username) {
    var checkSearch = /^[a-zA-ZåäöÅÄÖèéêëìíâ\s]+$/.test(username);
    return checkSearch;
  }

  this.getCurrentGroups = function() {
    console.log("DU E JESUS")
    console.log(userGroups)
    return userGroups;
  }

  this.getGroupForBack = function() {
    console.log("DU E JESUS")
    console.log(userGroups)
    return currentGroup;
  }


  this.getCurrentGroup = function(groups) {
    console.log(groups);
    console.log(currentGroup);

    for (group in groups){
      // console.log(userGroup[group])
      if (groups[group].group_id == currentGroup){
        console.log(userGroups);
        return groups[group];
      }
    }
    // console.log(complexGroupData);
    // return complexGroupData;
  }

  this.setCurrentGroup = function(groupID) {
    currentGroup = groupID;
    updateCookie_userbased();
  }

  this.getUserEvents = function() {
    console.log(userEvents)
    var ownEvents = [];
    for (activeEvent in userEvents) {
      if (userEvents[activeEvent].event_creator == complexUser.user_id) {
        var OKtoADD = true;
        console.log(userEvents[activeEvent])
        for (loggedEvents in ownEvents) {
          console.log(ownEvents[loggedEvents])
          if (ownEvents[loggedEvents].event_id == userEvents[activeEvent].event_id) {
            OKtoADD = false;
          }
        }
        if (OKtoADD) {
          ownEvents.push(userEvents[activeEvent])
        }
      }
    }
    console.log(ownEvents)
    return ownEvents;
  }


  this.deleteEvent = function(event_id) {
    console.log(markers)
    for (Group in userGroups) {
      for (Event in userGroups[Group].events) {
        if ((userGroups[Group].events)[Event].event_id == event_id) {
          console.log("VI KOMMER HIT ;D")
          FirebaseAccount.DeleteEvent(event_id, userGroups[Group].group_id);
          this.removeMarkerFromMap(event_id);
        }
      }
    }
  }

  this.getCurrentUser = function() {
    console.log("DU E JESUS")
    console.log(complexUser)
    return complexUser;
  }

  this.getCurrentProfile = function() {
    console.log("DU E JESUS")
    console.log(allUsers)
    for (profile in allUsers) {
      if (allUsers[profile].user_id == currentProfile) {
        return allUsers[profile];
      }
    }
  }




  this.setCurrentProfile = function(profileID) {
    currentProfile = profileID;
    updateCookie_userbased();
  }







  this.createNewEvent = function(title, description) {
    var dateMark = new Date();
    var id = "E" + dateMark.getTime() + complexUser.user_id;

    var _this = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }


        var geocoder = new google.maps.Geocoder;
        console.log(geocoder)
        geocoder.geocode({'location': {lat:pos.lat,lng:pos.lng}}, function(results, status){
          if (status == 'OK') {
            console.log(results);
            if (results[0]){
              strLocation = results[0].formatted_address;
              console.log(strLocation)

            }
          }

        FirebaseAccount.CreateEvent(id, title, description, pos.lat, pos.lng, complexUser.user_id, strLocation);

        for (group in checkedGroups) {
          FirebaseAccount.AddEventToGroup(id, title, checkedGroups[group]);
        }

        var newEvent = {id:id, title:title, description:description, lat:pos.lat,lng:pos.lng, strLocation:strLocation}
        _this.addMarkerToMap(newEvent);


      });




      });

    }
  }

  this.createNewGroup = function(title, description) {
    var dateMark = new Date();
    var id = "G" + dateMark.getTime() + complexUser.user_id;


    FirebaseAccount.CreateGroup(id, title, description);
    console.log(current_user);
    console.log(id);
    FirebaseAccount.AddUserToGroup(complexUser.user_id, complexUser.username, id);
    // UPDATERA LISTAN HÄR, NU ADDERAR DU BARA TILL Firebase
    // DU MÅSTE OCKSÅ ÄNDRA LISTAN: userGroups manuellt,
    // t.ex. genom att bara gör ett eget object med  datan id, title , desc samt member,
    // sen pusha in det i listan userGroups.
  }

  this.editUserProfile = function(age, city, description) {
    var updatedInfo = {};
    // updatedInfo.user_id = complexUser.user_id;
    // updatedInfo.username = complexUser.username;
    console.log(age)
    console.log(typeof city == "undefined")
    console.log(description)

    if (typeof age != "undefined") {
      updatedInfo.age = age;
    }
    if (typeof city != "undefined") {
      updatedInfo.city = city;
    }
    if (typeof description != "undefined") {
      updatedInfo.description = description;
    }

    FirebaseAccount.EditProfile(current_user, updatedInfo);

    // var updatedInfo = {
    //   age: age,
    //   city: city,
    //   description: description
    // }
    //     FirebaseAccount.CreateGroup(id, title, description);
    //     console.log(current_user);
    //     console.log(id);
    //     FirebaseAccount.AddUserToGroup(current_user, id);
  }




  this.addMember = function(userToAdd) {
    console.log("Inne i addMember")
    console.log(userToAdd)
    console.log(currentGroup)
    for (member in allUsers) {
      if (allUsers[member].username == userToAdd) {
        console.log(allUsers[member].username)
        FirebaseAccount.AddUserToGroup(allUsers[member].user_id, allUsers[member].username, currentGroup);
      }
    }
  }
  // UPDATERA LISTAN HÄR, NU ADDERAR DU BARA TILL Firebase
  // DU MÅSTE OCKSÅ ÄNDRA LISTAN: userGroups manuellt,
  // t.ex. genom att bara gör ett eget object med  datan id, title , desc samt member,
  // sen pusha in det i listan userGroups.




  this.addMarkerToMap = function(newEvent) {
    console.log("------ ------- ADD TO MARKER ------ --------")
    console.log(newEvent)
    eventMarkers.push(newEvent);
    var location = {lat:newEvent.lat, lng:newEvent.lng};
    map.setCenter(location);

    var newMarker = new google.maps.Marker({
      position: location,
      map: map,
      animation: google.maps.Animation.BOUNCE,
      title: newEvent.title,
      icon: 'marker.png',
      id: newEvent.id,
      address: newEvent.strLocation
    })

    newMarker.info = new google.maps.InfoWindow({
      content: '<div class="mapInfoWindow">' + '<h1>' + newEvent.title + '</h1>' + newEvent.strLocation + '<p>' + newEvent.description + '</p>' + '</div>'
    });

    newMarker.addListener('click', function(){
      // console.log(this);
      (this.info).open(map, this);
    });


    markers.push(newMarker);

    // this.markerListener();

    // var geocoder = new google.maps.Geocoder;
    // var infowindowG = new google.maps.InfoWindow;
    // var latlng = new google.maps.LatLng(59.323105,18.095467);

    // this.geocodeLatLng(geocoder, map, infowindowG);
  }

  this.removeMarkerFromMap = function(event_id) {
    console.log(event_id)
    console.log(markers)
    for (eventInfo in eventMarkers) {
      if (eventMarkers[eventInfo].event_id == event_id) {
        eventMarkers.splice(eventInfo,1);
      }
    }

    for (marker in markers) {
      if (markers[marker].id == event_id) {
        markers.splice(marker,1);
      }
    }
  }

  this.getCurrentLocation = function() {
    console.log("DU E JESUS 2")
    console.log(currentLocation)
    return currentLocation;
  }

  this.addOrRemoveGroup = function(groupname) {
    var flag = true;
    for (group in checkedGroups) {
      if (checkedGroups[group] == groupname) {
        checkedGroups.splice(group,1);
        flag = false;
      }
    }

    if (flag) {
      checkedGroups.push(groupname)
    }
    console.log("Detta är grupplistan:")
    console.log(checkedGroups)
  }

  // -------------SETTERS-------------
  // -------------SETTERS-------------

  this.setCurrentItem = function(itemID) {
    for (i=0; i<(completeList).length; i++) {
      if (completeList[i].id == itemID) {
        currentItem = completeList[i];
      }
    }
    for (i=0; i<(itemList).length; i++) {

      if (itemList[i].id == itemID) {
        currentItem = itemList[i];
      }
    }
    updateCookie_userbased();
  }


  this.setFirebaseUser = function (firebaseUser) {
    if (firebaseUser == null) {
      current_user = firebaseUser;
    }
    else {
      current_user = firebaseUser.uid
    }
    updateCookie_userbased();
  }


  this.getFirebaseUserUID = function () {
    return current_user;
  }



  // -------------UPDATES-------------
  // -------------UPDATES-------------



  var updateCookie_userbased = function() {
    console.log("updateCookie - User 1:")
    var user_cookie;
    var currentItem_cookie;
    var currentGroup_cookie;
    var complexUser_cookie;
    var currentProfile;

    console.log(user_cookie)
    // currentItem_cookie = currentItem;
    user_cookie = current_user;
    currentGroup_cookie = currentGroup;
    complexUser_cookie = complexUser;
    currentProfile_cookie = currentProfile;


    console.log(user_cookie)
    console.log(current_user)
    console.log(currentGroup_cookie)

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);

    // $cookies.putObject('currentItem_cookie', currentItem_cookie, {'expires': expireDate});
    $cookies.putObject('user_cookie', user_cookie, {'expires': expireDate});
    $cookies.putObject('currentGroup_cookie', currentGroup_cookie, {'expires': expireDate});
    $cookies.putObject('complexUser_cookie', complexUser_cookie, {'expires': expireDate});
    $cookies.putObject('currentProfile_cookie', currentProfile_cookie, {'expires': expireDate});

  }




  var map;
  var markers = [];
  var infowindows = [];
  var markerTitle = [];


  // this will be data from firebase later!
  // location ska vara baserad på koordinaterna, dvs få ut location genom koordinater
  var eventMarkers = [
    // {lat:59.323521,lng:18.096347},
    // {title:'Test Title', description:'Test Description', lat:59.323636,lng:18.097302, location:'KTH'},
    // {title:'Test Title 2', description:'Test Description 2', lat:59.323105,lng:18.095467}
  ];

  this.initMap = function() {
    console.log("SKAPAR KARTARN")
    console.log(eventMarkers)
    console.log(markers)

    var _this = this;
    console.log(window.location)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){

        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }


        var location = {lat:pos.lat, lng:pos.lng};
        console.log("LOCATION:")
        console.log(location)
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: location,
          disableDefaultUI: true
        });
        console.log("EventMarkers")
        console.log(eventMarkers)
        for (var i = 0; i < eventMarkers.length; i++) {
          console.log("KOLLA")
          console.log(eventMarkers[i])
          var newInfoMarker = new google.maps.Marker({
            position: {lat:eventMarkers[i].lat, lng:eventMarkers[i].lng},
            map: map,
            animation: google.maps.Animation.DROP,
            title: eventMarkers[i].title,
            icon: 'marker.png',
            address:eventMarkers[i].address
          })


          newInfoMarker.info = new google.maps.InfoWindow({
            content: '<div class="mapInfoWindow">' + '<h1>' + eventMarkers[i].title + '</h1>' + eventMarkers[i].address + '<p>' + eventMarkers[i].description + '</p>' + '</div>'
          });

          newInfoMarker.addListener('click', function(){
            // console.log(this);
            (this.info).open(map, this);
          });
          console.log("KOLLAR NEWINFOMARKER")
          console.log(newInfoMarker)
          console.log(markers)
          markers.push(newInfoMarker);

        }

        // _this.markerListener();

      });
                // });
    }




  }



  //
  this.geocodeLatLng = function(map, lat, lng){
    console.log(lat)
    console.log(lng)
    var geocoder = new google.maps.Geocoder;
    console.log(geocoder)
    // if (navigator.geolocation)
    //   navigator.geolocation.getCurrentPosition(function(position){
    //     var lat = position.coords.latitude;
    //     var lng = position.coords.longitude;
    return geocoder.geocode({'location': {lat:lat,lng:lng}}, function(results, status){
      console.log("NU E VI SNART KLARA!")
      if (status == 'OK') {
        console.log(results);
        if (results[0]){
          var yourLocation = results[0].formatted_address;
          console.log(yourLocation)
          // console.log(results[1].formatted_address);
          // currentLocation = yourLocation;
          // map.setZoom(11);
        }
      }
    });

  }






  // -------------INIT-------------
  // -------------INIT-------------



  var _this = this;

  this.init = function() {

    console.log("*********** INIT *****************")

    userGroups = [];
    userEvents = [];
    allUsers = [];
    eventMarkers = [];

    // complexGroupData = [];

    complexUser = [];
    console.log("HÄMTAR USER FRÅN COOKIESTORE:")
    current_user = $cookies.getObject('user_cookie');
    currentGroup = $cookies.getObject('currentGroup_cookie');
    complexUser = $cookies.getObject('complexUser_cookie');
    currentProfile = $cookies.getObject('currentProfile_cookie');


    console.log(current_user)
    console.log(currentGroup)
    // currentItem = $cookies.getObject('currentItem_cookie');

    if (current_user !== undefined && current_user != null) {
      var data_Users = FirebaseAccount.DownloadUsers();
      var data_Groups = FirebaseAccount.DownloadGroups();
      var data_Events = FirebaseAccount.DownloadEvents();

      var groups = [];
      var events = [];

      data_Users.$loaded().then(function() {
        for (user in data_Users) {
          allUsers.push(data_Users[user]);
          if (data_Users[user].$id == current_user) {

            var userInfo = data_Users[user];
            console.log(userInfo)
            complexUser = userInfo;
            updateCookie_userbased();
            console.log(complexUser)
            for (groupObj in userInfo.groups) {
              groups.push(userInfo.groups[groupObj].group_id)
            }
          }
        }
      });


      data_Groups.$loaded().then(function() {
        for (Group in data_Groups) {
          for (userGroup in groups) {
            if (data_Groups[Group].group_id == groups[userGroup]) {
              var groupInfo = data_Groups[Group];
              console.log(groupInfo);
              console.log(currentGroup);
              // if (groupInfo.group_id == currentGroup) {
              //   complexGroupData.push(groupInfo);
              //   console.log(complexGroupData);
              // }
              userGroups.push(groupInfo);
              for (eventObj in groupInfo.events) {
                events.push(groupInfo.events[eventObj].event_id)
              }
            }
          }
        }
      });

      data_Events.$loaded().then(function() {
        for (Event in data_Events) {
          for (userEvent in events) {
            if (data_Events[Event].event_id == events[userEvent]) {
              userEvents.push(data_Events[Event]);

              eventMarkers.push({
                title:data_Events[Event].event_name,
                description:data_Events[Event].event_description,
                owner:data_Events[Event].event_creator,
                lat:data_Events[Event].location.latitude,
                lng:data_Events[Event].location.longitude,
                address:data_Events[Event].event_address
              })

            }
          }
        }
        console.log(userGroups)
        console.log(userEvents)
        console.log(complexUser);
        console.log(window.location.hash)
        if (window.location.hash == '#!/events') {
          _this.initMap();
        }
      });
      // Man skulle kanske kunna ha en return true här, sedan return false i else satsen som du
      // får lägga till under här. Då kan man i controllern sen kolla att om true, ladda events -
      // annars, byt sida till login-sidan.
      console.log(complexUser);
    }
    else {
      console.log("ERROR - INGEN USER INLOGGAD")
    }
  }


  // -------------START-------------
  // -------------START-------------


  this.init();
  return this;



});
