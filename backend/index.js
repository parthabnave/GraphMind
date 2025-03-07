const express=require("express");
const app=express();
const login=require("../backend/routes/login/login");
const dashboard=require("../backend/routes/dashboard/dashboard");
const getParsedUML=require("../backend/uml_parser/umlParser");
app.use(express.json());

app.use("/getStarted",login);
app.use("/getParsedUML", getParsedUML);
app.use("/dashboard",dashboard);
app.listen(5000, () => console.log("Server running on port 5000"));
