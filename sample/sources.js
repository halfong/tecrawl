module.exports = [
  {
    name : '公众号网页',
    concat : true,
    queue : [
        'https://mp.weixin.qq.com/s/gXq9Hf6OH_3aUmM5ifaphw',
    ],
    tm :`
        #page-content@{
          .rich_media_title{ $title }
          .rich_media_content section@paras{
            &{ $text }
          }
          .wxw-img@pics{ &[data-src=$src]; }
        }
    `,
    format : items => items.map( i => {
      return i
    }),
  }
]