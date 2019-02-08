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

                                    callback(data);
                                },err=>{
                                    //console.log(err);
                                    callback(err);
                                })
                            }
    }
})