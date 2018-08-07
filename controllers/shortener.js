const cumulative = require('../util/cumulative');
const mongo = require('../util/mongo');
const {http_get, https_get} = require('../util/http');

exports.addShortUrl = async ctx => {
    let url = ctx.url;
    url = url.replace(/(\/new\/)?/, '');

    let strRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

    if (!strRegex.test(url)) {
        return (ctx.body = {
            error: 'URL illegal'
        });
    }

    if (url.split('https').length > 1) {
        let cUrl = await https_get(url).catch(e => e);
        if (cUrl && cUrl.error) return (ctx.body = cUrl); 
    } else {
        let cUrl = await http_get(url).catch(e => e);
        if (cUrl && cUrl.error) return (ctx.body = cUrl);
    }

    let oUrl = await mongo.findOne('Url_Shortener', {original_url: url}, {_id: 0});
    if (oUrl) return (ctx.body = oUrl);

    let current = await mongo.findOne('USN_Currnet', {});
    let short = cumulative(current.current);

    await mongo.update('USN_Currnet', {_id: mongo.id(current._id)}, {current: short});

    let doc = {
        original_url: url,
        short_url: `${ctx.origin}/${short}`
    };

    let result = await mongo.insert('Url_Shortener', doc);
    delete result._id;
    ctx.body = result;
};

exports.getShortUrl = async ctx => {
    if (ctx.url === '/favicon.ico') return;

    let url = ctx.href;

    let info = await mongo.findOne('Url_Shortener', {short_url: url}, {_id: 0});
    if (info) ctx.redirect(info.original_url);
    else
        ctx.body = {
            error: 'No short url found for given input'
        };
};
