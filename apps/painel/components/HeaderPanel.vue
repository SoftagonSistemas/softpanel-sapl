<script setup lang="ts">
import { LegilsativeHouse } from '@/composables/useCasaLegislativa'

const props = defineProps({
    poder: {
        type: String,
        default: 'Poder Legislativo',
    },
    status: {
        default: 'closed',
    },
    materia: {
        type: String,
        default: '',
    },
    sessao: {
        type: String,
        default: '',
    },
    votacoes: {
        type: Array,
        default: [],
    },
})

const theHouse = new useCasaLegislativa()
const house: LegilsativeHouse | null = await theHouse.getLegilsativeHouse()
const session = new useSessaoPlenaria()
</script>

<template>
    <v-card id="headerPanel">
        <v-row class="bg-grey-lighten-4 pa-4" justify="center">
            <v-col cols="12" sm="12" md="4">
                <v-row>
                    <v-col class="d-flex justify-center pa-0 pt-1" cols="12">
                        <v-img
                            max-width="100"
                            :src="house?.logotipo"
                            :alt="house?.nome"
                        />
                    </v-col>
                    <v-col class="pa-1" cols="12" justify="center">
                        <v-sheet
                            color="transparent"
                            class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
                            width="100%"
                        >
                            <strong>{{ house?.nome }}</strong>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-col>

            <v-col align-self="center" cols="12" sm="12" md="4">
                <v-alert
                    :color="session.getStatusData(props.status).color"
                    variant="tonal"
                    border="bottom"
                >
                    <v-sheet
                        color="transparent"
                        class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
                        width="100%"
                    >
                        <strong>{{
                            session.getStatusData(props.status).text
                        }}</strong>
                    </v-sheet>
                </v-alert>
            </v-col>

            <v-col cols="12" sm="12" md="4" class="d-flex justify-center">
                <div class="d-flex flex-column justify-center text-right pr-3">
                    <h3 id="poder">{{ props.poder }}</h3>
                    <p
                        v-show="props.materia !== ''"
                        id="materia"
                        class="font-weight-medium"
                    >
                        {{ props.materia }}
                    </p>
                    <p
                        v-show="props.sessao !== ''"
                        id="sessao"
                        class="font-weight-regular"
                    >
                        {{ props.sessao }}
                    </p>
                </div>
                <v-divider
                    v-show="props.sessao"
                    :thickness="1"
                    class="border-opacity-75"
                    color="grey-darken-4"
                    vertical
                ></v-divider>
                <div
                    id="votacoes"
                    v-if="!!props.votacoes?.length"
                    class="d-flex flex-column justify-center text-right pl-3"
                >
                    Votações aqui
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>
