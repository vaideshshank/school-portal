const express=require('express'),
bodyParser=require('body-parser'),
mongoose=require('./database_conn/conn'),
url=require('url'),
autoIncrement=require('mongoose-auto-increment'),
app=express();

var port=process.env.PORT||5000;

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

mongoose.connect();

var class_ids_model=mongoose.classIdModel('class_ids');
var teachers_model=mongoose.teachersModel('teachers');
var students_model=mongoose.studentsModel('students');
  

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
            class_id:data.id
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
    var stu=[];
    teachers_model.find({
        teacher_name:teacherName
    }).then(function(res1){
        var tData=res1[0].class_ids;
        
        console.log(tData);
        tData.forEach(function(val){
            students_model.find({
                class_id:val
            }).then(function(res2){
                res2.forEach(function(value){
                    stu.push(value);
                })
            },function(err){
                throw err;
            })
        })
        res.json(stu);
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
    var teacher=req.body.teacherName;

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
        
        })
        
        
    })
})


app.get('/',(req,res)=>{
    console.log(__dirname);
    res.sendFile(__dirname+'/index.html');
})

app.listen(port,function(err){
    console.log("Connected to "+port);
})
