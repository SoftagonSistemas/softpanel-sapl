<script setup lang="ts">
const utilities = new useUtils()
const apiSAPL = new useSessaoPlenaria()

const ScreenShow = ref({ screen: 'NoSection', scenario: 0 })
const today = utilities.AmericanDateToday()
const timeExpedienteRead = ref()
const oldExp = ref()

const { data, refresh, pending } = await useAsyncData(
    async () => {
        const sessionToday = await apiSAPL.plenarySession({ hoje: today })
        const [expedientResult, orderDay] = await Promise.all([
            apiSAPL.expedientSession(sessionToday?.id),
            apiSAPL.dayOrderSession(sessionToday?.id),
        ])

        const treating = new TreatingExpedient(
            expedientResult,
            oldExp,
            timeExpedienteRead,
            ScreenShow.value
        )
        const {
            expedient,
            treatingTimeExpedienteRead,
            treatingRegistroExpediente,
        } = await treating.treatingExpedientAndResult()

        const dataExpedient = treatingRegistroExpediente
        oldExp.value = expedient
        timeExpedienteRead.value = treatingTimeExpedienteRead

        return {
            sessionToday,
            expedient,
            dataExpedient,
            orderDay,
        }
    },
    { lazy: true }
)

const sessionToday = ref(data.value?.sessionToday)
const expedient = ref(data.value?.expedient)
const registro = ref(data.value?.dataExpedient)
const orderDay = ref(data.value?.orderDay)
const vereadores = ref()
// vereadores.value = await apiSAPL.plenarySessionAttendance({ id })

setInterval(async () => {
    if (!pending.value) {
        refresh()

        sessionToday.value = data.value?.sessionToday
        expedient.value = data.value?.expedient
        registro.value = data.value?.dataExpedient
        orderDay.value = data.value?.orderDay
    }
}, 4000)

watch(sessionToday, () => {
    const ScreenController = new ScreensShow(
        sessionToday.value,
        expedient.value,
        registro.value,
        orderDay.value
    )
    ScreenShow.value = ScreenController.changeScreen()
})
</script>

<template>
    <div id="index">
        <div class="heigth-index">
            <NoSection v-if="ScreenShow.screen === 'NoSection'" />

            <div
                v-if="ScreenShow.screen === 'SectionInitiate'"
                class="text-grey-lighten-5 text-h2 text-center"
            >
                Sessão em andamento!
                <ListaVereadores :lista-vereador="vereadores" />
            </div>

            <Proposition
                v-if="ScreenShow.screen === 'ShowMaterial'"
                :expedient="ScreenShow.scenario === 1 ? expedient : orderDay"
            />

            <Voting
                v-if="ScreenShow.screen === 'VotationOpen'"
                status="discussao"
                :sessao="sessionToday"
                :expedient="ScreenShow.scenario === 1 ? expedient : orderDay"
                :order-day="ScreenShow.scenario"
            />

            <VotingResults
                v-if="ScreenShow.screen === 'PollResult'"
                :result="registro"
                :registro="registro"
                :expedient="ScreenShow.scenario === 1 ? expedient : orderDay"
                :sessao="sessionToday"
            />
        </div>
        <Footer-index />
    </div>
</template>

<style scoped>
.heigth-index {
    min-height: 100vh;
    max-height: auto;
}
</style>
