<template>
  <div class="hello">
    <vue-markdown :source="contents"></vue-markdown>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      contents: '',
      errors: []
    }
  },
  created () {
    let url = this.$apiBaseUrl + 'README.md'
    axios.get(url)
      .then(response => {
      // JSON responses are automatically parsed.
        this.contents = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  text-align: center;
}
.hello {
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5em;
  text-align: left;
}
h1, h2 {
  font-weight: normal;
}
h2, h3, p {
  text-align: left;
}
p {
  line-height: 1.8em;
}
ul {
  list-style-type: none;
}
a {
  color: #42b983;
}
.cve-select  {
  display: inline;
}
vue-markdown {
  white-space: pre;
}
</style>
