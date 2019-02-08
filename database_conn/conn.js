const mongoose=require('mongoose'),
autoIncrement=require('mongoose-auto-increment')

module.exports={
    connect                 : ()=>{
                                    mongoose.connect('mongodb://vaidesh:maggie3142857@ds223015.mlab.com:23015/student_remark',{useNewUrlParser:true},function(res){
                                        console.log(res);
                                        console.log("connectedto mongo");
                                    });

                                },

    classIdModel            :  (name)=>{
                                   return mongoose.model(name,new mongoose.Schema({
                                        class_id:{
                                            type:Number,
                                            unique:true,
                                            required:true
                                        },
                                        class: String,
                                        section: String
                                    }))
                                },
    
    teachersModel            :  (name)=>{
                                   return mongoose.model(name,new mongoose.Schema({
                                        teacher_id:{
                                            type:Number,
                                            unique:true,
                                            required:true
                                        },
                                        teacher_name: String,
                                        teacher_head_id: {
                                            type:Number,
                                            default:0
                                        },
                                        class_ids:Array
                                    }))
                                    
                                },
    
    studentsModel            :  (name)=>{
                                   return mongoose.model(name,new mongoose.Schema({
                                        roll_no:{
                                            type:Number,
                                            required:true
                                        },
                                        student_name: String,
                                        class_id:Number,
                                        remark: {
                                            type:String,
                                            default:""
                                        }
                                    }))
                                }
    

}