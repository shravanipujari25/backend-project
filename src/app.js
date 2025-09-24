import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.get('/', (req, res) => {
  res.send('Hello, Shravani!');
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000` );
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16 kb"}))
app.use(express.urlencoded({extented:true,limit:"16kb"}))
app.use(express.static("Public"))
app.use(cookieParser())

//routes
import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users",userRouter)

//http://localhost8000/api/v1/users/register

export {app};