const mongoose=require('mongoose'); 

mongoose.connect("mongodb://localhost:27017/GraphMind").then(()=>console.log("DB connected Successfully!"));

const UserSchema=new mongoose.Schema({
    name:{type:String, required:true},
    phn_no:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:String,
});

const DiagramSchema = new mongoose.Schema({
    title:{type:String, required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    user_name:{type:String, required:true},
    date_created:{type:Date, default:Date.now},
    last_updated:{type:Date, default:Date.now},
    description:{type:String, required:false},
    diagram:[
        {
            type: mongoose.Schema.Types.Mixed
        }
    ]
});

const Diagram=mongoose.model("Diagram",DiagramSchema);
const User=mongoose.model("User",UserSchema);

module.exports={User,Diagram};
