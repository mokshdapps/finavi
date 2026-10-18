import type { Lang } from "@/lib/i18n";

export type Bilingual = { en: string; es: string };

export type WorkPreset = {
  id: string;
  label: Bilingual;
  note: Bilingual;
  weights: number[];
};

export const workPresets: WorkPreset[] = [
  {
    id: "berries",
    label: { en: "Berry harvest (WA)", es: "Cosecha de berries (WA)" },
    note: {
      en: "The short harvest season includes strawberries in June and blueberries and raspberries in July and August.",
      es: "La temporada de cosecha es corta, con fresas en junio y arándanos y frambuesas en julio y agosto.",
    },
    weights: [2, 2, 3, 5, 9, 18, 20, 16, 9, 6, 3, 2],
  },
  {
    id: "tree-fruit",
    label: { en: "Apples & tree fruit (WA)", es: "Manzana y fruta de árbol (WA)" },
    note: {
      en: "Work includes thinning in spring, cherry picking in June, and the main apple and pear harvest from September through November.",
      es: "El trabajo incluye raleo en primavera, cosecha de cerezas en junio y la temporada principal de manzanas y peras de septiembre a noviembre.",
    },
    weights: [3, 3, 5, 8, 8, 11, 7, 8, 15, 17, 10, 5],
  },
  {
    id: "asparagus",
    label: { en: "Asparagus & early row crops", es: "Espárrago y cultivos tempranos" },
    note: {
      en: "Cutting runs April into June, then work thins out fast.",
      es: "El corte va de abril a junio y luego el trabajo baja rápido.",
    },
    weights: [3, 4, 8, 16, 18, 13, 8, 7, 7, 6, 5, 5],
  },
  {
    id: "packing",
    label: { en: "Packing house / warehouse", es: "Empacadora / bodega" },
    note: {
      en: "Steadier than field work but still peaks after harvest and slows in late spring.",
      es: "Más estable que el campo, pero sube después de la cosecha y baja al final de la primavera.",
    },
    weights: [8, 8, 7, 6, 6, 7, 8, 9, 11, 12, 10, 8],
  },
  {
    id: "rideshare",
    label: { en: "Rideshare & delivery", es: "Transporte y entregas" },
    note: {
      en: "Demand is often stronger in summer and during the December holidays, and slower in January and February.",
      es: "La demanda suele aumentar en verano y durante las fiestas de diciembre, y bajar en enero y febrero.",
    },
    weights: [6, 6, 8, 8, 9, 10, 10, 9, 8, 8, 8, 10],
  },
  {
    id: "construction",
    label: { en: "Construction & landscaping", es: "Construcción y jardinería" },
    note: {
      en: "Rain and frost shut down outdoor work from November through February.",
      es: "La lluvia y la helada paran el trabajo de noviembre a febrero.",
    },
    weights: [4, 4, 7, 10, 12, 12, 13, 12, 10, 8, 5, 3],
  },
  {
    id: "fishing",
    label: { en: "Fishing & seafood processing", es: "Pesca y procesamiento" },
    note: {
      en: "Much of the year's income comes from one or two busy seasons, so setting money aside then helps cover the quieter months.",
      es: "Gran parte de los ingresos del año llega en una o dos temporadas fuertes, así que guardar dinero entonces ayuda a cubrir los meses de menos trabajo.",
    },
    weights: [3, 3, 4, 6, 12, 19, 20, 13, 7, 5, 4, 4],
  },
  {
    id: "hospitality",
    label: { en: "Hotels, restaurants & tourism", es: "Hoteles, restaurantes y turismo" },
    note: {
      en: "Work tends to pick up with summer visitors and the December holidays, then slow down after New Year's.",
      es: "El trabajo suele aumentar con los visitantes de verano y las fiestas de diciembre, y bajar después del Año Nuevo.",
    },
    weights: [5, 5, 6, 7, 9, 12, 13, 12, 9, 7, 6, 9],
  },
];

export function presetIncome(preset: WorkPreset, annual: number): number[] {
  const total = preset.weights.reduce((a, b) => a + b, 0);
  return preset.weights.map((w) => Math.round(((w / total) * annual) / 5) * 5);
}

export type BillTemplate = { id: string; label: Bilingual; typical: number; essential: boolean };

export const billTemplates: BillTemplate[] = [
  {
    id: "rent",
    label: { en: "Rent or housing", es: "Renta o vivienda" },
    typical: 900,
    essential: true,
  },
  {
    id: "food",
    label: { en: "Food & groceries", es: "Comida y despensa" },
    typical: 500,
    essential: true,
  },
  {
    id: "utilities",
    label: { en: "Utilities", es: "Servicios (luz, agua)" },
    typical: 160,
    essential: true,
  },
  {
    id: "phone",
    label: { en: "Phone & internet", es: "Teléfono e internet" },
    typical: 80,
    essential: true,
  },
  {
    id: "gas",
    label: { en: "Gas & transportation", es: "Gasolina y transporte" },
    typical: 220,
    essential: true,
  },
  { id: "car", label: { en: "Car payment", es: "Pago del carro" }, typical: 300, essential: true },
  { id: "insurance", label: { en: "Insurance", es: "Seguro" }, typical: 130, essential: true },
  {
    id: "childcare",
    label: { en: "Childcare", es: "Cuidado de niños" },
    typical: 400,
    essential: true,
  },
  {
    id: "remittance",
    label: { en: "Money sent to family", es: "Dinero enviado a la familia" },
    typical: 200,
    essential: false,
  },
  {
    id: "debt",
    label: { en: "Loan or credit payment", es: "Pago de préstamo o crédito" },
    typical: 150,
    essential: false,
  },
  {
    id: "subs",
    label: { en: "Subscriptions & extras", es: "Suscripciones y extras" },
    typical: 45,
    essential: false,
  },
];

export function bi(v: Bilingual, lang: Lang) {
  return lang === "es" ? v.es : v.en;
}
