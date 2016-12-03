<template>
  <div id="vr">
    <a-scene id="scene" ref="scene">
      <a-assets>
          <!--<img id="highlight1" src="../assets/radial-highlight.png">-->
          <a-asset-item id="plane-obj" src="/static/plane.obj"></a-asset-item>
      </a-assets>
      

      <!-- Ground Highlight -->
      <!--<a-image position="0 -.2 5" src="#highlight1" rotation="-90 0 0" scale="30 30 30"></a-image>-->

      <!-- Objects -->
      <a-entity toy-color position="0 1 -3" obj-model="obj: #plane-obj" rotation="0 -90 0"></a-entity>

      <!-- Background -->
      <a-sky color="blue"></a-sky>

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
        this.el.setAttribute('materials', 'color:red')
      }
    })
  }
}
</script>

<style type="sass">
  
</style>