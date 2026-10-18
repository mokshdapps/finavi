import type { Bilingual, Module } from "./learn";

export type CreditUnit = {
  id: string;
  title: Bilingual;
  summary: Bilingual;
  lessons: Module[];
};

export const creditUnits: CreditUnit[] = [
  {
    id: "unit-1",
    title: { en: "Foundations", es: "Fundamentos" },
    summary: {
      en: "What the score is, where the information comes from, and what to do if you have no score at all.",
      es: "Qué es el puntaje, de dónde sale la información y qué hacer si no tienes puntaje.",
    },
    lessons: [
      {
        id: "credit-1",
        title: { en: "What a credit score is", es: "Qué es un puntaje de crédito" },
        minutes: 3,
        body: [
          {
            en: "A credit score is a number between 300 and 850 that lenders use to guess how likely you are to pay back money. It is not a measure of how responsible you are, and it says nothing about your income or savings.",
            es: "Un puntaje de crédito es un número entre 300 y 850 que los prestamistas usan para calcular qué tan probable es que pagues. No mide qué tan responsable eres y no dice nada sobre tu ingreso ni tus ahorros.",
          },
          {
            en: "Roughly 35% of the score comes from paying on time and 30% from how much of your available credit you are using. Together those two things decide most of the number.",
            es: "Cerca del 35% del puntaje viene de pagar a tiempo y el 30% de cuánto usas del crédito disponible. Esas dos cosas deciden casi todo el número.",
          },
          {
            en: "Scores move slowly on the way up and quickly on the way down. One missed payment can cost more points than a year of perfect ones adds.",
            es: "El puntaje sube despacio y baja rápido. Un pago atrasado puede costar más puntos de los que suma un año de pagos perfectos.",
          },
        ],
        takeaway: {
          en: "Payment history and how much available credit you use account for most of your score.",
          es: "El historial de pagos y cuánto crédito disponible usas representan la mayor parte de tu puntaje.",
        },
      },
      {
        id: "credit-2",
        title: {
          en: "Your credit report, and how to read it free",
          es: "Tu reporte de crédito y cómo leerlo gratis",
        },
        minutes: 4,
        body: [
          {
            en: "The report is the record behind the score: accounts, balances, payment history, and collections. You can get it free every week from all three bureaus at annualcreditreport.com, the only federally authorized site.",
            es: "El reporte es el historial detrás del puntaje: cuentas, saldos, pagos y cobranzas. Puedes obtenerlo gratis cada semana de las tres agencias en annualcreditreport.com, el único sitio autorizado por el gobierno federal.",
          },
          {
            en: "Read it in four passes: personal information, open accounts, negative items, and inquiries. You are looking for anything you do not recognize.",
            es: "Léelo en cuatro pasos: datos personales, cuentas abiertas, información negativa y consultas. Buscas cualquier cosa que no reconozcas.",
          },
          {
            en: "Checking your own report never lowers your score. Only a lender's hard pull does that.",
            es: "Revisar tu propio reporte nunca baja tu puntaje. Solo lo hace una consulta dura de un prestamista.",
          },
        ],
        takeaway: {
          en: "Take 20 minutes to check your credit report for free before applying for credit.",
          es: "Dedica 20 minutos a revisar tu reporte gratis antes de solicitar crédito.",
        },
      },
      {
        id: "credit-3",
        title: {
          en: "The three bureaus and who reports to them",
          es: "Las tres agencias y quién les reporta",
        },
        minutes: 3,
        body: [
          {
            en: "Equifax, Experian, and TransUnion are private companies. No one is required to send them information, so your three reports are usually similar but not identical.",
            es: "Equifax, Experian y TransUnion son empresas privadas. Nadie está obligado a enviarles información, así que tus tres reportes suelen parecerse pero no ser idénticos.",
          },
          {
            en: "That is why an account can help your score at one bureau and be invisible at another, and why a card that reports to only one bureau builds less than one that reports to all three.",
            es: "Por eso una cuenta puede ayudar tu puntaje en una agencia y no aparecer en otra, y por eso una tarjeta que reporta a una sola agencia construye menos que una que reporta a las tres.",
          },
          {
            en: "Before opening anything meant to build credit, ask one question: does this report to all three bureaus? If the answer is no or unclear, it is not a credit builder.",
            es: "Antes de abrir algo para construir crédito, haz una pregunta: ¿esto reporta a las tres agencias? Si la respuesta es no o no está clara, no sirve para construir crédito.",
          },
        ],
        takeaway: {
          en: "Ask every lender whether they report to all three bureaus. If they don't, it builds nothing.",
          es: "Pregunta a cada prestamista si reporta a las tres agencias. Si no, no construye nada.",
        },
      },
      {
        id: "credit-4",
        title: { en: "If you have no score at all", es: "Si no tienes puntaje" },
        minutes: 3,
        body: [
          {
            en: "About 1 in 10 adults in the U.S. has no credit file. That is called being credit invisible, and it is different from having a bad score. There is nothing negative to undo.",
            es: "Cerca de 1 de cada 10 adultos en EE. UU. no tiene archivo de crédito. A eso se le llama ser invisible al crédito, y no es lo mismo que tener mal puntaje: no hay nada negativo que deshacer.",
          },
          {
            en: "A score generally appears after one account has reported for about six months. One secured card, used lightly, is usually enough to start.",
            es: "El puntaje suele aparecer después de que una cuenta reporte por unos seis meses. Una tarjeta asegurada, usada poco, casi siempre es suficiente para empezar.",
          },
          {
            en: "You can open a credit union account and many secured cards with an ITIN or a consular ID. You do not need a Social Security number for every product.",
            es: "Puedes abrir una cuenta en una cooperativa y muchas tarjetas aseguradas con ITIN o matrícula consular. No necesitas número de Seguro Social para todos los productos.",
          },
        ],
        takeaway: {
          en: "A score generally appears after an account has reported for about six months.",
          es: "El puntaje suele aparecer después de que una cuenta haya reportado durante unos seis meses.",
        },
      },
    ],
  },
  {
    id: "unit-2",
    title: {
      en: "The five things that move your score",
      es: "Las cinco cosas que mueven tu puntaje",
    },
    summary: {
      en: "Payment history, utilization, age, mix, and new credit: what each one is worth and how to control it.",
      es: "Historial de pagos, uso, antigüedad, mezcla y crédito nuevo: cuánto vale cada uno y cómo controlarlo.",
    },
    lessons: [
      {
        id: "credit-5",
        title: { en: "Payment history (35%)", es: "Historial de pagos (35%)" },
        minutes: 3,
        body: [
          {
            en: "This is the single biggest piece. It records whether each account was paid on time, month by month, for up to seven years.",
            es: "Esta es la parte más grande. Registra si cada cuenta se pagó a tiempo, mes por mes, por hasta siete años.",
          },
          {
            en: "The safest habit with an unpredictable income is autopay set to the minimum, with extra payments made by hand whenever money comes in. Autopay protects the score; the manual payments cut the interest.",
            es: "Con un ingreso impredecible, el hábito más seguro es pago automático por el mínimo, y pagos extra a mano cuando entra dinero. El automático protege el puntaje; los pagos extra bajan los intereses.",
          },
        ],
        takeaway: {
          en: "Set automatic payments for the minimum on each account and make extra payments when you can.",
          es: "Configura el pago automático del mínimo de cada cuenta y haz pagos adicionales cuando puedas.",
        },
      },
      {
        id: "credit-6",
        title: { en: "Utilization: the 30% rule", es: "Uso del crédito: la regla del 30%" },
        minutes: 3,
        body: [
          {
            en: "Utilization is the share of your limit you are using. On a $300 limit, a $90 balance is 30% utilization. Below 30% helps; below 10% helps more.",
            es: "El uso es la parte de tu límite que estás ocupando. Con un límite de $300, un saldo de $90 es 30% de uso. Menos del 30% ayuda; menos del 10% ayuda más.",
          },
          {
            en: "The balance the card reports is usually the one on your statement date, not after you pay. Paying a few days before the statement closes lowers the number the bureaus see.",
            es: "El saldo que reporta la tarjeta suele ser el del día del estado de cuenta, no el de después de pagar. Pagar unos días antes de que cierre baja el número que ven las agencias.",
          },
          {
            en: "Utilization has no memory. A high balance last month stops hurting as soon as a lower balance is reported.",
            es: "El uso no tiene memoria. Un saldo alto del mes pasado deja de afectar en cuanto se reporta un saldo más bajo.",
          },
        ],
        takeaway: {
          en: "You can build credit without carrying a balance or paying interest.",
          es: "Puedes construir crédito sin dejar un saldo pendiente ni pagar intereses.",
        },
      },
      {
        id: "credit-7",
        title: { en: "Length of history (15%)", es: "Antigüedad del historial (15%)" },
        minutes: 2,
        body: [
          {
            en: "Lenders look at the age of your oldest account and the average age of all of them. Time is the one factor you cannot speed up.",
            es: "Los prestamistas ven la antigüedad de tu cuenta más vieja y el promedio de todas. El tiempo es el único factor que no puedes acelerar.",
          },
          {
            en: "Closing an old no-fee card shortens your history and removes its limit from your utilization at the same time. Keeping it open with one small recurring charge, paid automatically, costs nothing.",
            es: "Cerrar una tarjeta vieja sin cuota acorta tu historial y además quita su límite del cálculo de uso. Dejarla abierta con un cargo pequeño y fijo, pagado automáticamente, no cuesta nada.",
          },
        ],
        takeaway: {
          en: "Keeping your oldest no-fee card active with a small recurring payment, such as a $5 subscription, can help preserve your credit history.",
          es: "Mantener activa tu tarjeta más antigua sin cuota con un cargo recurrente pequeño, como una suscripción de $5, puede ayudarte a conservar tu historial.",
        },
      },
      {
        id: "credit-8",
        title: { en: "Credit mix (10%)", es: "Mezcla de crédito (10%)" },
        minutes: 2,
        body: [
          {
            en: "Mix means having both revolving accounts (cards) and installment accounts (a car loan, a credit-builder loan). Scores reward showing you can handle both.",
            es: "La mezcla significa tener cuentas rotativas (tarjetas) y a plazos (un préstamo de carro, un préstamo para crear crédito). El puntaje premia demostrar que manejas ambas.",
          },
          {
            en: "This is the smallest factor that you can act on, and it is never a reason to borrow money you do not need. Take a loan because it is useful, not because of ten points.",
            es: "Es el factor más pequeño sobre el que puedes actuar, y nunca es razón para pedir dinero que no necesitas. Pide un préstamo porque te sirve, no por diez puntos.",
          },
        ],
        takeaway: {
          en: "Credit mix accounts for about 10% of your score, but is not a reason to borrow money you do not need.",
          es: "La mezcla de crédito representa cerca del 10% de tu puntaje, pero no justifica pedir dinero que no necesitas.",
        },
      },
      {
        id: "credit-9",
        title: {
          en: "New credit and hard inquiries (10%)",
          es: "Crédito nuevo y consultas duras (10%)",
        },
        minutes: 3,
        body: [
          {
            en: "A hard inquiry is recorded when you apply for credit. One costs a few points and fades within a year. Several in a short window looks like distress and can trigger denials.",
            es: "Una consulta dura queda registrada cuando solicitas crédito. Una cuesta pocos puntos y desaparece en un año. Varias en poco tiempo parecen señal de apuro y pueden causar rechazos.",
          },
          {
            en: "Rate shopping for one car loan or mortgage is treated differently: applications of the same type within about 14 to 45 days count as a single inquiry. Do that comparison in one short stretch.",
            es: "Comparar tasas para un solo préstamo de carro o hipoteca se trata distinto: las solicitudes del mismo tipo dentro de unos 14 a 45 días cuentan como una sola consulta. Haz esa comparación en pocos días.",
          },
          {
            en: "Checking your own score, or a prequalification that says 'soft pull', does not affect anything.",
            es: "Revisar tu propio puntaje, o una precalificación que diga 'consulta suave', no afecta nada.",
          },
        ],
        takeaway: {
          en: "Compare car loan rates within two weeks so they count as one inquiry.",
          es: "Compara tasas de préstamo de carro en dos semanas para que cuenten como una sola consulta.",
        },
      },
    ],
  },
  {
    id: "unit-3",
    title: { en: "Building credit from zero", es: "Construir crédito desde cero" },
    summary: {
      en: "The specific products that work when no one will approve you yet, and a six-month plan.",
      es: "Los productos que sí funcionan cuando nadie te aprueba todavía, y un plan de seis meses.",
    },
    lessons: [
      {
        id: "credit-10",
        title: { en: "Secured credit cards", es: "Tarjetas de crédito aseguradas" },
        minutes: 4,
        body: [
          {
            en: "A secured card is a normal credit card backed by a deposit you put down, often $200. Your limit equals your deposit, so the bank takes no risk and approval does not depend on your score.",
            es: "Una tarjeta asegurada es una tarjeta normal respaldada por un depósito que tú das, muchas veces $200. Tu límite es igual al depósito, así que el banco no arriesga y la aprobación no depende de tu puntaje.",
          },
          {
            en: "Credit unions are usually the cheapest place to get one. Look for no annual fee, confirm it reports to all three bureaus, and ask when the deposit is refunded. Good cards return it and convert to a regular card after 6 to 12 months.",
            es: "Las cooperativas de crédito suelen ser el lugar más barato. Busca que no tenga cuota anual, confirma que reporte a las tres agencias y pregunta cuándo devuelven el depósito: las buenas lo regresan y la convierten en tarjeta normal entre 6 y 12 meses.",
          },
          {
            en: "Use it for one small recurring bill and pay the statement in full. The interest rate does not matter if you never carry a balance.",
            es: "Úsala para un solo gasto pequeño y fijo, y paga el estado de cuenta completo. La tasa de interés no importa si nunca dejas saldo.",
          },
        ],
        takeaway: {
          en: "A $200 secured card from a credit union, used lightly and paid in full, builds a real score.",
          es: "Una tarjeta asegurada de $200 en una cooperativa, usada poco y pagada completa, crea puntaje real.",
        },
      },
      {
        id: "credit-11",
        title: { en: "Credit-builder loans", es: "Préstamos para crear crédito" },
        minutes: 3,
        body: [
          {
            en: "A credit-builder loan works in reverse: you make small payments first, the money sits in a locked savings account, and it is released to you at the end. Some credit unions offer them for $25 a month.",
            es: "Un préstamo para crear crédito funciona al revés: haces pagos pequeños primero, el dinero queda en una cuenta de ahorro bloqueada y se te entrega al final. Algunas cooperativas los ofrecen desde $25 al mes.",
          },
          {
            en: "You end with two things: a year of on-time installment payments on your report, and a small pile of savings you could not spend along the way.",
            es: "Terminas con dos cosas: un año de pagos a plazos puntuales en tu reporte y unos ahorros que no pudiste gastar en el camino.",
          },
          {
            en: "Compare the total fee, not the rate. A reasonable program costs $10 to $60 in total for the year.",
            es: "Compara la comisión total, no la tasa. Un programa razonable cuesta entre $10 y $60 en total por el año.",
          },
        ],
        takeaway: {
          en: "Compare total fees when choosing a credit-builder loan that helps you save and establish a payment history.",
          es: "Compara las comisiones totales al elegir un préstamo para crear crédito que te ayude a ahorrar y formar un historial de pagos.",
        },
      },
      {
        id: "credit-12",
        title: {
          en: "Authorized user, and rent that counts",
          es: "Usuario autorizado y renta que cuenta",
        },
        minutes: 3,
        body: [
          {
            en: "Being added as an authorized user on someone else's old, low-balance card can put their whole history on your report. You do not need to use or even hold the card. Only do this with someone who pays on time; their late payment becomes yours too.",
            es: "Que te agreguen como usuario autorizado en una tarjeta vieja y con saldo bajo de otra persona puede poner todo ese historial en tu reporte. No necesitas usar ni tener la tarjeta. Hazlo solo con alguien que pague a tiempo: su atraso también se vuelve tuyo.",
          },
          {
            en: "Rent and utility reporting services add payments you already make to your report. Some landlords offer it free; paid services usually cost a few dollars a month and only report to one or two bureaus.",
            es: "Los servicios que reportan renta y servicios públicos agregan pagos que ya haces a tu reporte. Algunos arrendadores lo ofrecen gratis; los servicios de paga cuestan unos dólares al mes y suelen reportar a una o dos agencias.",
          },
        ],
        takeaway: {
          en: "Ask your landlord whether rent payments can be reported and whether there is a fee.",
          es: "Pregunta a tu arrendador si se pueden reportar los pagos de renta y si tiene algún costo.",
        },
      },
      {
        id: "credit-13",
        title: {
          en: "Your first six months, step by step",
          es: "Tus primeros seis meses, paso a paso",
        },
        minutes: 4,
        body: [
          {
            en: "Month 1: open a credit union account and a secured card with the smallest deposit you can spare. Put one recurring bill on the card, such as a phone plan or a streaming subscription.",
            es: "Mes 1: abre una cuenta en una cooperativa y una tarjeta asegurada con el depósito más pequeño que puedas. Pon un gasto fijo en la tarjeta: el plan del teléfono o una suscripción.",
          },
          {
            en: "Months 2 to 5: set autopay for the full statement balance. Do not add other purchases yet. Check your free report once to confirm the account is showing up.",
            es: "Meses 2 al 5: pon pago automático del saldo completo. No agregues otras compras todavía. Revisa tu reporte gratis una vez para confirmar que la cuenta aparece.",
          },
          {
            en: "Month 6: a score should exist. Do not apply for anything new yet. Let it age. At month 12, ask to convert the secured card and get your deposit back.",
            es: "Mes 6: ya debería existir un puntaje. No solicites nada nuevo todavía; deja que madure. Al mes 12, pide convertir la tarjeta asegurada y recuperar tu depósito.",
          },
        ],
        takeaway: {
          en: "Start with one account and a small recurring bill, with automatic payments for the full statement balance.",
          es: "Empieza con una cuenta y un gasto pequeño y recurrente, con pago automático del saldo completo del estado de cuenta.",
        },
      },
    ],
  },
  {
    id: "unit-4",
    title: { en: "Protecting what you build", es: "Proteger lo que construiste" },
    summary: {
      en: "Late payments, collections, medical debt, disputes, and freezing your credit for free.",
      es: "Pagos atrasados, cobranzas, deuda médica, disputas y congelar tu crédito gratis.",
    },
    lessons: [
      {
        id: "credit-14",
        title: {
          en: "The 30-day rule on late payments",
          es: "La regla de 30 días en pagos atrasados",
        },
        minutes: 3,
        body: [
          {
            en: "A payment is not reported to the bureaus until it is 30 days past the due date. Between day 1 and day 29 you may owe a late fee, but your report is untouched.",
            es: "Un pago no se reporta a las agencias hasta 30 días después de la fecha de vencimiento. Entre el día 1 y el 29 puedes deber un cargo por atraso, pero tu reporte no se toca.",
          },
          {
            en: "That window is your safety margin. If money is late, pay something before day 30, even partially, and call the lender to ask for a due-date change to match when you get paid.",
            es: "Esa ventana es tu margen de seguridad. Si el dinero se atrasa, paga algo antes del día 30, aunque sea parcial, y llama al prestamista para pedir cambiar la fecha de pago a cuando cobras.",
          },
          {
            en: "If you already have one late payment on an otherwise clean account, ask for a goodwill adjustment in writing. Lenders sometimes remove a first offense.",
            es: "Si ya tienes un atraso en una cuenta por lo demás limpia, pide por escrito un ajuste de buena voluntad. A veces los prestamistas quitan la primera falta.",
          },
        ],
        takeaway: {
          en: "Day 29 still counts as on time to the bureaus. Use that window, don't rely on it.",
          es: "El día 29 todavía cuenta como a tiempo para las agencias. Usa esa ventana, pero no dependas de ella.",
        },
      },
      {
        id: "credit-15",
        title: { en: "Collections, and calling first", es: "Cobranzas y llamar primero" },
        minutes: 4,
        body: [
          {
            en: "Most providers (hospitals, clinics, utilities, cities) will set up a payment plan that never reaches your report. The account only goes to a collection agency after months of silence.",
            es: "Casi todos los proveedores (hospitales, clínicas, servicios públicos, ciudades) aceptan un plan de pagos que nunca llega a tu reporte. La cuenta pasa a cobranza solo después de meses de silencio.",
          },
          {
            en: "If it is already in collections, request debt validation in writing within 30 days of first contact. The agency must prove the debt is yours and the amount is right before collecting.",
            es: "Si ya está en cobranza, pide validación de la deuda por escrito dentro de los 30 días del primer contacto. La agencia debe probar que la deuda es tuya y que el monto es correcto antes de cobrar.",
          },
          {
            en: "Never pay a collector by giving bank access over the phone, and get any settlement in writing before you pay. Paying an old collection does not always remove it, so ask what they will report.",
            es: "Nunca pagues a un cobrador dando acceso a tu banco por teléfono, y consigue cualquier acuerdo por escrito antes de pagar. Pagar una cobranza vieja no siempre la borra, así que pregunta qué van a reportar.",
          },
        ],
        takeaway: {
          en: "Contact the provider before a bill goes to collections to ask about a payment plan.",
          es: "Comunícate con el proveedor antes de que una cuenta pase a cobranza para preguntar por un plan de pagos.",
        },
      },
      {
        id: "credit-16",
        title: {
          en: "Medical debt is treated differently",
          es: "La deuda médica se trata distinto",
        },
        minutes: 3,
        body: [
          {
            en: "Paid medical collections must be removed from credit reports, unpaid ones cannot appear for the first year, and the three bureaus no longer report medical collections under $500.",
            es: "Las cobranzas médicas pagadas deben quitarse del reporte, las no pagadas no pueden aparecer durante el primer año y las tres agencias ya no reportan cobranzas médicas menores a $500.",
          },
          {
            en: "Before paying any hospital bill, ask for an itemized statement and for the charity care or financial assistance application. Washington hospitals are required to offer charity care, and many households qualify for a full write-off.",
            es: "Antes de pagar una factura de hospital, pide un estado de cuenta detallado y la solicitud de asistencia financiera o caridad. Los hospitales de Washington están obligados a ofrecer caridad, y muchos hogares califican para que se cancele todo.",
          },
        ],
        takeaway: {
          en: "Before paying a hospital bill in Washington, ask for the charity care application that hospitals are required to offer.",
          es: "Antes de pagar una factura hospitalaria en Washington, pide la solicitud de asistencia financiera que los hospitales deben ofrecer.",
        },
      },
      {
        id: "credit-17",
        title: { en: "Disputing an error, free", es: "Disputar un error, gratis" },
        minutes: 4,
        body: [
          {
            en: "Errors are common: accounts you never opened, a paid balance still showing, one debt listed twice by the original lender and a collector, or someone else's account with a similar name.",
            es: "Los errores son comunes: cuentas que nunca abriste, un saldo ya pagado que sigue apareciendo, una deuda listada dos veces por el prestamista y el cobrador, o la cuenta de otra persona con nombre parecido.",
          },
          {
            en: "File the dispute with the bureau in writing, describe exactly what is wrong, and attach copies, never originals. The bureau has 30 days to investigate and must tell you the result.",
            es: "Presenta la disputa con la agencia por escrito, describe exactamente qué está mal y adjunta copias, nunca originales. La agencia tiene 30 días para investigar y debe darte el resultado.",
          },
          {
            en: "Dispute with all three bureaus separately, since they do not share corrections. Keep a copy of everything you send.",
            es: "Disputa con las tres agencias por separado, porque no comparten las correcciones. Guarda copia de todo lo que envíes.",
          },
        ],
        takeaway: {
          en: "You can dispute errors yourself without paying a company to do it for you.",
          es: "Puedes disputar los errores por tu cuenta sin pagar a una empresa para que lo haga.",
        },
      },
      {
        id: "credit-18",
        title: { en: "Freeze your credit", es: "Congela tu crédito" },
        minutes: 3,
        body: [
          {
            en: "A credit freeze blocks new accounts from being opened in your name. It is free at all three bureaus, does not affect your score, and you can lift it temporarily in minutes when you actually apply for something.",
            es: "Congelar el crédito impide que abran cuentas nuevas a tu nombre. Es gratis en las tres agencias, no afecta tu puntaje y puedes levantarlo por un rato en minutos cuando de verdad solicites algo.",
          },
          {
            en: "It is the strongest free protection against identity theft, and it is worth doing even if nothing has happened. You can also freeze a child's file.",
            es: "Es la protección gratuita más fuerte contra el robo de identidad y vale la pena aunque no haya pasado nada. También puedes congelar el archivo de un menor.",
          },
          {
            en: "If you find fraud, report it at identitytheft.gov to get a recovery plan and the letters you need.",
            es: "Si encuentras fraude, repórtalo en identitytheft.gov para obtener un plan de recuperación y las cartas que necesitas.",
          },
        ],
        takeaway: {
          en: "A free credit freeze at all three bureaus helps protect against new accounts being opened in your name, and you can lift it when needed.",
          es: "Congelar tu crédito gratis en las tres agencias ayuda a evitar que abran cuentas a tu nombre y puedes levantar el congelamiento cuando lo necesites.",
        },
      },
    ],
  },
  {
    id: "unit-5",
    title: {
      en: "Using credit without getting trapped",
      es: "Usar el crédito sin caer en trampas",
    },
    summary: {
      en: "Interest, minimum payments, scams, and the places a score quietly matters.",
      es: "Intereses, pagos mínimos, estafas y los lugares donde el puntaje importa en silencio.",
    },
    lessons: [
      {
        id: "credit-19",
        title: { en: "Interest and the grace period", es: "Intereses y el periodo de gracia" },
        minutes: 3,
        body: [
          {
            en: "If you pay your statement balance in full each month, purchases cost you nothing in interest. That window is the grace period, and it is the only free credit that exists.",
            es: "Si pagas el saldo del estado de cuenta completo cada mes, las compras no te cuestan intereses. Esa ventana es el periodo de gracia y es el único crédito gratis que existe.",
          },
          {
            en: "Carry a balance once and many cards suspend the grace period, charging interest on new purchases from the day you make them until you are back at zero.",
            es: "Si dejas saldo una vez, muchas tarjetas suspenden el periodo de gracia y cobran intereses sobre las compras nuevas desde el día que las haces hasta que vuelvas a cero.",
          },
          {
            en: "Cash advances never have a grace period. Interest starts immediately, usually at a higher rate, plus a fee.",
            es: "Los adelantos de efectivo nunca tienen periodo de gracia. El interés empieza de inmediato, casi siempre a una tasa más alta, más una comisión.",
          },
        ],
        takeaway: {
          en: "Pay the full statement balance to avoid purchase interest during the grace period; cash advances start accruing interest immediately.",
          es: "Paga el saldo completo para evitar intereses sobre compras durante el periodo de gracia; los adelantos de efectivo generan intereses de inmediato.",
        },
      },
      {
        id: "credit-20",
        title: {
          en: "Why minimum payments never end",
          es: "Por qué los pagos mínimos nunca terminan",
        },
        minutes: 3,
        body: [
          {
            en: "The minimum is usually about 2% of the balance. On $2,000 at 24% APR, paying only the minimum takes over 15 years and costs more in interest than the original balance.",
            es: "El mínimo suele ser cerca del 2% del saldo. Con $2,000 al 24% APR, pagar solo el mínimo toma más de 15 años y cuesta más en intereses que el saldo original.",
          },
          {
            en: "Paying a fixed $100 a month instead of the shrinking minimum clears the same balance in about two years.",
            es: "Pagar una cantidad fija de $100 al mes en lugar del mínimo decreciente liquida el mismo saldo en unos dos años.",
          },
          {
            en: "Run your own numbers in the Trap Detector before you decide what to pay.",
            es: "Haz tus propios números en el Detector de Trampas antes de decidir cuánto pagar.",
          },
        ],
        takeaway: {
          en: "Pick a fixed monthly payment and never lower it as the balance falls.",
          es: "Elige un pago mensual fijo y nunca lo bajes cuando baje el saldo.",
        },
      },
      {
        id: "credit-21",
        title: {
          en: "Credit repair scams and co-signing",
          es: "Estafas de reparación de crédito y ser cofirmante",
        },
        minutes: 3,
        body: [
          {
            en: "No company can remove accurate information from your report. Charging before delivering results is illegal, and promises of a 'new credit identity' are fraud. Everything they charge for, you can do free.",
            es: "Ninguna empresa puede borrar información correcta de tu reporte. Cobrar antes de dar resultados es ilegal, y prometer una 'nueva identidad de crédito' es fraude. Todo lo que cobran lo puedes hacer gratis.",
          },
          {
            en: "For real help, nonprofit credit counseling through the NFCC is free or low cost and will not sell you anything.",
            es: "Para ayuda real, la asesoría de crédito sin fines de lucro a través de la NFCC es gratis o de bajo costo y no te vende nada.",
          },
          {
            en: "Co-signing is not a favor with no cost: the whole loan is your debt if the other person stops paying, and it appears on your report either way. Only co-sign an amount you could pay yourself.",
            es: "Ser cofirmante no es un favor sin costo: todo el préstamo es tu deuda si la otra persona deja de pagar, y aparece en tu reporte de todos modos. Solo cofirma una cantidad que tú podrías pagar.",
          },
        ],
        takeaway: {
          en: "You can handle credit disputes without paying for repair services, and should only co-sign a debt you could repay in full yourself.",
          es: "Puedes disputar errores de crédito sin pagar servicios de reparación, y solo deberías cofirmar una deuda que podrías pagar completa por tu cuenta.",
        },
      },
      {
        id: "credit-22",
        title: {
          en: "How your score affects everyday costs",
          es: "Cómo afecta tu puntaje a los gastos cotidianos",
        },
        minutes: 3,
        body: [
          {
            en: "Landlords, car insurers in most states, phone carriers, and utility deposits all use credit or a credit-based score. A thin file can cost you a larger deposit long before it costs you a loan.",
            es: "Los arrendadores, las aseguradoras de autos en casi todos los estados, las compañías de teléfono y los depósitos de servicios usan el crédito o un puntaje basado en él. Un archivo delgado puede costarte un depósito más alto mucho antes que un préstamo.",
          },
          {
            en: "On a used car loan, the gap between poor and good credit is often 8 to 10 percentage points, several thousand dollars over the term for the same car.",
            es: "En un préstamo de carro usado, la diferencia entre crédito malo y bueno suele ser de 8 a 10 puntos porcentuales: varios miles de dólares durante el plazo por el mismo carro.",
          },
          {
            en: "That is the real reason to build it: not the number, but the price you are quoted for the things you already need.",
            es: "Esa es la razón real para construirlo: no el número, sino el precio que te cotizan por las cosas que ya necesitas.",
          },
        ],
        takeaway: {
          en: "Your credit score can affect the rates and deposits you are offered for things you need.",
          es: "Tu puntaje de crédito puede influir en las tasas y los depósitos que te piden por cosas que necesitas.",
        },
      },
    ],
  },
];

export const creditLessons: Module[] = creditUnits.flatMap((u) => u.lessons);

export function findLesson(id: string) {
  const index = creditLessons.findIndex((l) => l.id === id);
  if (index < 0) return null;
  const lesson = creditLessons[index]!;
  const unit = creditUnits.find((u) => u.lessons.some((l) => l.id === id))!;
  return {
    lesson,
    unit,
    index,
    prev: index > 0 ? creditLessons[index - 1]! : null,
    next: index < creditLessons.length - 1 ? creditLessons[index + 1]! : null,
  };
}
