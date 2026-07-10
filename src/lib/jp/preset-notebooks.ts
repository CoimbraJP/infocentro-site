import { createEmptyNotebook, type NotebookLabel } from './etiquetas';

// Lista de notebooks que o usuário passou pra já vir preenchidos no gerador
// (/jp/etiquetas), pra ele só revisar e completar o que faltar. Tela, placa
// de vídeo e valor à vista não foram informados pra nenhum modelo, então
// ficam no padrão/em branco — e o campo de bateria só aceita "Boa" ou
// "Ruim", então descrições como "nova", "muito excelente" ou "ok" foram
// todas mapeadas pra "Boa" (só "ruim" virou "Ruim").
type PresetNotebook = Partial<
  Pick<NotebookLabel, 'marcaModelo' | 'processador' | 'memoriaRam' | 'armazenamento' | 'sistemaOperacional' | 'bateria'>
>;

const PRESET_NOTEBOOKS: PresetNotebook[] = [
  {
    marcaModelo: 'Lenovo G40-80',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '500GB HD',
    sistemaOperacional: 'Windows 11',
    bateria: 'Ruim',
  },
  {
    marcaModelo: 'Dell Vostro 14 3468',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '500GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Ruim',
  },
  {
    marcaModelo: 'Lenovo ThinkPad E431',
    processador: 'Intel Core i3',
    memoriaRam: '6GB RAM',
    armazenamento: '320GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Lenovo IdeaPad S145',
    processador: 'Intel Core i5 8ª Geração',
    memoriaRam: '8GB RAM',
    armazenamento: '240GB SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Compaq Presario CQ-17',
    processador: 'Intel Core i5',
    memoriaRam: '4GB RAM',
    armazenamento: '32GB SSD + 500GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Samsung 350X',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '240GB NVMe SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Acer Aspire A315-53',
    processador: 'Intel Core i3 7ª Geração',
    memoriaRam: '8GB RAM',
    armazenamento: '120GB SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Dell Vostro 3300',
    processador: 'Intel Core i5',
    memoriaRam: '4GB RAM',
    armazenamento: '128GB NVMe SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Asus K45A',
    processador: 'Intel Core i5',
    memoriaRam: '8GB RAM',
    armazenamento: '240GB SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Lenovo L440',
    processador: 'Intel Core i7',
    memoriaRam: '16GB RAM',
    armazenamento: '120GB SSD',
    sistemaOperacional: 'Windows 11',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Samsung NP550X',
    processador: 'Intel Celeron',
    memoriaRam: '4GB RAM',
    armazenamento: '500GB HD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
  {
    marcaModelo: 'Positivo Vision C15',
    processador: 'Intel Celeron',
    memoriaRam: '4GB RAM',
    armazenamento: '120GB NVMe SSD',
    sistemaOperacional: 'Windows 10',
    bateria: 'Boa',
  },
];

/** Gera a lista de notebooks já preenchidos com os modelos do usuário (cada um com id/expiração novos). */
export function createPresetNotebooks(): NotebookLabel[] {
  return PRESET_NOTEBOOKS.map((preset) => ({
    ...createEmptyNotebook(),
    ...preset,
  }));
}
