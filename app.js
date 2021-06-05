if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}

const express=require('express');
const mongoose=require('mongoose');
const ejsMate = require('ejs-mate');
const path=require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError=require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet');
const MongoDBStore = require("connect-mongo");


const userRoutes=require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//CONNECT OT DATABASE
const MONGOURI=process.env.MONGO_URI;
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//START APP
const app=express();

//SET TEMPLATE ENGINE
app.engine('ejs', ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

//SESSIONS & FLASH PASSPORT
/*const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = new MongoDBStore({
    url: MONGOURI,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})*/
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionConfig={
    store: MongoDBStore.create({
        mongoUrl: process.env.MONGO_URI  //(URI FROM.env file)
      }),
    name:'amit',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() +1000*60*60*24*7,
        maxAge:Date.now() +1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/devcacmp/", //*SHOULD MATCH CLOUDINARY ACCOUNT! (DATABSE NAME)
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());//use it before local sesison
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//LOCAL SESSION STORAGE(all requests/templates have access to this directly by name)
//, it is only available to the view(s) rendered during that request/response cycle
app.use((req, res, next) => {//do it before routes
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser=req.user;//from pasport;
    next();
})

//ROUTES
app.use('/',userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/',(req,res)=>{
    res.render('home');
})

//ERROR HANDLING

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{
  if(!err.statusCode)
  err.statusCode=500;
  if(!err.message)
  err.message="OOOPS!! Something went wrong";
  res.status(err.statusCode).render('error',{err});
})
//START SERVER
app.listen(3000,()=>{
    console.log('Server :Hello ! Serving on Port 3000');
})












/*
'/rout/:id' should be defined after 'rout/new' bcoz otherwise express will treat new as a id and we'll get 
stucked at button point/or on that page bcoz no such id exists
*/ 