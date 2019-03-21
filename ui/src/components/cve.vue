<template>
  <div class="hello">
    <div v-if="contents" class="content">
      <h3 v-if="contents.name" class="cve-headline"> {{ contents.name }} - {{ contents.id }}</h3>
      <h3 v-else class="cve-headline">{{ contents.id }}</h3>
      <p v-if="contents.last_modified" class="last-modified"><em>Last modified {{ contents.last_modified }}</em></p>
      <div class="distro-links">
        <p><span v-for="(item, key) in contents.ref_urls" v-bind:key="key" class="distro-version-fixed">
          <a :href="item" target="_blank">{{key}}<img class="external-link" src="../assets/external-link.svg"></a></span>
        </p>
      </div>
      <span v-if="contents.cwe" class="tag">{{ contents.cwe }}</span>
      <div v-if="contents.vendor_specific === true" class="vendor-specific">
        <h4>Vendor Specific</h4>
        <p>This CVE has been marked <strong>vendor specific</strong>. CVEs with the tag are believed to only affect one or more distribution specific kernels. This maybe due to a custom patch set, error in back porting, or another error.</p>
        <p>If you disagree with the Vendor Specific nature of this CVE please submit an <a href="https://github.com/nluedtke/linux_kernel_cves/issues/new?assignees=&labels=Data&template=cve-data-issue.md&title=%5BDATA%5D+CVE-XXXX-XXXXXX">issue</a>.</p>
      </div>
      <div v-if="contents.vendor_specific != true">
        <h4 v-if="contents.nvd_text">NVD Text</h4>
        <p class="nvd-text" v-if="contents.nvd_text">{{ contents.nvd_text }}</p>
        <h4>Affected Versions</h4>
        <p class="versions">{{contents.affected_versions}}</p>
        <h4>Hashes</h4>
        <ul id="hashes">
          <li v-if='contents.breaks == ""'><strong>Breaks: </strong>{{contents.breaks}}</li>
          <li v-else><strong>Breaks: </strong><a href="https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id={{contents.breaks}}"> {{contents.breaks}}</a></li>
          <li v-if='contents.fixes == ""'><strong>Fixes:  </strong>{{contents.fixes}}</li>
          <li v-else><strong>Fixes:  </strong><a href="https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id={{contents.fixes}}">{{contents.fixes}}</a></li>
          <p class="commit-message"><strong>Commit message:</strong> {{ contents.cmt_msg }}</p>
        </ul>
        <cvss v-if="contents.cvss2" cvssVersion="cvss2" v-bind:cvssData="contents.cvss2"/>
        <cvss v-if="contents.cvss3" cvssVersion="cvss3" v-bind:cvssData="contents.cvss3"/>
        <h4>Fixed Versions</h4>
        <ul>
          <li v-for="(item, stream_id) in stream"
              v-bind:key="stream_id"><strong><router-link :to="{ name: 'stream', params: { stream_id: stream_id } }">{{stream_id}}</router-link></strong>:{{item.spacing}}{{item.fixed_version}}</li>
        </ul>
      </div>
    </div>
    <div v-else class="content">
      <h3 class="cve-headline"> {{ cveId }} not found</h3>
      <p>{{cveId}} does not appear in our data. This could be because its too new (within hours), is embargoed, or we believe that it does not affect the upstream kernel.</p>
      <p>If you believe this CVE does affect the Linux Kernel, please fill out an issue on our github by clicking the button below.</p>
      <div class="row">
        <a class="issue" href="https://github.com/nluedtke/linux_kernel_cves/issues/new?assignees=&labels=Data&template=cve-data-issue.md&title=%5BDATA%5D+CVE-XXXX-XXXXXX">file an issue</a>
      </div>
    </div>
    <input action="action" onclick="window.history.go(-1); return false;" type="button" value="Back" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  components: {
    cvss: () => import('./cvss')
  },
  data () {
    return {
      stream: [],
      contents: [],
      errors: [],
      cveId: []
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
      var cveID = this.$route.path.split('/')[2]
      this.cveId = cveID
      document.title = 'Linux Kernel CVEs | ' + cveID
      axios.get(cvesUrl)
        .then(response => {
          var cve = response.data[cveID]
          if (cve == null) {
            this.contents = null
          }
          cve['id'] = cveID
          this.contents = cve
        })
        .catch(e => {
          this.errors.push(e)
        })
      var streamUrl = this.$apiBaseUrl + 'data/stream_fixes.json'
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
  max-width: 740px;
  margin: 0 auto;
}
.content {
  text-align: left;
  padding: 1em 2em;
  margin: 4em 0 2em;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.cve-headline {
  font-size: 1.7em;
  text-align: center;
  margin: 1em 0 0.5em 0;
}
.distro-links {
  text-align: center;
}
.last-modified {
  font-size: .9em;
  text-align: center;
  margin-bottom: 2em;
}
.versions {
  padding: .5em 1em 1em
}
.commit-message {
  background-color: #354649;
  color: white;
  padding: .5em 1em;
  font-size: 12px;
  margin-right: 8px;
  white-space: normal;
}
h1, h2, h3, h4{
  margin-top: 1.75em;
  font-weight: 600;
}
ul {
  list-style-type: none;
  background-color: #9FD9E3;
  font-family: monospace;
  padding: 1em 2em;
  font-size: 1.2em;
  white-space: pre;
}
.external-link {
  height: 14px;
  width: 14px;
  margin-left: 3px;
  vertical-align: text-top;
}
.tag {
  border: 2px solid #CE4513;
  background-color: white;
  color: #CE4513;
  margin-right: 8px;
  padding: .5em 1em;
  font-size: 12px;
  font-weight: 700;
}
.distro-version-fixed a, .disro-version-unfixed a, .distro-version-unknown a {
  color:white;
  text-decoration: none;
}
.distro-version-fixed {
  background-color: #354649;
  color: white;
  padding: .5em 1em;
  font-size: 12px;
  margin-right: 8px;
}
.distro-version-unfixed {
  background-color: #CE4513;
  color: white;
  padding: .5em 1em;
  font-size: 12px;
  margin-right: 8px;
}
.distro-version-unknown {
  background-color: #b1b1b1;
  color: white;
  padding: .5em 1em;
  font-size: 12px;
  margin-right: 8px;
}
.vendor-specific {
  padding: .5em 1em;
  margin: 2em 0;
  background-color: #ffc2ab;
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
  color: #354649;
}
.issue {
  text-decoration: none;
  padding: 1em 2em;
  background-color: #42b983;
  color: white;
  border: 1px solid white;
  -webkit-transition: .5s;
  transition: .5s;
}
.issue:hover {
  color: #42b983;
  background-color: white;
  border: 1px solid #42b983;
}
.row {
  padding: 1em 0;
  margin: 1em 0;
}
</style>
