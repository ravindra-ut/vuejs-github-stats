const bus = new Vue();

Vue.component('github-user-data',{
  template:`
    <div v-if="data">
      <h4>{{ data.name }}</h4>
      <p>{{ data.company }}</p>
      <p>Number of repos: {{ data.public_repos }}</p>
    </div>
  `,

  props: ['data'],

  data(){
    return {}
  }
})

Vue.component('github-output',{
  template: `
    <div>
      <p v-if="currentUsername == null">
        Enter a username above to see their Github data
      </p>
      <p v-else>
        Below are the results for {{ currentUsername }}:
        <github-user-data :data="githubData[currentUsername]"></github-user-data>
      </p>
    </div>
  `,

  created (){
    bus.$on('new-username', this.onUsernameChange)
  },

  destroyed() {
    bus.$off('new-username', this.onUsernameChange)
  },

  methods: {
    onUsernameChange(name) {
      this.currentUsername = name
      this.fetchGithubData(name)
    },

    fetchGithubData(name) {
      if (this.githubData.hasOwnProperty(name)) return
      var _this = this;
      axios.get('https://api.github.com/users/' + name)
        .then(function (response) {
              Vue.set(_this.githubData, name, response.data)
        })
        .catch(function (error) {
              console.log(error);
        });
    }
  },

  data() {
    return {
      currentUsername: null,
      githubData: {}
    }
  }
})

Vue.component('github-input', {
  template: `
    <form v-on:submit.prevent="onSubmit">
      <input type="text" v-model="username" placeholder="Enter a github username here" />
      <button type="submit">Go!</button>
    </form>
    `,

  methods: {
    onSubmit(event){
      if(this.username && this.username !== ''){
        bus.$emit('new-username', this.username)
      }
    }
  },

  data(){
    return {
      username: '',
    }
  }
})

Vue.component('app', {
  template: `
    <div>
      <p>Enter your username to get some Github stats!</p>
      <github-input></github-input>
      <github-output></github-output>
    </div>
  `,
  data(){
    return {}
  }
})

new Vue({
    el: '#app',
});
