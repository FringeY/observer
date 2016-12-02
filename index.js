const koa = require('koa');
const app = new koa();
const redis = require('redis');
const client = redis.createClient({detect_buffers: true});
const serve = require('koa-static');
const logger = require('koa-logger');
const views = require('koa-views');
const bluebird = require('bluebird');
const send = require('koa-send');
const getIp = require('./getIp');
bluebird.promisifyAll(redis.RedisClient.prototype);

// logger

app.use(logger());

// static

app.use(serve(__dirname + '/src'));

// response

app.use(views(__dirname + '/views', { extension: 'html' }));

app.use(async function (ctx, next){
  if ('/test.txt' == ctx.path) return ctx.body = 'Try GET /package.json';
  await send(ctx, ctx.path, { root: __dirname + '/src' });
})

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

let count = 0;
let cities = {};

io.on('connection', function (socket) {
  const socketId = socket.id;
  const clientIp = socket.request.connection.remoteAddress.slice(-15);
  let city;
  count++;
  getIp(clientIp).then(function (data) {
    cities[data.geoIP] = cities[data.geoIP] ? cities[data.geoIP] + 1 : 1;
    city = data.geoIP;
  })
  // console.log(socketId);
  // console.log(clientIp);
  
  client.getAsync('sysinfo').then(function (res) {
    socket.emit('sysInfo', { 
      data: res.toString()
    });
    socket.emit('users', {
      count: count,
      cities: JSON.stringify(cities)
    });
  });
  
  socket.on('getSysInfo', function (data) {
    client.get('sysinfo', function (err, reply) {
      if (err !== null) {
        console.log(err);
      } else {
        socket.emit('sysInfo', {
          data: reply.toString()
        });
      }
    });
  });

  socket.on('getUsers', function (data) {
    socket.emit('users', {
      count: count,
      cities: JSON.stringify(cities)
    });
  })

  socket.on('disconnect', function () {
    count--;
    if (city) {
      cities[city] = cities[city] ? cities[city] - 1 : 0;
    }
  });
});