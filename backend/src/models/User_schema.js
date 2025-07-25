const mongoose = require('mongoose');

// Database connection (add error handling in production)
mongoose.connect("mongodb+srv://kulkarnivyankatesh06:fYwrN0ZOu0wRSfBJ@cluster0.ks36v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Position Schema
const PositionSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
});

// Size Schema
const SizeSchema = new mongoose.Schema({
    width: { type: Number, required: true },
    height: { type: Number, required: true }
});

// Entity Schema (Actors & Use Cases)
const EntitySchema = new mongoose.Schema({
    identifier: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["actor", "useCase"] },
    position: { type: PositionSchema, required: true },
    size: { type: SizeSchema, required: true },
    label: { type: String, required: true }
});

// Relationship Schema
const RelationshipSchema = new mongoose.Schema({
    source: { type: String, required: true },
    target: { type: String, required: true },
    relationshipType: { type: String, required: true, enum: ["association", "includes", "excludes"] }
});

// Diagram Schema
const DiagramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    entities: [EntitySchema],
    relationships: [RelationshipSchema]
});

// Models
const Diagram = mongoose.model("Diagram", DiagramSchema);
const User = mongoose.model("User", UserSchema);

// Export
module.exports = { User, Diagram };