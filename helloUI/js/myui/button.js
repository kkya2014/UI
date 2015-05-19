/**
 * button组件
 */
(function() {

    //渲染组件
    var render = function(){
            
        };
     //绑定事件
    var bind = function(){
            var _btn = this, opts = _btn.opts;

            _btn.ref.on( _btn.touchEve() , function(evt) {
                var ele = evt.currentTarget;
                if ($.isFunction(_btn.callback)) {
                        _btn.callback.apply(_btn, [ele,evt]);
                    }
            });
        };


    define(function(require, exports, module) {
            var UI = require("UI");

        //botton
         var $botton = UI.define('Botton',{});

        //初始化
        $botton.prototype.init = function(){
            render.call(this);
            bind.call(this);
        };

        //注册$插件
        $.fn.botton = function (opts) {
            var bottonObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var bottonObj = null;
                var id = this.getAttribute('data-botton');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++UI.uuid;
                    UI.data[id] = new $botton(opts);
                    this.setAttribute('data-botton', id);
                } else {
                    bottonObj = UI.data[id];
                }
                bottonObjs.push(bottonObj);
            });
            return bottonObjs.length > 1 ? bottonObjs : bottonObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();
