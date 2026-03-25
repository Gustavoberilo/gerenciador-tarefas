import express from "express"
import { criarTask, listaTask, deletarTask, toggleTask } from "../controllers/taskController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/task", authMiddleware, criarTask)
router.get("/task", authMiddleware, listaTask)
router.delete("/task/:id", authMiddleware, deletarTask)
router.patch("/task/:id", authMiddleware, toggleTask)

export default router