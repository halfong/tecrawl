const Crawler = require('crawler');
const temme = require('temme').default;
const moment = require('moment');
const util = require('./util');

module.exports = class Tecrawl{

  sources = []
  threads = []

  /**
   * 创建Tecrawl
   * @param {array} sources
   * @returns 
   */
  constructor(sources = []){
    this.sources = sources
    return this;
  }

  async crawl( verbose = false ){
    for( let src of this.sources ){
      const result = await this.__fetch( src, verbose );
      this.threads = this.threads.concat( result );
    }
    this.__format();
    console.log(`Tecrawl::已抓取${this.threads.length} URL`);
  }

  async __fetch({ queue = [], tm, format = null, maxConnections = 5, rateLimit = 1000, concat = true }, verbose = false ){
    var result = []
    const c = new Crawler({
        maxConnections, //最大同时连接数
        rateLimit,   //每项任务间隔1000ms
        callback : async function (error, res, done) {
            if(error) console.log(error);
            else{
                console.log( res.request.uri.href , res.statusCode )
                var data = temme( res.body, tm )
                console.log( 'extract threads=> '+ Object.keys(data).length )
                
                format && ( data = format(data) )
                concat ? ( result = result.concat(data) ) : result.push( data )
            }
            done()
        }
    });
    queue.forEach( q => c.queue(q) )
    return new Promise( ( resolve, reject ) => {
        c.on('drain',function(){
            resolve( result )
        });
    })
  }

  __format(){
    this.threads = this.threads.sort( (a,b)=> b.date - a.date )
    this.threads.forEach( _th => {
      _th.crawled_at = new Date()
      _th.date = util.reDate( _th.date, _th.crawled_at )  //从human时间恢复为date
      Object.keys( _th ).forEach( _k => {
        if( typeof _th[_k] == 'string' ) _th[_k] = util.trimS( _th[_k] )
      })
    })
  }

  /**
   * 常用辅助方法
   */

  saveFile( saveAs ){
    console.log('还未实现')
    return this;
  }

  dateBetween( sdate, edate ){
    this.threads = this.threads.filter( i => moment(i.date).isBetween( sdate, edate ) );
    console.log(`Tecrawl::dateBetween ${sdate}-${edate} 剩余${this.threads.length}条`);
    return this;
  }

  unique( k ){
    this.threads = util.arrayObject.unique( this.threads, k );
    console.log(`Tecrawl::unique ${k} 剩余${this.threads.length}条`);
    return this;
  }

}