import * as XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';

export function importarPlanilha(caminhoDoArquivo: string) {
  const fileBuffer = fs.readFileSync(path.resolve(caminhoDoArquivo));
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const nomeDaPrimeiraAba = workbook.SheetNames[0];
  const primeiraAba = workbook.Sheets[nomeDaPrimeiraAba];
  const dados = XLSX.utils.sheet_to_json(primeiraAba);

  console.log('Dados importados:', dados);

  return dados;
}
