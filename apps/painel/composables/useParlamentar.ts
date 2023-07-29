export interface Assemblyman {
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
type FilterType = {
    ativo: boolean
    presente?: boolean
}

class useParlamentar {
    config = useRuntimeConfig()
    headers = { Authorization: '' }
    private sessaoID: number
    public parlamentar: Assemblyman[] | null = []

    constructor(sessaoID: number) {
        this.sessaoID = sessaoID
        this.headers = {
            Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
        }
    }

    async getAllAssemblyman(ativo = true): Promise<Assemblyman[] | null> {
        try {
            if (!this.sessaoID) return null

            const { results } = await $fetch<Assemblyman[] | any>(
                `${this.config.public.SAPL_URL}parlamentares/parlamentar/`,
                {
                    headers: this.headers,
                }
            )
            if (!results) return null

            //filter Ativo
            const filteredData = results?.filter(
                (obj: Assemblyman) => obj.ativo === ativo
            )

            this.parlamentar = filteredData
            return this.parlamentar
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }
}

export default useParlamentar
