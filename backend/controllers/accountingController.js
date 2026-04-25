import { transactionModel } from '../models/transactionModel.js';

export const getBalance = (req, res) => {
    try {
        const { targetDate } = req.query;
        let transactions = transactionModel.read();

        // Ordenar por fecha
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Filtro por fecha si se solicita
        if (targetDate) {
            transactions = transactions.filter(t => new Date(t.date) <= new Date(targetDate));
        }

        const history = [...transactions];

        // Lógica para agrupar saldos por cuenta (Balanza de Comprobación)
        const balances = transactions.reduce((acc, t) => {
            t.entries.forEach(entry => {
                const account = entry.account;
                if (!acc[account]) {
                    acc[account] = { debe: 0, haber: 0, saldo: 0 };
                }
                const d = parseFloat(entry.debe) || 0;
                const h = parseFloat(entry.haber) || 0;
                acc[account].debe += d;
                acc[account].haber += h;
                acc[account].saldo += (d - h);
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
            history: history, // Enviamos el historial filtrado
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

export const seedData = (req, res) => {
    try {
        const seed = [
            { id: 1, date: "2026-01-23", description: "Asiento de Apertura Nexium SAS", entries: [
                { account: 'AC-CA', debe: 5000, haber: 0 }, { account: 'AC-BA', debe: 45000, haber: 0 },
                { account: 'AC-IN', debe: 80000, haber: 0 }, { account: 'ANC-ME', debe: 10000, haber: 0 },
                { account: 'ANC-EC', debe: 25000, haber: 0 }, { account: 'AD-GI', debe: 5000, haber: 0 },
                { account: 'AD-PU', debe: 2000, haber: 0 }, { account: 'AD-RA', debe: 10000, haber: 0 },
                { account: 'C-CS', debe: 0, haber: 182000 }
            ]},
            { id: 2, date: "2026-01-28", description: "Compra de Contado", entries: [
                { account: 'AC-IN', debe: 20000, haber: 0 }, { account: 'AC-IV', debe: 3000, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 23000 }
            ]},
            { id: 3, date: "2026-01-31", description: "Compra Mixta (20% contado)", entries: [
                { account: 'AC-IN', debe: 5000, haber: 0 }, { account: 'AC-IV', debe: 160, haber: 0 },
                { account: 'AC-IP', debe: 640, haber: 0 }, { account: 'AC-BA', debe: 0, haber: 1160 },
                { account: 'PC-PR', debe: 0, haber: 4640 }
            ]},
            { id: 4, date: "2026-02-04", description: "Compra 100% Crédito", entries: [
                { account: 'AC-IN', debe: 10000, haber: 0 }, { account: 'AC-IP', debe: 1600, haber: 0 },
                { account: 'PC-PR', debe: 0, haber: 11600 }
            ]},
            { id: 5, date: "2026-02-06", description: "Cobro de Anticipo a Clientes", entries: [
                { account: 'AC-BA', debe: 2320, haber: 0 }, { account: 'PC-AC', debe: 0, haber: 2000 },
                { account: 'PC-IT', debe: 0, haber: 320 }
            ]},
            { id: 6, date: "2026-02-10", description: "Pago de Renta Anticipada", entries: [
                { account: 'AD-RA', debe: 5000, haber: 0 }, { account: 'AC-IV', debe: 800, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 5800 }
            ]},
            { id: 7, date: "2026-02-12", description: "Compra de Papelería (Contado)", entries: [
                { account: 'AD-PU', debe: 1000, haber: 0 }, { account: 'AC-IV', debe: 160, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 1160 }
            ]},
            { id: 8, date: "2026-03-04", description: "Venta Total y Cancelación Anticipo", entries: [
                { account: 'PC-AC', debe: 2000, haber: 0 }, { account: 'AC-CL', debe: 9280, haber: 0 },
                { account: 'RI-VE', debe: 0, haber: 10000 }, { account: 'PC-IX', debe: 0, haber: 1280 }
            ]},
            { id: 9, date: "2026-02-28", description: "Depreciación Mensual", entries: [
                { account: 'RE-GA', debe: 708.33, haber: 0 }, { account: 'ANC-DAM', debe: 0, haber: 83.33 },
                { account: 'ANC-DAC', debe: 0, haber: 625 }
            ]},
            { id: 10, date: "2026-03-08", description: "Compra de Contado", entries: [
                { account: 'RE-CO', debe: 10000, haber: 0 }, { account: 'AC-IV', debe: 1600, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 11600 }
            ]},
            { id: 11, date: "2026-03-10", description: "Compra a Crédito", entries: [
                { account: 'RE-CO', debe: 5000, haber: 0 }, { account: 'AC-IP', debe: 800, haber: 0 },
                { account: 'PC-PR', debe: 0, haber: 5800 }
            ]},
            { id: 12, date: "2026-03-12", description: "Venta de Contado", entries: [
                { account: 'AC-BA', debe: 11600, haber: 0 }, { account: 'RI-VE', debe: 0, haber: 10000 },
                { account: 'PC-IT', debe: 0, haber: 1600 }
            ]},
            { id: 13, date: "2026-03-14", description: "Venta a Crédito", entries: [
                { account: 'AC-CL', debe: 23200, haber: 0 }, { account: 'RI-VE', debe: 0, haber: 20000 },
                { account: 'PC-IX', debe: 0, haber: 3200 }
            ]},
            { id: 14, date: "2026-03-16", description: "Gastos de Compra", entries: [
                { account: 'RE-GC', debe: 1000, haber: 0 }, { account: 'AC-IV', debe: 160, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 1160 }
            ]},
            { id: 15, date: "2026-03-18", description: "Devolución s/Venta (Contado)", entries: [
                { account: 'RE-DV', debe: 2000, haber: 0 }, { account: 'PC-IT', debe: 320, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 2320 }
            ]},
            { id: 16, date: "2026-03-20", description: "Rebaja s/Venta (Contado)", entries: [
                { account: 'RE-RV', debe: 1000, haber: 0 }, { account: 'PC-IT', debe: 160, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 1160 }
            ]},
            { id: 17, date: "2026-03-22", description: "Gastos de Venta", entries: [
                { account: 'RE-GV', debe: 8000, haber: 0 }, { account: 'AC-IV', debe: 480, haber: 0 },
                { account: 'AC-BA', debe: 0, haber: 8480 }
            ]},
            { id: 18, date: "2026-03-24", description: "Devolución s/Compra (Contado)", entries: [
                { account: 'AC-BA', debe: 2320, haber: 0 }, { account: 'RI-DC', debe: 0, haber: 2000 },
                { account: 'AC-IV', debe: 0, haber: 320 }
            ]},
            { id: 19, date: "2026-03-26", description: "Rebaja s/Compra (Contado)", entries: [
                { account: 'AC-BA', debe: 1160, haber: 0 }, { account: 'RI-RC', debe: 0, haber: 1000 },
                { account: 'AC-IV', debe: 0, haber: 160 }
            ]},
            { id: 20, date: "2026-03-31", description: "Ajuste Rentas", entries: [
                { account: 'RE-GA', debe: 10000, haber: 0 }, { account: 'AD-RA', debe: 0, haber: 10000 }
            ]},
            { id: 21, date: "2026-03-31", description: "Ajuste Papelería", entries: [
                { account: 'RE-GA', debe: 150, haber: 0 }, { account: 'AD-PU', debe: 0, haber: 150 }
            ]},
            { id: 22, date: "2026-04-01", description: "Creación Fondo Caja Chica", entries: [
                { account: 'AC-FF', debe: 20000, haber: 0 }, { account: 'AC-BA', debe: 0, haber: 20000 }
            ]},
            { id: 23, date: "2026-04-17", description: "Gastos Menores (Caja Chica)", entries: [
                { account: 'RE-GG', debe: 1250, haber: 0 }, { account: 'AC-IV', debe: 200, haber: 0 }, { account: 'AC-FF', debe: 0, haber: 1450 }
            ]}
        ];
        transactionModel.write(seed);
        res.json({ message: "Seeding Nexium completado con 23 asientos.", count: 23 });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

