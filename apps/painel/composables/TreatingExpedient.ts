class TreatingData {
    apiSAPL = new UseSessaoPlenaria()

    constructor(
        private expedient: any,
        private expedientCurrent: any,
        private timeExpedienteRead: any,
        private ScreenShow: any
    ) { }

    async treatingExpedientAndResult() {
        this.expedientCurrent.value = !this.expedientCurrent.value
            ? this.expedient
            : this.expedientCurrent.value

        if (this.expedientCurrent.value && this.expedient?.votacao_aberta) {
            if (this.expedientCurrent.value?.id !== this.expedient?.id)
                this.expedientCurrent.value = this.expedient

            if (
                this.expedientCurrent.value?.id === this.expedient?.id &&
                !this.expedientCurrent.value?.votacao_aberta &&
                this.expedient?.votacao_aberta
            )
                this.expedientCurrent.value = this.expedient

            if (!this.expedientCurrent.value?.timed) {
                this.expedientCurrent.value.timed = true
                this.timeExpedienteRead.value = Date.now()
            }
        }

        const resultReadExpediente = await this.apiSAPL.registerRead(
            this.expedientCurrent.value?.id
        )

        if (this.expedientCurrent.value?.id)
            this.expedientCurrent.value.resultado = resultReadExpediente?.id
                ? 'Matéria lida'
                : ''

        if (
            !this.timeExpedienteRead.value &&
            this.ScreenShow.screen === 'ShowMaterial'
        )
            this.timeExpedienteRead.value =
                this.expedientCurrent.value?.resultado !== ''
                    ? Date.now()
                    : null

        const dataExpedient = ref(
            await this.apiSAPL.registroVotacao(this.timeExpedienteRead.value)
        )

        if (resultReadExpediente?.id) {
            const registerExist = await this.apiSAPL.registroVotacao(
                Date.parse(resultReadExpediente.data_hora)
            )

            if (registerExist?.id) dataExpedient.value = registerExist
            else dataExpedient.value = null
        }

        if (dataExpedient.value?.id) {
            this.timeExpedienteRead.value = null
            this.expedientCurrent.value.votacao_aberta = false
        }
        return {
            expedient: this.expedientCurrent.value,
            treatingTimeExpedienteRead: this.timeExpedienteRead.value,
            treatingRegistroExpediente: dataExpedient.value,
        }
    }
}

export default TreatingData
