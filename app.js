import express from "express";
import {PORT} from './config/env.js'
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import subscriptionRouter from "./subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(arcjetMiddleware);


app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/subscriptions',subscriptionRouter)

app.use(errorMiddleware)


app.get('/',(req,res)=>{
    res.send("welcome to first route");
})

app.listen(PORT,async()=>{
    console.log(`server running on ${PORT}`);
    await connectToDatabase();
})

export default app;