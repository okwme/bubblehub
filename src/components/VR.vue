<template>
  <div id="vr">
    <a-scene id="scene" ref="scene">
      <a-assets>
        <!--<img id="highlight1" src="../assets/radial-highlight.png">-->
        <a-asset-item id="plane-obj" src="/static/plane.obj"></a-asset-item>
        <a-asset-item id="bus-obj" src="/static/bus.obj"></a-asset-item>
        <img id="sky-src" :src="photo">
      </a-assets>
      

      <!-- Ground Highlight -->
      <!--<a-image position="0 -.2 5" src="#highlight1" rotation="-90 0 0" scale="30 30 30"></a-image>-->

      <!-- Objects -->
      <a-entity toy-color check-in :position="planePosition" obj-model="obj: #plane-obj" rotation="-3 -45 0">
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
        <a-cursor></a-cursor>
      </a-entity>

      <!-- Background / loc.photo -->
      <a-sky :src="photo"></a-sky>

    </a-scene>
  </div>
</template>

<script>
/* global Image:true */
/* eslint no-undef: "error" */

const AFRAME = require('aframe')
export default{
  name: 'VR',
  props: ['loc'],
  data () {
    return {
      loading: true,
      topAmount: 20,
      animOn: true,
      currentPhotoId: false,
      photo: '/static/loading.png',
      planePosition: '0 3 -3'
    }
  },
  mounted () {
    // this.switchPhoto()
  },
  watch: {
    loc () {
      if (this.loc && this.loc.photos) {
        this.switchPhoto()
      }
    }
  },
  methods: {
    rand () {
      return Math.floor(Math.random() * 3)
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
      this.$http.get('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=502dd540a28d1e7ab1f2ae936dfe2538&photo_id=' + photoId + '&format=json&nojsoncallback=1').then(function (successData) {
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
  created () {
    var vm = this
    // console.log(AFRAME.version)
    AFRAME.registerComponent('toy-color', {
      init: function () {
        this.el.setAttribute('material', 'color:red')
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
          this.setAttribute('material', 'color', 'yellow')
          vm.$parent.checkIn()
          vm.switchPhoto(function () {
            vm.changePosition()
            aframeEl.setAttribute('material', 'color', 'green')
          })
        })
      }
    })
  }
}
</script>

<style type="sass">
  
</style>