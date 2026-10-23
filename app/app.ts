console.log("Hello World")


const folderPath:string = "./media/unsorted"
import express from "express"
import {Connection} from "./controller/Connector.ts"
import {tagImage} from "./controller/ImageHandler.ts";

let app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("./static"))
app.use('/media', express.static('./media'));

app.get("/",function (req,res) {
    res.status(200).json({
        message:"Running A-OK"
    })
})
app.post("/formdata",tagImage)


app.listen(3000, function (){
    console.log("waiting for people...")

})

