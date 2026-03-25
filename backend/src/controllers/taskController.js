import { prisma } from "../lib/prisma.js"

export async function listaTask(req, res) {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId }
    })

    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao buscar tasks" })
  }
}

export async function criarTask(req, res) {
  try {
    const { title } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        userId: req.userId
      }
    })

    res.status(201).json(task)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao criar task" })
  }
}

export async function deletarTask(req, res) {
  try {
    const { id } = req.params

    await prisma.task.delete({
      where: { id: id }
    })

    console.log("ID RECEBIDO:", req.params.id)
    res.json({ message: "Task deletada" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao deletar task" })
  }
}

export async function toggleTask(req, res) {
  try {
    const { id } = req.params

    const task = await prisma.task.findUnique({
      where: { id: id }
    })

    const updated = await prisma.task.update({
      where: { id: id},
      data: { done: !task.done }
    })

    res.json(updated)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro: "Erro ao atualizar task" })
  }
}