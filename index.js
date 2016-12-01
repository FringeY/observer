const koa = require('koa');
const app = new koa();
const redis = require('redis');
const client = redis.createClient({detect_buffers: true});
const logger = require('koa-logger');
const views = require('koa-views');

// logger

app.use(logger());

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
  // console.log('io connect');
//   socket.emit('sysInfo', { data: `op - 23:49:41 up 19 days, 23:30,  2 users,  load average: 0.04, 0.13, 0.12
// Tasks:   1 total,   0 running,   1 sleeping,   0 stopped,   0 zombie
// %Cpu(s):  1.0 us,  0.3 sy,  0.0 ni, 98.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
// KiB Mem:   1017712 total,   808016 used,   209696 free,    19516 buffers
// KiB Swap:        0 total,        0 used,        0 free.   612860 cached Mem

//   PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
//     1 root      20   0   33464   2636   1332 S  0.0  0.3   0:16.10 init` });
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