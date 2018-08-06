const Koa = require('koa');
const views = require('koa-views');
const router = require('koa-router')();
const Mongo = require('./mongo');

let port = process.argv[2] || 3002;

const app = new Koa();
app.use(views(`${__dirname}/views`));
app.use(router.routes());

let mongo = new Mongo();

router.get('/new/*', async ctx => {
    let url = ctx.url;
    url = url.replace(/(\/new\/)?/, '');

    let strRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

    if (!strRegex.test(url)) {
        return (ctx.body = {
            original_url: url,
            short_url: 'http://kyun.dusuchao.xin:3002/null'
        });
    }

    let doc = {
        original_url: url,
        short_url: 'http://kyun.dusuchao.xin:3002/' 
    }
    // 存在就返回
    await mongo.connect('shortener');
    let s = await mongo.update({original_url: url}, doc);
    console.log(s);
});

router.get('/:id', async ctx => {
    let url = ctx.href;

    await mongo.connect('shortener');
    let info = await mongo.findOne({short_url: url}, {_id: 0});
    if (info) ctx.body = info;
    else
        ctx.body = {
            error: 'No short url found for given input'
        };
});

router.get('/', async ctx => {
    return await ctx.render('index');
});

app.listen(port, () => {
    console.log('listen to port: %s', port);
});
