/**
 * switch组件
 */
(function() {
    var CLASS_SWITCH = 'mui-switch';
    var CLASS_ACTION = '.' + CLASS_SWITCH;
    var CLASS_SWITCH_HANDLE = 'mui-switch-handle';
    var CLASS_ACTIVE = 'mui-active';
    var CLASS_DRAGGING = 'mui-dragging';

    var CLASS_DISABLED = 'mui-disabled';

    var SELECTOR_SWITCH_HANDLE = '.' + CLASS_SWITCH_HANDLE;

    var handle = function(event, target) {
        if (target.classList && target.classList.contains(CLASS_SWITCH)) {
            return target;
        }
        return false;
    };

    define(function(require, exports, module) {
        var $ = require("zepto"),
        UI = require("UI");

        var $switch = function(opts) {
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

            this.element = this.opts.ref;
            this.callback = this.opts.callback;
            this.classList = this.element.classList;
            this.handle = this.element.querySelector(SELECTOR_SWITCH_HANDLE);
            this.init();
            this.initEvent();
        };
        $switch.prototype.init = function() {
            this.toggleWidth = this.element.offsetWidth;
            this.handleWidth = this.handle.offsetWidth;
            this.handleX = this.toggleWidth - this.handleWidth - 3;
        };
        $switch.prototype.initEvent = function() {
             var _tog = this, opts = this.opts;
            this.element.addEventListener('touchstart', $.proxy(this.handleEvent, this));
            this.element.addEventListener('drag', $.proxy(this.handleEvent, this));
            this.element.addEventListener('swiperight', $.proxy(this.handleEvent, this));
            this.element.addEventListener('touchend', $.proxy(this.handleEvent, this));
            this.element.addEventListener('touchcancel', $.proxy(this.handleEvent, this));
            this.element.addEventListener('toggle', function(event) {
                    //event.detail.isActive 可直接获取当前状态
                    var ele = $(event.currentTarget);
                if ($.isFunction(_tog.callback)) {
                    _tog.callback.apply(_tog, [ele[0],event]);
                }
            });

        };
        $switch.prototype.handleEvent = function(e) {
            if (this.classList.contains(CLASS_DISABLED)) {
                return;
            }
            switch (e.type) {
                case 'touchstart':
                    this.start(e);
                    break;
                case 'drag':
                    this.drag(e);
                    break;
                case 'swiperight':
                    this.swiperight();
                    break;
                case 'touchend':
                case 'touchcancel':
                    this.end(e);
                    break;
            }
        };
        $switch.prototype.start = function(e) {
            this.classList.add(CLASS_DRAGGING);
            if (this.toggleWidth === 0 || this.handleWidth === 0) { //当switch处于隐藏状态时，width为0，需要重新初始化
                this.init();
            }
        };
        $switch.prototype.drag = function(e) {
            var detail = e.detail;
            if (!this.isDragging) {
                if (detail.direction === 'left' || detail.direction === 'right') {
                    this.isDragging = true;
                    this.lastChanged = undefined;
                    this.initialState = this.classList.contains(CLASS_ACTIVE);
                }
            }
            if (this.isDragging) {
                this.setTranslateX(detail.deltaX);
                e.stopPropagation();
                detail.gesture.preventDefault();
            }
        };
        $switch.prototype.swiperight = function(e) {
            if (this.isDragging) {
                e.stopPropagation();
            }
        };
        $switch.prototype.end = function(e) {
            this.classList.remove(CLASS_DRAGGING);
            if (this.isDragging) {
                this.isDragging = false;
                e.stopPropagation();
                UI.trigger(this.element, 'toggle', {
                    isActive: this.classList.contains(CLASS_ACTIVE)
                });
            } else {
                this.toggle();
            }
        };
        $switch.prototype.toggle = function() {
            var classList = this.classList;
            if (classList.contains(CLASS_ACTIVE)) {
                classList.remove(CLASS_ACTIVE);
                this.handle.style.webkitTransform = 'translate3d(0,0,0)';
            } else {
                classList.add(CLASS_ACTIVE);
                this.handle.style.webkitTransform = 'translate3d(' + this.handleX + 'px,0,0)';
            }
            UI.trigger(this.element, 'toggle', {
                isActive: this.classList.contains(CLASS_ACTIVE)
            });
        };
        $switch.prototype.setTranslateX = UI.animationFrame(function(x) {
            if (!this.isDragging) {
                return;
            }
            var isChanged = false;
            if ((this.initialState && -x > (this.handleX / 2)) || (!this.initialState && x > (this.handleX / 2))) {
                isChanged = true;
            }
            if (this.lastChanged !== isChanged) {
                if (isChanged) {
                    this.handle.style.webkitTransform = 'translate3d(' + (this.initialState ? 0 : this.handleX) + 'px,0,0)';
                    this.classList[this.initialState ? 'remove' : 'add'](CLASS_ACTIVE);
                } else {
                    this.handle.style.webkitTransform = 'translate3d(' + (this.initialState ? this.handleX : 0) + 'px,0,0)';
                    this.classList[this.initialState ? 'add' : 'remove'](CLASS_ACTIVE);
                }
                this.lastChanged = isChanged;
            }

        });
        //注册$插件
        $.fn.switch = function(opts) {
            var switchObjs = [];
            this.each(function() {
                var switchObj = null;
                var id = this.getAttribute('data-switch');
                if (!id) {
                    opts = $.extend(opts, { ref : this});
                    id = ++UI.uuid;
                    UI.data[id] = new $switch(opts);
                    this.setAttribute('data-switch', id);
                } else {
                    switchObj = UI.data[id];
                }
                switchObjs.push(switchObj);
            });
            return switchObjs.length > 1 ? switchObjs : switchObjs[0];
        };
       /* $(function() {
            $(CLASS_ACTION).switch();
        });*/
    });
})();