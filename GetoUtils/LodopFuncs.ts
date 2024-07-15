var CreatedOKLodop7766 = null
var CLodopIsLocal

function getStyle () {
  // 设计注意：
  // 子表单：只能单独一行；

  // 打印注意：
  // 子表单：打印时，cell内容不能完全居中；
  // 分割线：打印不支持，会有占位；
  // 滑块：打印不支持，会空白；
  // radio-group\checkbox-group，打印时，会强制变换为inline-block；
  // 栅格布局：打印时，不分列，一字段单独一行；

  return `
    * {
      box-sizing: border-box;
      color: #000 !important;
      font-size: 3mm;
      font-weight: 400;
    }

    body {
      width: 100%;
      background-color: #ffffff;
      margin: 0mm;
      padding: 0mm;
      line-height: 5mm;
      font-size: 3mm;
      box-sizing: border-box;
    }

    table {
      width: 100%;
    }

    td {
      min-height: 5mm;
    }

    td,
    td span {
      padding: 0 1mm;
      font-size: 4mm;
    }

    .head-center {
      text-align: center;
      font-size: 5mm;
    }

    .border-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid black;
    }
    .border-table.margin {
        margin-top: 10px;
    }
    .border-table td {
        border: 1px solid black;
    }
  `;
}

//= ===判断是否需要 Web打印服务CLodop:===
//= ==(不支持插件的浏览器版本需要用它)===
function needCLodop () {
  try {
    var ua = navigator.userAgent
    if (ua.match(/Windows\sPhone/i)) return true
    if (ua.match(/iPhone|iPod|iPad/i)) return true
    if (ua.match(/Android/i)) return true
    if (ua.match(/Edge\D?\d+/i)) return true

    var verTrident = ua.match(/Trident\D?\d+/i)
    var verIE = ua.match(/MSIE\D?\d+/i)
    var verOPR = ua.match(/OPR\D?\d+/i)
    var verFF = ua.match(/Firefox\D?\d+/i)
    var x64 = ua.match(/x64/i)
    if (!verTrident && !verIE && x64) return true
    else if (verFF) {
      verFF = verFF[0].match(/\d+/)
      if (verFF[0] >= 41 || x64) return true
    } else if (verOPR) {
      verOPR = verOPR[0].match(/\d+/)
      if (verOPR[0] >= 32) return true
    } else if (!verTrident && !verIE) {
      var verChrome = ua.match(/Chrome\D?\d+/i)
      if (verChrome) {
        verChrome = verChrome[0].match(/\d+/)
        if (verChrome[0] >= 41) return true
      }
    }
    return false
  } catch (err) {
    return true
  }
}

//= ===页面引用CLodop云打印必须的JS文件,用双端口(8000和18000）避免其中某个被占用：====
if (needCLodop()) {
  var src1 = 'http://localhost:8000/CLodopfuncs.js?priority=1'
  var src2 = 'http://localhost:18000/CLodopfuncs.js?priority=0'

  var head =
    document.head ||
    document.getElementsByTagName('head')[0] ||
    document.documentElement
  var oscript = document.createElement('script')
  oscript.src = src1
  head.insertBefore(oscript, head.firstChild)
  oscript = document.createElement('script')
  oscript.src = src2
  head.insertBefore(oscript, head.firstChild)
  CLodopIsLocal = !!(src1 + src2).match(/\/\/localho|\/\/127.0.0./i)
}

//= ===获取LODOP对象的主过程：====
function getLodop (oOBJECT, oEMBED, domTipsContainer) {
  var strHtmInstall =
    "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='/static/printInstall/CLodop_Setup.exe' target='_self'>执行安装</a>，（<a href='/static/printInstall/CLodop_Setup_for_Win64NT_6.572EN.exe' target='_self'>点击这里下载【64位打印服务控件】执行安装</a>）,安装后请刷新页面或重新进入。</font>"
  // var strHtmUpdate =
  //   "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>"
  var strHtm64Install =
    "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='/static/printInstall/CLodop_Setup.exe' target='_self'>执行安装</a>，（<a href='/static/printInstall/CLodop_Setup_for_Win64NT_6.572EN.exe' target='_self'>点击这里下载【64位打印服务控件】执行安装</a>）,安装后请刷新页面或重新进入。</font>"
  // var strHtm64_Update =
  //   "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>"
  var strHtmFireFox =
    "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>"
  var strHtmChrome =
    "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>"
  var strCLodopInstall1 =
    "<br><font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='/static/printInstall/CLodop_Setup.exe' target='_self'>下载执行安装</a>，（<a href='/static/printInstall/CLodop_Setup_for_Win64NT_6.572EN.exe' target='_self'>点击这里下载【64位打印服务控件】执行安装</a>）"
  var strCLodopInstall2 =
    "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）"
  var strCLodopInstall3 = '，成功后请关闭浏览器，重新进入本页面。</font>'
  // var strCLodopUpdate =
  //   "<br><font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>"
  var LODOP
  try {
    var ua = navigator.userAgent
    var isIE = !!ua.match(/MSIE/i) || !!ua.match(/Trident/i)
    // 客户端只考虑chrome下使用，所以是CLodop；
    // 这份文件只给vue上使用，所以有domTipsContainer；
    if (needCLodop()) {
      try {
        LODOP = getCLodop() // eslint-disable-line
      } catch (err) {
      }
      if (!LODOP && document.readyState !== 'complete') {
        alert('网页还没下载完毕，请稍等一下再操作.')
        return
      }
      if (!LODOP) {
        domTipsContainer.innerHTML =
          strCLodopInstall1 + (CLodopIsLocal ? strCLodopInstall2 : '') + strCLodopInstall3
        return
      } else {
        // if (CLODOP.CVERSION < "3.0.7.5") {
        //     document.body.innerHTML = strCLodopUpdate + document.body.innerHTML;
        // }
        if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED)
        if (oOBJECT && oOBJECT.parentNode) {
          oOBJECT.parentNode.removeChild(oOBJECT)
        }
      }
    } else {
      var is64IE = isIE && !!ua.match(/x64/i)
      //= ====如果页面有Lodop就直接使用，没有则新建:==========
      if (oOBJECT || oEMBED) {
        if (isIE) LODOP = oOBJECT
        else LODOP = oEMBED
      } else if (!CreatedOKLodop7766) {
        LODOP = document.createElement('object')
        LODOP.setAttribute('width', 0)
        LODOP.setAttribute('height', 0)
        LODOP.setAttribute(
          'style',
          'position:absolute;left:0px;top:-100px;width:0px;height:0px;'
        )
        if (isIE) {
          LODOP.setAttribute(
            'classid',
            'clsid:2105C259-1E0C-4534-8141-A753534CB4CA'
          )
        } else LODOP.setAttribute('type', 'application/x-print-lodop')
        document.documentElement.appendChild(LODOP)
        CreatedOKLodop7766 = LODOP
      } else LODOP = CreatedOKLodop7766
      //= ====Lodop插件未安装时提示下载地址:==========
      if (!LODOP || !LODOP.VERSION) {
        if (ua.indexOf('Chrome') >= 0) {
          document.body.innerHTML = strHtmChrome + document.body.innerHTML
        }
        if (ua.indexOf('Firefox') >= 0) {
          document.body.innerHTML = strHtmFireFox + document.body.innerHTML
        }
        document.body.innerHTML =
          (is64IE ? strHtm64Install : strHtmInstall) + document.body.innerHTML
        return LODOP
      }
    }
    // 注释不自动更新
    // if (LODOP.VERSION < "6.2.2.6") {
    //     if (!needCLodop())
    //         document.body.innerHTML = (is64IE ? strHtm64_Update : strHtmUpdate) + document.body.innerHTML;
    //     return LODOP;
    // }
    //= ==如下空白位置适合调用统一功能(如注册语句、语言选择等):==
    LODOP.SET_LICENSES(
      '中山志特铝模科技有限公司',
      'FB3450258EE17DEA2B7862E8A683CAF5',
      '中山誌特鋁模科技有限公司',
      '8DA959A3BB6332D73781C3686D89604F'
    )
    LODOP.SET_LICENSES(
      'THIRD LICENSE',
      '',
      'Zhongshan Zhite Aluminum Mould Technology Co., Ltd',
      'BC87D251A176F44DD893B439C896CDE4'
    )

    //= ======================================================
    return LODOP
  } catch (err) {
    alert('getLodop出错:' + err)
  }
}

function handlePrint (title, dom_id, domTipsContainer, list) {

  let LODOP = getLodop(undefined, undefined, domTipsContainer);

  LODOP.PRINT_INITA('5mm', '5mm', '200mm', '285mm', title);
  LODOP.SET_PRINT_PAGESIZE(1, "210mm", "297mm", 'A4');
  LODOP.SET_PRINT_MODE("POS_BASEON_PAPER", true);
  LODOP.SET_PRINT_MODE("RESELECT_PAGESIZE", true);
  LODOP.SET_PRINT_MODE("RESELECT_ORIENT", true);
  // LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", 'Width:90%;Height:90%');

  const strStyleHtml = `<style>${getStyle()}</style>`;

  if (list ) {
    list.forEach((item, index) => {
      const domA = document.getElementById(`print_index_${dom_id}_${index}`);
      // const domB = document.getElementById('audit-detail-print-content');
      // const domC = document.getElementById('audit-detail-print-record');

      const strDomA = `<body>${domA?.innerHTML}</body>`;
      // const strDomB = `<body>${domB.innerHTML}</body>`;
      // const strDomC = `<body>${domC.innerHTML}</body>`;

      // LODOP.ADD_PRINT_TEXT('7mm', '0mm', '200mm', '8mm', title);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
      LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);

      LODOP.ADD_PRINT_HTM('12mm', '0mm', '200mm', '260mm', '<!DOCTYPE html>' + `${strStyleHtml}${strDomA}`);

      LODOP.ADD_PRINT_LINE('1mm', '0mm', '1mm', '200mm', 2, 0);
      LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);
      LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 75);

      // LODOP.ADD_PRINT_HTM('3mm', '0mm', '200mm', '40mm', '<!DOCTYPE html>' + `${strStyleHtml}${strDomB}`);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);
      // LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 300);

      // LODOP.ADD_PRINT_LINE('1mm', '0mm', '1mm', '200mm', 2, 0);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);
      // LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 75);

      // LODOP.ADD_PRINT_HTM('3mm', '0mm', '200mm', '40mm', '<!DOCTYPE html>' + `${strStyleHtml}${strDomC}`);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);

      // LODOP.ADD_PRINT_LINE('1mm', '0mm', '1mm', '190mm', 2, 0);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);

      // LODOP.ADD_PRINT_TEXT('0mm', '0mm', '45mm', '5mm', '23');
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 1);
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

      LODOP.ADD_PRINT_HTM(1, 600, 300, 100, "<style>*{font-size: 13px}</style>总页号：<font color='#0000ff'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span></font>");
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
      if (index < list.length - 1) {
        LODOP.NewPage()
      }
    })
  } else {
    const domA = document.getElementById(dom_id);
      // const domB = document.getElementById('audit-detail-print-content');
      // const domC = document.getElementById('audit-detail-print-record');

      const strDomA = `<body>${domA?.innerHTML}</body>`;
      // const strDomB = `<body>${domB.innerHTML}</body>`;
      // const strDomC = `<body>${domC.innerHTML}</body>`;

      // LODOP.ADD_PRINT_TEXT('7mm', '0mm', '200mm', '8mm', title);
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
      LODOP.SET_PRINT_STYLEA(0, 'Bold', 1);

      LODOP.ADD_PRINT_HTM('12mm', '0mm', '200mm', '260mm', '<!DOCTYPE html>' + `${strStyleHtml}${strDomA}`);

      LODOP.ADD_PRINT_LINE('1mm', '0mm', '1mm', '200mm', 2, 0);
      LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);
      LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 75);

      // LODOP.ADD_PRINT_HTM('3mm', '0mm', '200mm', '40mm', '<!DOCTYPE html>' + `${strStyleHtml}${strDomB}`);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);
      // LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 300);

      // LODOP.ADD_PRINT_LINE('1mm', '0mm', '1mm', '200mm', 2, 0);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);
      // LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 75);

      // LODOP.ADD_PRINT_HTM('3mm', '0mm', '200mm', '40mm', '<!DOCTYPE html>' + `${strStyleHtml}${strDomC}`);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);

      // LODOP.ADD_PRINT_LINE('1mm', '0mm', '1mm', '190mm', 2, 0);
      // LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);

      // LODOP.ADD_PRINT_TEXT('0mm', '0mm', '45mm', '5mm', '23');
      LODOP.SET_PRINT_STYLEA(0, "Alignment", 1);
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

      LODOP.ADD_PRINT_HTM(1, 600, 300, 100, "<style>*{font-size: 13px}</style>总页号：<font color='#0000ff'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span></font>");
      LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
  }



  // LODOP.PRINT_SETUP();
  // LODOP.PRINT_DESIGN();
  LODOP.PREVIEW();

  // 预留给业务类提取打印
  // this.LODOP.ADD_PRINT_URL(0, 0, '100%', '100%', "");
  // this.LODOP.SET_PRINT_STYLEA(0, "IDTagForPick", 'app');
  // // this.LODOP.SET_PRINT_STYLEA(0, "IDTagForPick", 'audit-detail-print-content');
  // // this.LODOP.PREVIEW();

}

export {
  getLodop,
  handlePrint
}
