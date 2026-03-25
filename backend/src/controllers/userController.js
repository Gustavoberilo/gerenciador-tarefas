import { prisma } from '../lib/prisma.js'

export async function criarUsuario(req,res){
    try {
        const {name, email, age} = req.body

        const novoUsuario = await prisma.user.create({
            data: {name, email, age}
        })

        res.status(201).json(novoUsuario)
    } catch (error) {
        res.status(500).json({erro: "Erro ao criar usuário"})
    }
}

export async function listarUsuario(req,res) {
    try {
        const usuarios = await prisma.user.findMany()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({erro:"Erro ao buscar usuários"})
    }
}

export async function atualizarUsuario(req , res) {
    try {
        const {id} = req.params
        const {name,email,age} = req.body

        const usuarioAtualizado = await prisma.user.update({
            where:{id},
            data:{name,email,age}
        })

        res.status(201).json(usuarioAtualizado)
    } catch (error) {
        res.status(500).json({erro:"Erro ao atualizar usuários"})
    }
}

export async function deletarUsuario(req, res) {
    try {
        const {id} = req.params
        await prisma.user.delete({
            where:{id}
        })

        res.status(201).json({mensagem:"Usuário deletado"})
    } catch (error) {
        res.status(500).json({erro:"Erro ao deletar usuário"})
    }
}