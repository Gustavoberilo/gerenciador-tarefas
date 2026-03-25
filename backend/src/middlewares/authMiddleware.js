import jwt from "jsonwebtoken"

const SECRET = "segredo_super_secreto"

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, SECRET)

    console.log("TOKEN DECODED:", decoded) // debug

    req.userId = decoded.id 

    next()
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido" })
  }
}