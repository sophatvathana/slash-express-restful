const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const routes = require('../api/routes/v1');
const { logs } = require('./vars');
const strategies = require('./passport');
const error = require('../api/middlewares/error');
const settings = require('./settings');
const i18n = require('i18n');

//locale 
let languages = settings.languages;
function setLocale(req, res, next) {
    var locale;
    //i18n
    i18n.configure({
        locales: languages, 
        register: res,
        directory: __dirname + '/locales',   
        defaultLocale: settings.lang,    
        indent: "\t"
    });

    if (req.cookies['locale']) {
        locale = req.cookies['locale'];
    }
    else if (req.acceptsLanguages()) {
        locale = req.acceptsLanguages()[0];
    }
    if (!~languages.indexOf(locale)) {
        locale = settings.lang;
    }
     
    locale = settings.lang;
     
    res.setLocale(locale);
    next();
};


/**
* Express instance
* @public
*/
const app = express();

// request logging. dev: console | production: file
// app.use(morgan(logs));
app.use(morgan('":method :url" :status :res[content-length] ":referrer" ":user-agent"'))

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie
app.use(cookieParser(settings.session_secret));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// set locale
app.use(setLocale);

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

// mount api v1 routes
app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
