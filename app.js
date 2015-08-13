angular.module("App",["ngRoute"])
.config(["$routeProvider",function($routeProvider){
  $routeProvider
  .when("/", {
    templateUrl: "index-tmpl",
    controller: "indexController"
  })
  .when('/folders', {
    templateUrl: 'folderes-tmpl',
    controller: "folderesController"
  })
}])
.service("musicplayer",["$rootScope",function($scope){
  this.setplayer= function(target){
    $scope.player_url = target.previewUrl
    document.getElementById("player").setAttribute("src",target.previewUrl);
    document.getElementById("player").play();
    $scope.player_img = target.artworkUrl100
  }
}])
.service("itunes",["$rootScope","$http",function($scope,$http){
  this.search_it = function(keyword){
    var url = "https://itunes.apple.com/search";
    console.log(keyword)
    var params = {
      term: keyword,
      lang: 'ja_jp',
      entry: 'music',
      media: 'music',
      country: 'JP',
      dataType: "jsonp",
      method: "GET",
      limit: "1",
      callback: "JSON_CALLBACK"
    };
    encodeURIComponent(params)
    $http.jsonp("https://itunes.apple.com/search",{params})
    .success(function(response){
      $scope.musics = response.results
      console.log($scope.musics)
    })
    .error(function(data, status, headers, config){
      console.log(status)
      console.log("fail")
    });
  }
}])
.service("folder",["$rootScope",function($scope){
  $scope.folderes=[];

  function reset_create_folder(){
    return create_folder = {
      name: "new folder",
      tracks: []
    }
  };
   this.new_folder= function(){
    reset_create_folder();
    console.log("新規フォルダ作成用意")
  };
  this.add_folder = function(folder_name){
    create_folder.name = folder_name;
    $scope.folderes.push(create_folder);
    create_folder = null;
    console.log($scope.folderes);
  };
}])
.controller("folderesController",["$scope","folder",function($scope,folder){
  console.log($scope.folderes)

}])
.controller("indexController",["$scope","itunes","folder","musicplayer",function($scope,itunes,folder,musicplayer){
  $scope.setplayer = function(target){
    musicplayer.setplayer(target);
  }
  $scope.search_itunes = function(keyword){
    itunes.search_it(keyword);
  }
  $scope.new_folder_mode = false;
  $scope.newfolder_name = "";
  $scope.new_folder = function(){
    folder.new_folder();
    $scope.new_folder_mode = true;
  }
  $scope.add_folder = function(){
    folder.add_folder($scope.newfolder_name);
    $scope.new_folder_mode = false;
    $scope.newfolder_name = null;
  }
  $scope.music_add_folder= function(target){
    $scope.folderes[0].musics.push(target);
  }
  $scope.out_new_folder= function(){
    $scope.new_folder_mode = false;
  }
  $scope.select_into_track= function(target){
    $scope.target_track = target;
  }
  $scope.select_into_folder = function(target_f){
    target_f.tracks.push($scope.target_track);
    $scope.target_track = null;
    console.log(target_f)
  }
}]);