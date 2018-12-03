import axios from 'axios'

export default {
  data () {
    return {
      posts: [],
      errors: []
    }
  },

  // Fetches posts when the component is created.
  created () {
    axios.get(`https://api.github.com/repos/nluedtke/linux_kernel_cves/contents`)
      .then(response => {
      // JSON responses are automatically parsed.
        this.posts = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
