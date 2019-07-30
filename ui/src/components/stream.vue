<template>
  <div class="hello">
    <h1>CVEs in Stream {{stream}}</h1>
    <div v-if="contents == false" class="text-xs-center">
      <v-progress-linear
        color="primary"
        indeterminate
      ></v-progress-linear>
    </div>
    <div v-else id="content">
      <v-list>
        <v-list-group
          v-for="(data, id) in contents"
          :key="id"
        >
          <template slot="activator">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title v-if="id != 'outstanding'">Fixed in {{ id }}</v-list-tile-title>
                <v-list-tile-title v-else>Outstanding CVEs in Stream {{ stream }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <v-container fluid>
            <v-layout
              flexbox
              row
              fill-height
              wrap
            >
              <v-flex 
                v-for="(details, cveid) in data"
                :key="cveid"
                xs12 sm12 md6 lg6
              >
                <v-card class="cve-card">
                  <v-card-title>
                    <span class="headline">{{cveid}}</span>
                  </v-card-title>
                  <v-card-text>
                    <p v-if="details.cmt_msg">{{details.cmt_msg}}</p>
                    <p v-else><em>This CVE has no fixing commit in stream {{ stream }}.</em></p>
                    <span class="mono">{{details.cmt_id}}</span>
                  </v-card-text>
                  <v-card-actions v-if="cveid">
                    <v-spacer></v-spacer>
                    <v-btn icon flat color="green"
                      :to="'/cves/' + cveid"
                    >
                    <v-icon>link</v-icon>
                    </v-btn>
                    <v-btn flat icon color="green"
                      v-clipboard:copy="details.cmt_id"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                    >
                      <v-icon>file_copy</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-list-group>
      </v-list>
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
      sorting: 'most recent',
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
      this.contents = []
      this.stream = this.$route.path.split('/')[2]
      document.title = 'Linux Kernel CVEs | ' + 'CVEs in Stream ' + this.stream
      var url = this.$apiBaseUrl + 'data/stream_data.json'
      axios.get(url)
        .then(response => {
          // JSON responses are automatically parsed.
          var stream = response.data[this.stream]
          if (stream == null) {
            this.$router.push('/404')
          }
          this.contents = stream
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
  },
  filters: {
    trim: function (value) {
      if (!value) return ''
      return value.substring(0, 7)
    }
  },
  computed: {
    orderedStreams: function ()  {
      var sortedStreams = this.contents
      delete sortedStreams['outstanding']
      if (this.sorting === 'most recent') {
        var reversed = {}
        var keys = Object.keys(this.contents).reverse()
        keys.forEach((key) => {
          reversed[key] = this.contents[key]
        })
        return reversed
      }
      return this.contents
    },
    outstanding: function () {
      return this.contents['outstanding']
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cve-card {
  margin: 10px;
}
.mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>
