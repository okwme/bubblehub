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
      <a-sky :src="loc.photo"></a-sky>

    </a-scene>
  </div>
</template>

<script>
const AFRAME = require('aframe')
export default{
  name: 'VR',
  props: ['loc'],
  data () {
    return {
      animOn: true
    }
  },
  created () {
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
        })
      }
    })
  }
}
</script>

<style type="sass">
  
</style>