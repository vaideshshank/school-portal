const express=require('express'),
bodyParser=require('body-parser'),
mongoose=require('./database_conn/conn'),
url=require('url'),
autoIncrement=require('mongoose-auto-increment'),
app=express();


//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect();

var class_ids_model=mongoose.classIdModel('class_ids');
var teachers_model=mongoose.teachersModel('teachers');
var students_model=mongoose.studentsModel('students2');
var login_model=mongoose.loginModel('logins');  

app.post('/addLogin',(req,res)=>{
    var data=req.body;
    var loginInstance=new login_model({
        teacher_id:data.teacherId,
        password:data.password
    });

    loginInstance.save()
    .then((resp)=>{
        res.json({
            message:'SavedLoginInfo'
        })
    },err=>{
        console.log(err);
        res.json({message:'error encountered'});
    })
})

app.post('/checkLogin',(req,res)=>{
    var data=req.body;
    console.log("PASS : "+data.password)
    login_model.find({
        teacher_id:data.teacherId,
        password:data.password
    })
    .then(function(resp){
        if(resp.length==0){
            res.json({message:'noTeacherFound'});
        }else{
            res.json({message:'logged'})
        }
    },err=>{
        res.json({message:'error during login'});
    })
})

app.post('/recordRemark',(req,res)=>{
    var data=req.body;
    var obj={[data.teacherId]:data.remark};
    students_model.updateOne({
        class_id:data.classId,
        roll_no:data.rollNo,
    },{
        $push:{
            remark:obj                        //new feature to replace the key with a varible value in JS
        }
    })
    .then(function(resp){
        res.json({
            message:'updated'
        })
    },err=>{
        console.log(err);
    })
})


app.post('/recordClassIds',function(req,res){
    var data=req.body;
      
    //data.forEach(function(value){
    class_ids_model.find().sort({class_id:-1}).limit(1)
    .then(inst=>{
        var id=inst[0].class_id+1;
        var class_ids_instance=new class_ids_model({
            class_id:id,
            class:data.class,
            section:data.section
        })
        
        class_ids_instance.save().then((resp)=>{
            console.log("saved");
            res.json({"message":"success"})
        },(err)=>{
            throw err;
        })    
        
    },err=>{
        console.log(err);
    })
    

    //}) 
})

app.get('/classIds',(req,res)=>{
    var classIdArr=url.parse(req.url,true).query.classIdArray,arr=[],i=0;
    //classIdArr=JSON.parse(classIdArr);
    console.log(classIdArr);
    
    classIdArr.forEach((val,index)=>{

        class_ids_model.find({
            class_id:val
        })
        .then((resp)=>{
            arr.push(resp);
            i++;
            if(i==classIdArr.length){res.json(arr);}
        },err=>{
            console.log(err);
        });

        
    });
    
    
});

app.get('/getTeacherViaId',(req,res)=>{
    var id=url.parse(req.url,true).query.teacherId;
    teachers_model.find({
        teacher_id:id
    })
    .then(function(resp){
        res.json(resp);
    },err=>{
        console.log(err);
    })
})

app.get('/getStudentsViaClassIds',(req,res)=>{
    var classId=url.parse(req.url,true).query.classId;

    students_model.find({class_id:classId})
    .then(function(data){
        res.json(data);
    })
})

app.post('/addTeachers',(req,res)=>{
    var value=JSON.parse(req.body["teachersData"]);
    var id=0;
   
    console.log(value);

    //info.forEach(function(value){
      //  console.log(value);
    
    teachers_model.find().sort({teacher_id:-1}).limit(1)
    .then(function(result){
        id=result[0].teacher_id;
        
        return id;
    })
    .then(i=>{
        console.log(i);
        var teacher_info=new teachers_model({
            teacher_id:i+1,
            teacher_name:value.teacherName,
            teacher_head_id:value.teacherHead,
            class_ids:value.classIds
        })
        console.log(teacher_info);
        teacher_info.save()
        .then(function(resp){
            console.log(resp);
            console.log("saved");
            res.json({"message":"saved"});
        },
        err=>{
            console.log(err);
            
        })
    })
    .catch(err=>{
        console.log(err);
    })
    
    /*
      */
    //})
})

app.post("/addTeacherHead",(req,res)=>{
    var teacher=req.body.teacherName;

    teachers_model.find().sort({teacher_id:-1}).limit(1)
    .then(function(resp){
        var id=resp[0].teacher_id+1;
        return id;
    })
    .then(Id=>{
        var instanc=new teachers_model({
            teacher_head_id:Id,
            class_ids:null,
            teacher_id:Id,
            teacher_name:teacher
        })

        instanc.save()
        .then(function(response){
            console.log("saved as teacher Head");
            res.json({message:"SAved teacher head"});
        },(err)=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
});

app.post("/makeTeacherHead",(req,res)=>{
    var head=req.body;

    console.log(head);
    teachers_model.find({teacher_name:head.teacherName})
    .then((resp)=>{
        if(resp){
            console.log(resp);
            var tId=resp[0].teacher_id;
            return tId;
        }
    })
    .then(id=>{
        console.log(id);
        teachers_model.findOneAndUpdate({teacher_name:head.teacherName},{teacher_head_id:id})
        .then(function(respo){
            if(respo){
                console.log("updated");
                res.json({"message":"Teacher made head"});
            }
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

app.post('/addStudent',(req,res)=>{
    var data=req.body;

    class_ids_model.find({
        class:data.class,
        section:data.section
    })
    .then((resp)=>{
        var id=resp[0].class_id;
        
        var students_info=new students_model({
            roll_no:data.rollNo,
            student_name:data.studentName,
            class_id:id,
            remark:{0:"no remark"}
        })
    
        students_info.save()
        .then(function(result){
            if(result){
                console.log("saved")
                res.json({"message":"student data saved"});
            }
        },function(err){
            res.json({message:'Repeated entry'});
        })    
    })
    .catch(err=>{
        console.log(err);
    })
    
})

app.get('/uniqueStudent',(req,res)=>{
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var clss=query.class;
    var section=query.section;
    var roll=query.rollNo;

    console.log(`query ${clss} ${section} ${roll}`);

    //console.log('Query : '+query);
    class_ids_model.find({
        class:clss,
        section:section
    }).then(function(res1){
        var data=res1;
        console.log(data);
        students_model.find({
            class_id:data[0].class_id,
            roll_no:roll
        }).then(res2=>{
            console.log(res2);
            res.json(res2[0]);
        },err=>{
            console.log(err);
        });    
    })
    .catch(err=>{
        console.log(err);
        return;
    })

        
})

app.get('/allStudents',(req,res)=>{
    var url_query=url.parse(req.url,true);
    var query=url_query.query;

    var teacherName=query.teacherName;
    var stu=[],i=0;
    teachers_model.find({
        teacher_name:teacherName
    }).then(function(res1){
        var tData=res1[0].class_ids;
        
        console.log(tData);

       tData.forEach(function(val){
            students_model.find({
                class_id:val
            }).then(function(res2){
                //console.log("RES : "+res2);
                
                res2.forEach(function(val){
                    stu.push(val);
                })
                
                
                i++;
                if(i==tData.length){
                    console.log("STU : "+stu);

                    res.json(stu);
                  
                }               
            },function(err){
                throw err;
            })
       })
            
       
        
       
    },function(err){
        throw err;
    
})

       
})        
     
app.get('/coordinators',(req,res)=>{
    teachers_model.find({$where:function(){
        return this.teacher_id==this.teacher_head_id
    }})
    .then(resp=>{
        console.log(resp);
        res.json(resp);
    })
});

app.get("/classes",(req,res)=>{
    var teacher=url.parse(req.url,true).query.teacherName;
    
    console.log(teacher);
    teachers_model.find({teacher_name:teacher})
    .then(resp=>{
        var classIds=resp[0].class_ids;
        var classes=[];
        classIds.forEach((val,index)=>{
            class_ids_model.find({class_id:val},{_id:0,__v:0})
            .then(response=>{
                if(response.length>0){
                    //console.log(response[0]);
                    classes.push(response[0]);
                }

                if(index==classIds.length-1){
                    res.json(classes);
                }
            });
        
        },error=>{
            console.log(error);
        })
        
        
    },err=>{
        console.log(err);
    })
})

app.get("/teachOfCoor",(req,res)=>{
    var teacherId=Number(url.parse(req.url,true).query.teacherId);
    console.log(teacherId);
    teachers_model.find({teacher_head_id:teacherId})
    .then(data=>{
        //data='['+data+']';
        console.log(data);
        if(data==null){
            res.json({
                message:"No teacher under this coordinator"
            })
        }
        //var info;
        for(var i=0; i<data.length; i++){                               //foreach doesn't break
            if(data[i].teacher_id==data[i].teacher_head_id){
                return {
                    data:data,
                    index:i,
                };
            }
        }
        
    })
    .then(obj=>{       
        obj.data.splice(obj.index);
        res.json(obj.data);
    })
    .catch(err=>{
        console.log(err);
    })
    
})


app.get('/',(req,res)=>{
    console.log(__dirname);
    res.sendFile(__dirname+'/index.html');
})

app.listen(5000,function(err){
    console.log("Connected to 5000");
})
