const Koa = require('koa');
const views = require('koa-views');
const router = require('koa-router')();

const shortener = require('./controllers/shortener');

let port = process.argv[2] || 3002;

const app = new Koa();
app.use(views(`${__dirname}/views`));
app.use(router.routes());

router.get('/new/*', shortener.addShortUrl);

router.get('/*', shortener.getShortUrl);

router.get('/', async ctx => {
    return await ctx.render('index');
});

app.listen(port, () => {
    console.log('listen to port: %s', port);
});
