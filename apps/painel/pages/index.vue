<script setup lang="ts">
definePageMeta({
    layout: false,
})
const util = new useUtils()
const session = new useSessaoPlenaria()
const today = util.AmericanDateToday()
// const sessionToday = await session.plenarySession({ hoje: today })

// const expedient = new useExpediente(sessionToday.id)
// const expedientList = await expedient.getExpedientList()
// const expedientActive = expedient.getActiveExpedient()
// const sessions = await session.getOpenedSession()

/**
 * Verificações essenciais para essa tela.
 * 1 - Tem sessão para hoje?
 * 2 - Sessão foi iniciada?
 * 3 - Painel foi aberto?
 */
</script>

<template>
    <div>
        <NuxtLayout name="softpanel">
            <template #headerPanel>
                <HeaderPanel
                    poder="Empresa Privada"
                    status="Iniciada"
                    materia="Nenhuma"
                    sessao="Alguma"
                />
            </template>
            <div id="content">
                <pre>
                    Tudo.
                    <!-- {{ sessions }} -->
                    <!-- {{ expedientActive }} -->
                    <!-- {{ expedientList }} -->
                    <!-- {{ sessionToday }} -->
                </pre>
            </div>
        </NuxtLayout>
    </div>
</template>
