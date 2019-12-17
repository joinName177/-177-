/*
* @Description: JS
* @Author: CHENGZQ
* @Date: 2019-12-17 10:38:00
* @LastEditTime: xxxxxxxxxxxxxxxxxxx
* @LastEditors: Please set LastEditors
* */

const TempSkill = function () {

    /**模板消息核心方法START */
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

    let insertChange = (a, b) => {
        b ?
            document.execCommand(a, false, b) :
            document.execCommand(a, true, null)
    }

    let autoInpWidth = (val) => {
        var txtLen = val.length + 1
        return txtLen * 14
    }

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

    /**模板消息核心方法END */

    let createData = (len) => {
        let htm = ''
        for (var i = len; i--;) {
            htm += `<section>
                    <div class="wrap-header">
                        <span>标题_${i}</span>
                        <i class="fa fa-angle-down fa-2x switch" data-isopen="1"></i>
                    </div>
                    <div class="wrap-content"></div>
                </section>`
        }
        return htm
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
            if ($(this).attr('data-isopen') == 0) {
                $(this).attr('data-isopen', 1)
                $(this).addClass('fa-angle-down')
                $(this).removeClass('fa-angle-up')
            } else {
                $(this).attr('data-isopen', 0)
                $(this).removeClass('fa-angle-down')
                $(this).addClass('fa-angle-up')
            }
            $(this).parent().siblings('div').slideToggle(200)
        })
        //创建更多模块
        $(".container .more").off().on('click', function () {
            $(this).before(createData(30))
            bindEvent()
        })

        $(".plus-btn").off().on('click', (e) => choiceTemp(e))

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
            bindEvent()
        },
    }
}()