import express from "express"
import { register, login } from "../controllers/authController.js"
import { prisma } from "../lib/prisma.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", getMe)

export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar usuário" })
  }
}

export default router