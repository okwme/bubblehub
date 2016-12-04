<template>
  <div id="app" :data-view="viewing">
    
    <div v-if='error'>{{error}}</div>
    <div v-else>
        
        <VR v-if="vrOn" :loc="loc" :checkInWatch='checkInWatch'></VR>
        <!-- ui -->
        <a v-show="loc && viewing=='home'" id='showChat' @click='view("chat")' class="ui-btn">
          <img src="/static/icons/chat.svg">
        </a>
        <a id="showMyProfile" v-show="viewing=='home'" @click='showProfile()' class="ui-btn">
          <img src="/static/icons/profile.svg">
        </a>
        <a id="showLocLog" v-show="loc && viewing=='home'"  @click="view('log')" class="ui-btn">
          <img src="/static/icons/log.svg">
        </a>
        <a id="backHome" v-show="viewing!=='home'" @click='view("home")' class="ui-btn">
          <svg class="nc-icon outline" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32"> <polyline fill="none" stroke="black" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points="9,2 23,16 9,30 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline> </svg>
        </a>

        <div v-if="!loc" id="loading" class="watermark">
          <h1>Loading</h1>
        </div>

      <chat 
          v-if='loc'
          v-bind:loc='loc'
          v-bind:user='user'
          v-bind:chats='chats'
          v-bind:chatVisible='chatVisible'></chat>

      <profile v-if='me' :profileVisible="profileVisible" :locs='locs' :user='profileUser'></profile>
      <location v-if='loc' :loc="loc" :users='users'></location>

      <div id="message" ref="message" :class="[{'visible': message.visible}, 'modal']">{{ message.text }}</div>

    </div> <!-- endif -->
  </div> <!-- #app -->
</template>

<script>
import firebase from './firebase'
const db = firebase.database()
import Chat from './components/Chat'
import VR from './components/VR'
import sampleCities from './sampleCities'
import Profile from './components/Profile'
import Location from './components/Location'

export default {
  name: 'app',
  components: {
    VR,
    Chat,
    Profile,
    Location
  },
  data () {
    return {
      profileId: false,
      checkInWatch: false,
      viewing: 'home',
      vrOn: true,
      spoof: false,
      sampleCities: sampleCities,
      defaultPhoto: '',
      // radius: 20,
      chatVisible: false,
      profileVisible: false,
      greetingVisible: true,
      message: {
        visible: false,
        text: '',
        hideTimeout: null
      },
      locKey: false,
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
    locs: db.ref('locs'),
    users: db.ref('users'),
    allChats: db.ref('chats')
    // chats: db.ref('chats/main')
    // user: firebase.auth().currentUser
  },
  computed: {
    profileUser () {
      var vm = this
      var index = this.users.findIndex(function (user) {
        return user['.key'] === vm.profileId
      })
      return index < 0 ? this.me : this.users[index]
    },
    radius () {
      return this.loc.type === 'airport' ? 20 : 32
    },
    me () {
      var vm = this
      var meID = this.users.findIndex(function (user) {
        return user.id === vm.user.uid
      })
      if (meID < 0 && this.user) {
        return this.createMe()
        // return me
      } else {
        return this.users[meID]
      }
    }
  },
  watch: {
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
    },
    locs () {
      this.checkReady()
    },
    users () {
      this.checkReady()
    }
  },
  mounted () {
    var vm = this
    this.getLocation()
    this.getAirports()
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously().catch(error => {
          console.error('Failed to authenticate with Firebase', error)
        })
      } else {
        console.log('success!')
        vm.user = firebase.auth().currentUser
        if (!this.me) {
          this.createMe()
        }
        this.profileId = this.me['.key']
      }
    })
  },
  methods: {
    createMe () {
      var me = {
        username: this.user.displayName,
        id: this.user.uid,
        locs: {
          airports: [],
          stations: []
        }
      }
      this.$firebaseRefs.users.push(me)
      return me
    },
    view: function (a = 'home') {
      this.viewing = a === this.viewing ? 'home' : a
    },
    showProfile: function (bool = true) {
      this.profileVisible = bool
    },
    showMessage: function (text = '', hideAfter = 2000) {
      clearTimeout(this.message.hideTimeout)
      this.message.visible = true
      this.message.text = text
      const vm = this
      this.message.hideTimeout = setTimeout(function () { vm.message.visible = false }, hideAfter)
    },
    showGreeting: function (bool = true) {
      this.greetingVisible = bool
      const vm = this
      setTimeout(function () { vm.greetingVisible = false }, 4000)
    },
    getUserIndex () {
      var vm = this
      var index = this.users.findIndex(function (user) {
        return user.id === vm.user.uid
      })
      return index
    },
    getUserKey () {
      var index = this.getUserIndex()
      if (index > -1) {
        return this.users[index]['.key']
      } else {
        return false
      }
    },
    isset (thing) {
      return typeof (thing) !== 'undefined'
    },
    checkedIn () {
      var vm = this
      // var userKey = this.getUserKey()
      // var userIndex = this.getUserIndex()

      // var checkedIn = db.ref('users/' + userKey).once('value').then(function (snapshot) {
      //   console.log(snapshot.val())
      //   var user = snapshot.val()
        // + '/locs/' + this.loc.type + '/' + this.loc['.key']
      if (this.isset(this.me.locs) && this.isset(this.me.locs[this.loc.type])) {
        var index = this.me.locs[this.loc.type].findIndex(function (locID) {
          return locID === vm.loc['.key']
        })
        return index > -1
      } else {
        return false
      }
      // })
    },
    checkIn () {
      var userKey = this.getUserKey()
      // var userIndex = this.getUserIndex()
      if (!userKey) {
        console.log('no user yet')
        return
      }
      if (this.checkedIn()) {
        console.log('already checked in')
        return
      }

      var meCopy = JSON.parse(JSON.stringify(this.me))
      if (!this.isset(meCopy.locs)) {
        meCopy.locs = []
      }
      if (!this.isset(meCopy.locs[this.loc.type])) {
        meCopy.locs[this.loc.type] = []
      }
      meCopy.locs[this.loc.type].push(this.loc['.key'])
      delete meCopy['.key']
      db.ref('users/' + userKey).set(meCopy)

      var locCopy = JSON.parse(JSON.stringify(this.loc))
      if (!this.isset(locCopy.users)) {
        locCopy.users = []
      }
      locCopy.users.push(userKey)
      delete locCopy['.key']
      db.ref('locs/' + this.loc['.key']).set(locCopy)
      this.checkInWatch = true
      // updates[key + '/username'] = vm.username
      // this.$parent.$firebaseRefs.users.update(updates)
      // console.log(userKey)
      // console.log(userIndex)
      // console.log(this.users)
      // console.log(this.users[userIndex])
      // if (typeof (this.users[userIndex].locs) === 'undefined') {
      //   console.log(this.$firebaseRefs.users[userKey])
      //   var updates = {}
      //   var foo = {}
      //   foo[this.loc.type] = []
      //   foo[this.loc.type].push(this.loc['.key'])
      //   updates[userKey + '/locs'] = foo
      //   this.$firebaseRefs.users.update(updates)
      // } else if (typeof (this.users[userIndex].locs[this.loc.type]) === 'undefined') {
      //   updates = {}
      //   foo = {}
      //   updates[userKey + '/locs/' + this.loc.type] = [this.loc['.key']]
      //   this.$firebaseRefs.users.update(updates)
      // } else {
      //   updates = {}
      //   console.log(this.users[userIndex].locs)
      //   updates[userKey + '/locs/' + this.loc.type] = this.users[userIndex].locs[this.loc.type].push(this.loc['.key'])
      //   this.$firebaseRefs.users.update(updates)
      //   // console.log(this.$firebaseRefs.users.child(userKey))
      //   // this.$firebaseRefs.users.child(userKey).locs[this.loc.type].push(this.loc['.key'])
      // }
      // if (!this.checkedIn()) {
      //   console.log('checked in!')
      // } else {
      //   console.log('already checked in!')
      // }
    },
    getPhoto (loc, callback = function () {}) {
      console.log('get photo')
      this.$http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9f9dc34361fdef233d4309c30176d8dd&sort=interestingness-desc&group_id=44671723%40N00&lat=' + loc.latitude + '&lon=' + loc.longitude + '&radius=' + this.radius + '&format=json&extras=url_k&nojsoncallback=1').then(function (successResult) {
        if (successResult.data.photos.photo.length === 0) {
          callback(this.defaultPhoto)
        } else {
          var photos = successResult.data.photos.photo
          callback(photos)
        }
      }, function (errorResult) {
        console.log(errorResult)
      })
    },
    generateColor (str) {
      var hash = 0
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      var colour = '#'
      for (i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2)
      }
      return colour
    },
    makeLoc (loc) {
      var vm = this
      this.getPhoto(loc, function (photos = []) {
        var newLoc = {
          type: loc.type,
          key: vm.locSlug,
          slug: vm.locSlug,
          name: loc.name,
          lat: loc.latitude,
          long: loc.longitude,
          country_code: loc.country_code,
          color: vm.generateColor(vm.locSlug),
          photos: photos,
          entities: [],
          users: []
        }
        vm.locKey = vm.$firebaseRefs.locs.push(newLoc).key
        vm.loc = vm.findLoc()
      })
    },
    findLoc () {
      var vm = this
      var index = this.locs.findIndex(function (item) {
        return item.slug === vm.locSlug
      })
      return index > -1 ? this.locs[index] : false
    },
    checkReady () {
      if (this.airports.length > 0 && this.user && this.long && !this.checkingReady && this.locs.length > 0 && this.users.length > 0) {
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
    bindToLoc (loc) {
      console.log('bind to loc')
      this.locSlug = this.slugify(loc.name)
      this.loc = this.findLoc()
      if (!this.loc) {
        this.makeLoc(loc)
      }
      this.$bindAsArray('chats', db.ref('chats/' + this.locSlug))
    },
    findMe () {
      var vm = this
      var myLocId = this.airports.findIndex(function (item) {
        return vm.distanceBetween(vm.lat, vm.long, item.latitude, item.longitude) < 1
      })
      if (myLocId > -1) {
        var loc = this.airports[myLocId]
        loc.type = 'airport'
        this.bindToLoc(loc)
      } else {
        this.getStations(function () {
          console.log('stations ended')
          myLocId = vm.stations.findIndex(function (item) {
            return vm.distanceBetween(vm.lat, vm.long, item.latitude, item.longitude) < 1
          })
          if (myLocId > -1) {
            loc = vm.stations[myLocId]
            loc.type = 'station'
            vm.bindToLoc(loc)
          } else {
            vm.error = 'Sorry, Not close enough to a point of interest : ('
          }
        })
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
    getStations (callback = function () {}) {
      var vm = this
      var options = {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'ab16_flyking_club:98NWKlHUzTgb18XYMn3qG4CuOcfR7IkL'
        }
      }
      this.$http.get('https://xap.ix-io.net/api/v1/distribusion/stations?fields%5Bstations%5D=iata_code%2Ctime_zone%2Ccountry_code%2Ccity_name%2Clongitude%2Clatitude%2Cname%2Cx_id&sort=x_id&page%5Bnumber%5D=1&page%5Bsize%5D=10000', options).then(function (successResult) {
        vm.stations = successResult.data.stations
        callback()
      }, function (errorResult) {
        console.log(errorResult)
      })
    },
    getLocation () {
      var vm = this
      if (this.spoof) {
        var index = this.sampleCities.findIndex(function (city) {
          return city.name === vm.spoof
        })
        if (index > -1) {
          vm.lat = this.sampleCities[index].lat
          vm.long = this.sampleCities[index].long
        }
      } else {
        navigator.geolocation.getCurrentPosition(function (position) {
          if (position.coords) {
            vm.lat = position.coords.latitude
            vm.long = position.coords.longitude
          } else {
            vm.getIPLocation()
          }
        }, function (errorResult) {
          vm.getIPLocation()
        })
      }
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
  &, &:after, &:before{
    margin:0; padding:0;
    box-sizing: border-box;
  }
}

html{
  font-size:12px;
}
body{
  padding:0;
  margin:0;
  background-color:#00A8E8;
  font-size:16px;
  line-height: normal;
}
.h1{
  font-size:2.5em;
  font-weight: bolder;
}
.h2{
  font-size:1.75em;
  font-weight: bolder;
}
.h3{
  font-size:1.25em;
  font-weight: bolder;
}

#app {

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #00BFFF;
  height: 100%;

  &[data-view="chat"]{
    #chat{
      transform:translateX(0);
    }
    #vr,#log{
      transform:translateX(100%)
    }
  }

  &[data-view="log"]{
    #chat,#vr{
      transform:translateX(-100%)
    }
    #log{
      transform:translateX(0)
    }
  }

  &[data-view="profile"]{
    #profile{
      transform:translateY(0)
    }
  }
}

// ui
.ui-btn{
  padding:1rem;
  position:fixed;
  z-index:2;
  cursor: pointer;
  top:1rem;
  img{
    width:32px;
  }
}

#showChat{
  left:.5rem;
}
#showLocLog{
  right:.5rem;
}
#showMyProfile{
  top:auto;
  bottom:.5rem;
  left:50%;
  margin-left: calc(-1rem - 16px);
}
#backHome{
  [data-view="chat"] &{
    right:0;
  }
  [data-view="log"] &{
    left:0;
    transform:rotate(180deg);
    svg *{
      stroke:white;
    }
  }
}

.watermark{
  user-select:none;
  position:fixed;
  transition: margin 500ms ease;
  margin-top: 12.5vh;
  &.set {
    margin-top: 2rem;
  }
  width:100%;
  color:rgba(255,255,255,.45);
}
.swatch{
  width:44px;
  height:44px;
  display:inline-block;
}
#greeting{
  z-index:1;

}
#loading{
  z-index: 1;
  animation: pulse 2s infinite;
}
@keyframes pulse{
  0%{ opacity:1; }
  50%{ opacity:0 }
  100%{ opacity: 1}
}

// message
#message{
  position:fixed;
  bottom:0; left:0; width:100%;
  padding:1em 1rem;
  box-shadow:0 -1px 4px rgba(0,0,0,.25);
  background:white;
}

// helper classes
.profile-header{
  min-height:50vh;
  padding:1em 1rem 1em;
  display: flex;
  align-items:center;
  justify-content: center;
  flex-wrap:wrap;
}
.tt-cap{
  text-transform: capitalize;
}

.modal{
  transition: opacity 400ms, transform 400ms, visibility 0s 409ms;
  z-index:50;
  opacity:0;
  visibility: hidden;
  transform:translateY(1em);
  &.visible{
    visibility: visible;
    opacity:1;
    transform:none;
    transition:opacity 400ms, transform 400ms, visibility 0s 0s;
  }
}
</style>
