<template>
  <div id="vr">
    <a-scene id="scene" ref="scene">
      <!-- assets -->
      <!--<a-assets>-->
        <!--<img id="highlight1" src="../assets/radial-highlight.png">-->
        <!--<img id="starrysky" src="../assets/starrysky.jpg">-->
      <!--</a-assets>-->

      <!-- Ground Highlight -->
      <!--<a-image position="0 -.2 5" src="#highlight1" rotation="-90 0 0" scale="30 30 30"></a-image>-->

      <!-- Objects -->

      <!-- Orange -->
      <a-entity position="0 0 -20" visible="true">
        <a-sphere position="0 4.2 0" radius="4.2" color="#F16745" roughness="0.8" width-segments="52" height-segments="52"></a-sphere>
      </a-entity>
      <!-- Green -->
      <a-entity position="4 0 0" visible="true">
        <a-sphere position="0 1.75 0" radius="1.75" color="#7BC8A4" roughness="0.2"></a-sphere>
      </a-entity>

      <!-- Background -->
      <a-sky :color="roominfo"></a-sky>

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
      bgcolor: false
      entities:[],
      roominfo: false
    }
  },
  methods (){
    populateRoom: function () {
      this.entities = loc.entities
    }
  }
  watch () {
    loc: function () {
      this.populateRoom()
    }
  }
  created () {
    this.current = this.room
    console.log(AFRAME.version)
  }
}
</script>

<style type="sass">
  
</style>