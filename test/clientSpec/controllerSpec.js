
describe("AuthController tests", function() {
  beforeEach(module('hack'));

  var following = [];

  beforeEach(module({
    Links: {
    getPersonalStories: function(users) {
      console.log('users: ' + users);
      following = users;
    }
    }
  }));

  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('Auth');
    Followers = $injector.get('Followers');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    // used to create our AuthController for testing
    createController = function () {
      return $controller('AuthController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Auth: Auth,
        Followers: Followers
      });
    };

    createController();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('com.hack');
  });

  it('should have a signup method', function() {
    expect($scope.signup).to.be.a('function');
  });

  it('should have a signin method', function() {
    expect($scope.signin).to.be.a('function');
  });

  it('should have a logout method', function() {
    expect($scope.logout).to.be.a('function');
  });

  it('should store username and token in localStorage after signup', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';

    // make a 'fake' request to the server, not really going to our server
    $httpBackend.expectPOST('/api/users/signup').respond({token: token});
    $scope.newUser = {username: 'testUser'};
    $scope.signup();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.hack')).to.equal(token);
  });

  it('should store username, token, and followers in localStorage after signin', function() {
    // create a fake JWT for auth
    var token = 'sjj232hwjhr3urw90rof';
    var followers = 'user1,user2';

    // make a 'fake' request to the server, not really going to our server
    $httpBackend.expectPOST('/api/users/signin').respond({token: token, followers: followers});
    $scope.user = {username: 'testUser'};
    $scope.signin();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.hack')).to.equal(token);
    expect($window.localStorage.getItem('hfUsers')).to.equal('user1,user2');
  });

  it('should set $scope.loggedIn to false and empty localStorage after logout is called', function() {
    var followers = 'user1,user2';
    $httpBackend.expectPOST('/api/users/signin').respond({followers: followers});
    $scope.user = {username: 'testUser'};
    $scope.signin();
    $httpBackend.flush();
    $scope.logout();
    expect($scope.loggedIn).to.equal(false);
    expect($window.localStorage.getItem('com.hack')).to.equal(null);
    expect($window.localStorage.getItem('hfUsers')).to.equal(null);
  });

});


describe("CurrentlyFollowingController tests", function() {
   beforeEach(module('hack'));

   var following = [];

   beforeEach(module({
    Followers: {
      addFollower: function(user) {
        following.push(user);
      },
      removeFollower: function(user) {
        following = [];
      }
    }
   }));

   var $controller;

   beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
   }));

   afterEach(function() { });

   describe('$scope.follow', function () {
    it('sets $scope.newFollow to empty string', function() {
      var $scope = {};
      var controller = $controller('CurrentlyFollowingController', {$scope: $scope});
      $scope.follow('x');
      expect($scope.newFollow).to.equal("");
      expect(following).to.deep.equal(["x"]);
      $scope.unfollow('x');
      expect(following).to.deep.equal([]);
    });
   });
});


describe("PersonalController tests", function() {
  beforeEach(module('hack'));

   var following = [];

   beforeEach(module({
    Links: {
      getPersonalStories: function(users) {
        following = users;
      }
    },
    Followers: {
      following: ['pg', 'sama']
    }
   }));

  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    Followers = $injector.get('Followers');
    $scope = {users: ['pg', 'sama']};

    var $controller = $injector.get('$controller');

    // used to create our PersonalController for testing
    createController = function () {
      return $controller('PersonalController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Followers: Followers
      });
    };

    createController();
  }));

  it('should call fetchUsers() when controller is loaded', function () {
    createController();
    expect(following).to.deep.equal(['pg','sama']);
  });
});
