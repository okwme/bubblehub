<template>
  <article id="profile" :class="{ 'visible' : profileVisible }">
    <a id="closeProfile" class="close ui-btn" @click="close()" title="Close Profile"><img src="/static/icons/arrow-r.svg"></a>
    <h1 class="h1"><span>usermane</span></h1>
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
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: "O'Hare",
          color: 'blue'
        },
        {
          name: 'London Heathrow, GB',
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: "O'Hare",
          color: 'blue'
        },
        {
          name: 'London Heathrow, GB',
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: "O'Hare",
          color: 'blue'
        },
        {
          name: 'London Heathrow, GB',
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: 'London Heathrow, GB',
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: "O'Hare",
          color: 'blue'
        },
        {
          name: 'London Heathrow, GB',
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: "O'Hare",
          color: 'blue'
        },
        {
          name: 'London Heathrow, GB',
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
        },
        {
          name: "O'Hare",
          color: 'blue'
        },
        {
          name: 'London Heathrow, GB',
          color: 'red'
        },
        {
          name: 'Tegel',
          color: 'green'
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
      // this.$parent.showMessage(e.target.title, 2000)
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
  background:white;
  
  // show / hide
  transform:translateY(100%);
  &.visible{
    transform:translateY(0);
  }

  h1{
    min-height:50vh;
    padding:1em 1rem 1em;
    display: flex;
    align-items:center;
    justify-content: center;
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
      width:25%;
      height:0;
      padding-bottom:25%;
      float:left;

      
      // flip
      cursor: pointer;
      &[data-flipped="true"]{
        animation: flipX .75s 1;
        &:nth-child(3n){
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