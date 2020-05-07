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
        for (var i = 0; i <= 60; i++) {
            arr.push({
                id: i,
                type: i < 60 ? 'element' : 'text',
                content: i < 60 ? `【模板】模板${i}` : `这是文字${i}`
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
        $(".container section").off().on('click', '.wrap-header', function () {
            $(this).addClass('wrap-header-active').parent().siblings().find('.wrap-header').removeClass('wrap-header-active')
            let $section = $(this).parents('section')
            let dom = $(this).find('i')
            if ($(dom).attr('data-isopen') == 0) {
                $(dom).attr('data-isopen', 1)
                $($section).attr('isOpen', 'start')
                $(dom).removeClass('fa-angle-down')
                $(dom).addClass('fa-angle-up')
                $(this).siblings('div').slideDown(200)
            } else {
                $(dom).attr('data-isopen', 0)
                $($section).attr('isOpen', 'close')
                $(dom).addClass('fa-angle-down')
                $(dom).removeClass('fa-angle-up')
                $(this).siblings('div').slideUp(200)
            }
            let $Siblings = $section.siblings('section')
            $Siblings.each((index, $dom) => {
                if ($($dom).attr('isOpen') == 'start') {
                    $($dom).attr('isOpen', 'close')
                    $($dom).find('.wrap-content').slideUp(200)
                    $($dom).find('.switch').attr('data-isopen', 0)
                    $($dom).find('.switch').addClass('fa-angle-down').removeClass('fa-angle-up')
                }
            })
        })
        //创建更多模块
        $(".container .more").off().on('click', function () {
            $(this).before(createData(1))
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

        //选项卡
        $(".header-nav-ul").off().on('click', 'li', function () {
            let index = $(this).index()
            $(this).addClass('s_active').siblings().removeClass('s_active')
            // $(".select_content_box").find('div').eq(index).show().siblings().hide()
            $(".select_content_box").animate({
                left: - 917 * index
            }, 200)
        })

    }
    //promise async await 实践
    let promiseInit = () => {
        // Math.floor(Math.random()*10+1);
        let promise1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(1)
                // reject(1)
            }, 2000)
        })
        let promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(2)
            }, 1000)
        })
        let promise3 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(3)
            }, 3000)
        })
        $(".wrap-box").on('click', '.commonBtn', function () {
            $(this).addClass('commonBtn-active').siblings('span.commonBtn').removeClass('commonBtn-active')
            let id = $(this).attr('id')
            //promise串行加载....
            if (id == 'strandBtn') {
                $(".promiseBox").find('img').attr('src', '')
                $(".promiseBox").find('p').empty()
                let promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        let data = {
                            headImg: 'lb.jpg',
                            describe: '1、刘备(161-223)，221年至223年在位。蜀汉照烈皇帝，字玄德，涿郡(今河北省涿县)人，汉景帝之子中山靖王刘胜的后代。少年时孤独贫困，与母亲贩鞋子、织草席为生，后与关羽、张飞于桃园结义为异姓兄弟。剿除黄巾军有功，任安喜县尉。经常寄人篱下，先后投靠过公孙瓒、陶谦、曹操、袁绍、刘表等。建安十二年(207)，徐庶荐举诸葛亮，刘备三顾茅庐请出诸葛亮为军师，率军攻占了荆州、益州、汉中。于公元221年正式称帝，定都成都，国号汉，年号章武，史称“蜀汉”。在替关羽、张飞报仇时，大举进攻吴国，被东吴陆逊用火攻打败，不久病死于白帝城，享年63岁。'
                        }
                        $(".cont-1 img").attr('src', `../JS常用技巧/image/sg/${data.headImg}`)
                        $(".cont-1 p").text(data.describe)
                        resolve(data)
                    }, 300)
                })
                promise.then((res) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            let data = {
                                headImg: 'gy.jpg',
                                describe: '2、关羽(?-220)，刘备的义弟，五虎大将排名第一位。字云长，本字长生，河东解县(今山西省临猗西南)人。因战乱而逃亡至涿郡。其后与张飞一起追随刘备。曾在汜水关前斩华雄，虎牢关前战吕布而闻名天下。官渡之战前被俘，被曹操拜为偏军，封汉寿亭侯，为曹杀了袁绍名将颜良、文丑。后千里走单骑，骑坐赤兔马，提一口青龙偃月刀，过五关斩六将，终于回到刘备身边。后攻曹仁于樊城，水淹七军，收降曹操大将于禁，杀庞德，让华佗刮骨疗毒，威名远扬。'
                            }
                            $(".cont-2 img").attr('src', `../JS常用技巧/image/sg/${data.headImg}`)
                            $(".cont-2 p").text(data.describe)
                            resolve(data)
                        }, 200)
                    })
                }).then((res) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            let data = {
                                headImg: 'zf.jpg',
                                describe: '3、张飞(?-221)，刘备义弟，五虎大将中第二位。字翼德，涿郡(今河北省涿县)人。少时即与关羽共事刘备。曾在虎牢关与关羽、刘备一起迎战吕布。长坂坡桥头上一声吼，吓退曹操百万军。葭萌关夜战马超，一支丈八蛇矛勇冠三军。刘备入川以后拜本骑将军，封西乡侯。公元221年为替二哥关羽报仇，同刘备起兵攻伐东吴。临行前，因鞭挞士卒被部将范疆、张达刺杀，死时只有55岁。'
                            }
                            $(".cont-3 img").attr('src', `../JS常用技巧/image/sg/${data.headImg}`)
                            $(".cont-3 p").text(data.describe)
                            resolve(data)
                        }, 100)
                    })

                })
                //Promise.all并行加载....
            } else if (id == 'parallelBtn') {
                Promise.all([promise1, promise2, promise3]).then((res) => {
                    //全部成功打印
                    console.log(res)
                }, err => {
                    //一处异常打印
                    console.log(err)
                })
            } else if (id == 'parallelBtn2') {
                //竞速模式
                Promise.race([promise1, promise2, promise3]).then((res) => {
                    console.log(res)
                }, err => {
                    console.log('error')
                    console.log(err)
                })
            } else if (id == 'asyncAwait') {
                //例子《描述方法B依赖方法A的返回结果》
                async function a() {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve({
                                name: "张三"
                            })
                        }, 1000)
                    })

                }
                async function b() {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve({
                                age: 18
                            })
                        }, 3000)
                    })
                }

                async function fn() {
                    console.log('1 await 前面')
                    let result1 = await b();
                    console.log(result1)
                    let result2 = await a();
                    console.log(result2)
                    console.log('3 await 后面')
                }
                fn()
            }
        })

    }
    //动画深入浅出
    let animationFn = () => {
        $(".option-box").off().on('click', 'span', function () {
            if ($(this).hasClass('move')) {
                $(".looadbar").animate({
                    opacity: 1,
                    background: '#2980b9',
                    width: "100%"
                }, {
                    duration: 1000,
                    complete: function () {
                        $(this).css({
                            width: 0,
                            opacity: 0.25,
                        })
                    }
                })
            } else if ($(this).hasClass('step')) {
                let strHtml = ``
                for (var i = 0; i < 15; i++) {
                    let content = '【详细说明】园区集团机关党支部自5月份批复设立以来，严格对照党章党规要求，压实责任推动全员学习，不断强化政治理论学习，扎实推进学习教育常态化制度化，努力把学习贯彻习近平系列讲话精神和十九大精神转化为推动集团持续健康发展的强大动力'
                    if (i == 13) {
                        content = `【详细说明】Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of..., while others prefer...
                        基于个人经历、个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市个性类型和情感关注的不同，我们发现有人持……的观点，而另外一些人则更喜欢……
                        例句：Depending on personal experience, personal type and emotion concern, we find that some people hold the idea of living in the small town, while others prefer the big city.
                        基于个人经历、个性类型和情感关注的不同，我们发现有人喜欢生活在小城镇，而另外一些人则更喜欢大城市。`
                    }
                    strHtml += ` <section class="s-modular"><i></i>
                    <span class="s-m-type">类型</span>
                    <div class="s-m-info">
                        <span class="s-m-title">【版权${i}】保留所有权利</span>
                        <span class="s-m-remark">${content}</span>
                    </div>
                </section>`
                }
                $(".s-step").html(strHtml).slideDown(200)
            }
        })
    }

    let initDownEvent = () => {
        $(".c-combox-ipt").off().on('click', function () {
            $(".c-combox-ul").show()
            $(".c-combox-ul").animate({
                opacity: 1,
                top: 33
            }, {
                duration: 160
            })
        })
        $(document).bind("click", function (e) {
            var con_one = $(".c-combox-ipt");// 设置目标区域
            if (!con_one.is(e.target) && con_one.has(e.target).length === 0) {
                // $(".c-combox-ul").slideUp(200);//需要隐藏的元素
                $(".c-combox-ul").animate({
                    opacity: 0,
                    top: 133
                }, {
                    duration: 160
                })
            }
        });
    }
    
    //检测类型
    let isArray = (arr) => {
        return Object.prototype.toString.call(arr) === "[object Array]";
    }
    return {
        init: () => {
            renderTempData()
            bindEvent()
            animationFn()
            promiseInit()
            initDownEvent()
        }
    }
}()