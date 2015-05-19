/**
 * @file 选项卡组件
 */

(function() {
    var CLASS_CONTENT = 'mui-content',
        CLASS_ACTIVE = 'mui-active',
        CLASS_BAR = 'mui-bar',
        CLASS_BAR_TAB = 'mui-bar-tab',
        CLASS_TAB_ITEM = 'mui-tab-item',
        CLASS_CONTROL_CONTENT = 'mui-control-content';

        SELECTOR_ACTIVE = '.'+CLASS_ACTIVE,

        _uid = 1,
        uid = function(){
            return _uid++;
        },
        idRE = /^#(.+)$/;

    var render = function(){
            var _tb = this, opts = _tb.opts,items;

            _tb._nav =  _tb.ref.find('nav').first();
            if(_tb._nav) {
                _tb._content = $('<div></div>').appendTo(_tb.ref).addClass(CLASS_CONTENT);
                items = [];
                _tb._nav.addClass(CLASS_BAR+'  '+CLASS_BAR_TAB).children().each(function(){
                    var $a = _tb.callZ(this).addClass(CLASS_TAB_ITEM), href = $a?$a.attr('href'):_tb.callZ(this).attr('data-url'), id, $content;
                    id = idRE.test(href)? RegExp.$1: 'tabs_'+uid();
                    ($content = _tb.ref.find('#'+id) || $('<div id="'+id+'"></div>'))
                        .addClass(CLASS_CONTROL_CONTENT+(opts.transition?' '+opts.transition:''))
                        .appendTo(_tb._content);
                    items.push({
                        id: id,
                        href: href,
                        title: $a?$a.attr('href', 'javascript:;').text():_tb.callZ(this).text(),//如果href不删除的话，地址栏会出现，然后一会又消失。
                        content: $content
                    });
                });
                opts.items = items;
                opts.active = Math.max(0, Math.min(items.length-1, opts.active || _tb.callZ(SELECTOR_ACTIVE, _tb.ref).index()||0));
                getPanel.call(_tb).add(_tb._nav.children().eq(opts.active)).addClass(CLASS_ACTIVE);
            } 
            fitToContent.call(_tb,getPanel.call(_tb));
        };

    var bind = function(){
            var _tb = this, opts = _tb.opts, handler = $.proxy(eventHandler, _tb);
            
            _tb._nav.on(_tb.touchEve(), handler);
        };

    var getPanel = function(index){
            var _tb = this, opts = _tb.opts; 
            return $('#' + opts.items[index === undefined ? opts.active : index].id);
        };

    var fitToContent = function(div) {
            // var _tb = this, opts = _tb.opts, $content = _tb._content;
            // _tb._plus === undefined && (_tb._plus = parseFloat($content.css('border-top-width'))+parseFloat($content.css('border-bottom-width')))
            // $content.height('100%');
        };

    var eventHandler = function (e) {
            var _tb = this, opts = _tb.opts;
            if((match = $(e.target).closest('a', _tb._nav)) && match.length) {
                e.preventDefault();
                _tb.switchTo(match.index());
            }
                    
        };

    /**
     * 选项卡组件
     */
    define(function(require, exports, module) {
        var UI = require("UI");
        var $tabs = UI.define('Tabs',{

            /**
             * @property {Number} [active=0] 初始时哪个为选中状态
             * @namespace options
             */
            active: 0,

            /**
             * @property {Array} [items=null] 
             */
            items:null,

            /**
             * @property {String} [transition='slide'] 设置切换动画，目前只支持slide动画，或无动画
             * @namespace options
             */
            transition: 'slide'
         });
        
        //初始化
        $tabs.prototype.init = function () {
            var _tb = this, opts = _tb.opts;
            _tb.ref.addClass(CLASS_CONTENT);
            render.call(_tb);
            bind.call(_tb);
        };
        /**
         * 切换到某个Tab
         * @method switchTo
         * @param {Number} index Tab编号
         * @chainable
         * @return {self} 返回本身。
         */
        $tabs.prototype.switchTo = function(index) {
            var _tb = this, opts = _tb.opts, items = opts.items, eventData, to, from, reverse, endEvent;
            if(!_tb._buzy && opts.active != (index = Math.max(0, Math.min(items.length-1, index)))) {
                to = $.extend({}, items[index]);//copy it.
                to.div = getPanel.call(_tb,index);
                to.index = index;

                from = $.extend({}, items[opts.active]);
                from.div = getPanel.call(_tb);
                from.index = opts.active;

                var eventStatus = _tb.trigger(opts.ref,'beforeActivate',{
                    to: to,
                    from: from
                })
                if(!eventStatus) return _tb;

                _tb._content.children().removeClass(CLASS_ACTIVE);
                to.div.addClass(CLASS_ACTIVE);
                _tb._nav.children().removeClass(CLASS_ACTIVE).eq(to.index).addClass(CLASS_ACTIVE);
                if(opts.transition) { 
                    _tb._buzy = true;
                    endEvent = $.fx.animationEnd + '.tabs';
                    reverse = index>opts.active?'':' reverse';
                    from.div.addClass('out'+reverse);
                    to.div.addClass('in'+reverse).on(endEvent, function(e){
                        if (e.target != e.currentTarget) return //如果是冒泡上来的，则不操作
                        to.div.off(endEvent, arguments.callee);//解除绑定
                        _tb._buzy = false;
                        from.div.removeClass('out reverse');
                        to.div.removeClass('in reverse');
                        _tb.trigger(opts.ref,'animateComplete',{
                            to: to,
                            from: from
                        });
                        fitToContent.call(_tb,to.div);
                    });
                }
                opts.active = index;
                _tb.trigger(opts.ref,'activate',{
                    to: to,
                    from: from
                 });
                opts.transition ||  fitToContent.call(_tb,to.div);
            }
            return _tb;
        };

        /**
         * 当外部修改tabs内容好，需要调用refresh让tabs自动更新高度
         * @method refresh
         * @chainable
         * @return {self} 返回本身。
         */
        $tabs.prototype.refresh = function(){
            return fitToContent.call(this,getPanel.call(this));
        };

        /**
         * 销毁组件
         * @method destroy
         */
        $tabs.prototype.destroy = function () {
           
        };
        //注册$插件
        $.fn.tab = function(opts) {
            var tabObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var tabObj = null;
                var id = this.getAttribute('data-tab');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++UI.uuid;
                    tabObj = UI.data[id] = new $tabs(opts);
                    this.setAttribute('data-tab', id);
                } else {
                    tabObj = UI.data[id];
                }
                tabObjs.push(tabObj);
            });
            return tabObjs.length > 1 ? tabObjs : tabObjs[0];
        };

    });
})();