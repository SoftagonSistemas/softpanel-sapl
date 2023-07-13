<script setup lang="ts">
const props = defineProps(["Proposition"])
const Proposition = ref(props.Proposition)

watch(() => props.Proposition, () => {
    Proposition.value = props.Proposition
})

</script>

<template>
    <v-row id="proposition" class="my-5">
        <v-col cols="12" sm="12" md="5">
            <div class="d-flex flex-column ">
                <div>
                    <span class="d-inline-block text-grey-darken-4 px-5 bg-grey-lighten-3 text-h6 font-weight-bold">
                        Requerido por:
                    </span>
                </div>
                <div v-if="props.Proposition.parliamentaryName.length == 0">
                    <div class="d-flex flex-column text-wrap">
                        <div
                            class="d-inline-block text-grey-darken-4 my-1 py-1 px-5 bg-grey-lighten-3 text-h4 font-weight-bold text-center">
                            Nenhum autor registrado
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-for="(author, index) in props.Proposition.parliamentaryName" :key="author.id">
                        <div v-if="index < 3">
                            <div class="d-flex flex-column text-wrap">
                                <div
                                    class="d-inline-block text-grey-darken-4 my-1 py-1 px-5 bg-grey-lighten-3 text-h4 font-weight-bold">
                                    {{ author.nome }}
                                </div>
                            </div>

                            <div v-show="author.party">
                                <span class="d-inline-block bg-grey-darken-1 px-10 py-1 text-center text-h5 font-weight-bold">
                                    {{ author.party }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-end" v-if="props.Proposition.parliamentaryName.length > 3">
                        <div class="text-grey-darken-4 bg-grey-lighten-3 d-inline pa-2 rounded text-h6 font-weight-bold">
                        E mais {{ props.Proposition.parliamentaryName.length - 3 == 1? `um autor`: `${props.Proposition.parliamentaryName.length - 3} autores` }}
                        </div>
                    </div>
                </div>
            </div>
            <v-col cols="12" sm="12" md="8" lg="6" class="d-flex flex-column">
                <div class="bg-yellow-darken-2 pa-4 mt-12 mb-1 text-center font-weight-bold text-h5">
                    {{ props.Proposition.VoteTipe }}
                </div>
                <div class="bg-yellow-darken-2 pa-4">
                    <div class="font-weight-bold">
                        <p v-if="props.Proposition.poder">{{ props.Proposition.poder }}</p>
                        <p v-else>Poder Legislativo</p>
                    </div>
                    <p>{{ props.Proposition.bill }}</p>
                    <p>Sessão <strong>{{ props.Proposition.section }}</strong></p>
                </div>
            </v-col>
        </v-col>
        <v-col cols="12" sm="12" md="7">
            <div class="pa-4">
                <h1 class="text-h4 font-weight-bold text-grey-lighten-4">{{ props.Proposition.titleProposition }}</h1>
                <p class="d-inline-block bg-grey-darken-1 px-10 py-1 text-center text-h6 font-weight-bold">{{
                    Proposition.proposicao }}</p>
                <p class="bg-grey-lighten-5 mt-1 pa-3">
                    {{ props.Proposition.description }}
                </p>
            </div>
        </v-col>
    </v-row>
</template>

<style scoped></style>