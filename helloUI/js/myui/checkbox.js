/**
 * checkbox、radio组件
 */
(function() {   


    define(function(require, exports, module) {
        var $ = require("zepto");
            UI = require("UI");

        //pop
        var $checkbox = function(opts){
            //默认参数
            var defOpts = {
                /**
                 * 参照对象
                 * @property {String} [ref=null]
                 */
                ref     : null,     //参照目标
                /**
                 * 参照对象
                 * @property {String} [ref=null]
                 */
                type     : null,     //参照目标
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
        $checkbox.prototype.init = function(){
            var _chk = this, 
                opts = this.opts;
            //基础属性
            _chk.ref = opts.ref;
            _chk.callback = opts.callback;
            var els = opts.type == 'checkbox'?$(_chk.ref).find('input[type=checkbox]'):(opts.type == 'radio'?$(_chk.ref).find('input[type=radio]'):[]);
            els.on('change', function(evt) {
                var ele = $(evt.currentTarget);
                if ($.isFunction(_chk.callback)) {
                        _chk.callback.apply(_chk, [ele,evt]);
                    }
                    //_chk.render();   
            });
        };

        //渲染
        $checkbox.prototype.render = function(){
            var _chk = this, opts = _chk.opts;
            var hasTouch = isTouchScreen();
            var $ele = $(_chk.ref);
        };

        //绑定事件
        $checkbox.prototype.bind = function(){
            
        };

        //注册$插件
        $.fn.checkbox = function (opts) {
            var checkObjs = [];
            this.each(function() {
                var checkObj = null;
                var id = this.getAttribute('data-checkbox');
                if (!id) {
                    opts = $.extend(opts, { ref : this,type : 'checkbox'});
                    id = ++UI.uuid;
                    UI.data[id] = new $checkbox(opts);
                    this.setAttribute('data-checkbox', id);
                } else {
                    checkObj = UI.data[id];
                }
                checkObjs.push(checkObj);
            });
            return checkObjs.length > 1 ? checkObjs : checkObjs[0];
        };
        $.fn.radio = function (opts) {
            var radioObjs = [];
            this.each(function() {
                var radioObj = null;
                var id = this.getAttribute('data-radio');
                if (!id) {
                    opts = $.extend(opts, { ref : this,type : 'radio'});
                    id = ++UI.uuid;
                    UI.data[id] = new $checkbox(opts);
                    this.setAttribute('data-radio', id);
                } else {
                    radioObj = UI.data[id];
                }
                radioObjs.push(radioObj);
            });
            return radioObjs.length > 1 ? radioObjs : radioObjs[0];
        };

        /*module.exports = function(opts){
            return new checkbox(opts);
        };
    */
    });
})();