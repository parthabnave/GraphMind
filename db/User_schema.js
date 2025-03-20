const mongoose=require('mongoose'); 

mongoose.connect("mongodb+srv://kulkarnivyankatesh06:fYwrN0ZOu0wRSfBJ@cluster0.ks36v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const UserSchema=new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:String,
});

const PositionSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
});

const BaseDataSchema = new mongoose.Schema({
    left: { type: String, required: true },
    right: { type: String, required: true },
    leftType: { type: String, required: true },
    rightType: { type: String, required: true },
    leftArrowHead: { type: String, default: "" },
    rightArrowHead: { type: String, default: "" },
    leftArrowBody: { type: String, default: "-" },
    rightArrowBody: { type: String, default: "-" },
    leftCardinality: { type: String, default: "" },
    rightCardinality: { type: String, default: "" },
    label: { type: String, default: "" },
    hidden: { type: Boolean, default: false }
});

const ChangedDataSchema = new mongoose.Schema({
    left: { type: String, required: true },
    right: { type: String, required: true },
    leftType: { type: String, required: true },
    rightType: { type: String, required: true },
    leftArrowHead: { type: String, default: "" },
    rightArrowHead: { type: String, default: "" },
    leftArrowBody: { type: String, default: "-" },
    rightArrowBody: { type: String, default: "-" },
    position_actor: { type: PositionSchema, required: true },
    position_usecase: { type: PositionSchema, required: true }
});

const UMLSchema = new mongoose.Schema({
    title: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    user_name: { type: String, required: true },
    date_created: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
    description: { type: String, required: false },
    diagram: [
        {
            BaseData: { type: BaseDataSchema, required: true },
            ChangedData: { type: [ChangedDataSchema], default: [] }
        }
    ]
});

const UMLModel = mongoose.model("UML", UMLSchema);


// const Diagram=mongoose.model("Diagram",DiagramSchema);
const User=mongoose.model("User",UserSchema);

module.exports={User,UMLModel};
