export interface LegilsativeHouse {
    id: number
    __str__: string
    metadata: Record<string, unknown>
    version: string
    codigo: string
    nome: string
    sigla: string
    endereco: string
    cep: string
    municipio: string
    uf: string
    telefone: string
    fax: string
    logotipo: string
    endereco_web: string
    email: string
    informacao_geral: string
}

class CasaLegislativa {
    config = useRuntimeConfig()
    utils = new useUtils()
    headers = { Authorization: '' }
    house: LegilsativeHouse | null = null
    constructor() {
        this.headers = {
            Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
        }
    }

    async getLegilsativeHouse(): Promise<LegilsativeHouse | null> {
        try {
            const { results } = await $fetch<LegilsativeHouse[] | any>(
                `${this.config.public.SAPL_URL}base/casalegislativa/`,
                {
                    headers: this.headers,
                }
            )
            this.house = results.at(0)
            return this.house
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }
}
export default CasaLegislativa
