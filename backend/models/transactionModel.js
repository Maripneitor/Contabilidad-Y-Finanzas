import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'transacciones.json');

export const transactionModel = {
    read: () => {
        if (!fs.existsSync(filePath)) {
            // Asiento de apertura inicial basado en el PDF
            return [];
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return content ? JSON.parse(content) : [];
    },
    write: (data) => {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
};
