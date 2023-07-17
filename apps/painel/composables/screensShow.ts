const Votation = {
  exist: true,
  seeVotation: true,
  VotationOpen: true,
  typeVotation: 2,
  result: '',
}

const VotationSimbolic = {
  exist: true,
  seeVotation: false,
  VotationOpen: true,
  typeVotation: 1,
  result: '',
}

const VotationSecret = {
  exist: true,
  seeVotation: false,
  VotationOpen: true,
  typeVotation: 3,
  result: '',
}

const expedientReadOnly = {
  exist: true,
  seeVotation: false,
  VotationOpen: true,
  typeVotation: 4,
  result: '',
}

const materialRead = {
  exist: true,
  seeVotation: false,
  VotationOpen: false,
  typeVotation: 4,
  result: 'Matéria lida',
}

const materialReadAsync = {
  exist: true,
  seeVotation: false,
  VotationOpen: true,
  typeVotation: 4,
  result: 'Matéria lida',
}

export function isEqual(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function changeScreen(context: Context) {
  const screen = (screen: string, scenario = 0) => {
    return { screen, scenario }
  }

  // NoSection
  // SectionInitiate
  // VotationOpen
  // ShowMaterial
  // PollResults

  if (!context.sessaoToday.exist)
    return screen('NoSection')
  if (!context.sessaoToday.init)
    return screen('NoSection')
  if (context.sessaoToday.finalized)
    return screen('NoSection')

  if (isEqual(Votation, context.orderDay))
    return screen('VotationOpen', 2)
  if (isEqual(Votation, context.expedient))
    return screen('VotationOpen', 1)

  if (isEqual(VotationSimbolic, context.orderDay)
    || isEqual(VotationSecret, context.orderDay))
    return screen('ShowMaterial', 2)

  if (isEqual(expedientReadOnly, context.expedient))
    return screen('ShowMaterial', 1)
  if (isEqual(expedientReadOnly, context.orderDay))
    return screen('ShowMaterial', 2)

  if (context.expedient.typeVotation !== 4
    && context.expedient.typeVotation !== 2
    && context.expedient.result === ''
    && !context.registerVotation.exist)
    return screen('ShowMaterial', 1)

  if (context.registerVotation.exist)
    return screen('PollResult', context.registerVotation.scenario)

  if (isEqual(materialReadAsync, context.expedient))
    return screen('ShowMaterial', 1)

  if (isEqual(materialRead, context.expedient))
    return screen('ShowMaterial', 1)

  if (isEqual(materialRead, context.orderDay))
    return screen('ShowMaterial', 2)

  return screen('SectionInitiate')
}

export function contextConfig(sessaoToday: any, expediente: any, registro: any, orderDay: any) {
  const context: Context = {
    sessaoToday: {
      exist: !!sessaoToday?.id,
      init: sessaoToday?.iniciada,
      finalized: sessaoToday?.finalizada,
    },

    expedient: {
      exist: !!expediente?.id,
      seeVotation: expediente?.tipo_votacao === 2,
      VotationOpen: expediente?.votacao_aberta,
      typeVotation: expediente?.tipo_votacao,
      result: expediente?.resultado,
    },
    orderDay: {
      exist: !!orderDay?.id,
      seeVotation: orderDay?.tipo_votacao === 2,
      VotationOpen: orderDay?.votacao_aberta,
      typeVotation: orderDay?.tipo_votacao,
      result: orderDay?.resultado,
    },

    registerVotation: {
      exist: !!registro?.id,
      scenario: registro?.expediente ? 1 : 2,
    },
  }

  return context
}
