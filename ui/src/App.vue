<template>
  <v-app>
    <v-toolbar color="#42b983" fixed="true">
      <v-icon color="white">bug_report</v-icon>
      <v-toolbar-title class="white--text">Linux Kernel CVEs</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu>
          <template v-slot:activator="{ gostreams }">
            <v-btn flat class="white--text" v-on="gostreams">Streams</v-btn>
          </template>
                <v-list>
        <v-list-tile
          v-for="item in streams"
          :key="item"
          @click=""
        >
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
        </v-menu>
        <v-btn flat class="white--text">All CVEs</v-btn>
        <v-text-field
                label="Search by CVE id"
                append-icon="search"
                single-line
              ></v-text-field>
      </v-toolbar-items>
    </v-toolbar>
    <div class="nav-wrapper">
      <div class="nav">
        <a href="/"><img id="logo" src="./assets/logo.jpg"></a>
        <div class="nav-box">
          <vue-autosuggest
            :suggestions="filteredOptions"
            :onSelected="onSelected"
            :inputProps="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Or by CVE id'}"
          />
          <!--<input v-model="cve" placeholder="Search by CVE ID">-->
          <button v-on:click="gotoCVE">go</button>
        </div>
        <div class="nav-box">
          <select v-model="stream" v-on:change="gotoStream">
            <option disabled value="default">View by Stream</option>
            <option v-for="aStream in streams"
                    v-bind:key="aStream"
                    v-bind:value="aStream">Stream {{aStream}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="container">
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data () {
    return {
      stream: 'default',
      cves: [{
        data: []
      }],
      filteredOptions: [],
      cve: '',
      streams: [],
      errors: [],
      limit: 10,
    }
  },
  created () {
    axios.get(this.$apiBaseUrl + 'kern.json')
      .then(response => {
        var streams = response.data.eol_streams.concat(response.data.supp_streams)
        streams = streams.map( a => a.split('.').map( n => +n+1000 ).join('.') ).sort()
                         .map( a => a.split('.').map( n => +n-1000 ).join('.') )
        this.streams = streams
      })
      .catch(e => {
        this.errors.push(e)
      })
    var cvesUrl = this.$apiBaseUrl + 'data/kernel_cves.json'
    axios.get(cvesUrl)
      .then(response => {
      // JSON responses are automatically parsed.
        this.cves[0].data = Object.keys(response.data)
        this.filteredOptions = [{
          data: this.cves[0].data.slice(0, this.limit)
        }]
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    gotoStream () {
      this.$data.cve = ''
      this.$router.push('/streams/' + this.stream)
    },
    gotoCVE () {
      this.$data.stream = 'default'
      this.$router.push('/cves/' + this.cve.toUpperCase().trim())
      // temporarily comment this out to fix
      // this.cve = ''
    },
    onSelected (option) {
      this.cve = option.item
      this.gotoCVE()
    },
    onInputChange (text) {
      if (text === '' || text === undefined) {
        return
      }
      this.cve = text
      /* Full control over filtering. Maybe fetch from API?! Up to you!!! */
      const filteredData = this.cves[0].data.filter(item => {
        return item.toLowerCase().indexOf(text.toLowerCase()) > -1
      }).slice(0, this.limit)
      this.filteredOptions = [{
        data: filteredData
      }]
    }
  }
}
</script>

<style>

</style>