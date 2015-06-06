
##Dialog##

	弹出框组件封装了原生对话框对象，使开发者在界面中可以调用原生对话框完成交互，并且提供自定义对话框接口

ui组件底层基于[zepto](https://github.com/madrobby/zepto)([api](http://www.css88.com/doc/zeptojs_api/))来构建，其加载依赖于[seajs](http://seajs.org/docs/)。

##接口##
* alert
* confirm
* prompt
* dialog


##alert##
Dialog.alert(msg，options)
###代码###
		Dialog.alert('消息内容',{
               title : '单按钮',
               callback:function(ret){
                     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
                  }
         });

###msg###
	要提示的消息内容


###options###
	配置对象--JSON
*	title
*	buttons
*	callback
	*	ret

>#####title#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>title</td>
        <td>提示框的标题</td>
        <td>
			title : '单按钮'
		</td>
    </tr>
</table>
>#####buttons#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>buttons</td>
        <td>显示的按钮，默认值['确定']</td>
        <td>buttons:['确定']</td>
    </tr>

</table>
>#####callback#####
>callback(ret)
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>callback</td>
        <td>点击按钮后的回调函数</td>
        <td><pre><code>
	callback:function(ret){
                  if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
              }
		</code></pre></td>
    </tr>

</table>	
>	>######ret######

<table>
    <tr>
        <th>类型</th>
        <th>说明</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>JSON</td>
        <td>点击按钮的序号（从1开始）</td>
        <td><pre><code>
callback:function(ret){
     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
				  
     }
		</code></pre></td>
    </tr>

</table>

##confirm##
Dialog.confirm(msg，options)
###代码###
		Dialog.confirm('消息内容',{
               title : '多按钮',
			   buttons : ['确认','放弃','取消'],
               callback:function(ret){
                     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
                  }
         });

###msg###
	要提示的消息内容


###options###
	配置对象--JSON
*	title
*	buttons
*	callback
	*	ret

>#####title#####
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>title</td>
        <td>提示框的标题</td>
        <td>
			title : '多按钮'
		</td>
    </tr>
</table>
>#####buttons#####	
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
    <tr>
        <td>buttons</td>
        <td>显示的按钮</td>
        <td>buttons:['确定']</td>
    </tr>

</table>
>#####callback#####
>callback(ret)
<table>
    <tr>
        <th>key</th>
        <th>value</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>callback</td>
        <td>点击按钮后的回调函数</td>
        <td><pre><code>
	callback:function(ret){
                  if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
              }
		</code></pre></td>
    </tr>

</table>	
>	>######ret######

<table>
    <tr>
        <th>类型</th>
        <th>说明</th>
        <th>示例</th>
    </tr>
   
    <tr>
        <td>JSON</td>
        <td>点击按钮的序号（从1开始）</td>
        <td><pre><code>
callback:function(ret){
     if(ret.buttonIndex==1)
	console.log('点击的是第一个按钮');
				  
     }
		</code></pre></td>
    </tr>

</table>


###回调事件参数###

*	el ： 事件触发对象（dom对象）
*	evt ： 事件对象（change）