import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { filtrarEExportarCFOP } from './importsheet';

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

app.post('/upload', upload.single('planilha'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send('Nenhum arquivo enviado.');
    return;
  }

  res.send('Arquivo enviado com sucesso!');
});

app.get('/baixar-modelo', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, '..', 'modelo', 'Planilhacerta.xlsx');

  if (fs.existsSync(filePath)) {
    res.download(filePath, 'modelo_cfop.xlsx');
  } else {
    res.status(404).send('Arquivo modelo não encontrado.');
  }
});

app.get('/filtrar-cfop/:nomeArquivo', (req: Request, res: Response) => {
  const nomeArquivo = req.params.nomeArquivo;
  const caminhoDoArquivo = path.join(__dirname, '..', 'uploads', nomeArquivo);

  if (!fs.existsSync(caminhoDoArquivo)) {
    res.status(404).send('Arquivo não encontrado.');
    return;
  }

  try {
    const nomeArquivoFiltrado = filtrarEExportarCFOP(caminhoDoArquivo);
    const caminhoDownload = path.join(__dirname, '..', 'uploads', nomeArquivoFiltrado);
    res.download(caminhoDownload, nomeArquivoFiltrado);
  } catch (erro) {
    console.error(erro);
    res.status(500).send('Erro ao filtrar a planilha.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
