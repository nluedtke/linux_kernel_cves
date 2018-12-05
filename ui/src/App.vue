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
            <option v-for="content in contents"
                    v-if="content.type === 'dir'"
                    v-bind:key="content.name"
                    v-bind:value="content.name">Stream {{content.name}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="container">
      <sidebar></sidebar>
      <router-view/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import sidebar from './components/sidebar'

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
      contents: [],
      errors: [],
      limit: 10,
      sidebar: 'sidebar'
    }
  },
  components: {
    sidebar
  },
  created () {
    axios.get(`https://api.github.com/repos/nluedtke/linux_kernel_cves/contents`)
      .then(response => {
      // JSON responses are automatically parsed.
        this.contents = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
    let cvesUrl = 'https://raw.githubusercontent.com/nluedtke/linux_kernel_cves/master/kernel_cves.json'
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