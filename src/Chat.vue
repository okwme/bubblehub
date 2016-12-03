<template>
<div :class='{"visible":chatVisible}' id="chat">
  <div id='chats'>
    <div v-for="chat in filteredChats">
      <a v-if='username === "admin"' @click.stop='removeChat(chat[".key"])'>x</a>
      {{chat.username}}: {{chat.msg}} 
    </div>
  </div>
  <div class='inputs'>
    <input :value='username' placeholder='username' class='username' v-model='username' @keyup='newName()'>
    <input placeholder='message' class='text' v-model='currentMessage' @keyup.enter='newChat()'>
  </div>
</div>
</template>

<script>
export default {

  name: 'Chat',

  data () {
    return {
      currentMessage: '',
      currentKey: '',
      username: ''
    }
  },
  props: [
    'chats',
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
    }
  },
  watch: {
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
  },
  methods: {
    scrollDown () {
      var app = document.getElementById('chats')
      app.scrollTop = app.scrollHeight
    },
    newName () {
      var vm = this
      // var user = firebase.auth().currentUser
      var user = this.user
      if (user) {
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
      console.log(this)
      var chat = {
        username: this.username,
        msg: '',
        time: 0
      }
      console.log(chat)
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

<style lang="scss" scoped>
#chat{
  position:relative;
  width:100%;
  height:100vh;
  transition: all 500ms ease;
  margin-left:-100%;
  border-right:1px solid black;
  &.visible{
    margin-left:0;
  }
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