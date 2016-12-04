<template>
  <div id="vr">
    <div id="greeting" v-if='loc' class="watermark" :class='{"set": !$parent.greetingVisible}'>
      <h2 v-if="$parent.greetingVisible">Welcome to</h2>
      <h1>{{loc.name}}, {{loc.country_code}} <span class='swatch' :style="{'background-color' : loc.color}">&nbsp;</span></h1>
    </div>

    <a-scene id="scene" vr-mode-ui="enabled: false">
      <a-assets>
        <!--<img id="highlight1" src="../assets/radial-highlight.png">-->
        <a-asset-item id="plane-obj" src="/static/plane.obj"></a-asset-item>
        <a-asset-item id="wheel-obj" src="/static/wheel.obj"></a-asset-item>
        <img id="sky-src" :src="photo">
      </a-assets>
      <!-- Ground Highlight -->
      <!--<a-image position="0 -.2 5" src="#highlight1" rotation="-90 0 0" scale="30 30 30"></a-image>-->
      <!-- Objects -->
      <a-entity id="toy" toy-color check-in :position="planePosition" :obj-model="objmodel" rotation="-3 -45 0">
        <a-animation v-if="animOn" attribute="rotation"
        direction="normal"
        dur="20000"
        fill="reverse"
        to="0 -45 -360"
        easing="linear"
        repeat="indefinite"></a-animation>
      </a-entity>
      <!-- camera / cursor -->
      <a-entity camera="userHeight: 1.6" look-controls>
        <a-cursor v-if="loc"></a-cursor>
      </a-entity>
      <!-- Background / loc.photo -->
      <a-sky :src="photo"></a-sky>
    </a-scene>

    <!-- modal -->
    <div id="firstCheckInModal" @click='checkInPopup = false' :class="[{'visible':checkInPopup}, 'modal']">
      <div class="inner">
        <h2 class="h3">You checked-in to<br> {{loc.name}}!</h2>
        <span class="swatch" :style="{backgroundColor:loc.color}"></span> was added to your profile!<br><br>
        Click the {{loc.type === 'airport' ? 'paper plane' : 'bus'}} again for new scenes
      </div>
    </div>

  </div>
</template>

<script>
/* global Image:true */
/* eslint no-undef: "error" */

const AFRAME = require('aframe')
export default{
  name: 'VR',
  props: ['loc', 'checkInWatch'],
  data () {
    return {
      checkInPopup: false,
      loading: true,
      topAmount: 20,
      animOn: true,
      currentPhotoId: false,
      photo: '/static/loading.png',
      planePosition: '0 1.5 -3'
    }
  },
  computed: {
    objmodel () {
      return this.loc.type === 'airport' ? 'obj: #plane-obj' : 'obj: #wheel-obj'
    }
  },
  watch: {
    checkInWatch () {
      this.checkInPopup = true
      setTimeout(function () { this.checkInPopup = false }, 4000)
    },
    loc () {
      if (this.loc && this.loc.photos) {
        this.switchPhoto()
        document.getElementById('toy').setAttribute('material', 'color', this.loc.color)
        this.$parent.showGreeting()
      }
    }
  },
  methods: {
    rand () {
      var foo = Math.floor(Math.random() * 12) - 6
      return foo < 2 && foo > 0 ? 2 : foo > -2 && foo < 0 ? -2 : foo
    },
    changePosition () {
      this.planePosition = this.rand() + ' ' + this.rand() + ' ' + this.rand()
    },
    switchPhoto (callback = function () {}) {
      var vm = this
      vm.loading = true
      var topAmount = this.loc.photos.length > this.topAmount ? this.loc.photos.length : this.topAmount
      var photoId = this.loc.photos[Math.floor(Math.random() * topAmount)].id
      if (photoId === this.currentPhotoId) {
        this.switchPhoto()
      } else {
        this.getFlick(photoId, function (url) {
          var img = new Image()
          img.onload = function () {
            vm.photo = url
            vm.loading = false
            callback()
          }
          img.src = url
        })
      }
    },
    getFlick (photoId, callback = function () {}) {
      this.$http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=9f9dc34361fdef233d4309c30176d8dd&photo_id=' + photoId + '&format=json&nojsoncallback=1').then(function (successData) {
        var photo = false
        successData.data.sizes.size.reverse().forEach(function (element, int) {
          if (!photo && element.width <= 2050) {
            photo = element
          }
        })
        if (!photo) {
          photo = successData.data.sizes.size.pop()
        }
        callback(photo.source)
      }, function (errorResult) {
        console.log(errorResult)
      })
    }
  },
  mounted () {
    console.log('mounted')
    var vm = this
    // console.log(AFRAME.version)
    console.log(AFRAME)
    if (typeof (AFRAME.components['toy-color']) !== 'undefined') {
      console.log('plane already defined!')
      return
    } else {
      console.log('pane not already defined!')
    }
    AFRAME.registerComponent('toy-color', {
      init: function () {
        this.el.setAttribute('material', 'color:white')
      }
    })
    AFRAME.registerComponent('check-in', {
      init: function () {
        // const COLORS = ['red', 'green', 'blue']
        this.el.addEventListener('click', function () {
          if (vm.loading) {
            return
          }
          var aframeEl = this
          // const randomIndex = Math.floor(Math.random() * COLORS.length)
          this.setAttribute('material', 'color', '#00A8E8')
          vm.$parent.checkIn()
          vm.switchPhoto(function () {
            vm.changePosition()
            aframeEl.setAttribute('material', 'color', vm.loc.color)
          })
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  #vr{
    position: absolute;
    top:0; left: 0;
    height:100vh;
    overflow: hidden;
    width:100%;
    transition:transform 500ms;
  }

  #firstCheckInModal{
    position: absolute;
    width:100vw; height:100vh;
    top:0; left:0;
    display: flex;
    align-items:center;
    justify-content:center;
    > .inner {
      background: white;
      box-shadow:0 0 6px rgba(0,0,0,.25);
      padding:2rem;
      //max-width:20em;
      > h2{
        margin-bottom: 1em;
      }
      .swatch{
        width:1em; height:1em;
        display:inline-block;
      }
    }
  }
</style>