属性 类型 默认值 必要 可选值 描述
id String - 是 - 范围打印 ID（如果设置 url 则可以不设置 id）
url String - 否 - 打印指定的 URL。（不允许同时设置 ID
popTitle String - 否 - 默认使用浏览器标签名，为空时为 undefined
standard String HTML5 否 html5，loose，strict 打印的文档类型
extraHead String - 否 - 在节点中添加 DOM 节点， 并用,(Print local range only)分隔多个节点
extraCss String - 否 - 新的 CSS 样式表， 并使用,（仅打印本地范围）分隔多个节点
openCallback Function - 否 - 调用打印工具成功回调函数
closeCallback Function - 否 - 关闭打印工具成功回调函数
beforeOpenCallback Function - 否 - 调用打印工具前的回调函数
preview Boolean false 否 true,false 预览工具
previewTitle String - 否 - ‘打印预览’
previewPrintBtnLabel String 打印 否 - 打印按钮名称
previewBeforeOpenCallback Function - 否 - 预览打开前回调函数
previewOpenCallback Function - 否 - 预览打开回调函数
clickMounted Function - 否 - 点击打印按钮回调函数

```JavaScript
<script>
	export default {
		name: "nb-print",
		data() {
			return {
				printOption: {
					id: 'nbprint', // 打印元素的id 不需要携带#号
					preview: true, // 开启打印预览
					previewTitle: '打印预览', // 打印预览标题
					popTitle: '员工信息', // 页眉标题 默认浏览器标题 空字符串时显示undefined 使用html语言
                      // 头部文字 默认空 在节点中添加 DOM 节点， 并用,(Print local range only)分隔多个节点
					extraHead:'https://***/***.css, https://***/***.css',
                      // 新的 CSS 样式表， 并使用,（仅打印本地范围）分隔多个节点
					extraCss: '<meta http-equiv="Content-Language"content="zh-cn"/>',
					previewBeforeOpenCallback: () => {
						console.log("触发打印预览打开前回调");
					},
					previewOpenCallback: () => {
						console.log("触发打开打印预览回调");
					},
					beforeOpenCallback: () => {
						console.log("触发打印工具打开前回调");
					},
					openCallback: () => {
						console.log("触发打开打印工具回调");
					},
					closeCallback: () => {
						console.log("触发关闭打印工具回调");
					},
					clickMounted: () => {
						console.log("触发点击打印回调");
					}
				}
             }
		}
	}
</script>
```
