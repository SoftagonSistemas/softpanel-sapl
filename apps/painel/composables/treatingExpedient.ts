class TreatingData {
  apiSPL = new UseSessaoPlenaria()

  constructor(private expediente: any, private expedienteCurrent: any, private timeExpedienteRead: any, private ScreenShow: any) { }

  async treatingExpedientAndResult() {
    this.expedienteCurrent.value = !this.expedienteCurrent.value ? this.expediente : this.expedienteCurrent.value

    if (this.expedienteCurrent.value && this.expediente?.votacao_aberta) {
      if (this.expedienteCurrent.value?.id !== this.expediente?.id)
        this.expedienteCurrent.value = this.expediente

      if (this.expedienteCurrent.value?.id === this.expediente?.id && !this.expedienteCurrent.value?.votacao_aberta && this.expediente?.votacao_aberta)
        this.expedienteCurrent.value = this.expediente

      if (!this.expedienteCurrent.value?.timed) {
        this.expedienteCurrent.value.timed = true
        this.timeExpedienteRead.value = Date.now()
      }
    }

    const resultReadExpediente = await this.apiSPL.registerRead(this.expedienteCurrent.value?.id)

    if (this.expedienteCurrent.value?.id)
      this.expedienteCurrent.value.resultado = resultReadExpediente?.id ? 'Matéria lida' : ''

    if (!this.timeExpedienteRead.value && this.ScreenShow.screen === 'ShowMaterial')
      this.timeExpedienteRead.value = this.expedienteCurrent.value?.resultado !== '' ? Date.now() : null

    const registroExpediente = ref(await this.apiSPL.registroVotacao(this.timeExpedienteRead.value))

    if (resultReadExpediente?.id) {
      const registerExist = await this.apiSPL.registroVotacao(Date.parse(resultReadExpediente.data_hora))

      if (registerExist?.id)
        registroExpediente.value = registerExist
      else registroExpediente.value = null
    }

    if (registroExpediente.value?.id) {
      this.timeExpedienteRead.value = null
      this.expedienteCurrent.value.votacao_aberta = false
    }
    return {
      expediente: this.expedienteCurrent.value,
      treatingTimeExpedienteRead: this.timeExpedienteRead.value,
      treatingRegistroExpediente: registroExpediente.value,
    }
  }
}

export default TreatingData
