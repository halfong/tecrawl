## 使用限制

tecrawl是一个轻量级的抓取脚本，通常只适合抓取**无防抓策略**的**静态**网页内容。

## 使用方法

```javascript
const { Tecrawl } = require('tecrawl');
const $tec = new Tecrawl([
    {
      name : 'XXX网站',
      /**
       * 参数 queue
       * 相同HTML模板的多个url，依次抓取
       */
      queue : [
          'http://www.ctnews.com.cn/news/node_1.html',
          'http://www.ctnews.com.cn/news/node_2.html',
      ],
      /**
       * 参数 tm
       * 解析此模板的temme语法，详见temme库文档
       */
      tm :`
          li.list__item@{
              .list__img img[src=$image];
              .list__title a[href=$link]{ $title }
              .list__summary a{ $teaser }
              $source='中国旅游新闻网';
          };
      `,
      /**
       * 参数 format
       * 抓取后数据处理
       */
      format : items => items.map( i => {
          i.date = i.link.replace(/.*(\d\d\d\d-\d\d)\/(\d\d).*/,"$1-$2")
          return i
      }),
    }
    // ... 可以添加产出同类数据的多个source模板
  ]);

  // 执行抓取 => $tec.threads
  await $tec.crawl();
  console.log( '抓取结果：' , $tec.threads );

  // 便捷函数： 根据thread字段排重
  $tec.unique('title');

  // 边界函数：根据thread.date区间过滤
  $tec.dateBetween( sdate , edate );
```



## Credits

![Temme - 很有创意的js-html解析库](https://github.com/shinima/temme)
![Crawler - 耐用的nodejs-http抓取库](https://github.com/bda-research/node-crawler)
