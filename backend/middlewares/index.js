const express=require("express");
const app=express();
const login=require("../routes/login/login");
app.use(express.json());

app.use("/getStarted",login);
app.listen(5000, () => console.log("Server running on port 5000"));
