/**
 * iscroll组件
 */
(function() {
    var CLASS_SCROLL = 'mui-scroll',
        CLASS_SCROLL_WRAPPER = 'mui-scroll-wrapper';
      // 给$.fn上挂iScroll方法
    define(function(require, exports, module) {
         var UI = require("UI");
                  require("iscroll");

        //注册$插件
       $.fn.scroll = function( opts ) {

            var scrollObjs = [];
            opts|| (opts = {});
            this.addClass(CLASS_SCROLL_WRAPPER);
            this.each(function() {
                var scrollObj = null;
                var self = this;
                $(self).children().wrapAll('<div class = "'+CLASS_SCROLL+'"/>');
                var id = self.getAttribute('data-scroll');
                if (!id) {
                    opts = $.extend(opts, { disableMouse : true,disablePointer:true});
                    id = ++UI.uuid;
                    scrollObj = UI.data[id] = new IScroll(self, opts);
                    scrollObj.on('scrollStart', function () {
                            console.log('scrollStart --> '+this.y);
                    });
                    scrollObj.on('scrollEnd', function () {
                            console.log('scrollEnd --> '+this.y);
                    });
                    self.setAttribute('data-scroll', id);
                } else {
                    scrollObj = UI.data[id];
                }
                scrollObjs.push(scrollObj);
            });
            return scrollObjs.length === 1 ? scrollObjs[0] : scrollObjs;
        };
    });
})();
