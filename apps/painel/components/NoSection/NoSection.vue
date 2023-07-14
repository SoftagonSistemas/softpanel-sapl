<script setup lang="ts">
const apiSAPL = new UseSessaoPlenaria()
const pageSections = ref(1)

const changePageSections = ref((p: any) => {
  pageSections.value = p
})

const sections = await useAsyncData(async () => {
  const sections = await apiSAPL.sessaoPlenaria({ oldSections: true, page: pageSections.value })

  return sections
}, { watch: [pageSections], lazy: true })

const headerContent = computed(() => {
  return {
    bill: '',
    poder: '',
    status: 'SemSessao',
    section: '',
  }
})
</script>

<template>
  <div id="no-section-screen">
    <Header :content="headerContent" />
    <v-row class="text-grey-lighten-5 mt-5">
      <v-col cols="12">
        <NoSectionOldSections :page="pageSections" :sections="sections.data?.value" @change-page="changePageSections" />
      </v-col>
    </v-row>
  </div>
</template>
