const request = require('request');
const cheerio = require('cheerio');

function getIp(ip) {
  try {
    return new Promise((resolve) => {
      request({
        url: `http://ip.cn/index.php?ip=${ip}`,
        headers: {
          'User-Agent': 'request'
        }
      }, (err, res, body) => {
        const $ = cheerio.load(body, {
          normalizeWhitespace: false,
          xmlMode: false,
          decodeEntities: false
        });
        const well = $('.well');
        const ip = well.find('code').eq(0).text();
        // const city = well.find('p').eq(1).text().match(/[\u4e00-\u9fa5]*\s[\u4e00-\u9fa5]*/)[0];
        const geoIP = well.find('p').eq(2).text().replace('GeoIP: ', '');
        resolve({
          ip,
          // city,
          geoIP,
        })
      });
    });
  } catch(e) {
    return '';
  }
}
module.exports = getIp;