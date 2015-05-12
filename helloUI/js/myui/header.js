/**
 * @file 导航栏组件
 */
(function() {
        var tpl = {
            content:'<h1 class="mui-title"><%=title%></h1>',
            leftImg: '<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>',
            leftText: '<button class="mui-action-back mui-btn mui-btn-blue mui-btn-link mui-btn-nav mui-pull-left"><span class="mui-icon mui-icon-left-nav"></span><%=text%></button>',
            rightImg: '<a class="mui-icon mui-icon-bars mui-pull-right"></a>',
            rightText: '<button class="mui-btn mui-btn-blue mui-btn-link mui-pull-right"><%=text%></button>'
        };


    /**
         * 导航栏组件
         *
         */    

    define(function(require, exports, module) {
        var $ = require("zepto");
            UI = require("UI");
            _btn = require("button");
        //pop
        var $header = function(opts){
            //默认参数
            var defOpts = {
                /**
                 * 参照对象
                 * @property {String} [ref=null]
                 */
                ref: null,     //参照目标
                /**
                 * 标题
                 * @type {function}
                 */
                title:'导航栏',
                /**
                 * 定义左侧
                 * @type {function}
                 */
                 left: null,
                 /**
                 * 定义右侧
                 * @type {function}
                 */
                 right: null
            };
            this.opts = $.extend(defOpts, opts); 
            this.init();
        };

        //初始化
        $header.prototype.init = function(){
            var _h = this, opts = _h.opts;
            //基础属性
            _h.ref = opts.ref;
            _h.render();
            _h.bind();
        };

        //渲染
        $header.prototype.render = function(){
            var _h = this, opts = _h.opts;
            _h.ref = opts.ref;
            $(UI.parseTpl(tpl.content, opts)).appendTo(_h.ref)
            if(opts.left){
                var vars = {};
                opts.left.text&& (vars.text = opts.left.text);
                opts._left = vars.text?$(UI.parseTpl(tpl.leftText, vars)).appendTo(_h.ref):$(tpl.leftImg).appendTo(_h.ref);
            }
            if(opts.right){
                var vars = {};
                opts.right.text&& (vars.text = opts.right.text);
                opts._right = vars.text?$(UI.parseTpl(tpl.rightText, vars)).appendTo(_h.ref):$(tpl.rightImg).appendTo(_h.ref);
            }
        };

        //绑定事件
        $header.prototype.bind = function(){
            var _h = this, match, opts = _h.opts;
            opts._left && $.isFunction(opts.left.callback) && opts._left.botton({
                callback:opts.left.callback
            });
            opts._right && $.isFunction(opts.right.callback) && opts._right.botton({
                callback:opts.right.callback
            });
        };

        //注册$插件
        $.fn.header = function (opts) {
            var headerObjs = [];
            this.each(function() {
                var headerObj = null;
                var id = this.getAttribute('data-header');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++UI.uuid;
                    UI.data[id] = new $header(opts);
                    this.setAttribute('data-header', id);
                } else {
                    headerObj = UI.data[id];
                }
                headerObjs.push(headerObj);
            });
            return headerObjs.length > 1 ? headerObjs : headerObjs[0];
        };

        /*module.exports = function(opts){
            return new header(opts);
        };
    */
    });
})();