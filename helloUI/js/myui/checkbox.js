/**
 * checkbox、radio组件
 */
(function() {   

    //渲染
        var render = function(){
            
        };

        //绑定事件
        var bind = function(){
            var _chk = this, opts = _chk.opts;
            var els = opts.type == 'checkbox'?_chk.ref.find('input[type=checkbox]'):(opts.type == 'radio'?_chk.ref.find('input[type=radio]'):[]);
            els.on('change', function(evt) {
                var ele = evt.currentTarget;
                if ($.isFunction(_chk.callback)) {
                        _chk.callback.apply(_chk, [ele,evt]);
                    }
            });
        };

    define(function(require, exports, module) {
            var UI = require("UI");

        //pop
        var $checkbox = UI.define('Checkbox',{
                /**
                 * 区分是checkbox、radio
                 */
                type     : null     
            });

        //初始化
        $checkbox.prototype.init = function(){
            render.call(this);
            bind.call(this);
        };
        //注册$插件
        $.fn.checkbox = function (opts) {
            var checkObjs = [];
            this.each(function() {
                var checkObj = null;
                var id = this.getAttribute('data-checkbox');
                if (!id) {
                    opts = { ref : this,type : 'checkbox',callback:callback};
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
        $.fn.radio = function (callback) {
            var radioObjs = [];
            this.each(function() {
                var radioObj = null;
                var id = this.getAttribute('data-radio');
                if (!id) {
                    opts = { ref : this,type : 'radio',callback:callback};
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