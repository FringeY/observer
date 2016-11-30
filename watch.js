// 执行 top 命令获取系统信息，默认为头5行
const exec = require('child_process').exec;

const top = exec('top | head -5', {});

top.stdout.on('data', function (data) {
  console.log(data);
});

top.stderr.on('data', function (data) {
  console.log(data);
})

top.on('exit', function (code) {
  console.log('child process exited with code ' + code);
})