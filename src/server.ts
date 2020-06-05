import express from "express";
import routes from "./routes";
import path from "path";

const app = express();

app.use(express.json());
app.use(routes);

//route to static files
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.listen(8069);