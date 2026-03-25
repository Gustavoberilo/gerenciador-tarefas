import { Router } from "express";
import {
    criarUsuario,
    listarUsuario,
    atualizarUsuario,
    deletarUsuario
}from '../controllers/userController.js'

const router = Router()

router.post('/usuarios',criarUsuario)
router.get('/usuarios', listarUsuario)
router.put('/usuarios/:id', atualizarUsuario)
router.delete('/usuarios/:id', deletarUsuario)

export default router