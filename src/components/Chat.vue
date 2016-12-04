<template>
<div :class='{"visible":chatVisible}' id="chat">
  <div id='chats'>
    <div v-for="chat in filteredChats">
      <a v-if='username === "admin"' @click.stop='removeChat(chat[".key"])'>x</a>
      {{chat.username}}: {{chat.msg}} 
    </div>
  </div>
  <div class='inputs h3'>
    <input :value='username' placeholder='username' class='username' v-model='username' @keyup='newName()'>
    <input placeholder='message' class='text' v-model='currentMessage' @keyup.enter='newChat()'>
  </div>
</div>
</template>

<script>
// import firebase from '../firebase'
// const db = firebase.database()
export default {

  name: 'Chat',

  data () {
    return {
      currentMessage: '',
      currentKey: '',
      username: ''
    }
  },
  firebase: {
    // chats: db.ref('chats/' + this.loc.slug)
  },
  props: [
    'loc',
    'chats',
    'users',
    'user',
    'chatVisible'
  ],
  computed: {
    filteredChats () {
      var vm = this
      return this.chats.filter(function (chat) {
        return chat.msg !== '' || vm.username === 'admin'
      }).sort(function (a, b) {
        return a.time > b.time ? 1 : -1
      })
    },
    chatsLength () {
      return this.chats.length
    },
    displayName () {
      return this.user.displayName
    }
  },
  watch: {
    displayName () {
      this.username = this.displayName
    },
    currentMessage () {
      this.updateChat()
    },
    chatsLength () {
      this.$nextTick(function () {
        this.scrollDown()
      })
    }
  },
  mounted () {
    this.newChat()
    this.username = this.user.displayName
    if (!this.username) {
      this.username = 'n00b-' + Math.floor(Math.random() * 999)
      this.newName()
    }
  },
  methods: {
    scrollDown () {
      var app = document.getElementById('chats')
      app.scrollTop = app.scrollHeight
    },
    newName () {
      var user = this.user
      var vm = this
      // var user = firebase.auth().currentUser
      if (user) {
        var key = this.$parent.getUserKey()
        if (!key) {
          return
        }
        var updates = {}
        updates[key + '/username'] = vm.username
        this.$parent.$firebaseRefs.users.update(updates)
        user.updateProfile({
          displayName: vm.username
        }).then(function () {

        }, function (error) {
          console.log(error)
        })
      }
      this.updateChat()
    },
    newChat () {
      // var vm = this
      this.currentMessage = ''
      var chat = {
        username: this.username,
        msg: '',
        time: 0
      }
      this.currentKey = this.$parent.$firebaseRefs.chats.push(chat).key
    },
    updateChat () {
      // var date = new Date()
      var chat = {
        username: this.username,
        msg: this.currentMessage,
        time: (+new Date())}
      this.$parent.$firebaseRefs.chats.child(this.currentKey).set(chat)
      this.scrollDown()
    },
    removeChat (key) {
      this.$parent.$firebaseRefs.chats.child(key).remove()
      if (key === this.currentKey) {
        this.newChat()
      }
    }
  }
}
</script>

<style lang="scss">
#chat{
  transform: translateX(-100%);
  position:absolute;
  top:0px;
  left:0px;
  width:100%;
  height:100%;
  transition: all 500ms ease;
  background-color: white;
  // margin-left:-100%;
  border-right:1px solid black;
  &.visible{
    // margin-left:0;
    transform: translateX(0%);
  }
   > div{
    position:absolute;
    left:0;
    width:100%;
  }
  #chats {
    -webkit-overflow-scrolling: touch;
    padding:2rem 2rem;
    text-align: left;
    overflow:auto;
    max-height: calc(100% - 9rem);
    bottom:9rem;
    // height: calc(100vh - 110px);
    a{
      cursor: pointer;
    }
  }
  .inputs{
    bottom:0px;
    padding:.75rem 2rem 1rem;
    color:inherit;
    background:whitesmoke;
    input{
      display: block;
      background:transparent;
      font-size: inherit;
      font-weight: bolder;
      color:inherit;
      border:none;
      line-height: 1rem;
      margin:1.25rem 0;
      &:focus{
        outline: none;
      }
    }
  }
}
</style>