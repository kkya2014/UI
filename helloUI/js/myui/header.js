/**
 * @file 导航栏组件
 */
(function() {
        var CLASS_TITLE = 'mui-title',
            CLASS_ACTION_BACK = 'mui-action-back',
            CLASS_ICON = 'mui-icon',
            CLASS_BTN = 'mui-btn',
            CLASS_BTN_BLUE = 'mui-btn-blue',
            CLASS_BTN_LINK = 'mui-btn-link',
            CLASS_BTN_NAV = 'mui-btn-nav',
            CLASS_ICON_LEFT_NAV = 'mui-icon-left-nav',
            CLASS_PULL_LEFT = 'mui-pull-left',
            CLASS_PULL_RIGHT = 'mui-pull-right';
            CLASS_ICON_BARS = 'mui-icon-bars',

            tpl = {
                content:'<h1 class="'+CLASS_TITLE+'"><%=title%></h1>',
                leftImg: '<a class="'+CLASS_ACTION_BACK+' '+CLASS_ICON+' '+CLASS_ICON_LEFT_NAV+' '+CLASS_PULL_LEFT+'"></a>',
                leftText: '<button class="'+CLASS_ACTION_BACK+' '+CLASS_BTN+' '+CLASS_BTN_BLUE+' '+CLASS_BTN_LINK+' '+CLASS_BTN_NAV+' '+CLASS_PULL_LEFT+'">'+
                          '<span class="'+CLASS_ICON+' '+CLASS_ICON_LEFT_NAV+'"></span><%=text%></button>',
                rightImg: '<a class="'+CLASS_ICON+' '+CLASS_ICON_BARS+' '+CLASS_PULL_RIGHT+'"></a>',
                rightText: '<button class="'+CLASS_BTN+' '+CLASS_BTN_BLUE+' '+CLASS_BTN_LINK+' '+CLASS_PULL_RIGHT+'"><%=text%></button>'
            };



        //渲染
        var render = function(){
            var _h = this, opts = _h.opts;
            $(_h.parseTpl(tpl.content, opts)).appendTo(_h.ref)
            if(opts.left){
                var vars = {};
                opts.left.text&& (vars.text = opts.left.text);
                _h._left = vars.text?$(_h.parseTpl(tpl.leftText, vars)).appendTo(_h.ref):$(tpl.leftImg).appendTo(_h.ref);
            }
            if(opts.right){
                var vars = {};
                opts.right.text&& (vars.text = opts.right.text);
                _h._right = vars.text?$(_h.parseTpl(tpl.rightText, vars)).appendTo(_h.ref):$(tpl.rightImg).appendTo(_h.ref);
            }
        };

        //绑定事件
        var bind = function(){
            var _h = this, match, opts = _h.opts;
            _h._left && $.isFunction(opts.left.callback) && _h._left.botton({
                callback:opts.left.callback
            });
            _h._right && $.isFunction(opts.right.callback) && _h._right.botton({
                callback:opts.right.callback
            });
        };    


    /**
         * 导航栏组件
         *
         */    

    define(function(require, exports, module) {
        var UI = require("UI"),
            _btn = require("button");
        //pop
        var $header =  UI.define('Header',{
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
            });

        //初始化
        $header.prototype.init = function(){
            render.call(this);
            bind.call(this);
        };

        //注册$插件
        $.fn.header = function (opts) {
            var headerObjs = [];
            opts|| (opts = {});
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