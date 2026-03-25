import express from 'express'
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import authRoutes from "./routes/authRoutes.js"
import cors from "cors"

const app = express() 

app.use(cors())
app.use(express.json())
app.use(authRoutes)
app.use(userRoutes)
app.use(taskRoutes)

app.listen(3000, ()=>{
    console.log("servidor rodando na porta 3000")
})