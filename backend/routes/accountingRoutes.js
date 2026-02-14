import express from 'express';
import {
    getBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction
} from '../controllers/accountingController.js';

const router = express.Router();

router.get('/balance', getBalance);
router.post('/transaccion', addTransaction);
router.put('/transaccion/:id', updateTransaction);
router.delete('/transaccion/:id', deleteTransaction);

export default router;
