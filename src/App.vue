<template>
  <div id="app">
    <!-- <VR :loc='loc'></VR> -->
    <div v-if='error'>
      {{error}}
    </div>
    <div v-else>
      <a
      v-if='loc'
      id='showChat' 
      @click.prevent='chatVisible = !chatVisible'>
        Chat {{chatVisible ? 'Close' : 'Open'}}
      </a>

      <chat 
      v-if='loc'
      v-bind:loc='loc'
      v-bind:user='user'
      v-bind:chats='chats'
      v-bind:chatVisible='chatVisible'></chat>

      <div v-if='loc'>
        <h1>
        WILKOMMEN BEI:
        </h1>
        <h2>
          {{loc.name}}, {{loc.country_code}}
        </h2>
      </div>
      <div v-else>
        <h1>Please wait while we locate you</h1>
      </div>

    </div>
  </div>
</template>

<script>
import firebase from './firebase'
const db = firebase.database()
import Chat from './components/Chat'
// import VR from './components/VR'

export default {
  name: 'app',
  components: {
    // VR,
    Chat
  },
  data () {
    return {
      chatVisible: false,
      locSlug: false,
      loc: false,
      user: false,
      long: false,
      lat: false,
      error: false,
      checkingReady: false,
      chats: [],
      airports: [],
      stations: []
    }
  },
  firebase: {
    users: db.ref('users')
    // chats: db.ref('chats/main')
    // user: firebase.auth().currentUser
  },
  computed: {
    me () {
      var vm = this
      var meID = this.users.findIndex(function (user) {
        return user.id === vm.user.uid
      })
      if (meID < 0 && this.user) {
        var me = {
          username: vm.user.displayName,
          id: vm.user.uid
        }
        this.$firebaseRefs.users.push(me)
        return me
      } else {
        return this.users[meID]
      }
    }
    // loc () {

    //   return this.locSlug &&
    //   this.loc = {
    //       slug: this.slugify(loc.name),
    //       name: loc.name,
    //       lat: loc.latitude,
    //       long: loc.longitude,
    //       country_code: loc.country_code
    //     }
    // }
  },
  watch: {
    loc () {
      console.log(this.loc)
    },
    user () {
      this.checkReady()
    },
    long () {
      this.checkReady()
    },
    airports () {
      this.checkReady()
    },
    stations () {
      this.checkReady()
    }
  },
  mounted () {
    var vm = this
    this.getLocation()
    this.getAirports()
    this.getStations()
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously().catch(error => {
          console.error('Failed to authenticate with Firebase', error)
        })
      } else {
        console.log('success!')
        vm.user = firebase.auth().currentUser
      }
    })
  },
  methods: {
    checkReady () {
      console.log('check ready')
      if (this.airports.length > 0 && this.stations.length > 0 && this.user && this.long && !this.checkingReady) {
        console.log('actually check ready')
        this.checkingReady = true
        this.findMe()
      }
    },
    distanceBetween (lat1, lon1, lat2, lon2, unit = 'K') {
      var radlat1 = Math.PI * lat1 / 180
      var radlat2 = Math.PI * lat2 / 180
      var theta = lon1 - lon2
      var radtheta = Math.PI * theta / 180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
      dist = Math.acos(dist)
      dist = dist * 180 / Math.PI
      dist = dist * 60 * 1.1515
      if (unit === 'K') { dist = dist * 1.609344 }
      if (unit === 'N') { dist = dist * 0.8684 }
      return dist
    },
    slugify (word) {
      return word.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '')             // Trim - from end of text
    },
    findMe () {
      console.log('find me')
      var vm = this
      var myLocId = this.airports.findIndex(function (item) {
        return vm.distanceBetween(vm.lat, vm.long, item.latitude, item.longitude) < 1
      })
      if (myLocId > -1) {
        var chosenList = this.airports
      } else {
        console.log('')
        myLocId = this.stations.findIndex(function (item) {
          return vm.distanceBetween(vm.lat, vm.long, item.latitude, item.longitude) < 1
        })
        chosenList = this.stations
      }
      if (myLocId < 0) {
        this.error = 'Sorry, Not close enough to a point of interest : ('
      } else {
        var loc = chosenList[myLocId]
        this.locSlug = this.slugify(loc.name)
        vm.$bindAsArray('chats', db.ref('chats/' + this.locSlug))
        vm.$bindAsObject('loc', db.ref('locs/' + this.locSlug))
      }
    },
    getAirports () {
      var vm = this
      var options = {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'ab16_flyking_club:98NWKlHUzTgb18XYMn3qG4CuOcfR7IkL'
        }
      }
      this.$http.get('https://xap.ix-io.net/api/v1/airberlin_lab_2016/airports?fields%5Bairports%5D=name%2Clongitude%2Ccountry_code%2Ccity_code%2Clatitude%2Ccode&sort=code&page%5Bnumber%5D=1&page%5Bsize%5D=10000', options).then(function (successResult) {
        vm.airports = successResult.data.airports
        var betaHaus = {
          name: 'Betahaus',
          slug: 'betahaus',
          latitude: '52.502443',
          longitude: '13.412027',
          country_code: 'DE'
        }
        vm.airports.push(betaHaus)
      }, function (errorResult) {
        console.log(errorResult)
      })
    },
    getStations () {
      var vm = this
      var options = {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'ab16_flyking_club:98NWKlHUzTgb18XYMn3qG4CuOcfR7IkL'
        }
      }
      this.$http.get('https://xap.ix-io.net/api/v1/distribusion/stations?fields%5Bstations%5D=iata_code%2Ctime_zone%2Ccountry_code%2Ccity_name%2Clongitude%2Clatitude%2Cname%2Cx_id&sort=x_id&page%5Bnumber%5D=1&page%5Bsize%5D=10000', options).then(function (successResult) {
        console.log(successResult)
        vm.stations = successResult.data.stations
      }, function (errorResult) {
        console.log(errorResult)
      })
    },
    getLocation () {
      var vm = this
      navigator.geolocation.getCurrentPosition(function (position) {
        if (position.coords) {
          vm.lat = position.coords.latitude
          vm.long = position.coords.longitude
        } else {
          vm.getIPLocation()
        }
        vm.location = position
      }, function (errorResult) {
        vm.getIPLocation()
      })
    },
    getIPLocation () {
      // var vm = this
      this.$http.get('//ip-api.com/json').then(function (success) {
        this.lat = success.data.lat
        this.long = success.data.lon
        this.findAirport()
      }, function (error) {
        console.log(error)
        this.error = 'Sorry We can\'t seem to locate you : \\'
      })
    },
    findAirport () {

    }
  }
}
</script>

<style lang="scss">
*{
  box-sizing: border-box;
}
body{
  padding:0;
  margin:0;
}
#app {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  
  #showChat{
    cursor: pointer;
    z-index:2;
    position:absolute;
    left:10px;
    top:10px;
  }

}
</style>
