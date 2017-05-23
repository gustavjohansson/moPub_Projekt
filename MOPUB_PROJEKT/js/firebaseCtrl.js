carbonListApp.controller('FirebaseCtrl', function ($scope, $http, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {



  // $controller("SearchCtrl", {$scope: $scope});
  $scope.auth = FirebaseAccount.Auth();

  $scope.currentUser = Carbon.getCurrentUser();

  $scope.signOut = function () {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
      window.location = '#!/login';

    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }


  $scope.createUser = function(email, password, passwordCheck) {


    $scope.message = null;
    $scope.error = null;
    var checkUsername = Carbon.checkIfCorrectUsername(email);

    console.log(typeof email == "undefined")

    // Create a new user
    if (password !== passwordCheck) {
      console.log("ERROR 1")
      $scope.error = "Error: The passwords were not identical.";
    }


    else if (checkUsername == false) {
      console.log("ERROR 1")
      $scope.error = "Error: Your username can only contain letters.";
    }

    else if (typeof email == "undefined") {
      console.log("ERROR 1")
      $scope.error = "Error: You have to enter a valid username.";
    }

    else{
      console.log("ERROR 2")
      var emailFormat = email + "@gmail.com";
      $scope.auth.$createUserWithEmailAndPassword(emailFormat, password)
      .then(function(firebaseUser) {
        console.log("SUCCESS 1")
        console.log(email)

        // INITIALIZEUSER, IMPLEMENTATION 1
        // INITIALIZEUSER, IMPLEMENTATION 1
        FirebaseAccount.InitializeUser(firebaseUser.uid, email)
        $scope.message = "User created with uid: " + firebaseUser.uid;
        window.location = '#!/menu';
      }).catch(function(error) {
        console.log("ERROR 3")
        console.log(error)
        $scope.error = error;
      });
    }
  };

  $scope.signInWithEmail = function(email, password) {
    console.log("signInWithEmail 1")
    console.log(email)
    console.log(password)
    $scope.message = null;
    $scope.error = null;
    var emailFormat = email + "@gmail.com";
    if (typeof email == "undefined") {
      console.log("ERROR 1")
      $scope.error = "Error: You have to enter a valid username.";
    }
    // Create a new user
    $scope.auth.$signInWithEmailAndPassword(emailFormat, password)
    .then(function(firebaseUser) {
      console.log("SETFIREBASEUSER")
      console.log(firebaseUser)
      Carbon.setFirebaseUser(firebaseUser);

      $scope.message = "User created with uid: " + firebaseUser.uid;
      window.location = '#!/menu';
    }).catch(function(error) {
      console.log("error vid login")
      console.log(error)
      $scope.error = error;
      // $scope.sweAPIinfoError = "Oj, något gick fel! Kontrollera dina uppgifter.";
    });
  };


  // any time auth state changes, add the user data to scope
  firebase.auth().onAuthStateChanged(function(firebaseUser) {
    var referenceUserID = Carbon.getFirebaseUserUID();
    if (firebaseUser == null || referenceUserID != firebaseUser.uid) {
  console.log("INLOGGAD")
    $scope.firebaseUser = firebaseUser;
    Carbon.setFirebaseUser(firebaseUser);
    Carbon.init();
  }
 else {
  // No user is signed in.
  console.log("UTLOGGAD")
}
      // if(firebaseUser) {
        // window.location = '#!/login'; //After successful login, user will be redirected to home.html
        // window.location = '#!/menu';
      // }
      // else{
      // OMG HÄR KAN DU HA if $location != login or register, window.location = "login"!! SHIIITT
      // }
    //
  });

});
