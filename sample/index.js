/**
 * 示例：抓取列表
 */
const { Tecrawl } = require('../');

module.exports = ( async function(){

  const $tec = new Tecrawl({
    sources : [
      {
        name : '中国旅游新闻网',
        concat : true,
        queue : [
            'http://www.ctnews.com.cn/news/node_4.html',
        ],
        tm :`
            li.list__item@{
                .list__img img[src=$image];
                .list__title a[href=$link]{ $title }
                .list__summary a{ $teaser }
                $source='中国旅游新闻网';
            };
        `,
        format : items => items.map( i => {
            i.date = i.link.replace(/.*(\d\d\d\d-\d\d)\/(\d\d).*/,"$1-$2")
            return i
        }),
      }
    ]
  });

  await $tec.crawl();
  console.log( '[Threads]', $tec.threads );

  process.exit(0);
})();