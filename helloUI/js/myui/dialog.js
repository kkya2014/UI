/**
 * @file 对话框组件
 */
(function() {
        var $N;
    //渲染
        var render = function(){
            
        };

        //绑定事件
        var bind = function(){
            var _dog = this,opts = this.opts;
           
          
        };

        var alt = function(params){
            $N.alert.alert(params, params.callback);
        };
        var conf = function(params){
            $N.confirm.confirm(params, params.callback);
        };
        var prom = function(params){
            $N.prompt.prompt(params, params.callback);
        };

    define(function(require, exports, module) {
    var UI = require("UI"),dialog_plus = require("dialog_plus");

        //pop
        var $dialog = UI.define('Dialog',{});

        //初始化
        $dialog.prototype.init = function(native){
            $N = native;
            render.call(this);
            bind.call(this);
        };

        /*弹出警示框*/
        $dialog.prototype.alert = function(message,opts){
                var _dog = this
                if (_dog.isPlus) {
                    var params = {
                        title:'',
                        'msg':message,
                        buttons:['确定'],
                        callback:function(){}
                    }
                    opts|| (opts = {});
                    params = $.extend(params, opts);
                    alt(params);
                }else{
                    window.alert(message);
                }
        };

        //确认消息框
        $dialog.prototype.confirm = function(message,opts){
            var _dog = this 
            if (_dog.isPlus) {
                 var params = {
                        title:'',
                        'msg':message,
                        buttons:["取消","确定"],
                        callback:function(){}
                    }
                    opts|| (opts = {});
                    params = $.extend(params, opts);
                    conf(params);
            }else{
                window.confirm(message);
            }
        };

        //输入对话框
        $dialog.prototype.prompt = function(message,opts){
            var _dog = this 
            if (_dog.isPlus) {
                var params = {
                        title:'',
                        msg:message,
                        text:'',
                        type:'text',
                        buttons:["取消","确定"],
                        callback:function(){}
                    }
                    opts|| (opts = {});
                    params = $.extend(params, opts);
                    prom(params);
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
