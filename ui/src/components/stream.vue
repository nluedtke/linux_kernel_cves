<template>
  <div class="hello">
    <h1>CVEs in Stream {{this.stream}}</h1>
    <div id="content">
      <div class="row" v-for="(fixes, stream) in contents" v-bind:key="stream">
        <h3 v-if="stream != 'outstanding'">Fixed in {{stream}}</h3>
        <h3 v-if="stream === 'outstanding'">Outstanding CVEs in this Stream</h3>
        <div class="card-container">
          <div class="cards" v-for="(data, fix) in fixes" v-bind:key="fix">
            <router-link :to="'/cves/' + fix">{{fix}}</router-link>
            <p v-if="stream != 'outstanding'">{{ data.cmt_msg }}</p>
            <p v-if="stream != 'outstanding'"><strong>{{ data.cmt_id | trim }}...</strong> </p>
                <button v-if="stream != 'outstanding'" class="copy-button" type="button"
                        v-clipboard:copy="data.cmt_id"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError">Copy ID</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
  data () {
    return {
      stream: [],
      contents: [],
      errors: [],
      message: 'copy'
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
    onCopy: function (e) {
      alert('Commit ID copied to clipboard: ' + e.text)
    },
    onError: function () {
      alert('Failed to copy text.')
    },
    load: function () {
      this.stream = this.$route.path.split('/')[2]
      document.title = 'Linux Kernel CVEs | ' + 'CVEs in Stream ' + this.stream
      var url = this.$apiBaseUrl + 'data/stream_data.json'
      axios.get(url)
        .then(response => {
          // JSON responses are automatically parsed.
          this.contents = response.data[this.stream]
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  },
  filters: {
    trim: function (value) {
      if (!value) return ''
      return value.substring(0, 7)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#content {
  text-align: left;
}
.hello {
  margin: 1em 0;
}
.card-container:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
.cards {
  display: inline-block;
  vertical-align: top;
  width: 200px;
  min-height: 160px;
  text-align: left;
  padding: 1em 1.5em;
  margin: 0 1em 1em 0;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.streamCVE {
  width: 240px;
  padding: 10px;
  margin: 10px;
  display: inline-block;
  overflow: hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
h1, h2 {
  font-weight: normal;
}
h1 {
  margin: 1em 0;
}
ul {
  list-style-type: none;
}
a {
  color: #42b983;
}
button.copy-button {
  webkit-transition: opacity .3s ease-in-out;
  -o-transition: opacity .3s ease-in-out;
  transition: opacity .3s ease-in-out;
  opacity: 1;
  padding: 2px 6px;
  right: 4px;
  top: 4px;
}
</style>
