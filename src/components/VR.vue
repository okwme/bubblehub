<template>
  <div id="vr">
    <div id="greeting" v-if='loc' class="watermark" >
      <h1>{{loc.name}}, {{loc.country_code}} <span class='swatch' :style="{'background-color' : loc.color}">&nbsp;</span></h1>
      <h2><a style='cursor:pointer;' @click.prevent='switchClick()'>See New Hub</a></h2>
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
      <a-entity position="0 2.2 4">
    <a-entity camera look-controls wasd-controls>
      <a-entity v-if='loc' position="0 0 -3"
                geometry="primitive: ring; radiusOuter: 0.30;
                          radiusInner: 0.20;"
                material="color: cyan; shader: flat"
                cursor="maxDistance: 30; fuse: true">
        <a-animation begin="click" easing="ease-in" attribute="scale"
             fill="backwards" from="0.1 0.1 0.1" to="1 1 1" dur="150"></a-animation>
        <a-animation begin="fusing" easing="ease-in" attribute="scale"
             fill="forwards" from="1 1 1" to="0.1 0.1 0.1" dur="1500"></a-animation>
      </a-entity>
    </a-entity>
  </a-entity>
<!-- 

      <a-entity camera="userHeight: 1.6" look-controls>
            <a-entity position="0 0 -1"
                geometry="primitive: ring; radiusOuter: 0.10;
                          radiusInner: 0.07;"
                material="color: black; "
                cursor=" fuse: true;">
        <a-animation begin="click" easing="ease-in" attribute="scale"
             fill="backwards" from="0.1 0.1 0.1" to="1 1 1" dur="150"></a-animation>
        <a-animation begin="fusing" easing="ease-in" attribute="scale"
             fill="forwards" from="1 1 1" to="0.1 0.1 0.1" dur="1500"></a-animation>
      </a-entity>
      </a-entity> -->
      <!-- Background / loc.photo -->
      <a-sky :src="photo"></a-sky>
    </a-scene>

    <!-- modal -->
    <div id="firstCheckInModal" @click='checkInPopup = false; first = false' :class="[{'visible':(checkInPopup && loc)}, 'modal']">
      <div v-if='first && loc' class="inner">
        <h2 class="h3"> Welcome to<br> {{loc.name}}!</h2>
        <span class="swatch" :style="{backgroundColor:loc.color}"></span> is the color of this Hub!<br><br>
        Focus & Click on the {{loc.type === 'airport' ? 'Paper Plane' : 'Wheel'}} to see a new Bubble.<br>Refresh the page to see a new Hub.<br><br>
        (Click anywhere to close this popup)
      </div>
      <div v-else class="inner">
        <h2 class="h3">You checked-in to<br> {{loc.name}}!</h2>
        <span class="swatch" :style="{backgroundColor:loc.color}"></span> was added to your profile!<br><br>
        Search for the {{loc.type === 'airport' ? 'Paper Plane' : 'Wheel'}} and click again for a new Bubble.
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
      clickListener: false,
      checkInPopup: true,
      first: true,
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
    checkInWatch (val) {
      this.checkInPopup = val
      if (val) {
        setTimeout(function () { this.checkInPopup = false }, 4000)
      }
    },
    loc (newloc) {
      console.log('WATCH: loc changed')
      console.log(newloc)
      if (newloc && newloc.photos && newloc.photos.length > 0) {
        console.log('switch ')
        this.switchPhoto()
        document.getElementById('toy').setAttribute('material', 'color', newloc.color)
        this.$parent.showGreeting()
      }
    }
  },
  methods: {
    switchClick () {
      // console.log('switch click clicked')
      this.photo = ''
      this.$parent.switchCities()
    },
    rand () {
      var foo = Math.floor(Math.random() * 12) - 6
      return foo < 2 && foo > 0 ? 2 : foo > -2 && foo < 0 ? -2 : foo
    },
    changePosition () {
      this.planePosition = this.rand() + ' ' + this.rand() + ' ' + this.rand()
    },
    switchPhoto (callback = function () {}) {
      // console.log('switch photo')
      var vm = this
      vm.loading = true
      // var topAmount = this.loc.photos.length > this.topAmount ? this.loc.photos.length - 1 : this.topAmount
      var photoId = this.loc.photos[Math.floor(Math.random() * this.loc.photos.length)].id
      if (photoId === this.currentPhotoId) {
        this.switchPhoto()
      } else {
        this.getFlick(photoId, function (url) {
          // console.log('get flick')
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
        // console.log(errorResult)
      })
    }
  },
  mounted () {
    var vm = this
    // console.log(AFRAME.version)
    // console.log(AFRAME)
    if (typeof (AFRAME.components['toy-color']) !== 'undefined') {
      // console.log('plane already defined!')
      return
    } else {
      // console.log('pane not already defined!')
    }
    AFRAME.registerComponent('toy-color', {
      init: function () {
        this.el.setAttribute('material', 'color:white')
      }
    })
    AFRAME.registerComponent('check-in', {
      init: function () {
        // const COLORS = ['red', 'green', 'blue']
        if (!vm.clickListener) {
          // console.log('ADD EVENT LISTENER')
          vm.clickListener = this.el.addEventListener('click', function () {
            // console.log('AIRPLANE WAS CLICKED')
            if (vm.loading) {
              // console.log('still loading return false')
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