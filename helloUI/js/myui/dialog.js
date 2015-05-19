/**
 * @file 对话框组件
 */
(function() {

    //渲染
        var render = function(){
            
        };

        //绑定事件
        var bind = function(){
            var _dog = this,opts = this.opts;
           
            $(_dog.ref).find('select').on("change", function(evt) {
                var ele = evt.currentTarget;
                _dog.selectChange(ele);
                if ($.isFunction(_dog.callback)) {
                    _dog.callback.apply(_dog, [ele,evt]);
                }
            });
        };

    define(function(require, exports, module) {
            var UI = require("UI"),
            dialog_plus = require("dialog_plus");

        //pop
        var $dialog = UI.define('Dialog',{});

        //初始化
        $dialog.prototype.init = function(){
            render.call(this);
            bind.call(this);
        };

        /*弹出警示框*/
        $dialog.prototype.alert = function(message,callback){
                var _dog = this
                if (_dog.isPlus()) {

                }else{
                    window.alert(message);
                }
        };

        //确认消息框
        $dialog.prototype.confirm = function(message,callback){
            var _dog = this 
            if (_dog.isPlus()) {

            }else{
                window.confirm(message);
            }
        };

        //输入对话框
        $dialog.prototype.prompt = function(message,callback){
            var _dog = this 
            if (_dog.isPlus()) {

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
})();
