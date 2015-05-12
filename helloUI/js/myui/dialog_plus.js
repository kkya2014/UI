/**
 * @file 弹出框组件
 */
(function() {
    var tpl = {
        mask: '<div class="ui-mask"></div>',
        title: '<div class="ui-dialog-title"></div>',
        wrap: '<div class="ui-dialog">'+
            '<div class="ui-dialog-content"></div>'+
            '<% if(btns){ %>'+
            '<div class="ui-dialog-btns">'+
            '<% for(var i=0, length=btns.length; i<length; i++){var item = btns[i]; %>'+
            '<a class="ui-btn ui-btn-<%=item.index%>" data-key="<%=item.key%>"><%=item.text%></a>'+
            '<% } %>'+
            '</div>'+
            '<% } %>' +
            '</div> '
    };


    /**
     * 弹出框组件
     *
     */

    define(function(require, exports, module) {
        var $ = require("zepto");
            UI = require("UI");

        //pop
        var $dialog_plus = function(opts){
            //默认参数
            var defOpts = {
                /**
                 * @property {Array} [buttons=null] 弹出框上的按钮
                 * @namespace options
                 */
                buttons: null,
                /**
                 * @property {Boolean} [mask=true] 是否有遮罩层
                 * @namespace options
                 */
                mask: true,
                /**
                 * @property {Number} [width=300] 弹出框宽度
                 * @namespace options
                 */
                width: 300,
                /**
                 * @property {Number|String} [height='auto'] 弹出框高度
                 * @namespace options
                 */
                height: 'auto',
                /**
                 * @property {String} [title=null] 弹出框标题
                 * @namespace options
                 */
                title: '提示框',
                /**
                 * @property {String} [content=null] 弹出框内容
                 * @namespace options
                 */
                content: null,
                /**
                 * @property {Boolean} [scrollMove=true] 是否禁用掉scroll，在弹出的时候
                 * @namespace options
                 */
                scrollMove: true,
                /**
                 * @property {Element} [container=null] 弹出框容器
                 * @namespace options
                 */
                container: null,
                /**
                 * @property {Element} [position=null] 需要dialog.position插件才能用
                 * @namespace options
                 */
                position: null //
            };

            this.opts = $.extend(defOpts, opts); 
            this.init();
        };

        //初始化
        $dialog_plus.prototype.init = function(){
            var _dog = this, opts = _dog.opts, btns,i= 0,vars = {};

            opts._container = $(opts.container || document.body);
            (opts._cIsBody = opts._container.is('body')) || opts._container.addClass('ui-dialog-container');
            vars.btns = btns= [];
            opts.buttons && $.each(opts.buttons, function(key){
                btns.push({
                    index: ++i,
                    text: key,
                    key: key
                });
            });
            opts._mask = opts.mask ? $(tpl.mask).appendTo(opts._container) : null;
            opts._wrap = $(UI.parseTpl(tpl.wrap, vars)).appendTo(opts._container);
            opts._content = $('.ui-dialog-content', opts._wrap);

            opts._title = $(tpl.title);

            _dog.title(opts.title);
            _dog.content(opts.content);

            btns.length && $('.ui-dialog-btns .ui-btn', opts._wrap).highlight('ui-state-hover');
            opts._wrap.css({
                width: opts.width,
                height: opts.height
            });
            _dog.bind();
            _dog.open();
        };
        /**
         * 设置弹出框标题
         * @method title
         * @param {String} [value] 弹出框标题
         */
        $dialog_plus.prototype.title = function(value) {
            var opts = this.opts;
            value = '<h3>'+value+'</h3>';
            opts._title.html(value).prependTo(opts._wrap);
        };

        /**
         * 设置弹出框内容。value接受带html标签字符串和zepto对象。
         * @method content
         * @param {String|Element} [val] 弹出框内容
         */
        $dialog_plus.prototype.content = function(val) {
            var opts = this.opts, setter = val!==undefined;
            setter && opts._content.empty().append(opts.content = val);
        };

        /**
         * 弹出弹出框
         * @method open
         * @param {String|Number} [x] X轴位置
         * @param {String|Number} [y] Y轴位置
         * @return {self} 返回本身
         */
        $dialog_plus.prototype.open = function(x, y){
            var opts = this.opts;
            opts._isOpen = true;

            opts._wrap.css('display', 'block');
            opts._mask && opts._mask.css('display', 'block');

            this.refresh();

            $(document).on('touchmove', $.proxy($dialog_plus.prototype.tmove, this));
        };

        

        /**
         * 用来更新弹出框位置和mask大小。如父容器大小发生变化时，可能弹出框位置不对，可以外部调用refresh来修正。
         * @method refresh
         * @return {self} 返回本身
         */
        $dialog_plus.prototype.refresh = function(){
            var _dog = this, opts = _dog.opts, ret, action;
            if(opts._isOpen) {

                action = function(){
                    ret = _dog.calculate();
                    ret.mask && opts._mask.css(ret.mask);
                    opts._wrap.css(ret.wrap);
                }

                //如果有键盘在，需要多加延时
                if( $.os.ios &&
                    document.activeElement &&
                    /input|textarea|select/i.test(document.activeElement.tagName)){

                    document.body.scrollLeft = 0;
                    setTimeout(action, 200);//do it later in 200ms.

                } else {
                    action();//do it now
                }
            }
        };

        $dialog_plus.prototype.calculate = function(){
            var _dog = this, opts = _dog.opts, size, $win, root = document.body,
                ret = {}, isBody = opts._cIsBody, round = Math.round;

            opts.mask && (ret.mask = isBody ? {
                width:  '100%',
                height: Math.max(root.scrollHeight, root.clientHeight)-1//不减1的话uc浏览器再旋转的时候不触发resize.奇葩！
            }:{
                width: '100%',
                height: '100%'
            });

            size = opts._wrap.offset();
            $win = $(window);
            ret.wrap = {
                left: '50%',
                marginLeft: -round(size.width/2) +'px',
                top: isBody?round($win.height() / 2) + window.pageYOffset:'50%',
                marginTop: -round(size.height/2) +'px'
            }
            return ret;
        };

        /**
         * 关闭弹出框
         * @method close
         * @return {self} 返回本身
         */
        $dialog_plus.prototype.close = function(){
            var _dog = this, opts = _dog.opts;


            opts._isOpen = false;
            opts._wrap.css('display', 'none');
            opts._mask && opts._mask.css('display', 'none');
            _dog.destroy();
        };

        /**
         * @desc 销毁组件。
         * @name destroy
         */
        $dialog_plus.prototype.destroy = function(){
            var _dog = this, opts = _dog.opts;
            $(document).off('touchmove',$dialog_plus.prototype.tmove);
            opts._wrap.off().remove();
            opts._mask && opts._mask.off().remove();
        };

        $dialog_plus.prototype.tmove = function(e){
                var _dog = this, opts = _dog.opts;
                opts.scrollMove && e.preventDefault();
        };
        /**
         * 绑定事件
         * @method close
         * @return {self} 返回本身
         */
        $dialog_plus.prototype.bind = function(){
            var _dog = this, match, wrap, opts = _dog.opts;
                //bind events绑定事件
            opts._wrap.on(UI.isTouchScreen() ? "touchstart" : "mousedown", function(e){
                    wrap = opts._wrap.get(0);
                    if( (match = $(e.target).closest('.ui-dialog-close', wrap)) && match.length ){
                        _dog.close();
                    } else if( (match = $(e.target).closest('.ui-dialog-btns .ui-btn', wrap)) && match.length ) {
                        fn = opts.buttons[match.attr('data-key')];
                        fn && fn.apply(_dog, [_dog,e]);
                    }
            });
            opts._mask && opts._mask.on(UI.isTouchScreen() ? "touchstart" : "mousedown", function(e){
                    if ($.isFunction(opts.maskClick)) {
                        opts.maskClick.apply(_dog, [_dog,e]);
                    }
            });
        };
        
        /*$.fn.dialog = function (opts) {
            opts = $.extend(opts, { ref : this[0] });
            return new $dialog_plus(opts);
        };*/

        module.exports = function(opts){
            return new $dialog_plus(opts);
        };

    });

})();
