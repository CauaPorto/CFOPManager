import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import * as xlsx from 'xlsx';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORTA = process.env.PORT || 3001;


app.use(cors());
app.use(express.static('public'));


const upload = multer({ dest: 'uploads/' });


function importarPlanilha(caminho: string) {
  const workbook = xlsx.readFile(caminho); 
  const nomeDaPrimeiraAba = workbook.SheetNames[0]; 
  const planilha = workbook.Sheets[nomeDaPrimeiraAba]; 
  const dados = xlsx.utils.sheet_to_json(planilha); 
  return dados;
}


import { Request, Response } from 'express';

app.post('/upload', upload.single('arquivo'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).send('Nenhum arquivo enviado!');
    return;
  }

  const caminho = path.resolve(req.file.path);
  const dados = importarPlanilha(caminho);

  res.json({
    mensagem: 'Planilha importada com sucesso!',
    dados,
  });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
