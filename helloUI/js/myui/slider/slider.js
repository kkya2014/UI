/**
 * @file 图片轮播组件
 */
(function() {
    // todo 检测3d是否支持。
    var translateZ = ' translateZ(0)';
       
    /**
     * 更新dots
     */
    var updateDots = function( to, from ) {
        var _sl = this, dots = _sl._dots;

        typeof from === 'undefined' || _sl.UI.callZepto(dots[from % this.length ]).removeClass('ui-state-active');
        _sl.UI.callZepto(dots[to % this.length ]).addClass('ui-state-active');  
    };

    var initDots = function(){
        var _sl = this, opts = _sl.opts;
        var dots = _sl.ref.find( opts.selector.dots );

        if ( !dots.length ) {
            dots = _sl.UI.parseTpl(opts.tpl.dots, {
                len: _sl.length
            });
            dots = $( dots ).appendTo( _sl.ref[0] );
        }

        this._dots = dots.children().toArray();    
    };
    
    /**
     * 图片轮播组件
     */
    define(function(require, exports, module) {
        var UI = require("UI"),
            cssPrefix = $.fx.cssPrefix,
            transitionEnd = $.fx.transitionEnd;
        var $slider = UI.define('Slider',{
                

                /**
                 * @property {Boolean} [loop=false] 是否连续滑动
                 * @namespace options
                 */
                loop: false,
                
                /**
                 * @property {Number} [speed=400] 动画执行速度
                 * @namespace options
                 */
                speed: 400,

                /**
                 * @property {Number} [index=0] 初始位置
                 * @namespace options
                 */
                index: 0,
                /**
                 * @property {Boolean} [autoPlay=true] 是否开启自动播放
                 * @namespace options
                 * @for Slider
                 * @uses Slider.autoplay
                 */
                autoPlay: true,
                /**
                 * @property {Number} [interval=4000] 自动播放的间隔时间（毫秒）
                 * @namespace options
                 * @for Slider
                 * @uses Slider.autoplay
                 */
                interval: 4000,

                /**
                 * @property {Boolean} [dots=true] 是否显示点
                 * @namespace options
                 * @for Slider
                 * @uses Slider.dots
                 */
                dots: true,

                /**
                 * @property {Object}  容器的选择器
                 */
                selector: {
                    dots: '.ui-slider-dots',
                    group: '.ui-slider-group'
                },
                 tpl : {
                    item: '<div class="ui-slider-item"><a href="<%= href %>">' +
                            '<img src="<%= pic %>" alt="" /></a>' +
                            '<% if( title ) { %><p><%= title %></p><% } %>' +
                            '</div>',
                    dots: '<p class="ui-slider-dots"><%= new Array( len + 1 )' +
                            '.join("<b></b>") %></p>'        
                }

        }); 
        //加載觸摸按鈕
        require("slidertouch");
        //初始化
        $slider.prototype.init = function() {
            var _sl = this, opts = _sl.opts;

            _sl.index = opts.index;
            _sl.UI = UI;


            _sl.ref.on( 'slideend', $.proxy($slider.prototype.resume, _sl)).on( 'destory', $.proxy($slider.prototype.stop, _sl));

            // 避免滑动时，自动切换
            _sl.ref.on( 'touchstart', $.proxy($slider.prototype.stop, _sl))
                    .on( 'touchend', $.proxy($slider.prototype.resume, _sl));
             //dots添加
             if(opts.dots){
                _sl.ref.on( 'slide', function(e) {
                    var to = e.detail.to, from = e.detail.from;
                    updateDots.apply(_sl,[to,from]);
                }).on( 'donedom', function(e) {
                    initDots.call(_sl);
                })
            }

            // 初始dom结构
            _sl.initDom();

            // 更新width
            _sl.initWidth();
            _sl._container.on( transitionEnd,
                    $.proxy( _sl.tansitionEnd, _sl ) );
            //自动轮播
            opts.autoPlay&&_sl.resume();
            
        };

        /**
         * 自动播放。
         */
        $slider.prototype.resume = function() {
            var _sl = this,
                opts = _sl.opts;

            if ( opts.autoPlay && !_sl._timer ) {
                _sl._timer = setTimeout( function() {
                    _sl.slideTo( _sl.index + 1 );
                    _sl._timer = null;
                }, opts.interval );
            }
            return _sl;
        };

        /**
         * 停止自动播放
         * @method stop
         * @chainable
         * @return {self} 返回本身
         * @for Slider
         * @uses Slider.autoplay
         */
        $slider.prototype.stop = function() {
            var _sl = this;

            if ( _sl._timer ) {
                clearTimeout( _sl._timer );
                _sl._timer = null;
            }
            return _sl;
        };

        $slider.prototype.initDom = function( $el, opts ) {
            var _sl = this, opts = _sl.opts,
                selector = opts.selector,
                viewNum = opts.viewNum || 1,
                items,
                container;

            // 检测容器节点是否指定
            container = _sl.ref.find( selector.group );

            // 没有指定容器则创建容器
            if ( !container.length ) {
                container = $( '<div></div>' );

                // 如果没有传入content, 则将root的孩子作为可滚动item
                if ( !opts.content ) {

                    // 特殊处理直接用ul初始化slider的case
                    if ( _sl.ref.is( 'ul' ) ) {
                        _sl.el = container.insertAfter( _sl.ref );
                        container = _sl.ref;
                        _sl.ref = _sl.el;
                    } else {
                        container.append( _sl.ref.children() );
                    }
                } else {
                    _sl.createItems( container, opts.content );
                }

                container.appendTo( _sl.ref );
            }

            // 检测是否构成循环条件
            if ( (items = container.children()).length < viewNum + 1 ) {
                opts.loop = false;
            }

            // 如果节点少了，需要复制几份
            while ( opts.loop && container.children().length < 3 * viewNum ) {
                container.append( items.clone() );
            }

            _sl.length = container.children().length;

            _sl._items = (_sl._container = container)
                    .addClass( 'ui-slider-group' )
                    .children()
                    .addClass( 'ui-slider-item' )
                    .toArray();
            _sl.ref.addClass( 'ui-slider' )
            UI.trigger(opts.ref, 'donedom');
            opts.dots&&updateDots.call( _sl, _sl.index );
        };

        // 根据items里面的数据挨个render插入到container中
        $slider.prototype.createItems = function( container, items ) {
            // var _sl = this, opts = _sl.opts,i = 0,
            //     len = items.length;

            // for ( ; i < len; i++ ) {
            //     container.append( _sl.parseTpl(tpl.wrap, vars) );
            // }
        };

        $slider.prototype.initWidth = function() {
            var _sl = this, opts = _sl.opts,
                width;

            // width没有变化不需要重排
            if ( (width = _sl.ref.width()) === _sl.width ) {
                return;
            }

            _sl.width = width;
            _sl.arrange();
            _sl.height = _sl.ref.height();
            //me.trigger( 'width.change' );
        };

        // 重排items
        $slider.prototype.arrange = function() {
            var _sl = this, opts = _sl.opts,
                items = _sl._items,
                i = 0,
                item,
                len;

            _sl._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];
                
                item.style.cssText += 'width:' + _sl.width + 'px;' +
                        'left:' + (i * -_sl.width) + 'px;';
                item.setAttribute( 'data-index', i );

                _sl.move( i, i < _sl.index ? -_sl.width : i > _sl.index ? _sl.width : 0, 0 );
            }

            _sl._container.css( 'width', _sl.width * len );
        };

        $slider.prototype.move = function( index, dist, speed, immediate ) {
            var _sl = this, opts = _sl.opts,
                slidePos = _sl._slidePos,
                items = _sl._items;

            if ( slidePos[ index ] === dist || !items[ index ] ) {
                return;
            }

            _sl.translate( index, dist, speed );
            slidePos[ index ] = dist;    // 记录目标位置

            // 强制一个reflow
            immediate && items[ index ].clientLeft;
        };

        $slider.prototype.translate = function( index, dist, speed ) {
            var _sl = this, opts = _sl.opts,
                slide = _sl._items[ index ],
                style = slide && slide.style;

            if ( !style ) {
                return false;
            }

            style.cssText += cssPrefix + 'transition-duration:' + speed + 
                    'ms;' + cssPrefix + 'transform: translate(' + 
                    dist + 'px, 0)' + translateZ + ';';
        };

        $slider.prototype.circle = function( index, arr ) {
            var _sl = this, opts = _sl.opts, len;

            arr = arr || _sl._items;
            len = arr.length;

            return (index % len + len) % arr.length;
        };

        $slider.prototype.tansitionEnd = function( e ) {
             var _sl = this;
            // ~~用来类型转换，等价于parseInt( str, 10 );
            if ( ~~e.target.getAttribute( 'data-index' ) !== _sl.index ) {
                return;
            }
            
            UI.trigger(_sl.ref[0], 'slideend', {
                index: _sl.index
            });
        };

        $slider.prototype.slide = function( from, diff, dir, width, speed, opts ) {
             var _sl = this, to;

            to = _sl.circle( from - dir * diff );

            // 如果不是loop模式，以实际位置的方向为准
            if ( !opts.loop ) {
                dir = Math.abs( from - to ) / (from - to);
            }
            
            // 调整初始位置，如果已经在位置上不会重复处理
            _sl.move( to, -dir * width, 0, true );

            _sl.move( from, width * dir, speed );
            _sl.move( to, 0, speed );

            _sl.index = to;
            return UI.trigger(_sl.ref[0], 'slide', {
                to: to,
                from: from
            },_sl);
        };

        /**
         * 切换到第几个slide
         */
        $slider.prototype.slideTo = function( to, speed ) {
            var _sl = this, opts = _sl.opts;
            if ( _sl.index === to || _sl.index === _sl.circle( to ) ) {
                return this;
            }

            var index = _sl.index,
                diff = Math.abs( index - to ),
                
                // 1向左，-1向右
                dir = diff / (index - to),
                width = _sl.width;

            speed = speed || opts.speed;

            return _sl.slide( index, diff, dir, width, speed, opts );
        };

        /**
         * 返回当前显示的第几个slide
         * @method getIndex
         * @chainable
         * @return {Number} 当前的silde序号
         */
        $slider.prototype.getIndex = function() {
            return this.index;
        };

        /**
         * 销毁组件
         * @method destroy
         */
        $slider.prototype.destroy = function() {
            this._container.off( this.eventNs );
            $( window ).off( 'ortchange' + this.eventNs );
            return this.$super( 'destroy' );
        };

        //注册$插件
        $.fn.slider = function(opts) {
            var sliderObjs = [];
            this.each(function() {
                var sliderObj = null;
                var id = this.getAttribute('data-slider');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++UI.uuid;
                    sliderObj = UI.data[id] = new $slider(opts);
                    this.setAttribute('data-slider', id);
                } else {
                    sliderObj = UI.data[id];
                }
                sliderObjs.push(sliderObj);
            });
            return sliderObjs.length > 1 ? sliderObjs : sliderObjs[0];
        };

    });

})();