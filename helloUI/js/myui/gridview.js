/**
 * @file 列表组件
 */
(function() {
        var CLASS_ACTIVE = 'mui-active',
            CLASS_TABLE_VIEW_CELL = 'mui-table-view-cell',
            CLASS_BTN = 'mui-btn',
            CLASS_TOGGLE = 'mui-switch',
            CLASS_TABLE_VIEW = 'mui-table-view',

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
            if(!lis)lis = _gv.ref.find('li[data-ui-gli = true]');
            lis.on( _gv.touchEve() , function(evt) {
                var ele = evt.currentTarget;
                var tar = evt.target;
                var classList = ele.classList;
                if ((tar.tagName === 'INPUT' && tar.type !== 'radio' && tar.type !== 'checkbox') || tar.tagName === 'BUTTON') {
                    _gv.stopPropagation(evt);
                    return;
                }else if ((ele.querySelector('input') || ele.querySelector('.' +CLASS_BTN) || ele.querySelector('.' + CLASS_TOGGLE))) {
                     _gv.stopPropagation(evt);
                     return;
                }
                if (classList.contains(CLASS_TABLE_VIEW_CELL)) {
                    tarEl = ele;
                    tarEl.classList.add(CLASS_ACTIVE);
                    if ($.isFunction(_gv.callback)) {
                        _gv.callback.apply(_gv, [ele,evt]);
                    }
                    setTimeout(function(){
                        tarEl.classList.remove(CLASS_ACTIVE);
                    }, 200);
                }
            })
        };

    define(function(require, exports, module) {
        var UI = require("UI");

        //gridview
        var $gridview = UI.define('Gridview',{
                /**
                 * 模板對象
                 * @type {function}
                 */
                 tpl : {
                    ul: '<ul class="'+CLASS_TABLE_VIEW+'" ></ul>',
                    li: '<li class="'+CLASS_TABLE_VIEW_CELL+'"><%=cont%></li>' 
                },
                /**
                 * 渲染數據
                 */
                 data: []
            });

        //初始化
        $gridview.prototype.init = function(){
            render.call(this);
            bind.call(this);
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
                _gv._parseFn||(_gv._parseFn = _gv.parseTpl(opts.tpl.li));
                var _lis = [];
                if(lis.length>0){
                    $.each(lis, function(index, item){
                        _lis[index] = _gv._parseFn(item);
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
                _gv._parseFn||(_gv._parseFn = _gv.parseTpl(opts.tpl.li));
                var _lis = [];
                if(lis.length>0){
                    $.each(lis, function(index, item){
                        _lis[index] = _gv._parseFn(item);
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