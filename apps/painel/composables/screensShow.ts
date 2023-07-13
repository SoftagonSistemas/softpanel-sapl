export function changeScreen(context: Context, CurrentScreen: any) {
    const screen = (screen:string, scenario:number = 0) => {return {screen, scenario}}

    // NoSection
    // SectionInitiate
    // VotationOpen
    // ShowMaterial
    // PollResults

    if(!context.sessaoToday.exist) return screen("NoSection")
    if(!context.sessaoToday.init) return screen("NoSection")
    if(context.sessaoToday.finalized) return screen("NoSection")

    if(isEqual(Votation, context.orderDay)) return screen("VotationOpen", 2)
    if(isEqual(Votation, context.expedient)) return screen("VotationOpen", 1)

    if(isEqual(VotationSimbolic, context.orderDay)   ||
    isEqual(VotationSecret, context.orderDay)     ) return screen("ShowMaterial", 2)
    
    if(isEqual(expedientReadOnly, context.expedient)) return screen("ShowMaterial", 1)
    if(isEqual(expedientReadOnly, context.orderDay)) return screen("ShowMaterial", 2)

    if(context.expedient.typeVotation != 4 &&
       context.expedient.typeVotation != 2 &&
       context.expedient.result       == ""  &&
       !context.registerVotation.exist        ) return screen("ShowMaterial", 1)

    if(context.registerVotation.exist) return screen("PollResult", context.registerVotation.scenario)
    
    if(isEqual(materialReadAsync, context.expedient)) return screen("ShowMaterial", 1)

    if(isEqual(materialRead, context.expedient)) return screen("ShowMaterial", 1)
    
    if(isEqual(materialRead, context.orderDay)) return screen("ShowMaterial", 2)

    
    return screen("SectionInitiate")
}

export function contextConfig(sessaoToday: any, expediente: any, registro: any, orderDay: any) {

    const context: Context = {
        sessaoToday: {
            exist: sessaoToday?.id? true : false,
            init: sessaoToday?.iniciada,
            finalized: sessaoToday?.finalizada
        },

        expedient: {
            exist: expediente?.id? true : false,
            seeVotation: expediente?.tipo_votacao == 2? true : false,
            VotationOpen: expediente?.votacao_aberta,
            typeVotation: expediente?.tipo_votacao,
            result: expediente?.resultado
        },
        orderDay: {      
            exist: orderDay?.id? true : false,
            seeVotation: orderDay?.tipo_votacao == 2? true : false,
            VotationOpen: orderDay?.votacao_aberta,
            typeVotation: orderDay?.tipo_votacao,
            result: orderDay?.resultado
        },

        registerVotation: {
            exist: registro?.id? true: false,
            scenario: registro?.expediente? 1 : 2
        }
    }

    return context
}

const Votation = {
    exist: true,
    seeVotation: true,
    VotationOpen: true,
    typeVotation: 2,
    result: ""
}

const VotationSimbolic = {
    exist: true,
    seeVotation: false,
    VotationOpen: true,
    typeVotation: 1,
    result: ""
}

const VotationSecret = {
    exist: true,
    seeVotation: false,
    VotationOpen: true,
    typeVotation: 3,
    result: ""
}

const showExpedienteMaterial = {
    exist: true,
    seeVotation: true,
    VotationOpen: false,
    typeVotation: 2,
    result: ""
}

const expedientReadOnly = {
    exist: true,
    seeVotation: false,
    VotationOpen: true,
    typeVotation: 4,
    result: ""
}


const materialRead = {
    exist: true,
    seeVotation: false,
    VotationOpen: false,
    typeVotation: 4,
    result: "Matéria lida"
}

const materialReadAsync = {
    exist: true,
    seeVotation: false,
    VotationOpen: true,
    typeVotation: 4,
    result: "Matéria lida"
}

export function isEqual(obj1:any, obj2:any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
