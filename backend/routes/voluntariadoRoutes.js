import express from 'express';
import { 
    getVoluntariados, 
    postVoluntariado, 
    putVoluntariado, 
    deleteVoluntariado 
} from '../controllers/voluntariadoController.js';

const router = express.Router();

router.get('/', getVoluntariados);
router.post('/', postVoluntariado);
router.put('/:id', putVoluntariado);
router.delete('/:id', deleteVoluntariado);

export default router;