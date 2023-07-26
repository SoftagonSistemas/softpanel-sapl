<script setup lang="ts"></script>
<template>
    <header>
        <slot name="headerPanel">
            <HeaderPanel />
        </slot>
    </header>
    <main>
        <slot />
    </main>
    <footer>
        <slot name="header"> Softagon Sistemas </slot>
    </footer>
</template>
