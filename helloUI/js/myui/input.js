/**
 * Input(TODO resize)
 * @param {type} $
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 */
(function(window, document) {
    var CLASS_ACTION = '.mui-input-row input';
    var CLASS_ICON = 'mui-icon';
    var CLASS_ICON_CLEAR = 'mui-icon-clear';
    var CLASS_ICON_SPEECH = 'mui-icon-speech';
    var CLASS_ICON_SEARCH = 'mui-icon-search';
    var CLASS_INPUT_ROW = 'mui-input-row';
    var CLASS_PLACEHOLDER = 'mui-placeholder';
    var CLASS_TOOLTIP = 'mui-tooltip';
    var CLASS_HIDDEN = 'mui-hidden';
    var CLASS_FOCUSIN = 'mui-focusin';
    var SELECTOR_ICON_CLOSE = '.' + CLASS_ICON_CLEAR;
    var SELECTOR_ICON_SPEECH = '.' + CLASS_ICON_SPEECH;
    var SELECTOR_PLACEHOLDER = '.' + CLASS_PLACEHOLDER;
    var SELECTOR_TOOLTIP = '.' + CLASS_TOOLTIP;

    var findRow = function(target) {
        for (; target && target !== document; target = target.parentNode) {
            if (target.classList && target.classList.contains(CLASS_INPUT_ROW)) {
                return target;
            }
        }
        return null;
    };
    define(function(require, exports, module) {
        var $ = require("zepto"),
        UI = require("UI");
        var $input = function(element, options) {
            this.element = element;
            this.options = options || {
                actions: 'clear'
            };
            if (~this.options.actions.indexOf('slider')) { //slider
                this.sliderActionClass = CLASS_TOOLTIP + ' ' + CLASS_HIDDEN;
                this.sliderActionSelector = SELECTOR_TOOLTIP;
            } else { //clear,speech,search
                if (~this.options.actions.indexOf('clear')) {
                    this.clearActionClass = CLASS_ICON + ' ' + CLASS_ICON_CLEAR + (element.value ? '' : (' ' + CLASS_HIDDEN));
                    this.clearActionSelector = SELECTOR_ICON_CLOSE;
                }
                if (~this.options.actions.indexOf('speech')) { //only for 5+
                    this.speechActionClass = CLASS_ICON + ' ' + CLASS_ICON_SPEECH;
                    this.speechActionSelector = SELECTOR_ICON_SPEECH;
                }
                if (~this.options.actions.indexOf('search')) {
                    this.searchActionClass = CLASS_PLACEHOLDER;
                    this.searchActionSelector = SELECTOR_PLACEHOLDER;
                }
            }
            this.plus = UI.isPlus();
            this.init();
        };
        $input.prototype.init = function() {
            this.initAction();
            this.initElementEvent();
        };
        $input.prototype.initAction = function() {
            var self = this;

            var row = self.element.parentNode;
            if (row) {
                if (self.sliderActionClass) {
                    self.sliderAction = self.createAction(row, self.sliderActionClass, self.sliderActionSelector);
                } else {
                    if (self.searchActionClass) {
                        self.searchAction = self.createAction(row, self.searchActionClass, self.searchActionSelector);
                        self.searchAction.addEventListener(UI.isTouchScreen() ? "mousedown" : "touchstart", function(e) {
                            UI.focus(self.element);
                            e.stopPropagation();
                        });
                    }
                    if (self.speechActionClass) {
                        self.speechAction = self.createAction(row, self.speechActionClass, self.speechActionSelector);
                        self.speechAction.addEventListener('click', UI.stopPropagation);
                        self.speechAction.addEventListener(UI.isTouchScreen() ? "mousedown" : "touchstart", function(event) {
                            self.speechActionClick(event);
                        });
                    }
                    if (self.clearActionClass) {
                        self.clearAction = self.createAction(row, self.clearActionClass, self.clearActionSelector);
                        self.clearAction.addEventListener(UI.isTouchScreen() ? "mousedown" : "touchstart", function(event) {
                            self.clearActionClick(event);
                        });

                    }
                }
            }
        };
        $input.prototype.createAction = function(row, actionClass, actionSelector) {
            var action = row.querySelector(actionSelector);
            if (!action) {
                var action = document.createElement('span');
                action.className = actionClass;
                if (actionClass === this.searchActionClass) {
                    action.innerHTML = '<span class="' + CLASS_ICON + ' ' + CLASS_ICON_SEARCH + '"></span>' + this.element.getAttribute('placeholder');
                    this.element.setAttribute('placeholder', '');
                    if (this.element.value.trim()) {
                        row.classList.add('mui-active');
                    }
                }
                row.insertBefore(action, this.element.nextSibling);
            }
            return action;
        };
        $input.prototype.initElementEvent = function() {
            var element = this.element;

            if (this.sliderActionClass) {
                var tooltip = this.sliderAction;
                //TODO resize
                var offsetLeft = element.offsetLeft;
                var width = element.offsetWidth - 28;
                var tooltipWidth = tooltip.offsetWidth;
                var distince = Math.abs(element.max - element.min);

                var timer = null;
                var showTip = function() {
                    tooltip.classList.remove(CLASS_HIDDEN);
                    tooltipWidth = tooltipWidth || tooltip.offsetWidth;
                    var scaleWidth = Math.abs(element.value) / distince * width;
                    tooltip.style.left = (14 + offsetLeft + scaleWidth - tooltipWidth / 2) + 'px';
                    tooltip.innerText = element.value;
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function() {
                        tooltip.classList.add(CLASS_HIDDEN);
                    }, 1000);
                };
                element.addEventListener(UI.isTouchScreen() ? "mousedown" : "touchstart", showTip);
                element.addEventListener('touchmove', function(e) {
                    e.stopPropagation();
                });
            } else {
                if (this.clearActionClass) {
                    var action = this.clearAction;
                    if (!action) {
                        return;
                    }
                    $.each(['keyup', 'change', 'input', 'focus', 'blur', 'cut', 'paste'], function(index, type) {
                        (function(type) {
                            element.addEventListener(type, function() {
                                action.classList[element.value.trim() ? 'remove' : 'add'](CLASS_HIDDEN);
                            });
                        })(type);
                    });
                }
                if (this.searchActionClass) {
                    element.addEventListener('focus', function() {
                        element.parentNode.classList.add('mui-active');
                    });
                    element.addEventListener('blur', function() {
                        if (!element.value.trim()) {
                            element.parentNode.classList.remove('mui-active');
                        }
                    });
                }
            }
        };
        $input.prototype.clearActionClick = function(event) {
            var self = this;
            self.element.value = '';
            UI.focus(self.element);
            self.clearAction.classList.add(CLASS_HIDDEN);
            event.preventDefault();
        };
        $input.prototype.speechActionClick = function(event) {
            if (this.plus) {
                var self = this;
                self.element.value = '';
                document.body.classList.add(CLASS_FOCUSIN);
                plus.speech.startRecognize({
                    engine: 'iFly'
                }, function(s) {
                    self.element.value += s;
                    UI.focus(self.element);
                    plus.speech.stopRecognize();
                    $.trigger(self.element, 'recognized', {
                        value: self.element.value
                    });
                    // document.body.classList.remove(CLASS_FOCUSIN);
                }, function(e) {
                    document.body.classList.remove(CLASS_FOCUSIN);
                });
            } else {
                alert('当前浏览器不支持');
            }
            event.preventDefault();
        };
        $.fn.input = function(options) {
            this.each(function() {
                var actions = [];
                var row = findRow(this.parentNode);
                if (this.type === 'range' && row.classList.contains('mui-input-range')) {
                    actions.push('slider');
                } else {
                    var classList = this.classList;
                    if (classList.contains('mui-input-clear')) {
                        actions.push('clear');
                    }
                    if (classList.contains('mui-input-speech')) {
                        actions.push('speech');
                    }
                    if (this.type === 'search' && row.classList.contains('mui-search')) {
                        actions.push('search');
                    }
                }
                var id = this.getAttribute('data-input-' + actions[0]);
                if (!id) {
                    id = ++UI.uuid;
                    new $input(this, {
                        actions: actions.join(',')
                    });
                    for (var i = 0, len = actions.length; i < len; i++) {
                        this.setAttribute('data-input-' + actions[i], id);
                    }
                }

            });
        };
        $(function(){
          $(CLASS_ACTION).input();
        })
     });
})(window, document);