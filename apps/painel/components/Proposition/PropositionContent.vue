<script setup lang="ts">
const props = defineProps(['proposition'])
const proposition = ref(props.proposition)

watch(() => props.proposition, () => {
  proposition.value = props.proposition
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
        <div v-if="props.proposition.parliamentaryName.length === 0">
          <div class="d-flex flex-column text-wrap">
            <div
              class="d-inline-block text-grey-darken-4 my-1 py-1 px-5 bg-grey-lighten-3 text-h4 font-weight-bold text-center"
            >
              Nenhum autor registrado
            </div>
          </div>
        </div>
        <div v-else>
          <div v-for="(author, index) in props.proposition.parliamentaryName" :key="author.id">
            <div v-if="index < 3">
              <div class="d-flex flex-column text-wrap">
                <div
                  class="d-inline-block text-grey-darken-4 my-1 py-1 px-5 bg-grey-lighten-3 text-h4 font-weight-bold"
                >
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
          <div v-if="props.proposition.parliamentaryName.length > 3" class="d-flex justify-end">
            <div class="text-grey-darken-4 bg-grey-lighten-3 d-inline pa-2 rounded text-h6 font-weight-bold">
              E mais {{ props.proposition.parliamentaryName.length - 3 === 1 ? `um autor` : `${props.proposition.parliamentaryName.length - 3} autores` }}
            </div>
          </div>
        </div>
      </div>
      <v-col cols="12" sm="12" md="8" lg="6" class="d-flex flex-column">
        <div class="bg-yellow-darken-2 pa-4 mt-12 mb-1 text-center font-weight-bold text-h5">
          {{ props.proposition.VoteTipe }}
        </div>
        <div class="bg-yellow-darken-2 pa-4">
          <div class="font-weight-bold">
            <p v-if="props.proposition.poder">
              {{ props.proposition.poder }}
            </p>
            <p v-else>
              Poder Legislativo
            </p>
          </div>
          <p>{{ props.proposition.bill }}</p>
          <p>Sessão <strong>{{ props.proposition.section }}</strong></p>
        </div>
      </v-col>
    </v-col>
    <v-col cols="12" sm="12" md="7">
      <div class="pa-4">
        <h1 class="text-h4 font-weight-bold text-grey-lighten-4">
          {{ props.proposition.titleproposition }}
        </h1>
        <p class="d-inline-block bg-grey-darken-1 px-10 py-1 text-center text-h6 font-weight-bold">
          {{
            proposition.proposicao }}
        </p>
        <p class="bg-grey-lighten-5 mt-1 pa-3">
          {{ props.proposition.description }}
        </p>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped></style>
