// 执行 top 命令获取系统信息，默认为头5行
const exec = require('child_process').exec;
const redis = require('redis');
const client = redis.createClient({detect_buffers: true});

client.on('error', function (err) {
    console.log('Error ' + err);
});

function getSysInfo() {
  exec('top -bn2 | awk "/^top -/ { p=!p } { if (!p) print }"', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    client.set('sysinfo', stdout);
  });

  setTimeout(function () {
    getSysInfo();
  }, 5000);
}

getSysInfo();