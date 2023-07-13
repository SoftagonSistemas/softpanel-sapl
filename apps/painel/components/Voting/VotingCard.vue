<template>
    <Suspense>
        <v-row id="voting-card">
            <v-col class="d-flex">
                <div class="img-border bg-grey-lighten-4 d-flex align-center">
                    <v-img :src="parlamentar?.fotografia ? parlamentar?.fotografia : defaultAvatarImage"
                        class="fotografy" />
                </div>
                <div class="w-100">
                    <div class="text-center bg-grey-lighten-4 border-radius names">
                        <p class="nameBorder text-h6 font-weight-bold">{{ name }}</p>
                        <p class="nameBorder lastName text-h7 font-weight-bold">{{ lastName }}</p>
                    </div>
                    <div class="">
                        <div class="text-center bg-grey-lighten-4 border-radius names">
                            <p class="nameBorder text-h6 font-weight-bold">{{ name }}</p>
                            <p class="nameBorder lastName text-h7 font-weight-bold">{{ lastName }}</p>
                        </div>
                        <div class="d-flex">
                            <div class="bg-grey-lighten-4 d-flex justify-center align-center pa-3">
                                <div v-if="!logoPartido">
                                    <p>{{ party?.sigla }}</p>
                                </div>
                                <div v-else>
                                    <v-img width="50" :src="logoPartido" />
                                </div>

                            </div>
                            <div class="w-50 bg-grey-lighten-4 border-radius">
                                <p class="bg-grey-darken-1 text-h6 text-uppercase text-center pa-2 font-weight-bold">{{
                                    party.sigla }}</p>
                                <p class="text-h5 vote-border pa-3 rounded-be-xl"
                                    :style="{ borderColor: voteconfig?.color }">{{
                                        voteconfig?.value }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </v-col>
        </v-row>
    </Suspense>
</template>

<script setup lang="ts">
import defaultAvatarImage from '@/assets/images/avatar.png'

const apiSPL = new useSessaoPlenaria()
const name = ref()
const lastName = ref()

const props = defineProps(["infos", "votationOpen"])
const infos = ref(props.infos)

const [parlamentar, party] = await Promise.all([
    apiSPL.getParlamentar({ id: infos.value?.parlamentar, all: false }),
    apiSPL.filicaoParlamentar(infos.value?.parlamentar)
])

const watchVotes = setInterval(async () => {
    infos.value = props.infos
}, 4000)

const logoPartido = party?.logo_partido

const aa = () => {
    const names = parlamentar?.nome_completo.split(" ")
    name.value = names?.shift()
    lastName.value = names?.toString().replaceAll(",", " ")
}
aa()

const voteconfig = computed(() => {
    const setups = [
        { value: "SIM", color: '#66BB6A' },
        { value: "NÃO", color: '#EF5350' },
        { value: "ABS", color: '#FDD835' }
    ]

    for (const key in setups) {
        if (infos.value?.voto == "Sim") return setups[0]
        if (infos.value?.voto == "Não") return setups[1]
        if (infos.value?.voto == "Abstenção") return setups[2]
    }
})

onUnmounted(() => {
    clearInterval(watchVotes)
})
</script>

<style lang="scss" scoped>
.fotografy {
        width: 120px;
    }
@media (min-width: 600px) and (max-width: 960px) {
    .fotografy {
        width: 95px;
    }

}
.vote-border {
    border-left: 10px solid;
}

.names {
    min-width: 100%;
}

.img-border {
    border: solid 3px #76FF03;
}

.lastName {
    display: flex;
    text-align: center;
    justify-content: center;
    height: 50px;
}
.nameBorder {
    border-bottom: solid 1px #000000;
}

.border-radius {
    border-bottom-right-radius: 10px;
}</style>
