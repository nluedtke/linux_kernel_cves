<template>

  <div class="hello">
    <div id="homepage-sidebar">
      <h3>Navigation</h3>
      <router-link to="/cves">
        <a>All CVEs</a>
      </router-link>
      <h3>Linux distros security pages</h3>
      <ul>
        <li><a href="https://security.archlinux.org">Arch Linux</a></li>
        <li><a href="https://www.debian.org/security/">Debian</a></li>
        <li><a href="https://www.gentoo.org/support/security/">Gentoo</a></li>
        <li><a href="https://access.redhat.com/security/">Red Hat</a></li>
        <li><a href="https://www.suse.com/support/security/">SUSE</a></li>
        <li><a href="https://www.ubuntu.com/security/">Ubuntu</a></li>
      </ul>
      <div class="donate">
      <h3>Support this project</h3>
      <p>Infrastructure costs money. Donate to keep this page updating.</p>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="linuxkernelcves@gmail.com" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
          <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </form>
        <div id="contact-us"><a href="mailto:linuxkernelcves@gmail.com">contact us</a></div>
      </div>
    </div>
    <vue-markdown id="changes-block" :source="changes"></vue-markdown>
    <vue-markdown id="contents-block" :source="contents"></vue-markdown>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      contents: '',
      changes: '',
      errors: []
    }
  },
  created () {
    var aboutUrl = this.$apiBaseUrl + 'ABOUT.md'
    var changesUrl = this.$apiBaseUrl + 'CHANGES.md'

    axios.get(aboutUrl)
      .then(response => {
      // JSON responses are automatically parsed.
        this.contents = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
    axios.get(changesUrl)
      .then(response => {
      // JSON responses are automatically parsed.
        this.changes = response.data
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
#contact-us {
  text-align: center;
  margin-top: 30px;
  color: #fff;
  padding: .5em;
  font-size: 14px;
  border-width: 1px;
  border-radius: 4px;
  border-color: #42b983;
  background-color: #42b983;
  box-shadow: none;
  min-width: 35px;
  width: 100%;
}
#contact-us a {
  color: white;
  text-decoration: none;
  text-transform: uppercase;
}
#homepage-sidebar {
  width: 600px;
  background-color: #42b9835e;
  padding: 1em 0;
}
#homepage-sidebar p, #homepage-sidebar h3, #homepage-sidebar form {
  margin-left: 2em;
}
#homepage-sidebar ul {
  margin-left: 2em;
  padding-inline-start: 20px;
  list-style-type: disc;
}
@media only screen and (min-width: 1170px) {
  #homepage-sidebar {
    max-width: 180px;
    position: fixed;
    background-color: white;
    left: 0;
    padding: 2em;
    margin-left: 2em;
    margin-top: 4em;
  }
  #homepage-sidebar p, #homepage-sidebar h3, #homepage-sidebar form {
    margin-left: 0em;
    line-height: 1.2;
  }
  #homepage-sidebar ul {
    margin-left: 0;
    padding-inline-start: 20px;
    list-style-type: disc;
  }
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
#changes-block {
  background-color: #ffc2ab;
  padding: 1em;
}
</style>
