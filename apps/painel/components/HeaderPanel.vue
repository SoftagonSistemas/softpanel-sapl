<script setup lang="ts">
interface Props {
    bill?: string
    poder?: string
    status?: string
    section?: string
}
const props = defineProps<Props>()

const apiSAPL = new UseSessaoPlenaria()

const casa = await useAsyncData(async () => {
    return await apiSAPL.legislativeHouse()
})
const data = ref(props)
</script>

<template>
    <v-card id="header">
        <v-row class="bg-grey-lighten-4 pa-5" justify="center">
            <v-col cols="12" sm="12" md="4">
                <v-row>
                    <v-col class="d-flex justify-center pa-0 pt-1" cols="12">
                        <v-img
                            max-width="100"
                            :src="casa.data.value?.logotipo"
                            :alt="casa.data.value?.nome"
                        />
                    </v-col>
                    <v-col class="pa-1" cols="12" justify="center">
                        <v-sheet
                            color="transparent"
                            class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
                            width="100%"
                        >
                            <strong>{{ casa.data.value?.nome }}</strong>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-col>

            <v-col align-self="center" cols="12" sm="12" md="4">
                <v-alert color="success" variant="tonal" border="bottom">
                    <v-sheet
                        color="transparent"
                        class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
                        width="100%"
                    >
                        <strong>TEXTO {{ statusLabel }}</strong>
                    </v-sheet>
                </v-alert>
            </v-col>

            <v-col cols="12" sm="12" md="4" class="d-flex justify-center">
                <div class="d-flex flex-column justify-center text-right pr-5">
                    <div class="font-weight-bold">
                        <p v-if="data.poder">
                            {{ data.poder }}
                        </p>
                        <p v-else>Poder Legislativo</p>
                    </div>
                    <p>{{ data.bill }} dddd</p>
                    TESTE
                    <p v-if="data.section">
                        {{ `Sessão ${data.section}` }}
                    </p>
                </div>
                <v-divider
                    :thickness="2"
                    class="border-opacity-75"
                    color="grey-darken-4"
                    vertical
                ></v-divider>
            </v-col>
        </v-row>
    </v-card>
</template>
