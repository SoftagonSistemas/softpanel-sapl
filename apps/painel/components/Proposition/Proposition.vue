<script setup lang="ts">
const props = defineProps(['expediente'])
const utilities = new UseUtils()
const apiSPL = new UseSessaoPlenaria()

const materia = ref()
const sessao = ref()
const authors = ref()
const tipoMateria = ref()

const { refresh } = await useAsyncData('base', async () => {
  const [materiaRes, sessaoRes] = await Promise.all([
    apiSPL.materiaSessao(props.expediente.materia),
    apiSPL.sessao(props.expediente.sessao_plenaria),
  ])

  const [authorsRes, tipoMateriaRes] = await Promise.all([
    apiSPL.authorMaterial(materiaRes.autores),
    apiSPL.tipoMateria(materiaRes.tipo),
  ])

  materia.value = materiaRes
  sessao.value = sessaoRes
  authors.value = authorsRes
  tipoMateria.value = tipoMateriaRes
}, { server: false })

watch(() => props.expediente?.id, () => {
  refresh()
})

const proposition = computed(() => {
  return {
    parliamentaryName: authors.value?.authors,

    VoteTipe: utilities.typesVotation(props.expediente?.tipo_votacao),
    proposicao: utilities.bill(materia.value?.numero, materia.value?.ano),
    bill: `${tipoMateria.value} ${utilities.bill(materia.value?.numero, materia.value?.ano)}`,

    titleProposition: sessao.value.txtTituloReuniao,
    description: materia.value.ementa,
    section: sessao.value.datReuniaoString.slice(0, 10),
    poder: authors.value?.poder,
  }
})

const headerContent = computed(() => {
  return {
    bill: `${tipoMateria.value} ${utilities.bill(materia.value?.numero, materia.value?.ano)}`,
    poder: authors.value?.poder,
    status: props.expediente.resultado === 'Matéria lida' ? 'materialRead' : 'discussao',
    section: sessao.value.datReuniaoString.slice(0, 10),
  }
})
</script>

<template>
  <div id="proposition-screen">
    <Header :content="headerContent" />
    <PropositionContent :proposition="proposition" />
  </div>
</template>
