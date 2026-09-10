import { createEmptyNotebook, type NotebookLabel } from './etiquetas';

// Lista de notebooks que o usuário passou pra já vir preenchidos no gerador
// (/jp/etiquetas), pra ele só revisar e completar o que faltar. Tela e placa
// de vídeo não foram informadas pra nenhum modelo, então ficam no
// padrão/em branco — e o campo de bateria só aceita "Boa" ou "Ruim", então
// descrições como "nova", "muito excelente" ou "ok" foram todas mapeadas pra
// "Boa" (só "ruim" virou "Ruim"). valorAVista é o preço à vista digitado —
// o parcelado (12x) é sempre calculado a partir dele, nunca guardado direto.
type PresetNotebook = Partial<
  Pick<
    NotebookLabel,
    'marcaModelo' | 'processador' | 'memoriaRam' | 'armazenamento' | 'sistemaOperacional' | 'bateria' | 'valorAVista'
  >
>;

const PRESET_NOTEBOOKS: PresetNotebook[] = [
  {
    marcaModelo: 'Lenovo G40-80',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '500GB HD',
    sistemaOperacional: 'Windows 11',
    bateria: 'Ruim',
    valorAVista: '1899,00',
  },
  {
    marcaModelo: 'Dell Vostro 14 3468',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '500GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Ruim',
    valorAVista: '1499,00',
  },
  {
    marcaModelo: 'Lenovo ThinkPad E431',
    processador: 'Intel Core i3',
    memoriaRam: '6GB RAM',
    armazenamento: '320GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '1499,00',
  },
  {
    marcaModelo: 'Lenovo IdeaPad S145',
    processador: 'Intel Core i5 8ª Geração',
    memoriaRam: '8GB RAM',
    armazenamento: '240GB SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '2499,00',
  },
  {
    marcaModelo: 'Compaq Presario CQ-17',
    processador: 'Intel Core i5',
    memoriaRam: '4GB RAM',
    armazenamento: '32GB SSD + 500GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '1799,00',
  },
  {
    marcaModelo: 'Samsung 350X',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '240GB NVMe SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '2499,00',
  },
  {
    marcaModelo: 'Acer Aspire A315-53',
    processador: 'Intel Core i3 7ª Geração',
    memoriaRam: '8GB RAM',
    armazenamento: '120GB SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '1899,00',
  },
  {
    marcaModelo: 'Dell Vostro 3300',
    processador: 'Intel Core i5',
    memoriaRam: '4GB RAM',
    armazenamento: '128GB NVMe SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '2399,00',
  },
  {
    marcaModelo: 'Asus K45A',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '240GB SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '2399,00',
  },
  {
    marcaModelo: 'Lenovo L440',
    processador: 'Intel Core i7',
    memoriaRam: '16GB RAM',
    armazenamento: '120GB SSD',
    sistemaOperacional: 'Windows 11',
    bateria: 'Boa',
    valorAVista: '2999,00',
  },
  {
    marcaModelo: 'Samsung NP550X',
    processador: 'Intel Celeron',
    memoriaRam: '4GB RAM',
    armazenamento: '500GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '2399,00',
  },
  {
    marcaModelo: 'Positivo Vision C15',
    processador: 'Intel Celeron',
    memoriaRam: '4GB RAM',
    armazenamento: '120GB NVMe SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
    valorAVista: '1699,00',
  },
  {
    marcaModelo: 'Asus X5DIJ',
    processador: 'Intel Dual Core',
    memoriaRam: '4GB RAM',
    armazenamento: '320GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Ruim',
    valorAVista: '899,00',
  },
  {
    marcaModelo: 'Lenovo LNV L4070',
    processador: 'Intel Core i3',
    memoriaRam: '4GB RAM',
    armazenamento: '320GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Ruim',
    valorAVista: '899,00',
  },
  {
    marcaModelo: 'Asus X552E',
    processador: 'AMD C',
    memoriaRam: '4GB RAM',
    armazenamento: '500GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Ruim',
    valorAVista: '999,00',
  },
];

/** Gera a lista de notebooks já preenchidos com os modelos do usuário (cada um com id/expiração novos). */
export function createPresetNotebooks(): NotebookLabel[] {
  return PRESET_NOTEBOOKS.map((preset) => ({
    ...createEmptyNotebook(),
    ...preset,
  }));
}
