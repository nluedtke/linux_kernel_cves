<template>
  <div class="hello">
    <h1>FOUR OH FOUR</h1>
    <p>This CVE does not appear in our data. This could be because its too new (within hours), is embargoed, or we believe that it does not affect the upstream kernel.</p>
    <p>If you believe this CVE does affect the Linux Kernel, please fill out an <a href="https://github.com/nluedtke/linux_kernel_cves/issues/new?assignees=&labels=Data&template=cve-data-issue.md&title=%5BDATA%5D+CVE-XXXX-XXXXXX">issue</a>.</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      contents: [],
      errors: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
</style>
