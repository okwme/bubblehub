<template>
  <section id="log">
    <header class="profile-header"><div><h1 class="h2">{{loc.name}}</h1><p>{{locType}}</p></div></header>
    <ul class="h3">
      <li v-for="n in 40" 
      @click="showProfile()"      
      >
        <img src="/static/icons/log.svg"><span>Username</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default{
  name: 'Location',
  props: ['loc'],
  computed: {
    locType () {
      return this.loc.type === 'station' ? 'bus stop' : this.loc.type
    }
  },
  methods: {
    showProfile: function () {
      console.log('show')
      this.$parent.showProfile()
    }
  }
}
</script>

<style lang="scss">
#log{
  transition:transform 500ms;
  position: fixed;
  top:0; left:0; width:100%; height:100%;
  background:#00A8E8;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  // hidden
  transform: translateX(100%);

  // scrim for white text safeguard
  color:white;
  > .inner{
    min-height: 100vh;
    background-color:rgba(0,0,0,.25);
  }

  header p{
    text-transform:capitalize;
    margin-top: .5em;
  }

  ul{
    > li{
      text-align: left;
      vertical-align: middle;
      border-top: 1px solid;
      padding:1em;
      display: flex;
      align-items:center;
      img{
        display: inline;
        margin-right: 2rem;
      }
    }
  }
}
</style>