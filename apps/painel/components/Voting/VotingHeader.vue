<template>
    <Suspense>
    <v-card id="voting-header">
        <v-row class="bg-white">

            <v-col cols="12" sm="12" md="6" lg="3">
                <v-row>
                    <v-col class="d-flex justify-center pa-0 pt-5" cols="12">
                        <v-img height="80" :src="casa.data.value?.logotipo" />
                    </v-col>
                    <v-col class="pa-3" cols="12">
                        <h6 class="text-center text-bold font-weight-bold text-subtitle-1">{{ casa.data.value?.nome }}</h6>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="3" class="pa-8">
                <p class="py-2 bg-light-blue-darken-2 text-center"><strong>EM DISCUSSÃO</strong></p>
                <p class="text-h5 text-center">{{materia.__str__}}</p>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="3"  class="pa-8" :class="$vuetify.display.smAndDown ? 'pt-0 text-center' : ''">
                <div class="border-definition ">
                    <div class="font-weight-bold">
                        <p v-if="poder">{{poder}}</p>
                        <p v-else>Poder Legislativo</p>
                    </div>
                        <p>{{bill}}</p>
                        <p>Sessão {{ horarioSessao }}</p>
                    
                </div>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="3" class="my-2 px-4">
                <v-row class="bg-grey-darken-1">
                    <v-col cols="12" md="6" v-for="(item, index) in sss" :key="index">
                        <div class="d-flex text-center">
                            <div :class="item.bgColor" class="vote-card-bg-width"></div>
                            <p class="bg-grey-darken-3 w-100 text-h4"><strong>{{ item.value }}</strong></p>
                        </div>
                    </v-col>
                </v-row>
            </v-col>

            
        </v-row>


    </v-card>
    </Suspense>
</template>

<script lang="ts" setup>
const apiSPL = new useSessaoPlenaria()
const utilities = new useUtils()

const casa = await useAsyncData(async () => {
    return await apiSPL.casalegislativa()
})

const props = defineProps(["expediente", "sessao", "votos", "poder"])
const parlamentaryList = ref(props.votos)

const quorum = ref(await apiSPL.sessaoType(props.sessao.tipo))
const quorumMinimo =  quorum.value?.quorum_minimo

setInterval(async() =>  {
    parlamentaryList.value = props.votos
}, 2000)

const horarioSessao = props.sessao.data_inicio.split('-').reverse().join('/');
const materia = ref(await apiSPL.materiaSessao(props.expediente.materia))
const bill = utilities.bill(materia.value?.numero, materia.value?.ano)

const votes: Votes[] = reactive([
    { value: 0, bgColor: 'bg-green-darken-1' },
    { value: 0, bgColor: 'bg-red-lighten-1' },
    { value: 0, bgColor: 'bg-yellow-darken-1' },
    { value: quorumMinimo, bgColor: 'bg-white' }
])


const sss = computed(() => {
    for(let i = 3; i--; i ==0) {
        votes[i].value = 0
    }

    if(parlamentaryList.value) {
        parlamentaryList.value.forEach((element: any) => {
            if(element.voto == "Sim") votes[0].value++
            if(element.voto == "Não") votes[1].value++
            if(element.voto == "Abstenção") votes[2].value++
        });
    }
    
    return votes
})


interface Votes {
    value: number
    bgColor: string
}
</script>

<style lang="scss" scoped>
.vote-card-bg-width {
    max-height: 100px;
    width: 10px;
}

.img-style img{
    max-height: 80px;
    object-fit: contain;
}

.border-definition {
    border-left: 3px solid #757575;
    padding-left: 15px;
}
</style>