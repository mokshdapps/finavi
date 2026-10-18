export type Security = {
  symbol: string;
  name: { en: string; es: string };
  kind: "etf" | "stock" | "bond";
  note: { en: string; es: string };
  prices: number[];
};

export const securities: Security[] = [
  {
    symbol: "VTI",
    name: { en: "Total US stock market fund", es: "Fondo del mercado accionario de EE. UU." },
    kind: "etf",
    note: {
      en: "One fund that holds a small piece of nearly every US public company. This is what diversification looks like.",
      es: "Un solo fondo que tiene una parte pequeña de casi todas las empresas públicas de EE. UU. Así se ve la diversificación.",
    },
    prices: [212, 228, 219, 246, 271, 262, 289, 310, 298, 331],
  },
  {
    symbol: "VXUS",
    name: { en: "International stock fund", es: "Fondo de acciones internacionales" },
    kind: "etf",
    note: {
      en: "Companies outside the United States. It often moves differently from US stocks, which softens bad years.",
      es: "Empresas fuera de Estados Unidos. Suele moverse distinto a las acciones de EE. UU., lo que suaviza los años malos.",
    },
    prices: [52, 55, 51, 57, 59, 56, 61, 64, 63, 67],
  },
  {
    symbol: "BND",
    name: { en: "US bond fund", es: "Fondo de bonos de EE. UU." },
    kind: "bond",
    note: {
      en: "Loans to governments and companies. Smaller gains, much smaller drops. Bonds are the calm part of a portfolio.",
      es: "Préstamos a gobiernos y empresas. Ganancias más pequeñas y caídas mucho menores. Los bonos son la parte tranquila de un portafolio.",
    },
    prices: [73, 72, 71, 73, 74, 73, 75, 76, 76, 78],
  },
  {
    symbol: "SNGL",
    name: { en: "Single company (example)", es: "Una sola empresa (ejemplo)" },
    kind: "stock",
    note: {
      en: "One company instead of hundreds. Notice how much further this one swings in both directions. That is the risk you take on when you don't diversify.",
      es: "Una sola empresa en lugar de cientos. Fíjate cuánto más se mueve en ambas direcciones: ese es el riesgo de no diversificar.",
    },
    prices: [40, 58, 33, 47, 71, 44, 62, 88, 55, 79],
  },
];

export const investLessons: { id: string; en: string; es: string }[] = [
  {
    id: "l1",
    en: "The single-company price moves far more than the broad funds. Owning hundreds of companies at once is how most people reduce that swing.",
    es: "El precio de una sola empresa se mueve mucho más que el de los fondos amplios. Tener cientos de empresas a la vez es como la mayoría reduce ese vaivén.",
  },
  {
    id: "l2",
    en: "Down years happen. The practice portfolio drops in some years on purpose, because a real one will.",
    es: "Hay años a la baja. El portafolio de práctica baja en algunos años a propósito, porque uno real lo hará.",
  },
  {
    id: "l3",
    en: "Investing is for money you will not need for at least five years. Emergency money belongs in savings, where it can't fall in value.",
    es: "Invertir es para dinero que no necesitarás en al menos cinco años. El dinero de emergencia va en ahorros, donde no pierde valor.",
  },
];
