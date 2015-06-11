// 下面是 seajs 的异步载入代码：
// ;(function(m, o, d, u, l, a, r) {
//   if(m[d]) return;
//   function f(n, t) { return function() { r.push(n, arguments); return t; } }
//   m[d] = a = { args: (r = []), config: f(0, a), use: f(1, a) };
//   m.define = f(2);
//   u = o.createElement('script');
//   u.id = d + 'node';
//   u.src = 'http://example.com/libs/seajs/1.0.2/sea.js';
//   l = o.getElementsByTagName('head')[0];
//   l.insertBefore(u, l.firstChild);
// })(window, document, 'seajs');

// // 下面立刻就可以调用 seajs 的方法了：
// seajs.config({
//   'base': 'http://example.com/libs/'
// });
window.onerror = function(message, url, line) {
     if (!url) return;
     var msg = {};
 
     //记录客户端环境
     msg.ua = window.navigator.userAgent;
 
     //只记录message里的message属性就好了，
     //错误信息可能会比较晦涩，有些信息完全无用，应酌情过滤
     msg.message = message;
     msg.url = url;
     msg.line = line;
     msg.page = window.location.href;
 
     var s = [];
 
     //将错误信息转换成字符串
     for(var key in msg){
          s.push(key + '=' + msg[key]);
     }
     s = s.join('----');
 
     //这里是用增加标签的方法调用日志收集接口，优点是比较简洁。
     alert(s);  
};
define(function(require, exports, module) {
	var UI = {},Base = {},$local = {},$N = window.rd;
	UI.config = {};
   /*
        判断是否存在原生插件对象
    */
  UI.plus = Base.isPlus = !!$N;

  Base.eachObj = function( obj, iterator ) {
        obj && Object.keys( obj ).forEach(function( key ) {
            iterator( key, obj[ key ] );
        });
  };
  Base.init = function(){};
  /**
  * @name extend
  * @desc 扩充现有组件
  */
  Base.extend = function( obj ) {
      var proto = this.prototype;
      Base.eachObj( obj, function( key, val ) {
          proto[ key ] = val;
      } );
      return this;
  };

  Base.parseTpl = function(str, data){
    var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                .replace( /'/g, '\\\'' )
                .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                    return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                } )
                .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                    return '\');' + code.replace( /\\'/, '\'' )
                            .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                } )
                .replace( /\r/g, '\\r' )
                .replace( /\n/g, '\\n' )
                .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

            func = new Function( 'obj', tmpl );
    
        return data ? func( data ) : func;
  };

  /*
        判断是否Touch屏幕
    */
  Base.isTouchScreen = function(){
        return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
  };

  Base.touchEve = function(str, data){
    return this.isTouchScreen()? "tap" : "mousedown"
  };

  Base.touchStart = function(str, data){
    return this.isTouchScreen()? "touchstart" : "mousedown"
  };

  Base.touchEnd = function(str, data){
    return this.isTouchScreen()? "touchend" : "mouseup"
  };

  Base.touchCancel = function(str, data){
    return this.isTouchScreen()? "touchcancel" : "mouseup"
  };

  Base.touchMove = function(str, data){
    return this.isTouchScreen()? "touchmove" : "mouseup"
  };

  Base.longTap = function(str, data){
    return this.isTouchScreen()? "longTap" : "mouseup"
  };

  Base.touchOver = function(str, data){
    return this.isTouchScreen()? "touchend touchmove" : "mouseup"
  };

  Base.log = function(str){
    console.log(str);
    return this;
  };
  Base.callZ = (function() {
            instance = $();
            instance.length = 1;

        return function( item) {
            instance[ 0 ] = item;
            return instance;
        };
    })()

  Base.stopPropagation = function(e) {
        e.stopPropagation();
        return this;
  };

  Base.preventDefault = function(e) {
        e.preventDefault();
        return this;
  };
    
 
  Base.focus = function(element) {
        if ($.os.ios) {
            setTimeout(function() {
                element.focus();
            }, 10);
        } else {
            element.focus();
        }
        return this;
    };  
  Base.back = function(id,ottions) {
        id = id||'root';
       $local.Win.backWin(id,ottions);
    }; 
  Base.openWin = function(url,id,options,type) {
       $local.Win.openWin(url,id,options,type);
    };   

  UI.define = function( name, options) {
        if(UI[ name ])return UI[ name ];
         var defOpts =  {
                /**
                 * 参照对象
                 * @property {String} [ref=null]
                 */
                ref     : null,    //参照目标 

                /**
                 * 点击回调函数
                 * @type {function}
                 */
                 callback: null
         }
        var klass = function(opts) {
            var baseOpts = $.extend(true,{},this.options);
            this.opts = $.extend(true,baseOpts, opts); 
            this.ref = $(this.opts.ref);
            this.callback = this.opts.callback;
            this.init($N);
        }
        UI[ name ] = Base.extend.call(klass,Base);
        UI[ name ].prototype.options = $.extend(defOpts, options); 
        return UI[ name ];
    };

    UI.uuid = 0;
    UI.data = {};
    /**
     * scrollTo
     */
    UI.scrollTo = function(scrollTop, duration, callback) {
        duration = duration || 1000;
        var scroll = function(duration) {
            if (duration <= 0) {
                callback && callback();
                return;
            }
            var distaince = scrollTop - window.scrollY;
            setTimeout(function() {
                window.scrollTo(0, window.scrollY + distaince / duration * 10);
                scroll(duration - 10);
            }, 16.7);
        };
        scroll(duration);
    };
    UI.animationFrame = function(cb) {
        var args, isQueued, context;
        return function() {
            args = arguments;
            context = this;
            if (!isQueued) {
                isQueued = true;
                requestAnimationFrame(function() {
                    cb.apply(context, args);
                    isQueued = false;
                });
            }
        };
    };


    /**
     * ui native window
     * @param {type} window
     * @returns {undefined}
     */
    (function($,window) {
       $.Win = {
          openWin : function(url,id,options,type){
              if(UI.plus){
                id = id||url;
                type = type||0;
                options = options||{type:$N.window.ANIMATION_TYPE_PUSH,time:150,curve:$N.window.ANIMATION_CURVE_LINEAR};
                $N.window.openWindow(id,type,url,options);
              }else{
                window.location.href=url;
              }
              return this;
            },

          backWin : function(id,options){
              if(UI.plus){
                options = options||{type:$N.window.ANIMATION_TYPE_PUSH,time:150,curve:$N.window.ANIMATION_CURVE_LINEAR};
                $N.window.backToWindow(id,options);
              }else{
                if(window.history.length > 1) {
                  window.history.back();
                }
              }
              return this;
            }  
       }
        window.$local = $;
    }($local,window));



    //exports
    module.exports = UI;

});