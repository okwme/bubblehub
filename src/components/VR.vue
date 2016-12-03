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
      <a-entity toy-color position="0 2 -3" obj-model="obj: #bus-obj" rotation="-3 -45 0">
        <a-animation attribute="rotation"
                  direction="normal"
                  dur="20000"
                  fill="reverse"
                  to="0 -45 -360"
                  easing="linear"
                  repeat="indefinite"></a-animation>
      </a-entity>

      <!-- Background -->
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
    }
  },
  created () {
    console.log(AFRAME.version)
    AFRAME.registerComponent('toy-color', {
      init: function () {
        this.el.setAttribute('material', 'color:red')
      }
    })
  }
}
</script>

<style type="sass">
  
</style>