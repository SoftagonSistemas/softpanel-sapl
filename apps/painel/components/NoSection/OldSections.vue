<script setup lang="ts">
const props = defineProps(['sections', 'page'])
const emits = defineEmits({
    changePage: (p: number) => p,
})
const env = useRuntimeConfig()
const apiSAPL = new UseSessaoPlenaria()
const sections = ref(props.sections?.results)
const page = ref(props.page)
const lastPage = ref(props.sections?.pagination.total_pages)

function url() {
    const urlApi = env.public.SAPL_URL
    const url = urlApi.slice(0, -5)
    if (url.slice(-1) === '/') return url.slice(-1)
    return url
}

watch(
    () => props.sections,
    async () => {
        page.value = props.page
        sections.value = props.sections?.results
        await typeSections()
    }
)

function changePage(p: number, operation: string) {
    const newPage = operation === 'som' ? p + 1 : p - 1
    emits('changePage', newPage)
}

async function typeSections() {
    await sections.value?.forEach(async (element: any) => {
        const { data } = await useAsyncData(async () => {
            return await apiSAPL.sessaoType(element.tipo)
        })

        const data_americana = element.data_inicio

        element.data_inicio = data_americana.split('-').reverse().join('/')
        element.typeSection = data.value
    })
}
await typeSections()
</script>

<template>
    <v-container id="old-sections">
        <div>
            <v-row>
                <v-col cols="12">
                    <h1 class="text-center">Sessões Passadas</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    v-for="section in sections"
                    :key="section.id"
                    cols="12"
                    md="3"
                >
                    <v-card
                        class="bg-grey-darken-2 rounded-s-0 text-grey-darken-5"
                        :title="section.__str__"
                        :subtitle="section.typeSection?.nome"
                        :text="section?.data_inicio"
                    >
                        <v-card-actions>
                            <v-btn
                                block
                                variant="tonal"
                                color="white"
                                :href="`${url()}/sessao/${section.id}`"
                                target="_blank"
                            >
                                Veja mais
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-row class="">
                <v-col>
                    <v-btn v-if="page > 1" @click="changePage(page, 'sub')">
                        Anterior
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn
                        v-if="lastPage !== page"
                        @click="changePage(page, 'som')"
                    >
                        Próxima
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>
