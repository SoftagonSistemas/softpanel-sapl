<script setup lang="ts">
const props = defineProps<{ expedient: any; sessao: any; registro: any }>()

const expedient = ref(props.expedient)
const sessao = ref(props.sessao)
const registro = ref(props.registro)

const utilities = new UseUtils()
const apiSAPL = new UseSessaoPlenaria()

const { data, refresh } = await useAsyncData(
    async () => {
        const [sessaoPle, materia] = await Promise.all([
            apiSAPL.sessao(sessao.value.id),
            apiSAPL.materiaSessao(registro.value.materia),
        ])

        const [tipoMateria, authors, result] = await Promise.all([
            apiSAPL.tipoMateria(materia?.tipo),
            apiSAPL.authorMaterial(materia?.autores),
            apiSAPL.tiporesultadovotacao(registro.value.tipo_resultado_votacao),
        ])

        return { sessaoPle, materia, tipoMateria, authors, result }
    },
    { server: false }
)

watch(
    () => props.registro,
    () => {
        if (registro.value?.id !== props.registro?.id) {
            expedient.value = props.expedient
            sessao.value = props.sessao
            registro.value = props.registro
            refresh()
        }
    }
)

const artigo = computed(
    () =>
        `${data.value?.tipoMateria} ${utilities.bill(
            data.value?.materia?.numero,
            data.value?.materia?.ano
        )}`
)

const headerContent = computed(() => {
    return {
        bill: artigo,
        poder: data.value?.authors?.poder,
        status: data.value?.result.natureza,
        section: data.value?.sessaoPle.datReuniaoString.slice(0, 10),
    }
})
</script>

<template>
    <div id="results-screen">
        <HeaderPanel :content="headerContent" />
        <VotingResultsNumbers
            :expedient="expedient"
            :registro="registro"
            :sessao="sessao"
            :bill="artigo"
        />
    </div>
</template>
