<template>
  <div id="vr">
    <a-scene id="scene" ref="scene">
      <a-assets>
          <!--<img id="highlight1" src="../assets/radial-highlight.png">-->
          <a-asset-item id="plane-obj" src="/static/plane.obj"></a-asset-item>
          <a-asset-item id="bus-obj" src="/static/bus.obj"></a-asset-item>
      </a-assets>
      

      <!-- Ground Highlight -->
      <!--<a-image position="0 -.2 5" src="#highlight1" rotation="-90 0 0" scale="30 30 30"></a-image>-->

      <!-- Objects -->
      <a-entity toy-color check-in position="0 2 -3" obj-model="obj: #plane-obj" rotation="-3 -45 0">
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
      topAmount: 5,
      animOn: true,
      currentPhotoId: false,
      photo: 'loading.jpg'
    }
  },
  mounted () {
    this.switchPhoto()
  },
  methods: {
    switchPhoto () {
      var vm = this
      var photoId = this.loc.photos[Math.floor(Math.random() * this.topAmount)].id
      if (photoId === this.currentPhotoId) {
        this.switchPhoto()
      } else {
        this.getFlick(photoId, function (url) {
          console.log(url)
          var img = new Image()
          console.log(img)
          img.onload = function () {
            vm.photo = url
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
          console.log('coldnt find one over 2000')
          photo = successData.data.sizes.size.pop()
        }
        console.log(photo)
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
        const COLORS = ['red', 'green', 'blue']
        this.el.addEventListener('click', function () {
          const randomIndex = Math.floor(Math.random() * COLORS.length)
          this.setAttribute('material', 'color', COLORS[randomIndex])
          console.log('I was clicked!')
          vm.switchPhoto()
        })
      }
    })
  }
}
</script>

<style type="sass">
  
</style>