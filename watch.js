// 执行 top 命令获取系统信息，默认为头5行
const exec = require('child_process').exec;
const redis = require('redis');
const client = redis.createClient({detect_buffers: true});

client.on("error", function (err) {
    console.log("Error " + err);
});

const top = exec('top -bn 1', {});

top.stdout.on('data', function (data) {
  client.set('sysinfo', data);
});

top.stderr.on('data', function (data) {
  console.log(data);
})

top.on('exit', function (code) {
  client.quit();
  console.log('child process exited with code ' + code);
})