<script lang="ts" setup>
const props = defineProps(['expedient', 'sessao', 'orderDay', 'votatioOpen'])

const apiSAPL = new UseSessaoPlenaria()

const exp = ref(props.expedient)
const orderDay = props.orderDay === 2
const presenca: any = ref()
const materia = ref(await apiSAPL.materiaSessao(props.expedient?.materia))
const authors = ref(await apiSAPL.authorMaterial(materia.value?.autores))

const { data, refresh, pending } = await useAsyncData(
    async () => {
        const result: any = await apiSAPL.votosSessao({
            exp: props.expedient?.id,
            order: orderDay,
        })

        if (result.length === 0) return null

        return result
    },
    { server: false }
)

const existVotes = computed(() => {
    if (!presenca.value) return false
    else return true
})

const watchVotes = setInterval(async () => {
    presenca.value = data.value
    exp.value = props.expedient

    if (!pending.value) {
        if (exp.value) refresh()
    }
}, 4000)

onUnmounted(() => {
    clearInterval(watchVotes)
})
</script>

<template>
    <div id="voting-screen">
        <VotingHeader
            :poder="authors?.poder"
            :votos="presenca"
            :sessao="sessao"
            :expedient="expedient"
        />

        <div>
            <div
                v-if="!existVotes"
                class="text-grey-lighten-5 mt-10 text-center text-h3"
            >
                Sessão Aberta para votação
            </div>

            <v-row v-else justify-center class="mt-5">
                <v-col
                    v-for="item in presenca"
                    :key="item.id"
                    cols="12"
                    xs="12"
                    sm="6"
                    lg="3"
                >
                    <VotingCard :infos="item" />
                </v-col>
            </v-row>
        </div>
    </div>
</template>
