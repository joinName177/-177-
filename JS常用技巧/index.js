/*
* @Description: JS
* @Author: CHENGZQ
* @Date: 2019-12-17 10:38:00
* @LastEditTime: xxxxxxxxxxxxxxxxxxx
* @LastEditors: Please set LastEditors
* */

const TempSkill = function () {
    //知识点一:
    /*************************************模板消息核心方法START************************************************/
    //插入DOM节点
    let insertHtmlToRange = (domNode, inputTarget) => {
        if (domNode == null || inputTarget == null) {
            return;
        }
        var sel = null;
        var rang = null;
        if (window.getSelection()) {
            sel = window.getSelection();
            rang = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
            if (rang === null) {
                var message = "无法插入内容";
                $.tipsWindown({
                    content: 'text:' + message,
                    singleButton: true
                });
                return;
            }
            rang.deleteContents();
            // 如果选择的对象是输入框时执行操作
            if (sel.focusNode === inputTarget.innerHTML ||
                sel.focusNode.parentElement === inputTarget ||
                sel.focusNode === inputTarget) {
                rang.insertNode(domNode);
            } else {
                var tipMessage = "无法插入内容，请检查焦点是否在输入框中";
                $.tipsWindown({
                    content: 'text:' + tipMessage,
                    singleButton: true
                });
                return;
            }
            //光标移动至末尾
            if (document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("Range", "2.0")) {
                var tempRange = document.createRange();
                var chatmessage = inputTarget;
                var position = rang.endOffset;
                tempRange.selectNodeContents(chatmessage);
                tempRange.setStart(rang.endContainer, rang.endOffset);
                tempRange.setEnd(rang.endContainer, rang.endOffset);
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        } else { //ie9 以下版本
            textRange = document.selection.createRange();
            if (textRange === null) {
                var message = "无法插入内容";
                $.tipsWindown({
                    content: 'text:' + message,
                    singleButton: true
                });
                return;
            }
            //插入 dom节点
            textRange.collapse(false)
            textRange.pasteHTML(domNode.outerHTML);
            textRange.select();
        }
    }
    //写入内容
    let insertChange = (a, b) => {
        b ?
            document.execCommand(a, false, b) :
            document.execCommand(a, true, null)
    }
    //计算宽度
    let autoInpWidth = (val) => {
        var txtLen = val.length + 1
        return txtLen * 14
    }
    //选择模板
    let choiceTemp = (e) => {
        e.stopPropagation()
        $(".info-list").slideDown(200)
        //获得当前选区
        let constituency = document.querySelector("#infoTemplate");
        let _focus = $("#infoTemplate").is(":focus");
        if (!_focus) {
            if (window.getSelection) {
                constituency.focus()
                //创建range
                var range = window.getSelection();
                //range 选择obj下所有子内容
                range.selectAllChildren(constituency);
                //光标移至最后
                range.collapseToEnd();
            } else if (document.selection) {
                //创建选择对象
                var range = document.selection.createRange();
                //range定位到obj
                range.moveToElementText(constituency);
                //光标移至最后
                range.collapse(false);
                range.select();
            }
        }
    }
    //消息模板手动输入的文字转换为标签
    let queryDom = (dom) => {
        if (dom.nodeType == 1) {
            for (var i = 0; i < dom.childNodes.length; i++) {
                var _nowDom = dom.childNodes[i];
                if (_nowDom.nodeType == 1) {
                    queryDom(_nowDom)
                } else if (_nowDom.nodeType == 3) {
                    if (_nowDom.parentNode.tagName === "INPUT") return
                    var _replaceNode = document.createElement('span')
                    _replaceNode.className = 'operation'
                    _replaceNode.innerText = _nowDom.nodeValue;
                    _nowDom.parentNode.replaceChild(_replaceNode, _nowDom);
                }

            }
        }
    }
    let transformStr = (str) => {
        var _dom = document.createElement('div');
        _dom.innerHTML = str;
        queryDom(_dom);
        return _dom.innerHTML
    }

    /*************************************模板消息核心方法END************************************************/

    let createData = (len) => {
        let htm = ''
        for (var i = len; i--;) {
            htm += `<section>
                    <div class="wrap-header">
                        <span>标题_${i}</span>
                        <i class="fa fa-angle-down fa-2x switch" data-isopen="0"></i>
                    </div>
                    <div class="wrap-content"></div>
                </section>`
        }
        return htm
    }

    //模拟渲染模板控件
    let renderTempData = () => {
        let arr = []
        for (var i = 0; i <= 20; i++) {
            arr.push({
                id: i,
                type: i < 18 ? 'element' : 'text',
                content: i < 18 ? `【模板】模板${i}` : `这是文字${i}`
            })
        }
        let domStr = ''
        for (var i = 0; i < arr.length; i++) {
            let _val = arr[i].content
            if (arr[i].type == 'element') {
                let _width = autoInpWidth(_val) + 3
                domStr += `<input style="width:${_width}px" class="selList" data-id="${arr[i].id}"  value="${_val}" disabled/>`
            } else {
                domStr += `<span class="operation">${_val}</span>`
            }
        }

        $("#infoTemplate").html(domStr)
    }

    let bindEvent = () => {
        $('.news-template-content').keypress(function (event) {
            if (event.keyCode == 13 || event.charCode == 13) {
                insertHtmlToRange($('<br/>')[0], this);
                return false;
            }
        })
        //模块开关事件
        $(".container section").off().on('click', '.switch', function () {
            let $section = $(this).parents('section')
            if ($(this).attr('data-isopen') == 0) {
                $(this).attr('data-isopen', 1)
                $($section).attr('isOpen', 'start')
                $(this).removeClass('fa-angle-down')
                $(this).addClass('fa-angle-up')
                $(this).parent().siblings('div').slideDown(200)
            } else {
                $(this).attr('data-isopen', 0)
                $($section).attr('isOpen', 'close')
                $(this).addClass('fa-angle-down')
                $(this).removeClass('fa-angle-up')
                $(this).parent().siblings('div').slideUp(200)
            }

            let $Siblings = $section.siblings('section')

            $Siblings.each((index, dom) => {
                if ($(dom).attr('isOpen') == 'start') {
                    $(dom).attr('isOpen', 'close')
                    $(dom).find('.wrap-content').slideUp(200)
                    $(dom).find('.switch').attr('data-isopen', 0)
                    $(dom).find('.switch').addClass('fa-angle-down').removeClass('fa-angle-up')
                }
            })
        })
        //创建更多模块
        $(".container .more").off().on('click', function () {
            $(this).before(createData(30))
            bindEvent()
        })

        $(".plus-btn").off().on('click', (e) => choiceTemp(e))
        $(".tra-btn").off().on('click', () => {
            let msgHtml = $("#infoTemplate").html()
            $("#infoTemplate").html(transformStr(msgHtml))
        })
        $(".info-list").on('click', 'li', function (e) {
            e.preventDefault()
            let _val = $(this).text()
            let _id = $(this).attr('data-id')
            let _width = autoInpWidth(_val) + 3
            var selVal = `<input style="width:${_width}px" class="selList" data-id="${_id}"  value="${_val}" disabled/>`
            insertChange('insertHTML', selVal)
        })
        //点击空白处关闭下拉
        $(document).click(function (e) {
            // 设置目标区域
            var _con = $(".col");
            if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                $(".info-list").slideUp(200)
            }
        });
    }
    return {
        init: () => {
            renderTempData()
            bindEvent()
        },
    }
}()