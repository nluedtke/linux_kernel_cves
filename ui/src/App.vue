<template>
  <v-app>
    <v-toolbar
      color="#354649"
      dark
      app
      fixed
      clipped-left
    >
      <img class="logo" src="@/assets/logo.svg"/>
      <v-toolbar-title class="white--text headline font-weight-light">Linux Kernel CVEs</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-autocomplete
          label="Search by CVE ID"
          color="white"
          dense
          hide-no-data
          append-icon="search"
          :items="cves"
          v-model="cve"
          @change="gotoCVE()"
        >
        </v-autocomplete>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer permanent clipped hide-overlay app mobile-break-point=0>
      <v-list>
        <v-list-tile
          to="/"
        >
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>
        <v-list-group>
          <template slot="activator">
            <v-list-tile>
              <v-list-tile-content>
              <v-list-tile-title>Stream Reports</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
            <v-list-group sub-group>
              <template slot="activator">
                <v-list-tile>
                  <v-list-tile-content>
                  <v-list-tile-title>Supported Streams</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <v-list-tile 
                v-for="stream in supportedStreams" 
                :key="stream"
                :to="'/streams/' + stream"
              >
                <v-list-tile-content>
                  <v-list-tile-title>Stream {{ stream }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
            <v-list-group sub-group>
              <template slot="activator">
                <v-list-tile>
                  <v-list-tile-content>
                  <v-list-tile-title>EOL Streams</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
              <v-list-tile 
                v-for="stream in eolStreams" 
                :key="stream"
                :to="'/streams/' + stream"
              >
                <v-list-tile-content>
                  <v-list-tile-title>Stream {{ stream }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
        </v-list-group>
        <v-list-tile
          to="/cves"
        >
          <v-list-tile-title>All CVEs in Index</v-list-tile-title>
        </v-list-tile>
        <v-list-group>
          <template slot="activator">
            <v-list-tile>
              <v-list-tile-content>
              <v-list-tile-title>Linux Distro Security Pages</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <v-list-tile><a target="_blank" href="https://security.archlinux.org">Arch Linux</a></v-list-tile>
          <v-list-tile><a target="_blank" href="https://www.debian.org/security/">Debian</a></v-list-tile>
          <v-list-tile><a target="_blank" href="https://www.gentoo.org/support/security/">Gentoo</a></v-list-tile>
          <v-list-tile><a target="_blank" href="https://access.redhat.com/security/">Red Hat</a></v-list-tile>
          <v-list-tile><a target="_blank" href="https://www.suse.com/support/security/">SUSE</a></v-list-tile>
          <v-list-tile><a target="_blank" href="https://www.ubuntu.com/security/">Ubuntu</a></v-list-tile>
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <div class="support">
        <h3>Want to support this project?</h3>
        <p>Infrastructure costs money. Donate to keep this page updating.</p>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="linuxkernelcves@gmail.com" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
          <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </form>
        <v-btn class="contact-us" dark large color="#354649" href="mailto:linuxkernelcves@gmail.com">contact us</v-btn>
      </div>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data () {
    return {
      stream: 'default',
      cves: [],
      filteredOptions: [],
      cve: '',
      eolStreams: [],
      supportedStreams: [],
      errors: [],
    }
  },
  created () {
    axios.get(this.$apiBaseUrl + 'kern.json')
      .then(response => {
        var eolStreams = response.data.eol_streams
        var supportedStreams = response.data.supp_streams
        this.supportedStreams = supportedStreams.map( a => a.split('.').map( n => +n+1000 ).join('.') ).sort()
                                .map( a => a.split('.').map( n => +n-1000 ).join('.') )
        this.eolStreams = eolStreams.map( a => a.split('.').map( n => +n+1000 ).join('.') ).sort()
                                .map( a => a.split('.').map( n => +n-1000 ).join('.') )
      })
      .catch(e => {
        this.errors.push(e)
      })
    var cvesUrl = this.$apiBaseUrl + 'data/kernel_cves.json'
    axios.get(cvesUrl)
      .then(response => {
      // JSON responses are automatically parsed.
        this.cves = Object.keys(response.data)
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    gotoCVE () {
      this.$router.push('/cves/' + this.cve.toUpperCase().trim(), () => {
        // TODO: make this reset more reliably
        this.$nextTick(() => {
          this.cve = '' 
        })
      })
    },
  }
}
</script>

<style>

</style>

<style scoped>
.logo {
  width: 50px;
  height: 50px;
}
.support {
  margin: 10px;
  margin-bottom: 25px;
}
.support h3, .support p, .support form {
  padding: 5px;
}
.contact-us {
  margin-top: 25px;
}
</style>