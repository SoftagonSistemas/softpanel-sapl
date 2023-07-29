<script setup lang="ts">
import { Assemblyman } from '@/composables/useParlamentar'

const props = defineProps({
    councilors: {
        type: Array<Assemblyman>,
        required: true,
    },
})
const defaultAvatarImage =
    'https://sapl.softagon.app/media/sapl/public/casa/profile/softpanel-person-profile.png'
const defaultLogoImage =
    'https://sapl.softagon.app/media/sapl/public/casa/profile/softpanel-partido-politico-logo.png'
</script>

<template>
    <v-container id="assemblyman" fluid>
        <v-row justify="start">
            <v-col
                v-for="dep in councilors"
                :key="dep.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="mx-auto pr-1"
            >
                <v-row class="bg-cyan" :dense="true">
                    <v-col id="profilePic" cols="4" class="bg-red">
                        <v-img
                            :max-width="200"
                            :max-height="200"
                            cover
                            :src="dep?.fotografia ?? defaultAvatarImage"
                        ></v-img>
                    </v-col>
                    <v-col cols="8">
                        <v-card color="#1F7087" theme="dark">
                            <div
                                class="d-flex flex-no-wrap justify-space-between"
                            >
                                <div>
                                    <v-card-title class="text-h5">
                                        {{ dep.nome_parlamentar }}
                                    </v-card-title>

                                    <v-card-actions>
                                        <v-img
                                            max-width="50"
                                            :src="defaultLogoImage || ''"
                                        />
                                        <div class="pl-2">
                                            {{ dep?.sigla || 'SOFTPANEL' }}
                                        </div>
                                    </v-card-actions>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>
