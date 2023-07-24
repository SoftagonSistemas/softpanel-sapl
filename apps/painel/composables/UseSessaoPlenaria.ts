class SessaoPlenaria {
    config = useRuntimeConfig()
    utils = new UseUtils()
    /**
   * Dados da sessaoPlenaria
   * @url https://sapl.CIDADE.leg.br/api/schema/swagger-ui/
          {{ ver.presentes }}
   * @param params.hoje Filtro por data
   * @param params.id  Pega apenas uma
   * @returns json com todos os campos da sessão
   */
    async plenarySession(params: {
        id?: number
        hoje?: string
        oldSections?: boolean
        page?: number
    }) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            if (params.oldSections) {
                params.page = !params.page ? 1 : params.page
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/sessaoplenaria?finalizada__istartswith=true&page=${params.page}`,
                    {
                        headers,
                    }
                )
                if (!data.pagination) return null

                return data
            }
            if (params.hoje) {
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/sessaoplenaria/?data_inicio=${params.hoje}`,
                    {
                        headers,
                    }
                )
                if (!data) return null
                return data.results[0]
            }
            if (params.id) {
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/sessaoplenaria/${params.id}`,
                    {
                        headers,
                    }
                )

                return data
            }
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao-plenaria`,
                {
                    headers,
                }
            )
            if (data.results.length) return data?.results
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async legislativeHouse(params = { id: 1 }) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}base/casalegislativa/${params.id}`,
                {
                    headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async expedients(params: any) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/sessaoplenaria/${params.id}/expedientes/`,
                {
                    headers,
                }
            )
            if (data.results.length) return data.results
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async plenarySessionAttendance(params: {
        id?: number
        atualizar?: boolean
    }) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }
            const data: any = await useAsyncData('parla', () =>
                $fetch(
                    `${this.config.public.SAPL_URL}sessao/plenarySessionAttendance?sessao_plenaria=${params.id}`,
                    {
                        headers,
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
                                headers,
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
            console.log(e)
        }
    }

    async getParlamentar(params: { id?: number; all: boolean; page?: number }) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }
            if (params.all) {
                params.page = !params.page ? 1 : params.page
                const parlamentarys: any = await $fetch(
                    `${this.config.public.SAPL_URL}parlamentares/parlamentar?page=${params.page}`,
                    {
                        headers,
                    }
                )
                if (!parlamentarys.pagination) return null

                return parlamentarys
            }

            if (typeof params.id === 'undefined') return null

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/parlamentar/${params.id}`,
                {
                    headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async sessao(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao-plenaria/${id}`,
                {
                    headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async materiaSessao(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}materia/materialegislativa/${id}`,
                {
                    headers,
                }
            )
            if (data) return data
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async sessaoType(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/tiposessaoplenaria/${id}`,
                {
                    headers,
                }
            )
            if (data?.id) return data
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async expedientSession(id: number) {
        if (!id) return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/expedientemateria?sessao_plenaria=${id}`,
                {
                    headers,
                }
            )
            if (!data.results[0]) return null

            const expedientOpen = data.results?.find((elem: any) => {
                return elem.votacao_aberta === true
            })

            if (expedientOpen) return expedientOpen
            else return data.results.pop()
        } catch (e) {
            console.log(e)
        }
    }

    async dayOrderSession(id: number) {
        if (!id) return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/ordemdia?sessao_plenaria=${id}`,
                {
                    headers,
                }
            )
            if (!data.results[0]) return null

            const expedientOpen = data.results?.find((elem: any) => {
                return elem.votacao_aberta === true
            })

            if (expedientOpen) return expedientOpen
            else return data.results.pop()
        } catch (e) {
            console.log(e)
        }
    }

    async filicaoParlamentar(id: number, sigla?: boolean) {
        if (typeof id === 'undefined') return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/filiacao?parlamentar=${id}`,
                {
                    headers,
                }
            )

            if (!data.results[0]?.partido) return null

            const party: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/partido/${data.results[0]?.partido}`,
                {
                    headers,
                }
            )

            if (!data) return null
            if (sigla) return party?.sigla
            if (party) return party
            else return null
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async politycalParty(id: number) {
        if (typeof id === 'undefined') return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}parlamentares/partido/${id}`,
                {
                    headers,
                }
            )

            if (data?.id) return data
            else return null
        } catch (e) {
            console.log(e)
        }
    }

    async votosSessao(params: { exp: number; order: boolean }) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }
            if (params.order) {
                const data: any = await $fetch(
                    `${this.config.public.SAPL_URL}sessao/votoparlamentar?ordem=${params.exp}`,
                    {
                        headers,
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
                    headers,
                }
            )

            if (!data?.pagination) return null

            return data.results.filter((elem: any) => elem.voto !== 'Não Votou')
        } catch (e) {
            console.log(e)
        }
    }

    async registroVotacao(expedientTime: any) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }

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
            console.log(e)
        }
    }

    async orgaoAuthor(params: { id: number; atualizar?: boolean }) {
        if (!params.id) return null
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}materia/orgao/${params.id}`,
                { headers, retry: 3 }
            )

            if (data?.id) return null

            const retorno = data

            return retorno
        } catch (e) {
            console.log(e)
        }
    }

    async registerRead(idExpediente: number) {
        if (!idExpediente) return null

        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/registroleitura?expediente=${idExpediente}`,
                { headers, retry: 3 }
            )

            if (!data.pagination) return null

            const retorno = data.results[0]

            return retorno
        } catch (e) {
            console.log(e)
        }
    }

    async tiporesultadovotacao(id: number) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}sessao/tiporesultadovotacao/${id}`,
                {
                    headers,
                    retry: 3,
                }
            )

            const retorno = data

            return retorno
        } catch (e) {
            console.log(e)
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
                console.log(e)
            }
        }

        if (authors.length === 0) return { authors: [], poder: undefined }
        return { authors, poder }
    }

    async tipoMateria(id: number) {
        try {
            const headers = {
                Authorization: `Bearer ${this.config.public.SAPL_TOKEN}`,
            }
            const data: any = await $fetch(
                `${this.config.public.SAPL_URL}materia/tipomaterialegislativa/${id}`,
                { headers }
            )

            if (!data) return null

            const retorno = data.__str__

            return retorno
        } catch (e) {
            console.log(e)
        }
    }
}
export default SessaoPlenaria
