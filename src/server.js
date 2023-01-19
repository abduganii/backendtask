import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/index.js"

const app = express();

mongoose
    .connect("mongodb+srv://Abduganiy:rmFMzmMajqOVdFSC@cluster0.18iey.mongodb.net/inuser?retryWrites=true&w=majority")
    .then(console.log("MB connected"))
    .catch((err)=>console.log(err))

app.use(express.json());
app.use(cors());
app.use(router)

app.listen('7000', (err) => {
    if (err) {
      return console.log(err)
    }
    console.log(`Server is running in http://localhost:7000`)
})