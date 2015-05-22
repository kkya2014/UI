/**
 * iscroll组件
 */
(function() {
      // 给$.fn上挂iScroll方法
    define(function(require, exports, module) {
         var UI = require("UI");
                  require("iscroll");

        //注册$插件
       $.fn.scroll = function( opts ) {

            var scrollObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var scrollObj = null;
                var self = this;
                var id = self.getAttribute('data-scroll');
                if (!id) {
                    opts = $.extend(opts, { disableMouse : true,disablePointer:true});
                    id = ++UI.uuid;
                    scrollObj = UI.data[id] = new IScroll(self, opts);
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
