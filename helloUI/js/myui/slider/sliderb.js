/**
 * @file 图片轮播剪头按钮
 */
(function() {
    

    /**
     * 图片轮播剪头按钮
     */
    define(function(require, exports, module) {
        UI = require("UI");
        // 提供默认options
        $.extend(true, UI.Slider.prototype.options, {
            tpl: {
                prev: '<span class="ui-slider-pre"></span>',
                next: '<span class="ui-slider-next"></span>'
            },

            /**
             * @property {Object} [select={prev:'.ui-slider-pre',next:'.ui-slider-next'}] 上一张和下一张按钮的选择器
             * @namespace options
             * @for Slider
             * @uses Slider.arrow
             */
            selector: {
                prev: '.ui-slider-pre',    // 上一张按钮选择器
                next: '.ui-slider-next'    // 下一张按钮选择器
            }
        });
        var sliderBinit = function(){
            var _sl = this, opts = _sl.opts,
                arr = [ 'prev', 'next' ];

            _sl.ref.on( 'donedom', function(e) {
                var selector = opts.selector;

                arr.forEach(function( name ) {
                    var item = _sl.ref.find( selector[ name ] );
                    item.length || _sl.ref.append( item = $( opts.tpl[name]));
                    _sl[ '_' + name ] = item;
                });
            } );

            _sl.ref.on( 'readydom', function() {
                arr.forEach(function( name ) {
                    _sl[ '_' + name ].on( _sl.touchEve(), function() {
                        _sl[ name ].call( _sl );
                    } );
                });
            } );

            _sl.ref.on( 'destroy', function() {
                _sl._prev.off();
                _sl._next.off();
            } );
        }
        /**
         * 切换到下一个slide
         * @method next
         * @chainable
         * @return {self} 返回本身
         */
        sliderBinit.next = function() {
            var _sl = this, opts = _sl.opts;
            if ( opts.loop || _sl.index + 1 < _sl.length ) {
                _sl.slideTo( _sl.index + 1 );
            }

            return _sl;
        };
         /**
         * 切换到上一个slide
         * @method prev
         * @chainable
         * @return {self} 返回本身
         */
        sliderBinit.prev = function() {
            var _sl = this, opts = _sl.opts;
            if ( opts.loop || _sl.index > 0 ) {
                _sl.slideTo( _sl.index - 1 );
            }

            return _sl;
        };
        UI.Slider.prototype.extend.call(UI.Slider,sliderBinit);
        UI.Slider.prototype.plugins.push(sliderBinit);
    });
})();