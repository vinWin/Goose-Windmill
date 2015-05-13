angular.module('hack.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('TopStoriesCtrl', function($scope, Links) {
  $scope.Math = window.Math;

  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 15;
  $scope.index = $scope.perPage;

  // $scope.currentlyFollowing = Followers.following;

  $scope.getData = function() {
    Links.getTopStories();
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.loadMore = function() {
    $scope.index = $scope.index + $scope.perPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.getData();
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});