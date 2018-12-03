<template>
  <div class="hello">
    <div id="content">
      <h3 class="cve-headline">{{ contents.id  }}</h3>
      <p><em>{{ contents.cmt_msg }}</em></p>
      <span v-if="contents.cwe" class="tag">{{ contents.cwe }}</span>
      <h4>Affected Versions</h4>
      <p class="versions">{{contents.affected_versions}}</p>
      <h4>Hashes</h4>
      <ul id="hashes">
        <li><strong>Breaks: </strong>{{contents.breaks}}</li>
        <li><strong>Fixes:  </strong>{{contents.fixes}}</li>
      </ul>
      <h4>Risk Score</h4>
      <ul>
        <li><strong>cvss2</strong>: {{ contents.cvss2 }}</li>
        <li><strong>cvss3</strong>: {{ contents.cvss3 }}</li>
      </ul>
      <h4>Fixed Versions</h4>
      <ul>
        <li v-for="(item, key) in stream"
            v-bind:key="key"><strong>{{key}}</strong>:{{item.spacing}}{{item.fixed_version}}</li>
      </ul>
    </div>
    <input action="action" onclick="window.history.go(-1); return false;" type="button" value="Back" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      stream: [],
      contents: [],
      errors: []
    }
  },
  created () {
    this.load()
  },

  watch: {
    '$route' (to, from) {
      this.load()
    }
  },
  methods: {
    load: function () {
      var cvesUrl = this.$apiBaseUrl + 'kernel_cves.json'
      axios.get(cvesUrl)
        .then(response => {
          var cveID = this.$route.path.split('/')[2]
          var cve = response.data[cveID]
          if (cve == null) {
            this.$router.push('/404')
          }
          cve['id'] = cveID
          this.contents = cve
        })
        .catch(e => {
          this.errors.push(e)
        })
      var streamUrl = this.$apiBaseUrl + 'stream_fixes.json'
      axios.get(streamUrl)
        .then(response => {
          // JSON responses are automatically parsed.
          var cveID = this.$route.path.split('/')[2]
          var stream = response.data[cveID]
          for (var key of Object.keys(response.data[cveID])) {
            var spacing = 6 - key.length
            stream[key]['spacing'] = ' '.repeat(spacing)
          }
          this.stream = stream
        })
        .catch(e => {
          console.log('Error loading stream.')
          this.stream = ''
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
.cve-headline {
  text-align: center;
  margin: 1em 0 2em;
}
.versions {
  padding: .5em 1em 1em
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
  white-space: pre;
}
.tag {
  background-color: #CE4513;
  color: white;
  padding: .5em 1em;
  font-size: 12px;
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
