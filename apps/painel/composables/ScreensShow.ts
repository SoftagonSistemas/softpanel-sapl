import { Context } from 'types/Context'

class ScreensShow {
    context: Context
    useUtils = new UseUtils()

    Votation = {
        exist: true,
        seeVotation: true,
        VotationOpen: true,
        typeVotation: 2,
        result: '',
    }

    VotationSimbolic = {
        exist: true,
        seeVotation: false,
        VotationOpen: true,
        typeVotation: 1,
        result: '',
    }

    VotationSecret = {
        exist: true,
        seeVotation: false,
        VotationOpen: true,
        typeVotation: 3,
        result: '',
    }

    expedientReadOnly = {
        exist: true,
        seeVotation: false,
        VotationOpen: true,
        typeVotation: 4,
        result: '',
    }

    materialRead = {
        exist: true,
        seeVotation: false,
        VotationOpen: false,
        typeVotation: 4,
        result: 'Matéria lida',
    }

    materialReadAsync = {
        exist: true,
        seeVotation: false,
        VotationOpen: true,
        typeVotation: 4,
        result: 'Matéria lida',
    }

    constructor(
        sessionToday: any,
        expedient: any,
        registro: any,
        orderDay: any
    ) {
        this.context = {
            sessionToday: {
                exist: !!sessionToday?.id,
                init: sessionToday?.iniciada,
                finalized: sessionToday?.finalizada,
            },
            expedient: {
                exist: !!expedient?.id,
                seeVotation: expedient?.tipo_votacao === 2,
                VotationOpen: expedient?.votacao_aberta,
                typeVotation: expedient?.tipo_votacao,
                result: expedient?.resultado,
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
                scenario: registro?.expedient ? 1 : 2,
            },
        }
    }

    changeScreen() {
        const screen = (screen: string, scenario = 0) => {
            return { screen, scenario }
        }

        // NoSection
        // SectionInitiate
        // VotationOpen
        // ShowMaterial
        // PollResults

        if (!this.context.sessionToday.exist) return screen('NoSection')
        if (!this.context.sessionToday.init) return screen('NoSection')
        if (this.context.sessionToday.finalized) return screen('NoSection')

        if (this.useUtils.isEqual(this.Votation, this.context.orderDay))
            return screen('VotationOpen', 2)
        if (this.useUtils.isEqual(this.Votation, this.context.expedient))
            return screen('VotationOpen', 1)

        if (
            this.useUtils.isEqual(
                this.VotationSimbolic,
                this.context.orderDay
            ) ||
            this.useUtils.isEqual(this.VotationSecret, this.context.orderDay)
        )
            return screen('ShowMaterial', 2)

        if (
            this.useUtils.isEqual(
                this.expedientReadOnly,
                this.context.expedient
            )
        )
            return screen('ShowMaterial', 1)
        if (
            this.useUtils.isEqual(this.expedientReadOnly, this.context.orderDay)
        )
            return screen('ShowMaterial', 2)

        if (
            this.context.expedient.typeVotation !== 4 &&
            this.context.expedient.typeVotation !== 2 &&
            this.context.expedient.result === '' &&
            !this.context.registerVotation.exist
        )
            return screen('ShowMaterial', 1)

        if (this.context.registerVotation.exist)
            return screen('PollResult', this.context.registerVotation.scenario)

        if (
            this.useUtils.isEqual(
                this.materialReadAsync,
                this.context.expedient
            )
        )
            return screen('ShowMaterial', 1)

        if (this.useUtils.isEqual(this.materialRead, this.context.expedient))
            return screen('ShowMaterial', 1)

        if (this.useUtils.isEqual(this.materialRead, this.context.orderDay))
            return screen('ShowMaterial', 2)

        return screen('SectionInitiate')
    }
}

export default ScreensShow
