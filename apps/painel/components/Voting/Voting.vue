<template>
    <div id="voting-screen">
        <VotingHeader :poder="authors?.poder" :votos="presenca" :sessao="sessao" :expediente="expediente" />
        
        <div>
            
            <div v-if="presenca == ''" class="text-grey-lighten-5 mt-10 text-center text-h3" >
                Sessão Aberta para votação
            </div>

            <v-row v-else justify-center class="mt-5">
                <v-col  cols="12" xs="12" sm="6" lg="3" v-for="item in data?.votos" :key="item.id"
                >
                    <VotingCard :votationOpen="data.status?.votacao_aberta" :infos="item" />
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
const apiSPL = new useSessaoPlenaria()

const props  = defineProps(["expediente", "sessao", "orderDay", "votatioOpen"])
const exp = ref(props.expediente)
const orderDay  = props.orderDay == 2? true : false

const materia = ref(await apiSPL.materiaSessao(props.expediente?.materia))
const authors = ref(await apiSPL.authorMaterial(materia.value?.autores))
const presenca:any = ref("")

const { data, refresh, pending } = await useAsyncData(async() => {
    const result: any = {votos: undefined}
    result.votos =  await apiSPL.votosSessao({exp: props.expediente?.id, order: orderDay})
     
    return result
}, {server: false})

const watchVotes = setInterval(async () => {
    presenca.value = data.value?.votos
    exp.value = props.expediente
    
    if(!pending.value) {
        if(exp.value) {
            refresh()
        }
    }
    
}, 4000)

onUnmounted(() => {
    clearInterval(watchVotes)
})

</script>