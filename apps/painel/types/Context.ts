export interface Context {
  sessaoToday: SessaoToday
  expedient: ExpedientOrOrderDay
  orderDay: ExpedientOrOrderDay

  registerVotation: registerVotation
}

interface SessaoToday {
  exist: boolean
  init: boolean
  finalized: boolean
}

interface ExpedientOrOrderDay {
  exist: boolean
  seeVotation: boolean
  VotationOpen: boolean
  typeVotation: 1 | 2 | 3 | 4 | undefined
  result: string
}

interface registerVotation {
  exist: boolean
  scenario: 1 | 2
}
