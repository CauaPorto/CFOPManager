import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export function filtrarEExportarCFOP(caminhoDoArquivo: string): string {
  const arquivo = fs.readFileSync(path.resolve(caminhoDoArquivo));
  const planilhaCompleta = XLSX.read(arquivo, { type: 'buffer' });

  const nomeAba = planilhaCompleta.SheetNames[0];
  const aba = planilhaCompleta.Sheets[nomeAba];

  const todasAsLinhas: any[][] = XLSX.utils.sheet_to_json(aba, {
    header: 1,
    defval: ''
  });

  const linhasFiltradas: any[][] = [['CFOP', 'Valor']];

  for (let i = 0; i < todasAsLinhas.length; i++) {
    const linhaAtual = todasAsLinhas[i];
    const cfop = String(linhaAtual[0]).trim();
    const valor = linhaAtual[1];

    if (cfop === '1104') {
      linhasFiltradas.push([cfop, valor]);
    }
  }

  const novaAba = XLSX.utils.aoa_to_sheet(linhasFiltradas);
  const novaPlanilha = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(novaPlanilha, novaAba, 'Filtrado');

  const nomeDoArquivoNovo = 'CFOP_filtrada.xlsx';
  const caminhoCompleto = path.join(__dirname, '../uploads', nomeDoArquivoNovo);
  XLSX.writeFile(novaPlanilha, caminhoCompleto);

  return nomeDoArquivoNovo;
}
