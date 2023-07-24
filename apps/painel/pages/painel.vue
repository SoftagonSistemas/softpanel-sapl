<script setup lang="ts">
const utilities = new UseUtils()

const taxaAtualizacao = 95000 // 15 segundos
const camara = ref()
const apiSAPL = new UseSessaoPlenaria()
const sessao = ref()
const vereadores = ref()
const sessaoAnteriores = ref()

camara.value = await apiSAPL.legislativeHouse()

const today = utilities.AmericanDateToday()
const [ultimaSessao] = await apiSAPL.plenarySession({ hoje: today })

if (ultimaSessao?.id) {
    sessao.value = ultimaSessao

    const id = ultimaSessao.id
    vereadores.value = await apiSAPL.plenarySessionAttendance({ id })

    // Procurando por novos presentes a cada taxaAtualizacao
    setInterval(async (id: number) => {
        vereadores.value = await apiSAPL.plenarySessionAttendance({
            id,
            atualizar: true,
        })
        sessao.value = await apiSAPL.plenarySession({ id })
    }, taxaAtualizacao)
} else {
    sessaoAnteriores.value = await apiSAPL.plenarySession({})
    console.log('Não tem sessao hoje , exiba na TELAAA')
}
</script>

<template>
    <div>
        <div v-if="sessao" id="sessao" class="p-10 gap-4">
            <div id="titulo" class="text-3xl text-center font-sans m-4 pb-9">
                {{ sessao.__str__ }}
            </div>

            <div id="cabecalho" class="grid grid-cols-3 gap-3">
                <div class="data-inicio">
                    {{ utilities.format(sessao.data_inicio) }}
                </div>
                <div class="logotipo">
                    <img :src="camara?.logotipo" :alt="camara?.nome" />
                </div>
                <div class="hora-inicio">
                    {{ sessao.hora_inicio }}
                </div>
            </div>
            <div id="agora" class="flex flex-row gap-2 p-1">
                <div id="data" class="basis-1/2">???</div>
                <div id="relogio" class="basis-1/2">?</div>
            </div>
            <hr class="p-4" />
            <div v-show="!sessao.painel_aberto">
                <ListaVereadores :lista-vereador="vereadores" />
            </div>
        </div>
        <div v-else class="p-10">
            <div>
                Sessão anteriores
                <div id="relacao">
                    Primeira segunda
                    {{ sessaoAnteriores }}
                </div>
            </div>
        </div>
    </div>
</template>
