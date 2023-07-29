interface Expediente {
    id: number
    __str__: string
    metadata: Record<string, unknown>
    data_ordem: string
    observacao: string
    numero_ordem: number
    resultado: string
    tipo_votacao: number
    votacao_aberta: boolean
    registro_aberto: boolean
    sessao_plenaria: number
    materia: number
    tramitacao: null | unknown
}

class useExpediente {
    config = useRuntimeConfig()
    headers = { Authorization: '' }
    private sessaoID: number
    public expedientes: Expediente[] | null = []

    constructor(sessaoID: number) {
        this.sessaoID = sessaoID
        this.headers = {
            Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
        }
    }

    async getExpedientList(): Promise<Expediente[] | null> {
        try {
            if (!this.sessaoID) return null

            const { results } = await $fetch<Expediente[] | any>(
                `${this.config.public.SAPL_URL}sessao/expedientemateria/?sessao_plenaria=${this.sessaoID}`,
                {
                    headers: this.headers,
                }
            )
            if (!results) return null
            this.expedientes = results
            return this.expedientes
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }

    async getActiveExpedient() {
        try {
            if (!this.expedientes || this.expedientes.length === 0) {
                this.expedientes = await this.getExpedientList()
            }
            if (!!this.expedientes?.length) {
                const itemsWithOpenRegisterOrVoting = this.expedientes.filter(
                    (obj: Expediente) =>
                        obj.registro_aberto === true ||
                        obj.votacao_aberta === true
                )

                if (itemsWithOpenRegisterOrVoting.length > 0) {
                    return itemsWithOpenRegisterOrVoting?.at(0)
                } else {
                    return null
                }
            }
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }
}

export default useExpediente
