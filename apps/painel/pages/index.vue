<script setup lang="ts">
import { Session } from '@/composables/useSessaoPlenaria'
definePageMeta({
    layout: false,
})
const session = new useSessaoPlenaria()
/**
 * Verificações essenciais para essa tela.
 * 1    - Tem sessão para hoje?
 *  1.1 - É mais de uma sessão?
 * 2    - Sessão foi iniciada?
 * 3    - Painel foi aberto?
 */
const sessionToday = ref()
const currentStatus = ref()

async function pollData() {
    try {
        const opened = await session.getOpenedSession()
        if (!!opened?.length) {
            console.log(opened)
            currentStatus.value = 'open'
            sessionToday.value = opened
            return opened
        }
        const initiated = await session.getInitiatedSession()
        if (!!initiated?.length) {
            currentStatus.value = 'initiated'
            sessionToday.value = initiated

            return initiated
        }
        const multiSessions: Session[] | any = await session.getTodaySession()
        if (multiSessions?.length > 1) {
            currentStatus.value = 'multi'
            sessionToday.value = multiSessions

            return multiSessions
        }
        if (multiSessions?.length > 0) {
            currentStatus.value = 'scheduled'
            sessionToday.value = multiSessions

            return multiSessions
        }
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error)
    }
}

onMounted(async () => {
    pollData()
})

const { data, refresh, pending } = await useAsyncData(
    async () => {
        sessionToday.value = await session.getSessions()
        return {
            sessionToday,
        }
    },
    { lazy: true }
)
setInterval(async () => {
    if (!pending.value) {
        refresh()
    }
    sessionToday.value = await pollData()
}, 5000)

const materia = ref()
const sessao = ref()
watchEffect(async () => {
    const sessaoID = ref(sessionToday.value?.at(0).id)
    sessao.value = sessionToday.value?.at(0).__str__
    const expedient = new useExpediente(sessaoID.value)
    const materiaList = await expedient.getActiveExpedient()
    materia.value = materiaList?.__str__
    pegaParlamentar(sessaoID.value)
})

const parlamentares = ref()
async function pegaParlamentar(sessaoID: number) {
    const parlamentar = new useParlamentar(sessaoID)
    parlamentares.value = await parlamentar.getAllParliamentarians()
}
</script>

<template>
    <div id="softpanel">
        <NuxtLayout name="softpanel">
            <template #headerPanel>
                <HeaderPanel
                    :status="currentStatus"
                    :materia="materia"
                    :sessao="sessao"
                />
            </template>
            <div id="content">
                <pre>
                    {{ parlamentares }}
                    <!-- {{ sessions }} -->
                    <!-- {{ expedientActive }} -->
                    <!-- {{ expedientList }} -->
                    <!-- {{ sessionToday }} -->
                </pre>
            </div>
        </NuxtLayout>
    </div>
</template>
