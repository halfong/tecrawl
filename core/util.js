// @todo 精简到 /core/util.js
module.exports = {
    
    arrayObject : {
        unique : ( arr , key ) => {
            const exists = []
            return arr.filter( i => {
                if( exists.indexOf( i[key] ) > - 1  ) return false
                exists.push( i.title )
                return true
            })
        }
    },

    getEve( delta_day = 0 ){
        const dms = 3600*24*100
        var time = new Date().getTime()
    
        if( delta_day !=0 ) time += 24*3600*1000*delta_day
    
        return new Date( Math.floor( time/dms ) * dms )
    },

    /**
     * 删除头尾的空白字符串
     */
    trimS(str){
        return str.replace(/\s+([\S ]+)\s*/g, "$1")
    },

    /**
     * 格式化日期
     */
    formatDate : function( date , format = '$M月$d日' ){
        var map_Mzh = ['未知','一','二','三','四','五','六','七','八','九','十','十一','十二' ];
        var map_wdzh = ['日','一','二','三','四','五','六']
        var map = [
            { key : '$Y', value : date.getFullYear() },  //年
            { key : '$M@zh', value : map_Mzh[ date.getMonth() + 1 ] }, //月：中文
            { key : '$M', value : date.getMonth()+1 },   //月
            { key : '$dd', value : date.getDate() < 10 ? ( '0'+ date.getDate() ) : ( date.getDate() ) }, //日期 前导0
            { key : '$d', value : date.getDate() },  //日期
            { key : '$wd@zh', value : map_wdzh[date.getDay()] },  //周几：中文
            { key : '$H', value : date.getHours() }, //时
            { key : '$m', value : date.getMinutes() }, //分
            { key : '$s', value : date.getSeconds() },   //秒
        ];
        map.forEach(function(i){
            format = format.replace( i.key, i.value );
        });
        return format;
    },
    
    /**
     * 从human time还原为实际Date
     * @param (string) human time
     * @param (Date) 捕获时间
     * @return Date() || human time
     */
    reDate(time, crawled_at ){
        if( !time || typeof time != 'string' ) return time
        
        const at = new Date(crawled_at).getTime()
        const date = new Date()

        if( time.match(/(\d+)分钟前/) ){
            date.setTime( at - parseInt( time.match(/(\d+)分钟前/)[1] )*60*1000 )
            date.setSeconds(0)
        }
        else if( time.match(/(\d+)小时前/) ){
            date.setTime( at - parseInt( time.match(/(\d+)小时前/)[1] )*3600*1000 )
            date.setMinutes(0)
            date.setSeconds(0)
        }
        else if( time.match(/(\d+)天前/) ){
            date.setTime( at - parseInt( time.match(/(\d+)天前/)[1] )*3600*24*1000 )
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
        }
        else if( time.match(/^昨天\s*(\d+?):(\d+?)$/) ){
            const [match, h , min ] = time.match(/^昨天\s*(\d+?):(\d+?)$/)
            date.setTime( at - 3600*24*1000 )
            date.setHours(h)
            date.setMinutes(min)
            date.setSeconds(0)
        }
        else if( time.match(/^前天\s*(\d+?):(\d+?)$/) ){
            const [match, h , min ] = time.match(/^前天\s*(\d+?):(\d+?)$/)
            date.setTime( at - 3600*24*1000*2 )
            date.setHours(h)
            date.setMinutes(min)
            date.setSeconds(0)
        }
        else if( time.match(/(\d+)-(\d+)-(\d{2})/) ){
            if( time.match(/(\d+)-(\d+)-(\d{2})\s*(\d{2}):(\d{2})/) ){
                const [ match, y, m, d, h, min ] = time.match(/(\d+)-(\d+)-(\d{2})\s*(\d{2}):(\d{2})/)
                date.setFullYear( y, m -1 , d )
                date.setHours(h)
                date.setMinutes(min)
                date.setSeconds(0)
            }else{
                const [ match, y, m, d ] = time.match(/(\d+)-(\d+)-(\d{2})/)
                date.setFullYear( y, m -1 , d )
                date.setHours(0)
                date.setMinutes(0)
                date.setSeconds(0)
            }
        }
        else if( time.match(/(\d+)年(\d+)月(\d+)日/) ){
            const [ match, y, m, d ] = time.match(/(\d+)年(\d+)月(\d+)日/)
            date.setFullYear( y, m -1 , d )
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
        }
        else return time
        return date
    },
    
}