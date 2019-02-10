app.factory('principalService',function($http){
    return {

        getCoordinators:function(callback){
                                $http({
                                    method:'GET',
                                    url:'/coordinators'
                                })
                                .then(function(resp){
                                    var data=[];
                                    //console.log(resp);
                                    resp.data.forEach(function(val){
                                        data.push(val);
                                    })

                                    callback(null,data);
                                },err=>{
                                    //console.log(err);
                                    callback(err);
                                })
                            },

        getTeacherOfCoors   :function(id,callback){
                            
                                $http({
                                    method:'GET',
                                    url:'/teachOfCoor',
                                    params:{
                                        teacherId:id
                                    }
                                })
                                .then(function(res){
                                    //console.log("ckrjlkecrlke;00");
                                    //console.log(res);
                                    callback(null,res.data);
                                },err=>{
                                    console.log(err);
                                    callback(err);
                                })

                            },

        getClasses          :   function(classes,callback){
                                    $http({
                                        method:'GET',
                                        url:'/classIds',
                                        params:{
                                            classIdArray:classes
                                        }
                                    })
                                    .then(function(res){
                                        callback(null,res.data);
                                    },err=>{
                                        console.log(err);
                                        callback(err);
                                    })
                                },

        getStudentsOfClass  : function(classId,callback){
                                    $http({
                                        method:'GET',
                                        url:'/getStudentsViaClassIds',
                                        params:{
                                            classId : classId
                                        }
                                    })
                                    .then(function(data){
                                        callback(null,data.data);
                                    },err=>{
                                        console.log(err);
                                    })
                                },

        loginTeacher        : function(userId,pass,callback){
                                    $http({
                                        method:'POST',
                                        url:'/checkLogin',
                                        data:{
                                            teacherId:userId,
                                            password:pass
                                        }
                                    })
                                    .then(function(data){
                                        if(data.data.message=='logged'){
                                            $http({
                                                method:'GET',
                                                url:'/getTeacherViaId',
                                                params:{
                                                    teacherId:userId
                                                }
                                            })
                                            .then(function(resp){
                                                callback(null,resp.data[0]);
                                            })
                                        }else{
                                            callback(null,data.data);
                                        }
                                    },err=>{
                                        console.log(err);
                                        callback(err);
                                    })
                                    
                                },

        updateRemark        :  function(teacherId,rollNo,classId,remark,callback){
                                    $http({
                                        method:'POST',
                                        url:'/recordRemark',
                                        data:{
                                            teacherId:teacherId,
                                            rollNo:rollNo,
                                            remark:remark,
                                            classId:classId
                                        }
                                    })
                                    .then(function(resp){
                                        callback(null,resp.data)
                                    },err=>{
                                        callback(err);
                                    })
                                }
        

    }
})