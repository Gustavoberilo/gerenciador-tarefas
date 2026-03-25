import { prisma } from "../lib/prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SECRET = "segredo_super_secreto"

export async function register(req, res) {
  try {
    const { email, password, name } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    res.status(201).json(user)

  } catch (error) {
    res.status(500).json({ erro: "Erro ao registrar usuário" })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ erro: "Senha inválida" })
    }

    const token = jwt.sign(
      { userId: user.id },
      SECRET,
      { expiresIn: "1d" }
    )

    res.json({ token })

  } catch (error) {
    res.status(500).json({ erro: "Erro no login" })
  }
}