<script setup lang='ts'>

/**
Itens para fazer:
 1 - Procurar sessão em HOJE
 2 - Caso não tenha hoje, exibe todas as últimas para o clique
 3 - Se tiver hoje e tiver FECHADO o painel, exibe VEREADORES
 4 - Ao abrir painel, exibe pauta da reunião
 5 - Ao colocar em votação atualiza para matéria a ser aprecidada

**/
const utilities = new useUtils()
const { currentTime } = utilities.clock()
const relogio = ref(currentTime)

const taxaAtualizacao = 95000 // 15 segundos
const camara = ref()
const uSP = new useSessaoPlenaria()
const sessao = ref()
const vereadores = ref()
const sessaoAnteriores = ref()

camara.value = await uSP.casalegislativa()

const agoraD = '2022-06-11'
const [ultimaSessao] = await uSP.sessaoPlenaria({ hoje: agoraD })

if (ultimaSessao?.id) {
  sessao.value = ultimaSessao

  const id = ultimaSessao.id
  vereadores.value = await uSP.sessaoPlenariaPresenca({ id })

  // Procurando por novos presentes a cada taxaAtualizacao
  setInterval(async (id: number) => {
    vereadores.value = await uSP.sessaoPlenariaPresenca({
      id,
      atualizar: true
    })
    sessao.value = await uSP.sessaoPlenaria({ id, atualizar: true })
  }, taxaAtualizacao)
} else {
  sessaoAnteriores.value = await uSP.sessaoPlenaria({})
  console.log('Não tem sessao hoje , exiba na TELAAA')
}
</script>
<template>
  <div>
    <div id='sessao' v-if='sessao' class='p-10 gap-4'>
      <div id='titulo' class='text-3xl text-center font-sans m-4 pb-9'>
        {{ sessao.__str__ }}
      </div>

      <div id='cabecalho' class='grid grid-cols-3 gap-3'>
        <div class='data-inicio'>
          {{ utilities.format(sessao.data_inicio) }}
        </div>
        <div class='logotipo'>
          <img :src='camara?.logotipo' :alt='camara?.nome' />
        </div>
        <div class='hora-inicio'>{{ sessao.hora_inicio }}
        </div>
      </div>
      <div id='agora' class='flex flex-row gap-2 p-1'>
        <div id='data' class='basis-1/2'>
          {{ relogio.toLocaleDateString() }}
        </div>
        <div id='relogio' class='basis-1/2'>
          {{ relogio.toLocaleTimeString() }}
        </div>
      </div>
      <hr class='p-4' />
      <div v-show='!sessao.painel_aberto'>
        <ListaVereadores :listaVereador='vereadores' />
      </div>
    </div>
    <div v-else class='p-10'>
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