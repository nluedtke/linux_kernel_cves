<template>
  <div class="hello">
    <div id="content">
      <h1>All Indexed CVEs</h1>
      <p>The following is a comprehensive list of all CVEs in our index that affect the upstream kernel.</p>
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

</style>