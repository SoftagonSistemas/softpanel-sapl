export async function treatingExpedientAndResult(expediente: any, expedienteCurrent: any, timeExpedienteRead: any, ScreenShow: any) {
  const apiSPL = new UseSessaoPlenaria()

  expedienteCurrent.value = !expedienteCurrent.value ? expediente : expedienteCurrent.value

  if (expedienteCurrent.value && expediente?.votacao_aberta) {
    if (expedienteCurrent.value?.id !== expediente?.id)
      expedienteCurrent.value = expediente

    if (expedienteCurrent.value?.id === expediente?.id && !expedienteCurrent.value?.votacao_aberta && expediente?.votacao_aberta)
      expedienteCurrent.value = expediente

    if (!expedienteCurrent.value?.timed) {
      expedienteCurrent.value.timed = true
      timeExpedienteRead.value = Date.now()
    }
  }

  const resultReadExpediente = await apiSPL.registerRead(expedienteCurrent.value?.id)

  if (expedienteCurrent.value?.id)
    expedienteCurrent.value.resultado = resultReadExpediente?.id ? 'Matéria lida' : ''

  if (!timeExpedienteRead.value && ScreenShow.screen === 'ShowMaterial')
    timeExpedienteRead.value = expedienteCurrent.value?.resultado !== '' ? Date.now() : null

  const registroExpediente = ref(await apiSPL.registroVotacao(timeExpedienteRead.value))

  if (resultReadExpediente?.id) {
    const registerExist = await apiSPL.registroVotacao(Date.parse(resultReadExpediente.data_hora))

    if (registerExist?.id)
      registroExpediente.value = registerExist
    else registroExpediente.value = null
  }

  if (registroExpediente.value?.id) {
    timeExpedienteRead.value = null
    expedienteCurrent.value.votacao_aberta = false
  }
  return {
    expediente: expedienteCurrent.value,
    treatingTimeExpedienteRead: timeExpedienteRead.value,
    treatingRegistroExpediente: registroExpediente.value,
  }
}
