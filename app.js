angular.module("App",["ngRoute"])
.config(["$routeProvider",function($routeProvider){
  $routeProvider
  .when("/", {
    templateUrl: "index-tmpl",
    controller: "ItunesController"
  })
  .when('/folders', {
    templateUrl: 'folders-tmpl',
    controller: "ItunesController"
  })
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
.service("folder",["$rootScope",function($scop){

}])
.controller("ItunesController",["$scope","itunes",function($scope,itunes){
  $scope.search_itunes = function(keyword){
    itunes.search_it(keyword);
  }
  $scope.setplayer= function(target){
    $scope.player_url = target.previewUrl
    document.getElementById("player").setAttribute("src",target.previewUrl);
    document.getElementById("player").play();
    $scope.player_img = target.artworkUrl100
  }


  $scope.folderes=[];
  $scope.new_folder_mode = false;
  $scope.newfolder_name = "";
  function reset_create_folder(){
    return create_folder = {
      name: "new folder",
      musics: []
    }
  }
  $scope.folderes.push(reset_create_folder())

  $scope.new_folder= function(){
    reset_create_folder();
    $scope.new_folder_mode = true;
    console.log("新規フォルダ作成用意")
  }
  $scope.add_folder = function(){
    create_folder.name = $scope.newfolder_name; 
    $scope.folderes.push(create_folder);
    create_folder = null;
    $scope.new_folder_mode = false;
    console.log($scope.folderes);
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
    target_f.musics.push($scope.target_track);
    $scope.target_track = null;
    console.log(target_f)
  }
}]);