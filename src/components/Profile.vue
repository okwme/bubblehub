<template>
  <article id="profile" :class="{ 'visible' : profileVisible }">
    <a id="closeProfile" class="close ui-btn" @click="close()" title="Close Profile"><img src="/static/icons/arrow-r.svg"></a>
    <h1 class="h1 profile-header"><span>{{!$parent.isset(user.username) ? '(set your username in the chat)' : user.username}}</span></h1>
    <h2> {{checkins.length}} Hubs visited</h2>
    <ul>
      <li style='width:100%;' v-if='checkins.length === 0'>You haven't checked in anywhere yet!</li>
      <li v-for="item in checkins" 
      :locid="item['.key']"
      :title="item.name"
      @mouseover="flip"
      @click="locClick(item)" 
      :style="{backgroundColor:item.color, color:item.color}"></li>
    </ul>
  </article>
</template>
<script>
export default {
  name: 'Profile',
  props: ['profileVisible', 'locs', 'user'],
  computed: {
    checkins () {
      var vm = this
      return this.locs.filter(function (loc) {
        var indexAir = -1
        var indexLand = -1
        if (vm.$parent.isset(vm.user.locs) && vm.$parent.isset(vm.user.locs.airport)) {
          indexAir = vm.user.locs.airport.findIndex(function (userloc) {
            return userloc === loc['.key']
          })
        }
        if (vm.$parent.isset(vm.user.locs) && vm.$parent.isset(vm.user.locs.station)) {
          indexLand = vm.user.locs.station.findIndex(function (userloc) {
            return userloc === loc['.key']
          })
        }
        return indexLand > -1 || indexAir > -1
      })
    }
  },
  data () {
    return {
    }
  },
  methods: {
    locClick (item) {
      if (!this.$parent.isMobile) {
        this.$parent.switchCities(item['.key'])
        this.close()
      }
    },
    close () {
      this.$parent.profileId = false
      this.$parent.showProfile(false)
    },
    flip (e) {
      // message
      this.$parent.showMessage(e.target.title, e.target.attributes.locid.value, 2000)
      // add Class
      e.target.setAttribute('data-flipped', true)
      setTimeout(() => e.target.setAttribute('data-flipped', false), 510)
    }
  }
}
</script>
<style lang="scss" scoped>
#profile {
  transition:transform 400ms;
  position:fixed;
  z-index: 20;
  top:0;
  left:0;
  width:100%;
  height:100%;
  overflow-x:hidden;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
  background:white;
  
  // show / hide
  transform:translateY(100%);
  &.visible{
    transform:translateY(0);
  }

  ul{
    position:relative;
    list-style-type: none;
    &:after{
      content:'';
      display: block;
      width:100%;
      clear:both;
    }
    > li{
      width:20%;
      height:0;
      padding-bottom:20%;
      float:left;

      
      // flip
      cursor: pointer;
      &[data-flipped="true"]{
        animation: flipX .75s 1;
        &:nth-child(3n){
          animation: flipY .75s 1;
        }
        &:nth-child(7n){
          animation: flipY .75s 1;
        }
      }
    }
  }
}

#closeProfile{
  top:.5rem;
  position:absolute;
  right:1rem;
  transform:rotate(90deg);
}

@keyframes flipX {
  0% { transform:rotateX(0) }
  70% { transform:rotateX(180deg) }
}
@keyframes flipY {
  0% { transform:rotateY(0) }
  70% { transform:rotateY(180deg) }
}
</style>