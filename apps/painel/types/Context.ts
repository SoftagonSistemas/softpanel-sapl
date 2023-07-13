type Context = {
    sessaoToday: SessaoToday,
    expedient: ExpedientOrOrderDay,
    orderDay: ExpedientOrOrderDay,
    
    registerVotation: registerVotation
}

type SessaoToday = {
    exist: boolean,
    init: boolean,
    finalized: boolean
}

type ExpedientOrOrderDay = {
    exist: boolean,
    seeVotation: boolean,
    VotationOpen: boolean,
    typeVotation: 1 | 2 | 3 | 4 | undefined,
    result: string
}

type registerVotation = {
    exist: boolean,
    scenario: 1 | 2
}