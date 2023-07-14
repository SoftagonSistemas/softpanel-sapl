<script setup lang="ts">
interface Props {
  listaVereador: {
    id: number
    parlamentar: string
    presentes: any
  }[]
}
const props = defineProps<Props>()
const listaVereador = ref(props.listaVereador)
</script>

<template>
  <div>
    <div v-if="listaVereador" id="presentes" class="grid grid-cols-4 gap-4">
      <li v-for="ver in listaVereador" :key="ver.id">
        {{ ver.parlamentar }}
        {{ ver.presentes?.nome_parlamentar }}
        <img :src="ver.presentes?.fotografia" :alt="ver.presentes?.nome_completo">
      </li>
    </div>
    <div v-else>
      <h2>Aguardo registro de presença dos parlamentares.</h2>
    </div>
  </div>
</template>
