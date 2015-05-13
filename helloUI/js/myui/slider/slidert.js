/**
 * @file 图片轮播手指跟随插件
 * @import slider.js
 */
(function() {
    
    var map = {
            touchstart: 'sliderTonStart',
            touchmove: 'sliderTonMove',
            touchend: 'sliderTonEnd',
            touchcancel: 'sliderTonEnd',
            click: 'sliderTonClick'
        },

        isScrolling,
        start,
        delta,
        moved;

    

    /**
     * 图片轮播手指跟随插件
     * @pluginfor Slider
     */
    define(function(require, exports, module) {
        UI = require("UI");
        // 提供默认options
        $.extend( UI.Slider.prototype.options, {

            /**
             * @property {Boolean} [stopPropagation=false] 是否阻止事件冒泡
             * @namespace options
             * @for Slider
             * @uses Slider.touch
             */
            stopPropagation: false,

            /**
             * @property {Boolean} [disableScroll=false] 是否阻止滚动
             * @namespace options
             * @for Slider
             * @uses Slider.touch
             */
            disableScroll: false
        });
        var sliderT = {
            sliderTinit: function() {
                var _sl = this, opts = _sl.opts;

                _sl._handler = function( e ) {
                    opts.stopPropagation && e.stopPropagation();
                    return map[ e.type ] && _sl[ map[ e.type ] ].call( _sl, e );
                };

                _sl.ref.on( 'readydom', function() {
                    // 绑定手势
                    _sl.ref.on( 'touchstart', _sl._handler );
                    
                    // 阻止误点击, 犹豫touchmove被preventDefault了，导致长按也会触发click
                    _sl._container.on( 'click', _sl._handler );
                } );
            },

            sliderTonClick: function() {
                return !moved;
            },

            sliderTonStart: function( e ) {
                    
                // 不处理多指
                if ( e.touches.length > 1 ) {
                    return false;
                }

                var _sl = this,
                    touche = e.touches[ 0 ],
                    opts = _sl.opts,
                    num;

                start = {
                    x: touche.pageX,
                    y: touche.pageY,
                    time: +new Date()
                };

                delta = {};
                moved = false;
                isScrolling = undefined;

                num = opts.viewNum || 1;
                _sl.move( opts.loop ? _sl.circle( _sl.index - num ) :
                        _sl.index - num, -_sl.width, 0, true );
                _sl.move( opts.loop ? _sl.circle( _sl.index + num ) :
                        _sl.index + num, _sl.width, 0, true );

                _sl.ref.on( 'touchmove' + ' touchend' +
                        ' touchcancel', _sl._handler );
            },

            sliderTonMove: function( e ) {

                // 多指或缩放不处理
                if ( e.touches.length > 1 || e.scale &&
                        e.scale !== 1 ) {
                    return false;
                }

                var _sl = this,
                    opts = _sl.opts,
                    viewNum = opts.viewNum || 1,
                    touche = e.touches[ 0 ],
                    index = _sl.index,
                    i,
                    len,
                    pos,
                    slidePos;

                opts.disableScroll && e.preventDefault();

                delta.x = touche.pageX - start.x;
                delta.y = touche.pageY - start.y;

                if ( typeof isScrolling === 'undefined' ) {
                    isScrolling = Math.abs( delta.x ) <
                            Math.abs( delta.y );
                }

                if ( !isScrolling ) {
                    e.preventDefault();

                    if ( !opts.loop ) {

                        // 如果左边已经到头
                        delta.x /= (!index && delta.x > 0 ||

                                // 如果右边到头
                                index === _sl._items.length - 1 && 
                                delta.x < 0) ?

                                // 则来一定的减速
                                (Math.abs( delta.x ) / _sl.width + 1) : 1;
                    }

                    slidePos = _sl._slidePos;

                    for ( i = index - viewNum, len = index + 2 * viewNum;
                            i < len; i++ ) {

                        pos = opts.loop ? _sl.circle( i ) : i;
                        _sl.translate( pos, delta.x + slidePos[ pos ], 0 );
                    }

                    moved = true;
                }
            },

            sliderTonEnd: function() {
                var _sl = this,
                    opts = _sl.opts;
                // 解除事件
                _sl.ref.off( 'touchmove' + ' touchend' + ' touchcancel',
                        _sl.ref._handler );

                if ( !moved ) {
                    return;
                }

                var viewNum = opts.viewNum || 1,
                    index = _sl.index,
                    slidePos = _sl._slidePos,
                    duration = +new Date() - start.time,
                    absDeltaX = Math.abs( delta.x ),

                    // 是否滑出边界
                    isPastBounds = !opts.loop && (!index && delta.x > 0 ||
                        index === slidePos.length - viewNum && delta.x < 0),

                    // -1 向右 1 向左
                    dir = delta.x > 0 ? 1 : -1,
                    speed,
                    diff,
                    i,
                    len,
                    pos;

                if ( duration < 250 ) {

                    // 如果滑动速度比较快，偏移量跟根据速度来算
                    speed = absDeltaX / duration;
                    diff = Math.min( Math.round( speed * viewNum * 1.2 ),
                            viewNum );
                } else {
                    diff = Math.round( absDeltaX / (_sl.perWidth || _sl.width) );
                }
                
                if ( diff && !isPastBounds ) {
                    _sl.slide( index, diff, dir, _sl.width, opts.speed,
                            opts, true );
                    
                    // 在以下情况，需要多移动一张
                    if ( viewNum > 1 && duration >= 250 &&
                            Math.ceil( absDeltaX / _sl.perWidth ) !== diff ) {

                        _sl.index < index ? _sl.move( _sl.index - 1, -_sl.perWidth,
                                opts.speed ) : _sl.move( _sl.index + viewNum,
                                _sl.width, opts.speed );
                    }
                } else {
                    
                    // 滑回去
                    for ( i = index - viewNum, len = index + 2 * viewNum;
                        i < len; i++ ) {

                        pos = opts.loop ? _sl.circle( i ) : i;
                        _sl.translate( pos, slidePos[ pos ], 
                                opts.speed );
                    }
                }
            }
        }
        UI.Slider.prototype.extend.call(UI.Slider,sliderT);
        UI.Slider.prototype.plugins.push(sliderT.sliderTinit);
    } );
})();