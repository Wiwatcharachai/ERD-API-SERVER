import express  from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./posts.js"




async function init() {

    // const express = require('express')
    const app = express(); 
    const port = 4002;

    app.use(cors()); 
    app.use(bodyParser.json());
    app.use("/posts", postRouter)

    app.get("/", async (req, res) => {
        return res.send("Hello! THIS IS POSTS APP")
});

app.get("*", (req, res)=>{
    res.status(404).send("Not found");
})

app.listen(port, () => {
     console.log(`Server is listening on ${port}`)
})

};

init();