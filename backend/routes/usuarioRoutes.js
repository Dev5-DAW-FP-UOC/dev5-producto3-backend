import express from 'express';

import { 
    getUsuarios, 
    postUsuario, 
    putUsuario, 
    deleteUsuario, 
    login 
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getUsuarios);
router.post('/', postUsuario);
router.put('/:email', putUsuario);
router.delete('/:email', deleteUsuario); 

export default router;