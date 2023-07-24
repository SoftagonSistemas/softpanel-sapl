<script setup lang="ts">
const headerContent = computed(() => {
    return {
        bill: 'Maça',
        poder: 'Banana',
        status: 'Pera',
        section: 'Manga',
    }
})
</script>
<template>
    <header>
        <slot name="header">
            <HeaderPanel :content="headerContent" />
        </slot>
    </header>
    <main>
        <slot />
    </main>
    <footer>
        <slot name="header"> Footer foot looser </slot>
    </footer>
</template>
