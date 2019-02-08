const app=angular.module("app",['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when('/teachers',{
        templateUrl:'templates/teachers.html',
        controller:'teachersControl'
    })
    .when('/teacherHead',{
        templateUrl:'templates/teacherHead.html',
        controller:'teacherHeadControl'
    })
    .when('/principal',{
        templateUrl:'templates/principal.html',
        controller:'principalControl'
    })
    .otherwise({
        template:'<h1>404</h1>'
    })
})

app.controller("teachersControl",function($scope){

})

app.controller("principalControl",function($scope,principalService){
    $scope.show=true;
    $scope.part=[true,false,false,false];
    principalService.getCoordinators(function(data){
        $scope.coordinator=data;
    });

    $scope.teacherInfo=function(obj){
        console.log(obj.coor)
    }
    
})