<template>
  <article id="profile" :class="{ 'visible' : profileVisible }">
    <a id="closeProfile" class="close ui-btn" @click="close()" title="Close Profile"><img src="/static/icons/arrow-r.svg"></a>
    <h1 class="h1 profile-header"><span>You</span></h1>
    <ul>
      <li v-for="item in userCheckIns" @click="flip" :style="{backgroundColor:item.color, color:item.color}" :title="item.name"></li>
    </ul>
  </article>
</template>
<script>
export default {
  name: 'Profile',
  props: ['profileVisible'],
  data () {
    return {
      userCheckIns: [
        {
          name: 'London Heathrow, GB',
          color: '#2AFC98'
        },
        {
          name: 'Tegel',
          color: '#9FA0C3'
        },
        {
          name: "O'Hare",
          color: '#6D1A36'
        },
        {
          name: 'London Heathrow, GB',
          color: '#16C172'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: "O'Hare",
          color: '#5E6973'
        },
        {
          name: 'London Heathrow, GB',
          color: '#7CFFC4'
        },
        {
          name: 'Tegel',
          color: '#3B60E4'
        },
        {
          name: "O'Hare",
          color: '#BCF8EC'
        },
        {
          name: 'London Heathrow, GB',
          color: '#FF570A'
        },
        {
          name: 'Tegel',
          color: '#420039'
        },
        {
          name: 'London Heathrow, GB',
          color: '#F433AB'
        },
        {
          name: 'Tegel',
          color: '#8C5E58'
        },
        {
          name: "O'Hare",
          color: '#A833B9'
        },
        {
          name: 'London Heathrow, GB',
          color: '#41292C'
        },
        {
          name: 'Tegel',
          color: '#FD3E81'
        },
        {
          name: "O'Hare",
          color: 'blue'
        },
        {
          name: 'London Heathrow, GB',
          color: '#A7CAB1'
        },
        {
          name: 'Tegel',
          color: '#F4ECD6'
        },
        {
          name: "O'Hare",
          color: '#49D49D'
        },
        {
          name: 'London Heathrow, GB',
          color: '#F58549'
        },
        {
          name: 'Tegel',
          color: '#05F140'
        }
      ]
    }
  },
  methods: {
    close () {
      this.$parent.showProfile(false)
    },
    flip (e) {
      // message
      this.$parent.showMessage(e.target.title, 2000)
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