import express from 'express';
import { 
    getSeleccionados, 
    postSeleccionado, 
    deleteSeleccionado 
} from '../controllers/seleccionadoController.js';

const router = express.Router();

router.get('/', getSeleccionados);
router.post('/', postSeleccionado);
router.delete('/:id', deleteSeleccionado);

export default router;