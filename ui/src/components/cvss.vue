<template>
  <div class="cvss">
    <div class="cvss-header">
      <p class="score">{{cvssVersion}} score: <strong>{{cvssData.score}}</strong></p>
      <button class="toggle-cvss" @click="isShowing ^= true">show {{cvssVersion}} details</button>
    </div>
    <div v-show="isShowing" class='cvss-columns'>
      <div class='cvss-column' v-for="(values, category) in cvss" v-bind:key="category">
        <h5>{{category}}</h5>
        <div v-for="(active, type) in values" v-bind:key="type">
            <div v-if="active" class="cvss-metric cvss-highlighted">{{ type }}</div>
            <div v-if="!active" class="cvss-metric">{{ type }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

var cvss3Template = {
    'Attack Vector': {
        'Network': false,
        'Adjacent': false,
        'Local': false,
        'Physical': false
    },
    'Attack Complexity': {
        'Low': false,
        'High': false
    },
    'Availability': {
        'Low': false,
        'High': false,
        'None': false
    },
    'Confidentiality': {
        'None': false,
        'Partial': false,
        'Complete': false
    },
    'Integrity': {
        'None': false,
        'Partial': false,
        'Complete': false
    },
    'Privileges Required': {
        'None': false,
        'Low': false,
        'High': false
    },
    'Scope': {
        'Changed': false,
        'Unchanged': false
    },
    'User Interaction': {
        'None': false,
        'Required': false
    }
}
var cvss2Template = {
  'Access Complexity': {
    'Low': false,
    'Medium': false,
    'High': false
  },
  'Access Vector': {
    'Local Access': false,
    'Adjacent Network': false,
    'Network Accessible': false
  },
  'Authentication': {
    'Multiple': false,
    'Single': false,
    'None': false
  },
  'Availability Impact': {
    'None': false,
    'Partial': false,
    'Complete': false
  },
  'Confidentiality Impact': {
    'None': false,
    'Partial': false,
    'Complete': false
  },
  'Integrity Impact': {
    'None': false,
    'Partial': false,
    'Complete': false
  }
}

export default {
  props: ['cvssData', 'cvssVersion'],
  data () {
    return {
      stream: [],
      contents: [],
      cvss: null,
      errors: [],
      isShowing: false
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

      // set cvss template based on cvssVersion
      if (this.$props.cvssVersion === 'cvss2') {this.$data.cvss = cvss2Template}
      if (this.$props.cvssVersion === 'cvss3') {this.$data.cvss = cvss3Template}
      
      var data = this.$props.cvssData
      for (var [key, value] of Object.entries(data)) {
        if (key != 'score') {
          this.$data.cvss[key][value] = true
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cvss-header {
  margin: 2em 0 0 0;
  padding: 0 0 0 1em;
  color: white;
  background-color: #0D8E53;
}
.score {
  text-transform: uppercase;
  font-size: 1.25em;
  display: inline-block;
}
.score strong {
  font-size: 1.5em;
}
.toggle-cvss {
  float: right;
  display: inline-block;
  margin-left: 2em;
}
.cvss-metric {
  width: 8em;
  margin: 0 1em .5em 0;
  padding: .5em;
  background-color:lightgrey;
  border: none;
  display: block;
}
.cvss-highlighted {
  background-color: #ffc2ab;
}
.cvss-column {
  display: inline-block;
  vertical-align: top;
  margin: 0 .5em 0 0;
}
.cvss-column h5 {
  text-align: left;
}
</style>
