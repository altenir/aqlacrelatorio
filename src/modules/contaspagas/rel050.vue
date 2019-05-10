<template>
  <div>
    
      <!-- <div class="row gutter wrap text-center">
        <div class="width-1of4">
          <span class="gm-label text-primary">Posto : </span>
          <q-select type="list" v-model="selectPosto" :options="selectOptPosto"></q-select>
        </div>
        <div class="width-1of4">
          <span class="gm-label text-primary">Data Inicial : </span>
          <input type="date" v-model="datainicial">
        </div>
        <div class="width-1of4">
          <span class="gm-label text-primary">Data Final : </span>
          <input type="date" v-model="datafinal">
        </div>
      </div> -->

      <!-- <div>
        <span class="gm-label">Convenio : </span>
        <q-select type="list" v-model="selectGuia" :options="selectOptGuia"></q-select>
      </div> -->
      <!-- <div>
        
      </div> -->
      <!-- <div>
        <span class="gm-label">Setor : </span>
        <q-select type="list" v-model="selectSetor" :options="selectOptSetor"></q-select>
      </div> -->
      <br>
     <!--  <br><br> -->
     <h5>Receita</h5>
        <table class="tg">
          <thead>
            <tr>
              <td align="right"><b>TOTAL:</b></td>
              <td align="right"><b>{{ total | real }}</b></td>
            </tr>
            <!-- <tr>
              <th class="tg-lqy6">CONVENIO</th>
              <th class="tg-lqy6">PEDIDOS</th>
              <th class="tg-lqy6">EXAMES</th>
              <th class="tg-lqy6">VALOR</th>
              <th class="tg-lqy6">GRUPO</th>
            </tr> -->
          </thead>
          <tbody>
            <tr v-for="item in lista">
              <td class="tg-yw4l">{{ item.CONVENIO }}</td>
              <td class="tg-yw4l">{{ item.QUANT_PEDIDOS }}</td>
              <td class="tg-yw4l">{{ item.QUANT_EXAMES }}</td>
              <td align="right" class="tg-yw4l">{{ item.VALOR | real }}</td>
              <td class="tg-lqy6">{{ item.grupo }}</td>
            </tr>
            <!-- <tr>
              <td align="right" colspan="3"><b>RECEITA TOTAL:</b></td>
              <td align="right"><b>{{ total | real }}</b></td>
              <td align="right"></td>
            </tr> -->
          </tbody> 
          </table>

    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import config from '../../config'
  // import _ from 'lodash'
  import { Loading, Toast } from 'quasar'
  import { mapActions, mapGetters } from 'vuex'
  import bus from '../../utils/events/bus'

  export default {
    name: 'relatorio',
    filters: {
      fixed: function (value) {
        let val = (value / 1).toFixed(3).replace('.', ',')
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
        selectGuia: '',
        selectOptGuia: [],
        selectPosto: '',
        selectOptPosto: [],
        selectSetor: '',
        selectOptSetor: [],
        datainicial: '',
        datafinal: '',
        total: 0,
        valor: 1
      }
    },
    mounted () {
      bus.$on('listadados', (param) => this.listaDados(param))
    },
    methods: {
      ...mapActions(['storeRel050']),
      ...mapGetters(['listarel050']),
      listaDados (param) {
        // CARREGA DADOS
        this.dados = []
        this.total = []
        Loading.show()
        axios.post(config.url_base_api + 'modules/financeiro/sql-rel-050.php',
          {
            'acao': 'sql-rel-050',
            'par_guia': this.selectGuia,
            'par_posto': param.posto,
            'par_setor': this.selectSetor,
            'par_grupo': '0',
            'pa_dataini': param.datainicial,
            'pa_datafim': param.datafinal
          }
        )
        .then(response => {
          console.log(response.data)
          var parsed = JSON.parse(JSON.stringify(response.data))
          this.storeRel050(parsed)
          let dados = this.listarel050()
          this.total = dados.reduce(function (prevVal, elem) {
            return Number(prevVal) + Number(elem.VALOR)
          }, 0)
          Loading.hide()
        })
        .catch(e => {
          this.errors.push(e)
          Toast.create(this.errors)
          Loading.hide()
        })
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
</style>
