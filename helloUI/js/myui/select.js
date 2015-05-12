define(function(require, exports, module) {
    var $ = require("zepto"),
        UI = require("UI");

    //pop
    var $select = function(opts){
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
    $select.prototype.init = function(){
        var _sel = this, 
            opts = this.opts;
        //基础属性
        _sel.ref = opts.ref;
        _sel.callback = opts.callback;
        $(_sel.ref).find('select').on("change", function(evt) {
            var ele = $(evt.currentTarget);
            _sel.selectChange(evt.currentTarget);
            if ($.isFunction(_sel.callback)) {
                _sel.callback.apply(_sel, [ele,evt]);
            }
        });
    };

    //渲染
    $select.prototype.render = function(){
        var _sel = this, opts = _sel.opts;
        var hasTouch = isTouchScreen();
        var $ele = $(_sel.ref);
    };

    //绑定事件
    $select.prototype.bind = function(){
        
    };

    /*
     下拉列表控件
     @param ELE id 下拉列表select标签的对象

     */
    $select.prototype.selectChange = function(sel) {
        var sl = $(sel)[0];
        if (sl) {
            var sp = sl.parentElement;
            //<span>
            if (sp) {
                var ch = sp.getElementsByTagName('div')[0];
                var t = sl.options[sl.selectedIndex].text;
                if (ch) {
                    $(ch).html(t);
                }
            }
        }
    };

    //注册$插件
    $.fn.select = function (opts) {
        var selectObjs = [];
        this.each(function() {
            var selectObj = null;
            var id = this.getAttribute('data-select');
            if (!id) {
                opts = $.extend(opts, { ref : this});
                id = ++UI.uuid;
                UI.data[id] = new $select(opts);
                this.setAttribute('data-select', id);
            } else {
                selectObj = UI.data[id];
            }
            selectObjs.push(selectObj);
        });
        return selectObjs.length > 1 ? selectObjs : selectObjs[0];
    };

    /*module.exports = function(opts){
        return new checkbox(opts);
    };
*/
});
