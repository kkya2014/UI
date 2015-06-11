seajs.config({
    alias: {
    	'$': 'base/zepto',
        'UI': 'base/ui',
        'iscroll': 'components/build/iscroll',
        'button' : 'myui/button',
        'checkbox' : 'myui/checkbox',
        'radio' : 'myui/checkbox',
        'select' : 'myui/select',
        'dialog_plus' : 'myui/dialog_plus',
        'dialog' : 'myui/dialog',
        'input' : 'myui/input',
        'switch':'myui/switch',
        'slider':'myui/slider/slider',
        'slidertouch':'myui/slider/slidert',
        'sliderbtn':'myui/slider/sliderb',
        'gridview' : 'myui/gridview',
        'tab' : 'myui/tabs/tabs',
        'tabbase' : 'myui/tabs/tabs.base',
        'tabswipe' : 'myui/tabs/tabs$swipe',
        'treeview' : 'myui/treeview',
        'scroll' : 'myui/iscroll'
    },
    preload: ['$'],
    base: './js/'
});
