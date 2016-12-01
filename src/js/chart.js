window.onload = function () {
  var socket = io('http://localhost:3000');
  var sysInfo,
      Uptime = [],
      Times = [],
      LoadAverage,
      Tasks,
      Mems = [],
      Swaps = [],
      CachedMems = [];
  // cpu chart
  var us = [],
      sy = [],
      ni = [],
      id = [],
      wa = [],
      hi = [],
      si = [],
      st = [];
  var cpuChart = echarts.init(document.getElementById('cpu-chart'));
  var cpuOption = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            params = params[0];
            // var date = new Date(params.name);
            return params;
        },
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data:['us','sy','ni','id','wa','hi','si','st']
    },
    xAxis : [
        {
            type : 'time',
            boundaryGap : false,
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'us',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: us
        },
        {
            name:'sy',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: sy
        },
        {
            name:'ni',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: ni
        },
        {
            name:'id',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: id
        },
        {
            name:'wa',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: wa
        },
        {
            name:'hi',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: hi
        },
        {
            name:'si',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: si
        },
        {
            name:'st',
            type:'line',
            stack: '总量',
            showSymbol: false,
            hoverAnimation: false,
            data: st
        },
    ]
  };

  function parseCpu(data) {
    us.push(data[0]);
    sy.push(data[1]);
    ni.push(data[2]);
    id.push(data[3]);
    wa.push(data[4]);
    hi.push(data[5]);
    si.push(data[6]);
    st.push(data[7]);
    cpuChart.setOption({
      series : [
          {
              data: us
          },
          {
              data: sy
          },
          {
              data: ni
          },
          {
              data: id
          },
          {
              data: wa
          },
          {
              data: hi
          },
          {
              data: si
          },
          {
              data: st
          },
      ] 
    });
  }

  socket.on('sysInfo', function (data) {
    console.log(data);
    sysInfo = data.data;
    var time = sysInfo.match(/top\s\-\s(\d+\:\d+\:\d+)/)[1];
    Times.push(nowTime);
    var uptime = sysInfo.match(/up\s(\d+)\sdays,\s(\d+\:\d+)/).slice(1);
    Uptime = uptime;
    var loadaverage = sysInfo.match(/load\saverage\:\s(\d+\.\d+),\s(\d+\.\d+),\s(\d+\.\d+)/).slice(1);
    LoadAverage = loadaverage;
    var tasks = sysInfo.match(/Tasks\:\s+(\d+)\stotal,\s+(\d+)\srunning,\s+(\d+)\ssleeping,\s+(\d+)\sstopped,\s+(\d+)\szombie/).slice(1)
    Tasks = tasks;
    var cpu = sysInfo.match(/Cpu\(s\):\s+(\d+\.\d+)\sus,\s+(\d+\.\d+)\ssy,\s+(\d+\.\d+)\sni,\s+(\d+\.\d+)\sid,\s+(\d+\.\d+)\swa,\s+(\d+\.\d+)\shi,\s+(\d+\.\d+)\ssi,\s+(\d+\.\d+)\sst/).slice(1);
    parseCpu(cpu);
    var mem = sysInfo.match(/KiB\sMem\:\s+(\d+)\stotal,\s+(\d+)\sused,\s+(\d+)\sfree,\s+(\d+)\sbuffers/).slice(1);
    Mems.push(men);
    var swap = sysInfo.match(/KiB\sSwap\:\s+(\d+)\stotal,\s+(\d+)\sused,\s+(\d+)\sfree/).slice(1);
    Swaps.push(swap);
    cachedMem = sysInfo.match(/(\d+)\scached\sMem/).slice(1);
    CachedMems.push(cachedMem);

    setTimeout(function () {
      getSysInfo();
    }, 5000);
  });

  function getSysInfo() {
    socket.emit('getSysInfo', { my: 'data' });    
  }

  setTimeout(function () {
    getSysInfo();
  }, 5000);
}