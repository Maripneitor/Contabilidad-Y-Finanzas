import { transactionModel } from '../models/transactionModel.js';

export const getBalance = (req, res) => {
    try {
        const { targetDate } = req.query;
        let transactions = transactionModel.read();

        // Ordenar por fecha
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

        const history = [...transactions];

        // Filtro por fecha si se solicita
        if (targetDate) {
            transactions = transactions.filter(t => new Date(t.date) <= new Date(targetDate));
        }

        // Lógica para agrupar saldos por cuenta
        const balances = transactions.reduce((acc, t) => {
            t.entries.forEach(entry => {
                acc[entry.account] = (acc[entry.account] || 0) + (entry.debe - entry.haber);
            });
            return acc;
        }, {});

        res.json({
            header: {
                company: "Nexium, S.A.S.",
                report: "Estado de Situación Financiera",
                date: targetDate || new Date().toISOString().split('T')[0]
            },
            body: balances,
            history: history, // Enviamos el historial completo para el Libro Diario
            footer: {
                elaboro: "Mario Efraín Moguel Hernández - Director",
                autorizo: "GONZALEZ ZUÑIGA NURIA"
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al calcular balance', error: error.message });
    }
};

export const addTransaction = (req, res) => {
    try {
        const transactions = transactionModel.read();
        const newTransaction = {
            id: Date.now(),
            date: req.body.date || new Date().toISOString().split('T')[0],
            description: req.body.description,
            entries: req.body.entries // Array de {account, debe, haber}
        };
        transactions.push(newTransaction);
        transactionModel.write(transactions);
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar transacción', error: error.message });
    }
};

export const updateTransaction = (req, res) => {
    try {
        const { id } = req.params;
        const transactions = transactionModel.read();
        const index = transactions.findIndex(t => t.id === parseInt(id));

        if (index !== -1) {
            transactions[index] = { ...transactions[index], ...req.body };
            transactionModel.write(transactions);
            res.json(transactions[index]);
        } else {
            res.status(404).json({ message: 'Transacción no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

export const deleteTransaction = (req, res) => {
    try {
        const { id } = req.params;
        let transactions = transactionModel.read();
        transactions = transactions.filter(t => t.id !== parseInt(id));
        transactionModel.write(transactions);
        res.json({ message: 'Transacción eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar', error: error.message });
    }
};
