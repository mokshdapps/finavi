export type PracticeSituation = {
  id: string;
  question: { en: string; es: string };
  options: { en: string; es: string }[];
  correct: number;
  explanation: { en: string; es: string };
};
export const moneyPractice: PracticeSituation[] = [
  {
    id: "payday",
    question: {
      en: "You receive $300 and owe $345 in 14 days. Is a $45 fee a small borrowing cost?",
      es: "Recibes $300 y debes $345 en 14 días. ¿Es pequeño el costo de $45?",
    },
    options: [
      { en: "Yes, because the fee is only $45", es: "Sí, porque solo son $45" },
      {
        en: "No. The annualized cost is about 391% APR",
        es: "No. El costo anualizado es cerca de 391% APR",
      },
      { en: "The APR is 15%", es: "La APR es 15%" },
    ],
    correct: 1,
    explanation: {
      en: "$45 ÷ $300 × 365 ÷ 14 × 100 = about 391% APR. A short repayment window makes a small fee expensive, especially if renewed.",
      es: "$45 ÷ $300 × 365 ÷ 14 × 100 = cerca de 391% APR. Un plazo corto hace cara una comisión pequeña, especialmente al renovar.",
    },
  },
  {
    id: "timing",
    question: {
      en: "You have $200, with $300 in rent due Tuesday and a $500 paycheck arriving Friday. What is the problem?",
      es: "Tienes $200, la renta de $300 vence el martes y cobras $500 el viernes. ¿Cuál es el problema?",
    },
    options: [
      {
        en: "There is no problem; the week ends with money",
        es: "No hay problema; terminas la semana con dinero",
      },
      { en: "You need to invest the $200", es: "Debes invertir los $200" },
      {
        en: "You are $100 short before payday. Ask about moving the due date",
        es: "Faltan $100 antes del pago. Pregunta si puedes cambiar el vencimiento",
      },
    ],
    correct: 2,
    explanation: {
      en: "Even if you have money left at the end of the week, you are $100 short when rent is due; contact the biller before the due date to ask about moving it.",
      es: "Aunque te sobre dinero al final de la semana, te faltan $100 cuando vence la renta; comunícate con quien cobra antes del vencimiento para preguntar si puedes cambiar la fecha.",
    },
  },
  {
    id: "gig",
    question: {
      en: "A gig pays $120 for 4 hours. You spend $20 and travel 1 unpaid hour. Before taxes, what is your real hourly pay?",
      es: "Un trabajo paga $120 por 4 horas. Gastas $20 y viajas 1 hora sin pago. Antes de impuestos, ¿cuánto ganas por hora?",
    },
    options: [
      { en: "$20 per hour", es: "$20 por hora" },
      { en: "$30 per hour", es: "$30 por hora" },
      { en: "$25 per hour", es: "$25 por hora" },
    ],
    correct: 0,
    explanation: {
      en: "($120 − $20) ÷ (4 + 1) = $20 per hour. Travel, waiting, supplies, and platform costs can change which offer is better.",
      es: "($120 − $20) ÷ (4 + 1) = $20 por hora. El viaje, espera, materiales y comisiones pueden cambiar qué oferta conviene.",
    },
  },
  {
    id: "season",
    question: {
      en: "You earn $4,000 in harvest month but only $1,000 in winter. What should a strong harvest check do first?",
      es: "Ganas $4,000 en la cosecha pero solo $1,000 en invierno. ¿Qué debe hacer primero un buen pago de cosecha?",
    },
    options: [
      { en: "Set your monthly spending at $4,000", es: "Fijar tus gastos mensuales en $4,000" },
      {
        en: "Cover essentials and bank a reserve for lean months",
        es: "Cubrir lo esencial y reservar para los meses bajos",
      },
      { en: "Put it all into stocks", es: "Invertir todo en acciones" },
    ],
    correct: 1,
    explanation: {
      en: "Set aside some of your harvest income for the low-income months you expect, while keeping a separate emergency fund for unexpected costs.",
      es: "Aparta parte de tus ingresos de cosecha para los meses de ingresos bajos que esperas, y mantén un fondo de emergencia separado para los gastos inesperados.",
    },
  },
  {
    id: "tanda",
    question: {
      en: "In a 10-person tanda, everyone pays $100 per round. You receive $1,000 in round 2. Are your contributions finished?",
      es: "En una tanda de 10, cada persona paga $100 por ronda. Recibes $1,000 en la ronda 2. ¿Ya terminaste de aportar?",
    },
    options: [
      { en: "Yes, you already received your pot", es: "Sí, ya recibiste el total" },
      { en: "You only owe the organizer a fee", es: "Solo debes una comisión" },
      {
        en: "No, you still owe eight $100 contributions",
        es: "No, todavía debes ocho aportaciones de $100",
      },
    ],
    correct: 2,
    explanation: {
      en: "Receiving your payout early does not end your commitment: after two $100 contributions, you still owe eight more. The tanda depends on everyone continuing to contribute after receiving the pot.",
      es: "Cobrar temprano no termina tu compromiso: después de dos aportaciones de $100, todavía debes ocho más. La tanda depende de que todos sigan aportando después de recibir el total.",
    },
  },
  {
    id: "credit",
    question: {
      en: "You can pay a credit card in full each month. Do you need to carry a balance to build credit?",
      es: "Puedes pagar toda tu tarjeta cada mes. ¿Necesitas dejar saldo para construir crédito?",
    },
    options: [
      {
        en: "No. Paying on time and in full avoids unnecessary interest",
        es: "No. Pagar a tiempo y completo evita intereses innecesarios",
      },
      { en: "Yes. Interest payments build your score", es: "Sí. Los intereses suben tu puntaje" },
      { en: "Yes. Always keep the card maxed out", es: "Sí. Mantén la tarjeta al límite" },
    ],
    correct: 0,
    explanation: {
      en: "You do not need to pay interest to build credit. Payment history and how much available credit you use matter; carrying debt is not a requirement.",
      es: "No necesitas pagar intereses para construir crédito. Importan el historial de pagos y cuánto crédito usas; mantener una deuda no es requisito.",
    },
  },
];
