<template>
  <div id="app">
    <VR :loc='loc'></VR>
    <a id='showChat' @click.prevent='chatVisible = !chatVisible'>Chat {{chatVisible ? 'Close' : 'Open'}}</a>
    <chat 
    v-bind:user='user'
    v-bind:chats='chats'
    v-bind:chatVisible='chatVisible'></chat>
  </div>
</template>

<script>
import firebase from './firebase'
const db = firebase.database()
import VR from './components/VR'
import Chat from './Chat'

export default {
  name: 'app',
  components: {
    VR,
    Chat
  },
  data () {
    return {
      chatVisible: false,
      user: false,
      loc: {
        roomInfo: {
          bgColor: 'lightgray',
        },
        entities: [],
      }
    }
  },
  firebase: {
    chats: db.ref('chats')
    // user: firebase.auth().currentUser
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    var vm = this
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously().catch(error => {
          console.error('Failed to authenticate with Firebase', error)
        })
      } else {
        console.log('success!')
        vm.user = firebase.auth().currentUser
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="scss">
*{
  box-sizing: border-box;
}
body{
  padding:0;
  margin:0;
}
#app {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  
  #showChat{
    cursor: pointer;
    z-index:2;
    position:absolute;
    left:10px;
    top:10px;
  }

}
</style>
