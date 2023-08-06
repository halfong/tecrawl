/**
 * 示例：抓取列表
 */
const { Tecrawl } = require('../');
const sources = require('./sources');

module.exports = ( async function(){

  const $tec = new Tecrawl({
    sources : sources
  });

  await $tec.crawl();
  console.log( '[Threads]', JSON.stringify( $tec.threads ) );

  process.exit(0);
})();