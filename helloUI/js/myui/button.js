define(function(require, exports, module) {
    var $ = require("zepto"),
        UI = require("UI");

    //pop
    var $botton = function(opts){
        //默认参数
        var defOpts = {
            /**
             * 参照对象
             * @property {String} [ref=null]
             */
            ref     : null,     //参照目标
            /**
             * 点击回调函数
             * @type {function}
             */
             callback: function(){}
        };
        this.opts = $.extend(defOpts, opts); 
        this.init();
    };

    //初始化
    $botton.prototype.init = function(){
        var _btn = this, 
            opts = this.opts;
        //基础属性
        _btn.ref = opts.ref;
        _btn.callback = opts.callback;
        _btn.isTouchScreen = UI.isTouchScreen();
        $(_btn.ref).on( _btn.isTouchScreen? "touchstart" : "mousedown" , function(evt) {
            var ele = evt.currentTarget;
            if ($.isFunction(_btn.callback)) {
                    _btn.callback.apply(_btn, [ele,evt]);
                }
            //_btn.render();   
        });
    };

    //渲染
    $botton.prototype.render = function(){
        var _btn = this, opts = _btn.opts;
        var hasTouch = _btn.isTouchScreen;
        var $ele = $(_btn.ref);
    };

    //绑定事件
    $botton.prototype.bind = function(){
        
    };

    //注册$插件
    $.fn.botton = function (opts) {
        var bottonObjs = [];
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
