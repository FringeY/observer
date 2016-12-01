const koa = require('koa');
const app = new koa();
const redis = require('redis');
const client = redis.createClient({detect_buffers: true});
const serve = require('koa-static');
const logger = require('koa-logger');
const views = require('koa-views');

// logger

app.use(logger());

// static

app.use(serve(__dirname + '/src'));

// response

app.use(views(__dirname + '/views', { extension: 'html' }));

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(async function (ctx, next) {
  await ctx.render('index', {});
});

const io = require('socket.io').listen(app.listen(3000));

io.on('connection', function (socket) {
  client.get('sysinfo', function (err, reply) {
    if (err !== null) {
      console.log(err);
    } else {
      socket.emit('sysInfo', { data: reply.toString() });
    }
  });
  
  socket.on('getSysInfo', function (data) {
    client.get('sysinfo', function (err, reply) {
      if (err !== null) {
        console.log(err);
      } else {
        socket.emit('sysInfo', { data: reply.toString() });
      }
    });
  });
});