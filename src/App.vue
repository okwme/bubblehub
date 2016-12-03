<template>
  <div id="app">
    <vr></vr>
    <div id='chats'>
      <div v-for="item in filteredItems">
        <a v-if='username === "admin"' @click.stop='removeItem(item[".key"])'>x</a>
        {{item.username}}: {{item.text}} 
      </div>
    </div>
    <div class='inputs'>
      <input :value='username' placeholder='username' class='username' v-model='username' @keyup='newName()'>
      <input placeholder='message' class='text' v-model='currentMessage' @keyup.enter='newItem()'>
    </div>
  </div>
</template>

<script>
import firebase from './firebase'
import VR from './components/VR'
const db = firebase.database()

export default {
  name: 'app',
  components: {
    VR
  },
  data () {
    return {
      currentMessage: '',
      currentKey: '',
      username: null
    }
  },
  firebase: {
    items: db.ref('items')
  },
  computed: {
    filteredItems () {
      var vm = this
      return this.items.filter(function (item) {
        return item.text !== '' || vm.username === 'admin'
      }).sort(function (a, b) {
        return a.time > b.time ? 1 : -1
      })
    },
    itemsLength () {
      return this.items.length
    }
  },
  watch: {
    currentMessage () {
      this.updateItem()
    },
    itemsLength () {
      this.$nextTick(function () {
        this.scrollDown()
      })
    }
  },
  mounted () {
    var vm = this
    this.newItem()

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously().catch(error => {
          console.error('Failed to authenticate with Firebase', error)
        })
      } else {
        vm.username = firebase.auth().currentUser.displayName
      }
    })
  },
  methods: {
    scrollDown () {
      var app = document.getElementById('chats')
      app.scrollTop = app.scrollHeight
    },
    newName () {
      var vm = this
      var user = firebase.auth().currentUser
      if (user) {
        user.updateProfile({
          displayName: vm.username
        }).then(function () {
        }, function (error) {
          console.log(error)
        })
      }
      this.updateItem()
    },
    newItem () {
      var vm = this
      this.currentMessage = ''
      this.currentKey = this.$firebaseRefs.items.push({
        username: vm.username,
        text: '',
        time: 0
      }).key
    },
    updateItem () {
      // var date = new Date()
      var item = {
        username: this.username,
        text: this.currentMessage,
        time: (+new Date())}
      this.$firebaseRefs.items.child(this.currentKey).set(item)
      this.scrollDown()
    },
    removeItem (key) {
      this.$firebaseRefs.items.child(key).remove()
      if (key === this.currentKey) {
        this.newItem()
      }
    }
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
  > div{
      position:absolute;
      left:0px;
      right:0px;
      width:100%;
  }
  #chats {
    -webkit-overflow-scrolling: touch;
    bottom:110px;
    padding:20px;
    text-align: left;
    overflow:auto;
    max-height: calc(100% - 110px);
    // height: calc(100vh - 110px);
    a{
      cursor: pointer;
    }
  }
  .inputs{
    bottom:0px;
    height:110px;
    input{
      height:55px;
      width: calc(100% - 10px);
      font-size:34px;
      line-height: 1.3em;
      padding:5px;
      border:0px;
      &:focus{
        outline: none;
      }
    }
    input.username{
      border-top: 1px solid black;
      position:absolute;
      bottom:55px;
      left:0px;
      width:100%;
    }
    input.text{
      position:absolute;
      bottom:0px;
      left:0px;
      width:100%;
    }
  }
}
</style>
