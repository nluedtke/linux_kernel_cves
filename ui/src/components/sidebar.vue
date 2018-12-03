<template>
  <div class="sidebar">
    <p>Hey, we are better than Wikipedia. Please <a>donate</a>.</p>
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
div {
  */float: right;*/
  display: block;
  background-color: #8FFFD0;
  border: #42b983 solid 1px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
}
a {
  color: blue;
}
.cve-select  {
  display: inline;
}
</style>
