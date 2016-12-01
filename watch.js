// 执行 top 命令获取系统信息，默认为头5行
const exec = require('child_process').exec;
const redis = require('redis');
const client = redis.createClient({detect_buffers: true});

client.on("error", function (err) {
    console.log("Error " + err);
});

const top = exec('top | head -5', {});

top.stdout.on('data', function (data) {
  client.set('sysinfo', data);
  client.get('sysinfo', function (err, reply) {
    if (err !== null) {
      console.log(err);
    } else {
      console.log(reply.toString());
    }
  });
});

top.stderr.on('data', function (data) {
  console.log(data);
})

top.on('exit', function (code) {
  client.quit();
  console.log('child process exited with code ' + code);
})