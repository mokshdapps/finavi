import type { BenefitAnswers } from "@/lib/store";

export type Program = {
  id: string;
  name: { en: string; es: string };
  what: { en: string; es: string };
  needed: { en: string; es: string };
  url: string;
};

export const programs: Program[] = [
  {
    id: "snap",
    name: { en: "Basic Food (SNAP)", es: "Basic Food (SNAP)" },
    what: {
      en: "Monthly money on an EBT card for groceries at most stores, farmers markets, and some online grocers.",
      es: "Dinero mensual en una tarjeta EBT para comprar comida en la mayoría de las tiendas, mercados agrícolas y algunas tiendas en línea.",
    },
    needed: {
      en: "Recent pay stubs or an estimate of income, household member ages, and rent or utility costs. Immigration status of household members is asked only for those applying.",
      es: "Talones de pago recientes o un estimado del ingreso, edades de los miembros del hogar y costos de renta o servicios. El estatus migratorio solo se pregunta de quienes solicitan.",
    },
    url: "https://www.washingtonconnection.org/",
  },
  {
    id: "apple-health",
    name: { en: "Apple Health (Medicaid)", es: "Apple Health (Medicaid)" },
    what: {
      en: "Free or very low-cost health coverage: doctor visits, prescriptions, emergency care, and dental for children.",
      es: "Cobertura médica gratuita o de muy bajo costo: consultas, medicinas, emergencias y dental para niños.",
    },
    needed: {
      en: "Household size, income estimate, and dates of birth for anyone applying.",
      es: "Tamaño del hogar, estimado de ingreso y fechas de nacimiento de quienes solicitan.",
    },
    url: "https://www.wahealthplanfinder.org/",
  },
  {
    id: "wic",
    name: { en: "WIC", es: "WIC" },
    what: {
      en: "Monthly food benefits, infant formula, breastfeeding support, and nutrition checkups for pregnant people and children under 5.",
      es: "Beneficios mensuales de comida, fórmula, apoyo de lactancia y revisiones de nutrición para embarazadas y niños menores de 5 años.",
    },
    needed: {
      en: "Proof of income or a Basic Food/Apple Health letter, and a short nutrition appointment.",
      es: "Comprobante de ingreso o una carta de Basic Food/Apple Health, y una cita corta de nutrición.",
    },
    url: "https://doh.wa.gov/you-and-your-family/wic",
  },
  {
    id: "school-meals",
    name: {
      en: "Free or reduced-price school meals",
      es: "Comidas escolares gratis o a precio reducido",
    },
    what: {
      en: "Breakfast and lunch at school at no cost or reduced cost. Many Washington schools serve all students free.",
      es: "Desayuno y almuerzo en la escuela sin costo o a precio reducido. Muchas escuelas de Washington sirven gratis a todos.",
    },
    needed: {
      en: "One household application through your school district, usually one page.",
      es: "Una solicitud por hogar en tu distrito escolar, normalmente de una página.",
    },
    url: "https://ospi.k12.wa.us/policy-funding/child-nutrition/school-meals",
  },
  {
    id: "liheap",
    name: { en: "Energy assistance (LIHEAP)", es: "Ayuda con la luz (LIHEAP)" },
    what: {
      en: "A payment made directly to your electric, gas, or heating provider, plus help during a shutoff notice.",
      es: "Un pago directo a tu compañía de luz, gas o calefacción, y ayuda si te avisan que van a cortar el servicio.",
    },
    needed: {
      en: "A recent utility bill and proof of the last three months of income.",
      es: "Un recibo reciente de servicios y comprobante de los últimos tres meses de ingreso.",
    },
    url: "https://www.commerce.wa.gov/energy-assistance/",
  },
  {
    id: "utility-discount",
    name: {
      en: "Utility low-income discount rate",
      es: "Descuento de servicios por bajos ingresos",
    },
    what: {
      en: "An ongoing percentage discount on your monthly electricity or water bill from most Washington utilities.",
      es: "Un descuento continuo en tu recibo mensual de luz o agua en la mayoría de las compañías de Washington.",
    },
    needed: {
      en: "Your account number and an income estimate. Ask your utility for the low-income rate.",
      es: "Tu número de cuenta y un estimado de ingreso. Pide a tu compañía la tarifa de bajos ingresos.",
    },
    url: "https://www.commerce.wa.gov/energy-assistance/",
  },
  {
    id: "housing",
    name: { en: "Rent help and housing assistance", es: "Ayuda con la renta y la vivienda" },
    what: {
      en: "Emergency rent help, deposit assistance, and waitlists for rent-based housing through your local housing authority or Coordinated Entry.",
      es: "Ayuda de emergencia con la renta, apoyo con el depósito y listas de espera para vivienda según ingreso, con la autoridad de vivienda local o Coordinated Entry.",
    },
    needed: {
      en: "A lease or rent receipt, household size, and an income estimate. Waitlists can be long, so apply early.",
      es: "Contrato o recibo de renta, tamaño del hogar y un estimado de ingreso. Las listas pueden ser largas: solicita pronto.",
    },
    url: "https://www.commerce.wa.gov/serving-communities/homelessness/",
  },
  {
    id: "wccc",
    name: { en: "Working Connections Child Care", es: "Cuidado infantil Working Connections" },
    what: {
      en: "Pays most of the cost of licensed child care or a licensed family provider while you work or attend training.",
      es: "Paga la mayor parte del cuidado infantil con licencia o con un proveedor familiar autorizado mientras trabajas o estudias.",
    },
    needed: {
      en: "Proof of work or training hours, household size, and your child care provider's information.",
      es: "Comprobante de horas de trabajo o estudio, tamaño del hogar e información de tu proveedor de cuidado infantil.",
    },
    url: "https://www.dcyf.wa.gov/services/earlylearning-childcare/getting-help",
  },
  {
    id: "eitc-wtc",
    name: {
      en: "Working Families Tax Credit",
      es: "Crédito Tributario para Familias Trabajadoras",
    },
    what: {
      en: "A yearly cash payment from Washington State for working people, paid even if you owe no tax. You can claim up to three prior years.",
      es: "Un pago anual en efectivo del estado de Washington para quienes trabajan, aunque no debas impuestos. Puedes reclamar hasta tres años anteriores.",
    },
    needed: {
      en: "A filed federal tax return and an SSN or ITIN. Free tax help is available.",
      es: "Una declaración federal presentada y un SSN o ITIN. Hay ayuda gratuita para declarar.",
    },
    url: "https://workingfamiliescredit.wa.gov/",
  },
];

export function screenPrograms(a: BenefitAnswers) {
  const child = a.childrenCount ?? (a.children ? 1 : 0);
  const young = a.under5Count ?? (a.youngChildren ? 1 : 0);
  const under13 = a.under13Count ?? child;
  const relevant = (p: Program) =>
    p.id === "wic"
      ? a.pregnant || young > 0
      : p.id === "wccc"
        ? under13 > 0
        : p.id === "school-meals"
          ? child > 0
          : p.id === "housing"
            ? a.paysRent
            : true;
  return { eligible: programs.filter(relevant), not: programs.filter((p) => !relevant(p)) };
}
