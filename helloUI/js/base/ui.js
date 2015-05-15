define(function(require, exports, module) {
	require("zepto");
	var UI = {},Base = {};

	UI.config = {};

  Base.eachObj = function( obj, iterator ) {
        obj && Object.keys( obj ).forEach(function( key ) {
            iterator( key, obj[ key ] );
        });
  };
  /**
     * trigger event
     * @param {type} element
     * @param {type} eventType
     * @param {type} eventData
     * @returns {_L8.$}
     */
  Base.trigger = function(element, eventType, eventData,goal) {
        element.dispatchEvent(new CustomEvent(eventType, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        }));
        return goal||this;
    };
  Base.init = function(){};
  Base.plugins = [];
  Base.initPlugins = function(){
      var self = this;
      self.plugins.forEach(function(fn){
          if ($.isFunction(fn)) {
                    fn.call(self);
                }
      });
  };
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
    return this.isTouchScreen()? "touchstart" : "mousedown"
  };

  Base.touchEnd = function(str, data){
    return this.isTouchScreen()? "touchend touchcancel touchmove" : "mouseup"
  };

  Base.log = function(str){
    console.log(str);
  };
  Base.callZepto = (function() {
            instance = $();
            instance.length = 1;

        return function( item) {
            instance[ 0 ] = item;
            return instance;
        };
    })()

  Base.stopPropagation = function(e) {
        e.stopPropagation();
    };

  UI.define = function( name, options) {
        if(UI[ name ])return UI[ name ];
         var defOpts =  {
                /**
                 * 参照对象
                 * @property {String} [ref=null]
                 */
                ref     : {}    //参照目标 
         }
        var klass = function(opts) {
            var baseOpts = $.extend(true,{},this.options);
            this.opts = $.extend(true,baseOpts, opts); 
            this.ref = $(opts.ref);
            this.initPlugins();
            this.init();
            this.trigger(this.opts.ref, 'readydom', {goal:this});
        }
        UI[ name ] = Base.extend.call(klass,Base);
        UI[ name ].prototype.options = $.extend(defOpts, options); 
        return UI[ name ];
    };


    /*
        判断是否Touch屏幕
    */
	UI.isTouchScreen = function(){
        return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    }
    /*
        判断是否存在原生插件对象
    */
    UI.isPlus = function(){
        return false;
    }


	/**
     * 解析模版tpl。当data未传入时返回编译结果函数；当某个template需要多次解析时，
     * 建议保存编译结果函数，然后调用此函数来得到结果。
     */
	UI.parseTpl = function(str, data){
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

	UI.init = function(){
	
	}();

    UI.focus = function(element) {
        if ($.os.ios) {
            setTimeout(function() {
                element.focus();
            }, 10);
        } else {
            element.focus();
        }
    };

    /**
     * trigger event
     * @param {type} element
     * @param {type} eventType
     * @param {type} eventData
     * @returns {_L8.$}
     */
    UI.trigger = function(element, eventType, eventData,goal) {
        element.dispatchEvent(new CustomEvent(eventType, {
            detail: eventData,
            bubbles: true,
            cancelable: true
        }));
        return goal||this;
    };

    /**
     * 调用此方法，可以减小重复实例化Zepto的开销。所有通过此方法调用的，都将公用一个Zepto实例
     */
    UI.callZepto = (function() {
            instance = $();
            instance.length = 1;

        return function( item) {
            instance[ 0 ] = item;
            return instance;
        };
    })();

    UI.stopPropagation = function(e) {
        e.stopPropagation();
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


    //exports
    module.exports = UI;
        /**
     *  @file 实现了通用highlight方法。
     *  @name Highlight
     *  @desc 点击高亮效果
     *  @import zepto.js
     */
    ;(function( $ ) {
        var $doc = $( document ),
            $el,    // 当前按下的元素
            timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时

        // 负责移除className.
        function dismiss() {
            var cls = $el.attr( 'hl-cls' );

            clearTimeout( timer );
            $el.removeClass( cls ).removeAttr( 'hl-cls' );
            $el = null;
            $doc.off( 'touchend touchmove touchcancel', dismiss );
        }

        /**
         * @name highlight
         * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
         * 当不传入className是，此操作将解除事件绑定。
         * 
         * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
         * @grammar  highlight(className, selector )   ⇒ self
         * @grammar  highlight(className )   ⇒ self
         * @grammar  highlight()   ⇒ self
         * @example var div = $('div');
         * div.highlight('div-hover');
         *
         * $('a').highlight();// 把所有a的自带的高亮效果去掉。
         */
        $.fn.highlight = function( className, selector ) {
            return this.each(function() {
                var $this = $( this );

                $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                        .off( 'touchstart.hl' );

                className && $this.on( 'touchstart.hl', function( e ) {
                    var match;

                    $el = selector ? (match = $( e.target ).closest( selector,
                            this )) && match.length && match : $this;

                    // selctor可能找不到元素。
                    if ( $el ) {
                        $el.attr( 'hl-cls', className );
                        timer = setTimeout( function() {
                            $el.addClass( className );
                        }, 100 );
                        $doc.on( 'touchend touchmove touchcancel', dismiss );
                    }
                } );
            });
        };
    })( Zepto );

    //     Zepto.js
    //     (c) 2010-2015 Thomas Fuchs
    //     Zepto.js may be freely distributed under the MIT license.

    ;(function($){
      function detect(ua, platform){
        var os = this.os = {}, browser = this.browser = {},
          webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
          android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
          osx = !!ua.match(/\(Macintosh\; Intel /),
          ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
          ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
          iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
          webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
          win = /Win\d{2}|Windows/.test(platform),
          wp = ua.match(/Windows Phone ([\d.]+)/),
          touchpad = webos && ua.match(/TouchPad/),
          kindle = ua.match(/Kindle\/([\d.]+)/),
          silk = ua.match(/Silk\/([\d._]+)/),
          blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
          bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
          rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
          playbook = ua.match(/PlayBook/),
          chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
          firefox = ua.match(/Firefox\/([\d.]+)/),
          firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
          ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
          webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
          safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

        // Todo: clean this up with a better OS/browser seperation:
        // - discern (more) between multiple browsers on android
        // - decide if kindle fire in silk mode is android or not
        // - Firefox on Android doesn't specify the Android version
        // - possibly devide in os, device and browser hashes

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
        if (wp) os.wp = true, os.version = wp[1]
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
        if (chrome) browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.firefox = true, browser.version = firefox[1]
        if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
        if (ie) browser.ie = true, browser.version = ie[1]
        if (safari && (osx || os.ios || win)) {
          browser.safari = true
          if (!os.ios) browser.version = safari[1]
        }
        if (webview) browser.webview = true

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
          (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
        os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
          (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
          (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
      }

      detect.call($, navigator.userAgent, navigator.platform)
      // make available to unit tests
      $.__detect = detect

    })(Zepto);

    /**
     * mui fixed requestAnimationFrame
     * @param {type} window
     * @returns {undefined}
     */
    ;(function(window) {
        if (!window.requestAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = window.webkitRequestAnimationFrame || function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
            window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function(id) {
                clearTimeout(id);
            };
        };
    }(window));

});