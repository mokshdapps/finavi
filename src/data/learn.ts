export type Bilingual = { en: string; es: string };

export type Module = {
  id: string;
  title: Bilingual;
  minutes: number;
  body: Bilingual[];
  takeaway: Bilingual;
};

export const trapReference: {
  id: string;
  title: Bilingual;
  typical: Bilingual;
  body: Bilingual;
}[] = [
  {
    id: "payday",
    title: { en: "Payday loans", es: "Préstamos de día de pago" },
    typical: { en: "Typically 200%–400% APR", es: "Normalmente 200% a 400% APR" },
    body: {
      en: "A $15 fee per $100 borrowed for two weeks is about 391% a year. Washington limits payday loans to $700 or 30% of monthly income and allows an installment plan at no extra fee. Ask for it in writing before the due date.",
      es: "Una comisión de $15 por cada $100 durante dos semanas equivale a cerca de 391% al año. Washington limita estos préstamos a $700 o al 30% del ingreso mensual y permite un plan de pagos sin costo extra: pídelo por escrito antes de la fecha de vencimiento.",
    },
  },
  {
    id: "rto",
    title: { en: "Rent-to-own", es: "Renta con opción a compra" },
    typical: {
      en: "Often 2–3× the store price",
      es: "Muchas veces 2 a 3 veces el precio de tienda",
    },
    body: {
      en: "A $500 washer at $30 a week for 18 months costs about $2,340, so a low weekly payment can hide a much higher total cost. Ask for both the cash price and the total of payments, which must be disclosed.",
      es: "Una lavadora de $500 a $30 por semana durante 18 meses cuesta cerca de $2,340, así que un pago semanal bajo puede ocultar un costo total mucho mayor. Pide tanto el precio de contado como el total de los pagos, ya que deben informarte ambos.",
    },
  },
  {
    id: "check-cashing",
    title: { en: "Check cashing", es: "Cambio de cheques" },
    typical: { en: "1%–6% of each check", es: "1% a 6% de cada cheque" },
    body: {
      en: "At 3%, cashing a $900 paycheck costs $27, about $700 a year if you do it every two weeks. Many credit unions open an account with no minimum balance and accept an ITIN or consular ID.",
      es: "Al 3%, cambiar un cheque de $900 cuesta $27, cerca de $700 al año si lo haces cada dos semanas. Muchas cooperativas abren cuenta sin saldo mínimo y aceptan ITIN o matrícula consular.",
    },
  },
  {
    id: "title",
    title: { en: "Title loans", es: "Préstamos sobre el título del carro" },
    typical: { en: "Around 300% APR, plus your vehicle", es: "Cerca de 300% APR, más tu vehículo" },
    body: {
      en: "The lender holds your car's title, and about one in five borrowers loses the vehicle. If you depend on your car for work, missing a payment could put your income at risk as well as adding to your loan costs.",
      es: "El prestamista retiene el título de tu carro y cerca de uno de cada cinco prestatarios pierde el vehículo. Si dependes del carro para trabajar, no pagar podría poner en riesgo tus ingresos además de aumentar el costo del préstamo.",
    },
  },
  {
    id: "remittance",
    title: { en: "Sending money home", es: "Enviar dinero a casa" },
    typical: {
      en: "3%–10% between fee and exchange rate",
      es: "3% a 10% entre comisión y tipo de cambio",
    },
    body: {
      en: "The advertised fee is only part of the cost because providers also add a margin to the exchange rate. Compare how much the recipient will receive, not just the fee; sending larger amounts less often usually costs less.",
      es: "La comisión anunciada es solo una parte del costo porque los proveedores también agregan un margen al tipo de cambio. Compara cuánto recibirá la otra persona, no solo la comisión; enviar cantidades mayores con menos frecuencia suele costar menos.",
    },
  },
];

export const tandaEducation = [
  "tanda.before.1",
  "tanda.before.2",
  "tanda.before.3",
  "tanda.before.4",
  "tanda.before.5",
  "tanda.before.6",
] as const;
