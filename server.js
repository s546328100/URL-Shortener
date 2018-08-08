const Koa = require('koa');
const router = require('koa-router')();
const ejs = require('koa-ejs');

const shortener = require('./controllers/shortener');

let port = process.argv[2] || 3002;

const app = new Koa();

ejs(app, {
    root: `${__dirname}/views`,
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
});

app.use(router.routes());

router.get('/', async ctx => {
    return await ctx.render('index', {host: ctx.origin});
});

router.get('/new/*', shortener.addShortUrl);

router.get('/*', shortener.getShortUrl);

app.listen(port, () => {
    console.log('listen to port: %s', port);
});

process.on('uncaughtException', function(err) {
    try {
        console.log(err);
    } catch (e) {
        console.log('uncaughtException:', e);
    }
});