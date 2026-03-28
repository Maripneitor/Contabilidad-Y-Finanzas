import express from 'express';
import cors from 'cors';
import accountingRoutes from './routes/accountingRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', accountingRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor Nexium corriendo en puerto ${PORT}`));
