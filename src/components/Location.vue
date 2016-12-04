<template>
  <section id="log" :style="{backgroundColor: loc.color }">
    <div class="inner">
      <header class="profile-header"><div><h1 class="h2">{{loc.name}}</h1><p>{{loc.type}}</p></div></header>
      <ul class="h3">
        <li v-for="n in 40" @click="showProfile()">
          <img src="/static/icons/log.svg"><span>Username</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default{
  name: 'Location',
  props: ['loc'],
  methods: {
    showProfile: function () {
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
  background:white;
  overflow-x: hidden;
  overflow-y: scroll;
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