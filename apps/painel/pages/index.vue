<script setup lang="ts">
const utilities = new UseUtils();
const apiSPL = new UseSessaoPlenaria();

const ScreenShow = ref({ screen: "NoSection", scenario: 0 });
const today = utilities.AmericanDateToday();
const timeExpedienteRead = ref();
const oldExp = ref();

const { data, refresh, pending } = await useAsyncData(
  async () => {
    const sessaoToday = await apiSPL.sessaoPlenaria({ hoje: today });
    const [expedienteResult, orderDay] = await Promise.all([
      apiSPL.expedienteSessão(sessaoToday?.id),
      apiSPL.dayOrderSessão(sessaoToday?.id),
    ]);

    const treating = new TreatingExpedient(
      expedienteResult,
      oldExp,
      timeExpedienteRead,
      ScreenShow.value
    );
    const {
      expediente,
      treatingTimeExpedienteRead,
      treatingRegistroExpediente,
    } = await treating.treatingExpedientAndResult();

    const registroExpediente = treatingRegistroExpediente;
    oldExp.value = expediente;
    timeExpedienteRead.value = treatingTimeExpedienteRead;

    return {
      sessaoToday,
      expediente,
      registroExpediente,
      orderDay,
    };
  },
  { lazy: true }
);

const sessaoToday = ref(data.value?.sessaoToday);
const expediente = ref(data.value?.expediente);
const registro = ref(data.value?.registroExpediente);
const orderDay = ref(data.value?.orderDay);

setInterval(async () => {
  if (!pending.value) {
    refresh();

    sessaoToday.value = data.value?.sessaoToday;
    expediente.value = data.value?.expediente;
    registro.value = data.value?.registroExpediente;
    orderDay.value = data.value?.orderDay;
  }
}, 4000);

watch(sessaoToday, () => {
  const ScreenController = new ScreensShow(
    sessaoToday.value,
    expediente.value,
    registro.value,
    orderDay.value
  );
  ScreenShow.value = ScreenController.changeScreen();
});
</script>

<template>
  <div id="index">
    <div class="heitgh-index">
      <NoSection v-if="ScreenShow.screen === 'NoSection'" />

      <div
        v-if="ScreenShow.screen === 'SectionInitiate'"
        class="text-grey-lighten-5 text-h2 text-center"
      >
        Sessão em andamento!
      </div>

      <Proposition
        v-if="ScreenShow.screen === 'ShowMaterial'"
        :expediente="ScreenShow.scenario === 1 ? expediente : orderDay"
      />

      <Voting
        v-if="ScreenShow.screen === 'VotationOpen'"
        status="discussao"
        :sessao="sessaoToday"
        :expediente="ScreenShow.scenario === 1 ? expediente : orderDay"
        :order-day="ScreenShow.scenario"
      />

      <VotingResults
        v-if="ScreenShow.screen === 'PollResult'"
        :result="registro"
        :registro="registro"
        :expediente="ScreenShow.scenario === 1 ? expediente : orderDay"
        :sessao="sessaoToday"
      />
    </div>
    <Footer-index />
  </div>
</template>

<style scoped>
.heitgh-index {
  min-height: 100vh;
  max-height: auto;
}
</style>
