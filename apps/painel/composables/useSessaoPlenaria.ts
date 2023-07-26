export interface Session {
    id: number
    __str__: string
    metadata: Record<string, unknown>
    cod_andamento_sessao: null | string
    painel_aberto: boolean
    data_inicio: string
    hora_inicio: string
    hora_fim: string | null
    numero: number
    data_fim: string | null
    url_audio: string
    url_video: string
    upload_pauta: null | string
    upload_ata: null | string
    upload_anexo: null | string
    iniciada: boolean
    finalizada: boolean
    interativa: boolean
    tema_solene: string
    data_ultima_atualizacao: string
    publicar_pauta: boolean
    tipo: number
    sessao_legislativa: number
    legislatura: number
    correspondencias: unknown[]
}
export type VotingPanelStatus =
    | 'open'
    | 'initiated'
    | 'scheduled'
    | 'multi'
    | 'started'
    | 'in_voting'
    | 'reading'
    | 'closed'

class SessaoPlenaria {
    config = useRuntimeConfig()
    utils = new useUtils()
    headers = { Authorization: '' }
    sessions: Session[] | null = []
    constructor() {
        this.headers = {
            Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
        }
    }

    async getSessions(): Promise<Session[] | null> {
        try {
            const { results } = await $fetch<Session[] | any>(
                `${this.config.public.SAPL_URL}sessao/sessaoplenaria/`,
                {
                    headers: this.headers,
                }
            )
            this.sessions = results
            return this.sessions
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }

    async getTodaySession(): Promise<Session[] | null> {
        try {
            if (!this.sessions || this.sessions.length === 0) {
                this.sessions = await this.getSessions()
            }

            const sessionsToday: Session[] | undefined = this.sessions?.filter(
                (item: Session) =>
                    item.data_inicio === this.utils.AmericanDateToday()
            )
            return sessionsToday ?? null
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }

    async getInitiatedSession(): Promise<Session[] | null> {
        try {
            if (!this.sessions || this.sessions.length === 0) {
                this.sessions = await this.getSessions()
            }
            const itemsWithOpenRegisterOrVoting = this.sessions?.filter(
                (obj: Session) =>
                    obj.iniciada === true && obj.finalizada === false
            )
            return itemsWithOpenRegisterOrVoting ?? null
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }

    async getOpenedSession(): Promise<Session[] | null> {
        try {
            if (!this.sessions || this.sessions.length === 0) {
                this.sessions = await this.getSessions()
            }
            const itemsWithOpenRegisterOrVoting = this.sessions?.filter(
                (obj: Session) => obj.painel_aberto === true
            )
            return itemsWithOpenRegisterOrVoting ?? null
        } catch (e: any | Error) {
            console.warn(e.message)
        }
        return null
    }

    getStatusData(currentStatus: VotingPanelStatus | string) {
        console.log(currentStatus)
        switch (currentStatus) {
            case 'open':
                return { text: 'Sessão aberta', color: 'primary' }
            case 'closed':
                return { text: 'Sem sessões agendadas', color: 'surface' }
            case 'scheduled':
                return { text: 'Aguardando iniciar', color: 'secondary' }
            case 'multi':
                return { text: 'Várias sessões hoje', color: 'info' }
            case 'initiated':
                return { text: 'Sessão iniciada', color: 'primary' }
            default:
                return { text: 'Sem sessões hoje', color: 'warning' }
        }
    }

    async plenarySession(params: {
        id?: number
        hoje?: string
        oldSections?: boolean
        page?: number
    }) {
        try {
            if (params.oldSections) {
                params.page = params.page ?? 1
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/sessaoplenaria?finalizada__istartswith=true&page=${params.page}`,
                    {
                        headers: this.headers,
                    }
                )
                if (!data.pagination) return null
                return data
            }
            if (params.hoje) {
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/sessaoplenaria/?data_inicio=${params.hoje}`,
                    {
                        headers: this.headers,
                    }
                )
                if (!data) return null
                return data.results[0]
            }
            if (params.id) {
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/sessaoplenaria/${params.id}`,
                    {
                        headers: this.headers,
                    }
                )
                return data
            }
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao-plenaria`,
                {
                    headers: this.headers,
                }
            )
            return data.results.length ? data?.results : null
        } catch (e) {
            console.warn(e)
        }
    }

    async legislativeHouse(params = { id: 1 }) {
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}base/casalegislativa/${params.id}`,
                {
                    headers: this.headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.warn(e)
        }
    }

    async expedients(params: any) {
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/sessaoplenaria/${params.id}/expedientes/`,
                {
                    headers: this.headers,
                }
            )
            if (data.results.length) return data.results
            else return null
        } catch (e) {
            console.warn(e)
        }
    }

    async plenarySessionAttendance(params: {
        id?: number
        atualizar?: boolean
    }) {
        try {
            const data: any = await useAsyncData('parla', () =>
                $fetch(
                    `${this.config.public.SAPL_URL}sessao/plenarySessionAttendance?sessao_plenaria=${params.id}`,
                    {
                        headers: this.headers,
                        retry: 3,
                    }
                )
            )

            const retorno = data?.results
            if (retorno?.length) {
                retorno.map(async (r: any, i: number, x: any) => {
                    if (r.parlamentar) {
                        const parlamentar: any = await $fetch(
                            `${this.config.public.SAPL_URL}parlamentares/parlamentar/${r.parlamentar}`,
                            {
                                headers: this.headers,
                            }
                        )
                        x[i].presente = parlamentar.data
                    }
                })
                return retorno
            } else {
                return null
            }
        } catch (e) {
            console.warn(e)
        }
    }

    async getParlamentar(params: { id?: number; all: boolean; page?: number }) {
        try {
            if (params.all) {
                params.page = !params.page ? 1 : params.page
                const parlamentarys: any = await $fetch(
                    `${this.config.public.SAPL_URL}parlamentares/parlamentar?page=${params.page}`,
                    {
                        headers: this.headers,
                    }
                )
                if (!parlamentarys.pagination) return null

                return parlamentarys
            }

            if (typeof params.id === 'undefined') return null

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/parlamentar/${params.id}`,
                {
                    headers: this.headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.warn(e)
        }
    }

    async sessao(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao-plenaria/${id}`,
                {
                    headers: this.headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.warn(e)
        }
    }

    async materiaSessao(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}materia/materialegislativa/${id}`,
                {
                    headers: this.headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.warn(e)
        }
    }

    async sessaoType(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/tiposessaoplenaria/${id}`,
                {
                    headers: this.headers,
                }
            )
            if (data?.id) return data
            else return null
        } catch (e) {
            console.warn(e)
        }
    }

    async expedientSession(id: number) {
        if (!id) return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/expedientemateria?sessao_plenaria=${id}`,
                {
                    headers: this.headers,
                }
            )
            if (!data.results[0]) return null

            const expedientOpen = data.results?.find((elem: any) => {
                return elem.votacao_aberta === true
            })

            if (expedientOpen) return expedientOpen
            else return data.results.pop()
        } catch (e) {
            console.warn(e)
        }
    }

    async dayOrderSession(id: number) {
        if (!id) return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/ordemdia?sessao_plenaria=${id}`,
                {
                    headers: this.headers,
                }
            )
            if (!data.results[0]) return null

            const expedientOpen = data.results?.find((elem: any) => {
                return elem.votacao_aberta === true
            })

            if (expedientOpen) return expedientOpen
            else return data.results.pop()
        } catch (e) {
            console.warn(e)
        }
    }

    async filicaoParlamentar(id: number, sigla?: boolean) {
        if (typeof id === 'undefined') return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/filiacao?parlamentar=${id}`,
                {
                    headers: this.headers,
                }
            )

            if (!data.results[0]?.partido) return null

            const party: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/partido/${data.results[0]?.partido}`,
                {
                    headers: this.headers,
                }
            )

            if (!data) return null
            if (sigla) return party?.sigla
            if (party) return party
            else return null
        } catch (e) {
            console.warn(e)
            return null
        }
    }

    async politycalParty(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/partido/${id}`,
                {
                    headers: this.headers,
                }
            )

            if (data?.id) return data
            else return null
        } catch (e) {
            console.warn(e)
        }
    }

    async votosSessao(params: { exp: number; order: boolean }) {
        try {
            if (params.order) {
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/votoparlamentar?ordem=${params.exp}`,
                    {
                        headers: this.headers,
                    }
                )

                if (!data?.pagination) return null
                return data.results.filter(
                    (elem: any) => elem.voto !== 'Não Votou'
                )
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/votoparlamentar?expediente=${params.exp}`,
                {
                    headers: this.headers,
                }
            )

            if (!data?.pagination) return null

            return data.results.filter((elem: any) => elem.voto !== 'Não Votou')
        } catch (e) {
            console.warn(e)
        }
    }

    async registroVotacao(expedientTime: any) {
        try {
            const data: any = await $fetch(
                `${
                    this.config.public.SAPL_URL
                }sessao/registrovotacao?data_hora__date=${this.utils.AmericanDateToday()}`,
                { headers }
            )

            if (!expedientTime || expedientTime === '')
                return data.results.pop()

            if (!data.pagination) return null

            const register = data.results.filter((elem: any) => {
                const minTime = Date.parse(elem.data_hora)

                return minTime > expedientTime
            })

            return register.pop()
        } catch (e) {
            console.warn(e)
        }
    }

    async orgaoAuthor(params: { id: number; atualizar?: boolean }) {
        if (!params.id) return null
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}materia/orgao/${params.id}`,
                { headers: this.headers, retry: 3 }
            )

            if (data?.id) return null

            const retorno = data

            return retorno
        } catch (e) {
            console.warn(e)
        }
    }

    async registerRead(idExpediente: number) {
        if (!idExpediente) return null

        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/registroleitura?expediente=${idExpediente}`,
                { headers: this.headers, retry: 3 }
            )

            if (!data.pagination) return null

            const retorno = data.results[0]

            return retorno
        } catch (e) {
            console.warn(e)
        }
    }

    async tiporesultadovotacao(id: number) {
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/tiporesultadovotacao/${id}`,
                {
                    headers: this.headers,
                    retry: 3,
                }
            )

            const retorno = data

            return retorno
        } catch (e) {
            console.warn(e)
        }
    }

    async authorMaterial(authorsMaterial: Array<number>) {
        if (!authorsMaterial) return null

        const authors = []
        const poder = ref('')
        for (const authorId of authorsMaterial) {
            try {
                const headers = {
                    Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
                }

                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}base/autor/${authorId}`,
                    { headers }
                )

                if (!data?.id) break

                if (data?.tipo !== 2 && data?.tipo !== 7) authors.push(data)

                if (data?.tipo === 2) {
                    const parlamentar = await this.getParlamentar({
                        id: data?.autor_related.value,
                        all: false,
                    })
                    const party = await this.filicaoParlamentar(parlamentar?.id)

                    if (parlamentar)
                        authors.push({
                            nome: parlamentar?.nome_completo,
                            party: party ? party?.sigla : undefined,
                        })

                    if (!data) return null
                }

                if (data?.tipo === 7) {
                    authors.push(data)
                    poder.value = 'Poder Executivo'
                }
            } catch (e) {
                console.warn(e)
            }
        }

        if (authors.length === 0) return { authors: [], poder: undefined }
        return { authors, poder }
    }

    async tipoMateria(id: number) {
        try {
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}materia/tipomaterialegislativa/${id}`,
                { headers }
            )

            if (!data) return null

            const retorno = data.__str__

            return retorno
        } catch (e) {
            console.warn(e)
        }
    }
}
export default SessaoPlenaria
