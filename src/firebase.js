// .db.js
import Firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyA9UkM3yg-BnYuTeag7semcgsvmUoBEbWw',
  authDomain: 't-hack-b65ba.firebaseapp.com',
  databaseURL: 'https://t-hack-b65ba.firebaseio.com',
  storageBucket: 't-hack-b65ba.appspot.com',
  messagingSenderId: '304013214382'
}
const firebase = Firebase.initializeApp(config)
export default firebase
