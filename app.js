if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express                          = require('express'),
      app                              = express(),
      mongoSanitize                    = require('express-mongo-sanitize'),
      ejsMate                          = require('ejs-mate'),
      path                             = require('path'),
      methodOverride                   = require('method-override'),
      mongoose                         = require('mongoose'),
      ExpressError                     = require('./utils/ExpressError'),
      campgroundsRoutes                = require('./routes/campgrounds'),
      reviewsRoutes                    = require('./routes/reviews'),
      usersRoutes                      = require('./routes/users'),
      testsRoutes                      = require('./routes/test'),
      session                          = require('express-session'),
      MongoStore                       = require('connect-mongo')
      flash                            = require('connect-flash'),
      passport                         = require('passport'),
      LocalPassportStrategy            = require('passport-local'),
      User                             = require('./models/user');

const uri = `mongodb+srv://${process.env.MONGOOSE_USERNAME}:${process.env.MONGOOSE_PASSWORD}@yelp-camp-cluster.y85puow.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri);
//mongoose.connect('mongodb://localhost:27017/yelp-camp', {});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    console.log('Connection Opened!');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.use(mongoSanitize());

const oneWeek = 1000 * 60 * 60 * 24 * 7;
//Session
const sessionConfig = {
    name: 'session', //overrides default name, makes it more annoying to hackers
    secret: 'temp-secret',
    store: MongoStore.create({
        mongoUrl: uri,
        secret: 'temp-secret',
        touchAfter: 24 * 60 * 60
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly         : true,
        expires          : Date.now() + oneWeek,
        maxAge           : oneWeek
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize()); //enables persistant sign in
app.use(passport.session());
passport.use(new LocalPassportStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((request, response, next) => {
    response.locals.currentUser = request.user;
    response.locals.success = request.flash('success');
    response.locals.error = request.flash('error');
    next();
});


//Endpoints

app.use('/', usersRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/tests', testsRoutes);

app.get('/', (request, response) => {
    response.render('home');
});

app.all('*', (request, response, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((error, request, response, next) => {
    const { statusCode = 500} = error;
    if (!error.message) error.message = 'Something went wrong!';
    response.status(statusCode).render('errors', {error});
});

app.listen(3000, () => {

});