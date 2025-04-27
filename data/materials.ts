export interface Material {
  id: number;
  title: string;
  date: string;
  image: string;
  source?: string; // добавляем source как необязательное поле
}
