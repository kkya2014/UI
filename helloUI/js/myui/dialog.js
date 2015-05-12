define(function(require, exports, module) {
    var $ = require("zepto"),
        UI = require("UI"),
        dialog_plus = require("dialog_plus");

    //pop
    var $dialog = function(opts){
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
    $dialog.prototype.init = function(){
        var _dog = this, 
            opts = this.opts;
        _dog.plus = UI.isPlus();
        //基础属性
        _dog.ref = opts.ref;
        _dog.callback = opts.callback;
        $(_dog.ref).find('select').on("change", function(evt) {
            var ele = $(evt.currentTarget);
            _dog.selectChange(evt.currentTarget);
            if ($.isFunction(_dog.callback)) {
                _dog.callback.apply(_dog, [ele[0],evt]);
            }
        });
    };

    /*弹出警示框*/
    $dialog.prototype.alert = function(message,callback){
            var _dog = this
            if (_dog.plus) {

            }else{
                window.alert(message);
            }
    };

    //确认消息框
    $dialog.prototype.confirm = function(message,callback){
        var _dog = this 
        if (_dog.plus) {

        }else{
            window.confirm(message);
        }
    };

    //输入对话框
    $dialog.prototype.prompt = function(message,callback){
        var _dog = this 
        if (_dog.plus) {

        }else{
            window.prompt(message);
        }
    };

    //输入对话框
    $dialog.prototype.dialog = function(opts){
        return dialog_plus(opts);
    };

    // //注册$插件
    // $.fn.$dialog = function (opts) {
    //     opts = $.extend(opts, { ref : this[0] });
    //     return new $dialog(opts);
    // };

    module.exports = Dialog = new $dialog();

});
