<script setup lang="ts">
definePageMeta({
    layout: false,
})
const util = new UseUtils()
const session = new UseSessaoPlenaria()
const today = util.AmericanDateToday()
// const sessionToday = await session.plenarySession({ hoje: today })

// const expedient = new useExpediente(sessionToday.id)
// const expedientList = await expedient.getExpedientList()
// const expedientActive = expedient.getActiveExpedient()
const sessions = await session.getOpenedSession()
</script>

<template>
    <div>
        <NuxtLayout name="softpanel">
            <div id="content">
                <pre>
                    NAda?
                    {{ sessions }}
                    <!-- {{ expedientActive }} -->
                    <!-- {{ expedientList }} -->
                    <!-- {{ sessionToday }} -->
                </pre>
            </div>
        </NuxtLayout>
    </div>
</template>
