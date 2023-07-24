<script setup lang="ts">
const props = defineProps(['content'])
const apiSPL = new UseSessaoPlenaria()

const casa = await useAsyncData(async () => {
    return await apiSPL.casalegislativa()
})
const data = ref(props.content)

watch(
    () => props.content,
    () => {
        data.value = props.content
    }
)

const statusLabel = computed<string>(() => {
    const labels = {
        materialRead: 'Matéria Lida',
        discussao: 'Em discussão',
        R: 'Vetada',
        A: 'Aprovada',
        SemSessao: 'Sem Sessão em andamento',
    }

    return labels[data.value?.status]
})

const statusColor = computed<string>(() => {
    const colors = {
        materialRead: 'bg-green',
        discussao: 'bg-light-blue-darken-4',
        R: 'bg-red-darken-1',
        A: 'bg-green',
        SemSessao: 'bg-blue-grey',
    }

    return colors[data.value?.status]
})
</script>

<template>
    <v-card id="header">
        <v-row class="bg-grey-lighten-4 pa-5">
            <v-col cols="12" sm="12" md="4">
                <v-row>
                    <v-col class="d-flex justify-center pa-0 pt-1" cols="12">
                        <v-img
                            height="80"
                            max-width="100"
                            :src="casa.data.value?.logotipo"
                            alt=""
                            srcset=""
                        />
                    </v-col>
                    <v-col class="pa-1" cols="12">
                        <h6
                            class="text-center text-bold font-weight-bold text-subtitle-1"
                        >
                            {{ casa.data.value?.nome }}
                        </h6>
                    </v-col>
                </v-row>
            </v-col>

            <v-col align-self="center" cols="12" sm="12" md="4">
                <div class="d-flex justify-center w-100">
                    <p
                        class="w-75 py-2 text-center text-uppercase text-grey-lighten-4 text-h6"
                        :class="statusColor"
                    >
                        <strong>{{ statusLabel }}</strong>
                    </p>
                </div>
            </v-col>

            <v-col cols="12" sm="12" md="4" class="d-flex justify-center">
                <div
                    class="d-flex flex-column justify-center border-definition text-right pr-5"
                >
                    <div class="font-weight-bold">
                        <p v-if="data.poder">
                            {{ data.poder }}
                        </p>
                        <p v-else>Poder Legislativo</p>
                    </div>
                    <p>{{ data.bill }}</p>
                    <p v-if="data.section">
                        {{ `Sessão ${data.section}` }}
                    </p>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<style scoped>
.border-definition {
    border-right: 3px solid #757575;
}
</style>
