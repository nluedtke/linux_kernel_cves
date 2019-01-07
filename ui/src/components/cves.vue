<template>
  <div class="hello">
    <div id="content">
      <h3>All CVEs Tracked</h3>
      <ul>
        <li v-for="(values, cve) in contents" v-bind:key="cve">
            <router-link :to="'/cves/' + cve">{{ cve }}</router-link><span v-if="values.cmt_msg != null">&nbsp;&nbsp;{{values.cmt_msg}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      contents: [],
      errors: []
    }
  },
  created () {
    this.load()
  },

  watch: {
    '$route' () {
      this.load()
    }
  },
  methods: {
    load: function () {
      var cvesUrl = this.$apiBaseUrl + 'data/kernel_cves.json'
      document.title = 'Linux Kernel CVEs | All CVEs'
      axios.get(cvesUrl)
        .then(response => {
          var cves = response.data
          this.contents = cves
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  max-width: 600px;
  margin: 0 auto;
}
#content {
  text-align: left;
  padding: 1em 2em;
  margin: 4em 0 2em;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
h1, h2, h3, h4{
  margin-top: 1.75em;
  font-weight: 600;
}
ul {
  list-style-type: none;
  background-color: #42b9835e;
  font-family: monospace;
  padding: 1em 2em;
  font-size: 1.2em;
  padding-left: 9.5em;
}
li {
  margin: .5em 0;
  list-style-position: inside;
  text-indent: -8.25em;
}
.external-link {
  height: 14px;
  width: 14px;
  margin-left: 3px;
  vertical-align: text-top;
}
@media only screen and (max-width : 700px) {
/* Styles */
  #hashes {
    white-space: normal;
  }
  #content {
    padding: .5em
  }
  ul {
    padding: .5em
  }
}
a {
  color: #42b983;
}
</style>