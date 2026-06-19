require('dotenv').config()
const express = require('express')
const cors = require('cors')
const port = 5000
const app = express()

const todoRoutes = require("./routes/todos")

app.use(express.json())
app.use(cors())
app.use('/todos', todoRoutes)
app.get("/", (req,res) => {
    res.send("Hello Prathibha")
})

app.listen(port, (req,res) =>{
    console.log(`server is running on ${port}`)
})

