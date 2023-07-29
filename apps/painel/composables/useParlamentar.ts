interface Parliamentarian {
    id: number
    __str__: string
    metadata: Record<string, any>
    nome_completo: string
    nome_parlamentar: string
    sexo: string
    numero_gab_parlamentar: string
    telefone: string
    telefone_celular: string
    endereco_web: string
    profissao: string
    email: string
    locais_atuacao: string
    ativo: boolean
    biografia: string
    fotografia: string
    cropping: string
    nivel_instrucao: string | null
}

class useParlamentar {
    config = useRuntimeConfig()
    headers = { Authorization: '' }
    private sessaoID: number
    public parlamentar: Parliamentarian[] | null = []

    constructor(sessaoID: number) {
        this.sessaoID = sessaoID
        this.headers = {
            Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
        }
    }

    async getAllParliamentarians(): Promise<Parliamentarian[] | null> {
        try {
            if (!this.sessaoID) return null

            const { results } = await $fetch<Parliamentarian[] | any>(
                `${this.config.public.SAPL_URL}parlamentares/parlamentar/`,
                {
                    headers: this.headers,
                }
            )
            if (!results) return null
            this.parlamentar = results
            return this.parlamentar
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }
}

export default useParlamentar
