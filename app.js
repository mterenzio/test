import 'websocket-polyfill'
import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
import express from 'express'
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import sessions from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ndk = new NDK({
  explicitRelayUrls: ["wss://relay.damus.io"],
});
var session;
await ndk.connect();
const pablo = ndk.getUser({
  npub: "npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft",
});
await pablo.fetchProfile();

const pabloFullProfile = pablo.profile;
console.log(pabloFullProfile);
const app = express();
app.use(cookieParser());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/dist/bundle.js', express.static(__dirname + '/dist/bundle.js'));
app.use(express.static('public'));
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  session=req.session;
  console.log(session.userid);
  if(session.userid){
    res.render('home', {npub: session.userid}); 
  } else {
    res.render('home'); 
  }
});
app.post('/user',(req,res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
      session=req.session;
      session.userid=req.body.username;
      console.log(req.session)
      res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
  }
  else{
      res.send('Invalid username or password');
  }
})
app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});
app.listen(1111, () => {
  console.log('listening on port 1111')
});