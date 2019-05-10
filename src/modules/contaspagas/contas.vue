<template>
  <div id="imprimir">
    <div class="layout-padding">
    <p class="text-center">
      Amaral Costa Medicina Diagnóstica <br>
      RELATÓRIO ESTRATÉGICO DE UNIDADES
    </p><br>
    <div class="no-print">
      <div class="row sm-gutter shadow-3" style="padding: 20px">
        <div class="col-4">
          <q-select
            v-model="select"
            float-label="Unidade"
            radio
           :options="selectOptions"
          />
        </div>
        <div class="col-4">
          <div class="row sm-gutter">
            <div class="col-6">
              <q-datetime float-label="Data Inicial" v-model="datainicial" type="date" />
            </div>
            <div class="col-6">
              <q-datetime float-label="Data Final" v-model="datafinal" type="date" />
            </div>
          </div>          
        </div>
        <div class="col-4">
          <div class="row sm-gutter">
            <div class="col-6">
              <q-btn outline color="primary" @click="getDados">Processar</q-btn>
            </div>
            <div class="col-6">
              <q-btn outline color="orange" @click="imprimir">IMPRIMIR</q-btn>
            </div>
          </div>
        </div>
      </div>  
    </div> <!-- no-print -->

 <!--      <rel050/> -->
      <br>
      <br>
      <div class="row sm-gutter">
        <div class="col-6">Ticket médio: <q-chip pointing="left" color="grey-4" class="text-black">{{ totais.totfaturado / totais.totpedidos | real }}</q-chip></div>
        <div class="col-6">Valor médio do exame: <q-chip pointing="left" color="grey-4" class="text-black">{{ totais.totfaturado / totais.totexames | real }}</q-chip></div>        
      </div>
      <br>
      <span><h6>FATURAMENTO:</h6></span>

      <table class="q-table striped" id="table" width="100%">
        <tbody>
          <tr>
            <td>Total de pedidos:</td>
            <td>{{ totais.totpedidos }}</td>
            <td>Nº de colaboradores:</td>
            <td>{{ faturamento.numColaboradores }}</td>
          </tr>
          <tr>
            <td>Total de exames:</td>
            <td>{{ totais.totexames }}</td>
            <td>Produtividade/Colaborador:</td>
            <td>{{ faturamento.prodColaborador }}</td>
          </tr>
          <tr>
            <td>Total faturado:</td>
            <td>{{  totais.totfaturado | real }}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <hr><br>

      <h6>RELATÓRIO DE GASTOS</h6>
<!--       <table class="q-table responsive tg" id="table">
        <thead>
          <tr>
            <th align="left">Despesas</th>
            <th class="tg-lqy6">Valor</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td align="right"><b>TOTAL:</b></td>
            <td align="right"><b>{{ total | real }}</b></td>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for="item in lista">
            <td class="tg-yw4l">{{ item.nmreceitadespesas}}</td>
            <td align="right" class="tg-yw4l">{{ item.vlvalor | real}}</td>
          </tr>
        </tbody>
      </table> -->

      <table class="q-table striped" id="table2" width="100%">
        <thead>
          <tr>
            <th>Despesas</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in lista">
            <td data-th="Despesas">{{ item.nmreceitadespesas}}</td>
            <td data-th="Valor">{{ item.vlvalor | real}}</td>
          </tr>
        </tbody>
      </table>

      <hr>

      <table class="q-table striped" id="table3">
        <tbody>
          <tr>
            <td>Despesas</td>
            <td>{{ despesas.total | real}}</td>
          </tr>
          <tr>
            <td>Pessoal</td>
            <td>{{ despesas.pessoal | real}}</td>
          </tr>
          <tr>
            <td>Custo médio exames</td>
            <td>{{ despesas.medioExames | real}}</td>
          </tr>
          <tr>
            <td>Estoque</td>
            <td>R{{ despesas.estoque | real}}</td>
          </tr>
          <tr>
            <td><b>Total de Gastos</b></td>
            <td>R$ 14.471,00</td>
          </tr>
          <tr>
            <td><b>Resultado</b></td>
            <td>R$ 14.471,00</td>
          </tr>
        </tbody>
      </table>

    </div>

    <div id="printable" style="display: none"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import config from '../../config'
  import { mapActions, mapState, mapGetters } from 'vuex'
  import bus from '../../utils/events/bus'
  // var _ = require('lodash')
  import jQuery from 'jquery'
  import { Loading, Toast, QSelect, QBtn, QCard, QCardTitle, QCardActions, QDatetime, QChip } from 'quasar'
  
  // .toLocaleString('pt-BR')
  export default {
    name: 'ContasPagas',
    components: {
      QSelect, QBtn, QCard, QCardTitle, QCardActions, QDatetime, QChip
    },
    filters: {
      fixed: function (value) {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '')
      },
      real: function (value) {
        let val = (value / 1).toFixed(2).split('.')
        val[0] = 'R$ ' + val[0].split(/(?=(?:...)*$)/).join('.')
        return val.join(',')
      }
    },
    data () {
      return {
        lista: [],
        errors: [],
        params: {},
        select: '',
        selectOptions: [],
        datainicial: '',
        datafinal: '',
        posto: '',
        totais: [],
        faturamento: {
          numColaboradores: 0,
          prodColaborador: 0
        },
        despesas: {
          total: 0,
          pessoal: 0,
          medioExames: 0,
          estoque: 0
        }
      }
    },
    created: function () {
      this.listaOptions()
      this.listaTodosEstabelecimentos()
    },
    watch: {
    },
    computed: {
      ...mapState({
        optEstabelecimentos (state) {
          return state.estabelecimento.optionsEstabelecimentos
        }
      })
    },
    methods: {
      ...mapActions(['storeOptionsEstabelecimentos', 'storeListaEstabelecimentos']),
      ...mapGetters(['listaOptionsEstabelecimentos', 'listaEstabelecimentos']),
      getDados () {
        // Consulta contas pagas no fortes
        Loading.show()
        this.lista = []
        this.totais = []

        Loading.show()
        axios.post(config.url_base_api + 'modules/impressao/contas.php', {acao: 'ag-contas-pagas', id: this.select, datainicial: this.datainicial, datafinal: this.datafinal})
          .then(response => {
            console.log(response.data)
            Loading.hide()
          })
          .catch(e => {
            this.errors.push(e)
            Toast.create(this.errors)
            Loading.hide()
          })

        Loading.show()
        axios.post(config.url_base_api + 'modules/impressao/importa-rel050.php', {id: this.select, datainicial: this.datainicial, datafinal: this.datafinal})
          .then(response => {
            console.log(response.data)
            Loading.hide()
          })
          .catch(e => {
            this.errors.push(e)
            Toast.create(this.errors)
            Loading.hide()
          })

        window.setTimeout(() => {
          axios.post(config.url_base_api + 'modules/impressao/gastos.php', {acao: 'ag-contas-pagas'})
            .then(response => {
              this.lista = response.data
              console.log(response.data)
              this.despesas.total = this.lista.reduce(function (prevVal, elem) {
                return Number(prevVal) + Number(elem.vlvalor)
              }, 0)
              Loading.hide()
            })
            .catch(e => {
              this.errors.push(e)
              Toast.create(this.errors)
              Loading.hide()
            })
        }, 1000)

        window.setTimeout(() => {
          Loading.show()
          axios.get(config.url_base_api + 'modules/impressao/fatura.php')
            .then(response => {
              this.totais = response.data
              console.log()
              Loading.hide('totais : ', response.data)
            })
            .catch(e => {
              this.errors.push(e)
              Toast.create(this.errors)
              Loading.hide()
            })
        }, 2000)
      },
      // Coloca options de estabelecimentos no state
      listaOptions () {
        Loading.show()
        // var opt = this.listaOptionsEstabelecimentos()
        // Se não existir a lista na store, faz a requisição ao servidor
        if (Object.keys(this.optEstabelecimentos).length === 0) {
          axios.post(config.url_base_api + 'modules/financeiro/listar-estabelecimentos.php', {acao: 'options'})
            .then(response => {
              var parsed = JSON.parse(JSON.stringify(response.data))
              this.storeOptionsEstabelecimentos(parsed)
              this.selectOptions = this.listaOptionsEstabelecimentos()
              Loading.hide()
            })
            .catch(e => {
              this.errors.push(e)
              Toast.create(this.errors)
              Loading.hide()
            })
        }
        else {
          this.selectOptions = this.listaOptionsEstabelecimentos()
          Loading.hide()
        }
      },
      // Coloca lista de estabelecimentos no state
      listaTodosEstabelecimentos () {
        Loading.show()
        axios.post(config.url_base_api + 'modules/financeiro/listar-estabelecimentos.php', {acao: 'lista-estabelecimentos'})
          .then(response => {
            var parsed = JSON.parse(JSON.stringify(response.data))
            this.storeListaEstabelecimentos(parsed)
            Loading.hide()
          })
          .catch(e => {
            this.errors.push(e)
            Toast.create(this.errors)
            Loading.hide()
          })
      },
      // executa evendo no componente filho rel050 para obter os dados
      dadosRel () {
        bus.$emit('listadados', {'posto': this.posto[0].posto_codigo, 'datainicial': this.datainicial, 'datafinal': this.datafinal})
      },
      imprimir (e, done) {
        jQuery('.layout-page-container').css('padding-top', '0px')
        jQuery('.layout-header').addClass('no-print')
        jQuery('.layout-header').css('display', 'none')
        jQuery('#table1').removeClass('responsive')
        jQuery('#table2').removeClass('responsive')
        jQuery('#table3').removeClass('responsive')
        var el = document.getElementById('table')
        el.classList.remove('responsive')
        document.getElementById('printable').innerHTML = document.getElementById('imprimir').innerHTML
        window.setTimeout(() => {
          window.print()
        }, 300)
        // volta a configuração normal do css do quasar
        window.setTimeout(() => {
          jQuery('.layout-header').css('display', 'block')
          jQuery('.layout-page-container').css('padding-top', '25px')
          // jQuery('.layout-page-container').css('padding-bottom', '0px')
          // jQuery('.layout-page-container').css('padding-right', '0px')
          jQuery('#table').addClass('responsive')
        }, 500)
      }
    }
  }
</script>
<style scoped>
.tg  {border-collapse:collapse;border-spacing:0;border-color:#999;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#444;background-color:#F7FDFA;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#fff;background-color:#26ADE4;}
.tg .tg-baqh{text-align:right;vertical-align:top}
.tg .tg-lqy6{text-align:right;vertical-align:top}
.tg .tg-yw4l{vertical-align:top}

@media print {
  html, body {
      margin: 0;
      padding: 0;
      border: 0;
  }
  
  table { page-break-inside:auto }
  thead { display:table-header-group }
  tfoot { display:table-footer-group }

  #printable {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 10px;

  }
  #printable ~ * {
      display: none;
  }
  .no-print {
    display: none;
  }

}
</style>
