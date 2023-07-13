<template>
    <div id="results-conteudo" class="mx-auto w-75 text-center mt-15">
        <h1 class="text-uppercase text-h5 mb-4 font-weight-bold  text-grey-lighten-4 text-md-h3">{{ sessao.__str__ }}</h1>
        <span class="bg-grey-darken-1 pa-2"><strong>{{bill}}</strong></span>
        
        <v-row class="mt-15 bg-white">
            <v-col
                v-for="(item, index) in results" :key="index" 
                cols="12" sm="12" md="6" lg="3"
                class="pa-4"
                :class="item.label === 'quorum' ? 'bg-grey-darken-1' : ''"
            >
                <div 
                    :style="{ borderColor: resultsColor(item.label) }"
                    class="bg-grey-darken-3 pa-3 result-border"
                >
                    <p class="text-uppercase"><strong>{{ item.label }}</strong></p>
                    <p class="text-h2"><strong>{{ item.value }}</strong></p>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
const apiSPL = new useSessaoPlenaria()

const props  = defineProps<{registro: any, expediente: any, sessao: any, bill: any}>();

const expediente = ref(props.expediente)
const sessao = ref(props.sessao)
const registro = ref(props.registro)
const bill = ref(props.bill)

const quorum = ref(await apiSPL.sessaoType(sessao.value.tipo))

watch(() => props.registro ,async () => {
    expediente.value = props.expediente
    sessao.value = props.sessao
    registro.value = props.registro

    quorum.value = await apiSPL.sessaoType(sessao.value.tipo)
})

watch(() => props.bill,() => {
    bill.value = props.bill
})

const results = computed<Results[]>(() => [
    { value: registro.value?.numero_votos_sim , label: 'sim' },
    { value: registro.value?.numero_votos_nao, label: 'nao' },
    { value: registro.value?.numero_abstencoes, label: 'abst' },
    { value: quorum.value.quorum_minimo, label: 'quorum' },
])

interface Results {
    value: number
    label: string
}

const resultsColor = (label: string): string => {
    const colors: any = {
        sim: '#66BB6A',
        nao: '#EF5350',
        abst: '#FFEE58',
    }

    return colors[label] || '#FFFFFF'
}

</script>

<style lang="scss" scoped>
.result-border {
    border-left: 15px solid;
}

</style>