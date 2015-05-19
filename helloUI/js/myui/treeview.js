/**
 * @file 列表组件
 */
(function() {
        var CLASS_ACTIVE = 'mui-active',
            CLASS_TABLE_VIEW_CELL = 'mui-table-view-cell',
            CLASS_COLLAPSE = 'mui-collapse',
            CLASS_CONTENT = 'mui-content',

            tarEl;

        var render = function(){
            var _tv = this,opts = _tv.opts;
            _tv._ul = $(opts.tpl.ul).appendTo( _tv.ref );
            _tv._lis = [];
            _tv.renderData(opts.data);
        };

         //绑定事件
        var bind = function(lis){
            var _tv = this,opts = _tv.opts;
            if(!lis)lis = $(_tv.ref).find('li[data-ui-tli = true]');
            lis.on( _tv.touchEve() , function(evt) {
                _tv.stopPropagation(evt);
                var ele = evt.currentTarget;
                var classList = ele.classList;
                if (classList.contains(CLASS_COLLAPSE)) {
                    if (!classList.contains(CLASS_ACTIVE)) { //展开时,需要收缩其他同类
                        var collapse = ele.parentNode.querySelector('.'+CLASS_COLLAPSE+'.'+CLASS_ACTIVE);
                        if (collapse) {
                            collapse.classList.remove(CLASS_ACTIVE);
                        }
                    }
                    classList.toggle(CLASS_ACTIVE);
                }else if (classList.contains(CLASS_TABLE_VIEW_CELL)) {
                    tarEl = ele;
                    classList.add(CLASS_ACTIVE);
                    if ($.isFunction(_tv.callback)) {
                        _tv.callback.apply(_tv, [ele,evt]);
                    }
                }
            }).on( _tv.touchEnd() , function(evt) {
                if (!tarEl) {
                    return;
                }
                tarEl.classList.remove(CLASS_ACTIVE);
            });
        };

    define(function(require, exports, module) {
        var UI = require("UI");

        //treeview
        var $treeview = UI.define('Treeview',{
                /**
                 * 模板對象
                 * @type {function}
                 */
                 tpl : {
                    ul: '<ul class="mui-table-view mui-table-view-chevron" ></ul>',
                    li: '<li class="mui-table-view-cell" data-ui-li = <%=i%> tar = <%=tar%>>'+
                        '<a class="mui-navigate-right"><%=cont%></a></li>' ,
                    muli: '<li class="mui-table-view-cell" data-ui-li = <%=i%>>'+
                        '<a class="mui-navigate-right"><%=cont%></a></li>' 
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
        $treeview.prototype.init = function(){
            var _tv = this,opts = _tv.opts;
            _tv.callback = opts.callback;
            render.call(_tv);
            bind.call(_tv);
        };
        /**
         * 根據傳入數據渲染
         * @type {function}
         * lis -> array
         */
        $treeview.prototype.renderData = function(lis){
            if($.isArray(lis)){
                var _tv = this,opts = _tv.opts, _lis = [],_mulis = [];

                _tv._ul.empty();
                _tv._parseFn||(_tv._parseFn = _tv.parseTpl(opts.tpl.li));
                if(lis.length>0){
                    $.each(lis, function(index, item){
                        item.i = index + 1;
                        if(item.contents&&($.isArray(item.contents))){
                            _tv._muliparseFn||(_tv._muliparseFn = _tv.parseTpl(opts.tpl.muli));
                            _lis[index] = _tv._muliparseFn(item);    
                            var mulis = [];
                            $.each(item.contents, function(i, el){
                                el.i = i + 1;
                                mulis[i] = _tv._parseFn(el);
                            })
                            _mulis.push({
                               index:index,
                               mulis:mulis
                           });
                        }else{
                            _lis[index] = _tv._parseFn(item);    
                        }
                    })
                    _tv._lis = $(_lis.join('')).appendTo( _tv._ul );
                    $.each(_mulis, function(index, item){
                        if(item.mulis&&($.isArray(item.mulis))){
                            var tarli = _tv._lis[item.index];
                            $(tarli).addClass(CLASS_COLLAPSE);
                            var tardiv = $('<div class="'+CLASS_CONTENT+'"></div>').appendTo(tarli);
                            var tarul = $(opts.tpl.ul).appendTo(tardiv);
                            var tarlis = $(item.mulis.join('')).appendTo( tarul )
                            _tv._lis = $(_tv._lis.concat(tarlis));
                       }
                    });
                    _tv._lis.attr('data-ui-tli',true);
                }
            }else{
                _tv.log('lis必須是數組對象');
                throw new Error( 'lis必須是數組對象' );
            }
            
        };
        //  /**
        //  * 根據傳入數據附加到列表
        //  * @type {function}
        //  * lis -> array
        //  */
        // $treeview.prototype.appendData = function(lis){
        //     if($.isArray(lis)){
        //         var _tv = this,opts = _tv.opts;
        //         _tv._parseFn||(_tv._parseFn = _tv.parseTpl(opts.tpl.li));
        //         var _lis = [];
        //         if(lis.length>0){
        //             $.each(lis, function(index, item){
        //                 _lis[index] = _tv._parseFn(item);
        //             })
        //             _lis = $(_lis.join('')).appendTo( _tv._ul );
        //             _lis.attr('data-ui-gli',true);
        //             bind.call(_tv,_lis);
        //             _tv._lis = _tv._lis.concat(_lis);
        //         }
        //     }else{
        //         this.log('lis必須是數組對象');
        //         throw new Error( 'lis必須是數組對象' );
        //     }
            
        // };

        //注册$插件
        $.fn.treeview = function (opts) {
            var treeviewObjs = [];
            opts|| (opts = {});
            this.each(function() {
                var treeviewObj = null;
                var id = this.getAttribute('data-treeview');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++UI.uuid;
                    treeviewObj = UI.data[id] = new $treeview(opts);
                    this.setAttribute('data-treeview', id);
                } else {
                    treeviewObj = UI.data[id];
                }
                treeviewObjs.push(treeviewObj);
            });
            return treeviewObjs.length > 1 ? treeviewObjs : treeviewObjs[0];
        };

        /*module.exports = function(opts){
            return new botton(opts);
        };
    */
    });
})();