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

app.controller("teachersControl",function($scope,principalService){
    $scope.show=true;
    $scope.part=[true,false,false];
    $scope.i=0;
    $scope.edit=true;
    
    $scope.login=function(id,pass){
        principalService.loginTeacher(id,pass,function(err,data){
            if(err){
                console.log(err);
            }else if(data.message=='noTeacherFound'){
                window.alert('Teacher Id is not presend in database');
                return;
            }else{
                principalService.getClasses(data.class_ids,function(err,data2){
                    if(err){
                        console.log(err);
                    }else{
                        data.class_ids=data2;
                        $scope.loggedTeacher=data;
                        console.log($scope.loggedTeacher);
                        window.alert(`Logged in as ${data.teacher_name}`);
                        $scope.show=false;
                    }
                })
                
                //$scope.part[]
            }
        })
    }

    $scope.studentInfo=function(clss){
        $scope.selectedClass=clss;
        principalService.getStudentsOfClass(clss.class_id,function(err,data){
            if(err){
                console.log(err);
            }else{
                $scope.students=data;
                console.log($scope.students);
                $scope.part[$scope.i]=false;
                $scope.i+=1;
                $scope.part[$scope.i]=true;
            }
        })
    }

    $scope.enableEdit=function(){
        $scope.edit=false;
        console.log($scope.edit);
    }

    $scope.updateRemark=function(remark,rollNo){
        principalService.updateRemark($scope.loggedTeacher.teacher_id,rollNo,$scope.selectedClass.class_id,remark,function(err,data){
            if(err){
                console.log(err);
            }else if(data.message=='updated'){
                alert('Remark updated');
            }
        })
    }

    $scope.goBack=function(){
        $scope.part[$scope.i]=false;
        $scope.i-=1;
        $scope.part[$scope.i]=true;
        
    }
})

app.controller("principalControl",function($scope,principalService){
    $scope.show=true;
    $scope.part=[true,false,false,false];
    $scope.i=0;

    principalService.getCoordinators(function(err,data){
        if(err){
            throw err;
        }
        $scope.coordinator=data;
    });

    $scope.teacherInfo=function(obj){
        $scope.selectedHeadTeacher=obj.coor.teacher_name;
        //console.log(obj.coor.teacher_name);
        principalService.getTeacherOfCoors(obj.coor.teacher_id,function(err,data){
            if(err){
                throw err;
            }
            
            console.log(data);

            data.forEach(function(indData,ind){
                principalService.getClasses(indData.class_ids,function(err,data2){
                    if(err){
                        throw err;
                    }
                    indData.class_ids=data2;
                });

                if(ind==data.length-1){
                    $scope.teachers=data;
                    console.log($scope.teachers);
                    $scope.part[$scope.i]=false;
                    $scope.i+=1;
                    $scope.part[$scope.i]=true;    
                }
            })
                 
        })
    }

    $scope.getStudentInfo=function(teacher,classInfo){
        

        $scope.selectedTeacher=teacher;
        $scope.selectedClass=classInfo;

        principalService.getStudentsOfClass(classInfo.class_id,function(err,data){
            $scope.students=data;
            console.log(data);
            $scope.part[$scope.i]=false;
            $scope.i+=1;
            $scope.part[$scope.i]=true;
        });


        
    }

    $scope.goBack=function(){
        $scope.part[$scope.i]=false;
        $scope.i-=1;
        $scope.part[$scope.i]=true;
        
    }
    
})