<script setup lang="ts">
const props  = defineProps<{expediente: any, sessao: any, registro: any}>();

const expediente = ref(props.expediente)
const sessao = ref(props.sessao)
const registro = ref(props.registro)


watch(() => props.registro,() => {

    if(registro.value?.id != props.registro?.id) {
        expediente.value = props.expediente
        sessao.value = props.sessao
        registro.value = props.registro
        refresh()
    }
})

const utilities = new useUtils()
const apiSPL= new useSessaoPlenaria()

const {data, refresh} = await useAsyncData(async() => {
    const [ sessaoPle, materia] = await Promise.all([
        apiSPL.sessao(sessao.value.id),
        apiSPL.materiaSessao(registro.value.materia)
    ])
    
    const [tipoMateria, authors, result] = await Promise.all([
        apiSPL.tipoMateria(materia?.tipo),
        apiSPL.authorMaterial(materia?.autores),
        apiSPL.tiporesultadovotacao(registro.value.tipo_resultado_votacao)
    ])

    return {sessaoPle, materia, tipoMateria, authors, result}
}, {server: false})

const artigo = computed(() => `${data.value?.tipoMateria} ${utilities.bill(data.value?.materia?.numero, data.value?.materia?.ano)}`)

const headerContent = computed(() => {return {
    bill: artigo,
    poder: data.value?.authors?.poder,
    status: data.value?.result.natureza,
    section: data.value?.sessaoPle.datReuniaoString.slice(0, 10)
}})

</script>


<template>
    <div id="results-screen">
        <Header :content="headerContent" />
        <VotingResultsNumbers :expediente="expediente" :registro="registro" :sessao="sessao" :bill="artigo"/>
    </div>
</template>