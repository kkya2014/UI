/**
 * @file 列表组件
 */
(function() {
        var CLASS_ACTIVE = 'mui-active',
            CLASS_TABLE_VIEW_CELL = 'mui-table-view-cell',
            CLASS_BTN = 'mui-btn',
            CLASS_TOGGLE = 'mui-switch',

            tarEl;

        var render = function(){
            var _gv = this,opts = _gv.opts;
            _gv._ul = $(opts.tpl.ul).appendTo( _gv.ref );
            _gv._lis = [];
            _gv.renderData(opts.data);
        };

         //绑定事件
        var bind = function(lis){
            var _gv = this,opts = _gv.opts;
            if(!lis)lis = $(_gv.ref).find('li[data-ui-gli = true]');
            lis.on( _gv.touchEve() , function(evt) {
                var ele = evt.currentTarget;
                var classList = ele.classList;
                if ((ele.tagName === 'INPUT' && ele.type !== 'radio' && ele.type !== 'checkbox') || ele.tagName === 'BUTTON') {
                    _gv.stopPropagation(evt);
                    return;
                }else if ((ele.querySelector('input') || ele.querySelector('.' +CLASS_BTN) || ele.querySelector('.' + CLASS_TOGGLE))) {
                            return;
                }
                if (classList.contains(CLASS_TABLE_VIEW_CELL)) {
                    tarEl = ele;
                    tarEl.classList.add(CLASS_ACTIVE);
                }
            }).on( _gv.touchEnd() , function(evt) {
                if (!tarEl) {
                    return;
                }
                tarEl.classList.remove(CLASS_ACTIVE);
            });
        };

    define(function(require, exports, module) {
        var UI = require("UI");

        //gridview
        var $gridview = UI.define('Slider',{
                /**
                 * 模板對象
                 * @type {function}
                 */
                 tpl : {
                    ul: '<ul class="mui-table-view" ></ul>',
                    li: '<li class="mui-table-view-cell"><%=cont%></li>' 
                },
                /**
                 * 渲染數據
                 */
                 data: [],
                /**
                 * 点击回调函数
                 * @type {function}
                 */
                 callback: function(){}
            });

        //初始化
        $gridview.prototype.init = function(){
            var _gv = this,opts = _gv.opts;
            _gv.callback = opts.callback;
            render.call(_gv);
            bind.call(_gv);
        };
        /**
         * 根據傳入數據渲染
         * @type {function}
         * lis -> array
         */
        $gridview.prototype.renderData = function(lis){
            if($.isArray(lis)){
                var _gv = this,opts = _gv.opts;
                _gv._ul.empty();
                _gv.parseFn||(_gv.parseFn = _gv.parseTpl(opts.tpl.li));
                var _lis = [];
                if(lis.length>0){
                    $.each(lis, function(index, item){
                        _lis[index] = _gv.parseFn(item);
                    })
                    _gv._lis = $(_lis.join('')).appendTo( _gv._ul );
                    _gv._lis.attr('data-ui-gli',true);
                }
            }else{
                _gv.log('lis必須是數組對象');
                throw new Error( 'lis必須是數組對象' );
            }
            
        };

        /**
         * 根據傳入HTML附加到列表
         * @type {function}
         * lis -> array
         */
        $gridview.prototype.appendHtml = function(html){
            if(typeof html === 'string'){
                var _gv = this,opts = _gv.opts;
                var appLis = $(html).appendTo( _gv._ul );
                appLis.attr('data-ui-gli',true);
                bind.call(_gv,appLis);
                _gv._lis = _gv._lis.concat(appLis);
            }else{
                _gv.log('html必須是字符串');
                throw new Error( 'html必須是字符串' );
            }
            
        };

         /**
         * 根據傳入數據附加到列表
         * @type {function}
         * lis -> array
         */
        $gridview.prototype.appendData = function(lis){
            if($.isArray(lis)){
                var _gv = this,opts = _gv.opts;
                _gv.parseFn||(_gv.parseFn = _gv.parseTpl(opts.tpl.li));
                var _lis = [];
                if(lis.length>0){
                    $.each(lis, function(index, item){
                        _lis[index] = _gv.parseFn(item);
                    })
                    _lis = $(_lis.join('')).appendTo( _gv._ul );
                    _lis.attr('data-ui-gli',true);
                    bind.call(_gv,_lis);
                    _gv._lis = _gv._lis.concat(_lis);
                }
            }else{
                this.log('lis必須是數組對象');
                throw new Error( 'lis必須是數組對象' );
            }
            
        };

        //注册$插件
        $.fn.gridview = function (opts) {
            var gridviewObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var gridviewObj = null;
                var id = this.getAttribute('data-gridview');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++UI.uuid;
                    gridviewObj = UI.data[id] = new $gridview(opts);
                    this.setAttribute('data-gridview', id);
                } else {
                    gridviewObj = UI.data[id];
                }
                gridviewObjs.push(gridviewObj);
            });
            return gridviewObjs.length > 1 ? gridviewObjs : gridviewObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();