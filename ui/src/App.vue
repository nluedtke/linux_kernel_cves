<template>
  <div id="app">
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
  </div>
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
    var cvesUrl = this.$apiBaseUrl + 'kernel_cves.json'
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
      this.$router.push('/cves/' + this.cve.toUpperCase())
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #303030;
  margin: 0 auto;
}
body {
  margin: 0;
}
.container {
  margin: 0 auto;
  max-width: 800px;
  margin-top: 100px;
}
.nav-wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  height: 75px;
  background-color: #fafafb;
  border-bottom: 1px #f3f3f3 solid;
}
.nav {
  background-color: #fafafb;
  border-bottom: 1px #f3f3f3 solid;
  width: 100%;
  max-width: 1000px;
  height: 75px;
  margin: 0 auto;
}
.nav #logo {
  height: 75px;
  float: left;
}
.nav .nav-box {
  float: right;
  width: 300px;
  display: inline-block;
  padding: 1.5em 0;
}
@media only screen and (max-width : 700px) {
/* Styles */
  .nav-wrapper {
    position: static;
    height: auto;
  }
  .nav {
    height: auto;
    padding-bottom: 1em
  }
  .nav #logo {
    height: 100px;
    float: none;
  }
  .nav .nav-box {
    float: none;
    min-width: 300px;
    width: 100%;
    display: inline-block;
    padding: 1em 0 0;
  }
}
.nav select, .nav input {
  padding: .5em;
  font-size: 14px;
  border-width: 1px;
  border-radius: 4px;
  border-color: #42b983;
  box-shadow: none;
  min-width: 200px;
}
.nav button {
  color: #fff;
  padding: .5em;
  font-size: 14px;
  border-width: 1px;
  border-radius: 4px;
  border-color: #42b983;
  background-color: #42b983;
  box-shadow: none;
  min-width: 35px;
}
.nav .stream-tag {
  width: 100px;
  padding-top: 32px;
  color: #42b983;
  font-weight: 550;
}
#autosuggest {
  display: inline-block;
}
#autosuggest__input {
  width: 200px;
  display:inline-block;
}
.autosuggest__results-container {
    position: relative;
    margin: 0 auto;
    width: 216px;
}
.autosuggest__results {
    font-weight: 300;
    margin: 0;
    position: absolute;
    z-index: 10000001;
    width: 100%;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: #fff;
    padding: 0;
}
.autosuggest__results ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}
.autosuggest__results .autosuggest__results_title {
    color: gray;
    font-size: 11px;
    margin-left: 0;
    padding: 15px 13px 5px;
    border-top: 1px solid #d3d3d3;
}
.autosuggest__results .autosuggest__results_item {
    cursor: pointer;
    padding: 7px;
    text-align: left;
}
.autosuggest__results .autosuggest__results_item.autosuggest__results_item-highlighted, .autosuggest__results .autosuggest__results_item:active, .autosuggest__results .autosuggest__results_item:focus, .autosuggest__results .autosuggest__results_item:hover {
    background-color: #ddd;
}
a {
  color: #42b983;
}
.sidebar {
  display: none;
}
</style>
