/**
 * 日期格式转换
 * @param {定义日期格式} format 
 * @param {时间戳} date 
 */
let DateFormats = (format, date) => {
    if (!date) {
        date = new Date();
    } else {
        date = new Date(parseInt(date));
    }
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    var o = {
        "y+": date.getYear(), //year
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "h+": date.getHours(), //hour
        "H+": date.getHours(), //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        "S": date.getMilliseconds(), //millisecond
        "w": Week[date.getDay()]
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

let MyCommon = function() {
    /**
     * By ChangKui
     */
    const electron = nodeRequire('electron')
    const service = electron.remote.getGlobal("sharedObject").service
    const server = electron.remote.getGlobal("xmpp").server
    const loginService = electron.remote.getGlobal("sharedObject").loginService
    const fileService = electron.remote.getGlobal("sharedObject").fileService
    const session = electron.remote.session;
    const ipc = electron.ipcRenderer
        // 记录点击空白处显示的节点
    let blankShowObj = {
        showDom: '',
        type: 0, //0：使用hide隐藏，1：使用添加类名的方式隐藏
        hideClass: '' //隐藏时用的类名 （type==1的时候使用）
    };
    let myfn = {
        /**
         * 日期格式转换
         * @param {定义日期格式} format 
         * @param {时间戳} date 
         */
        dateFormats: (format, date) => {
            if (!date) {
                date = new Date();
            } else {
                date = new Date(date);
            }
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            var o = {
                "y+": date.getYear(), //year
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(), //day
                "h+": date.getHours(), //hour
                "H+": date.getHours(), //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds(), //millisecond
                "w": Week[date.getDay()]
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        /**
         * 分页器
         * pageDom 绑定的分页节点名
         * currentPage 当前页
         * totalPages 总页数
         * pageSize 每页条数
         * fn 点击分页按钮调用的匿名函数function(){内嵌查询列表数据的函数}
         */
        pager: (pageDom, currentPage, totalPages, pageSize, fn) => {
            $.jqPaginator(pageDom, {
                    totalPages: parseInt(totalPages),
                    visiblePages: 6,
                    currentPage: parseInt(currentPage),
                    first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                    prev: '<li class="prev"><a href="javascript:void(0);"><i class="arrow_left"></i></a></li>',
                    next: '<li class="next"><a href="javascript:void(0);"><i class="arrow_right"></i></a></li>',
                    last: '<li class="last"><a href="javascript:void(0);">末页</a></li>',
                    page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                    onPageChange: function(currentPage, type) {
                        if (type == "change") {
                            $(pageDom).siblings('#currentPage').val(currentPage);
                            fn(currentPage, pageSize);
                        }
                    }
                })
                //初始显示
            $(pageDom).parent().find(".select_page_size").attr('data-pagesize', pageSize);
            $(pageDom).parent().find(".select_page_size").find(".select_page_size_num").html(`${pageSize}/页`)
            $(pageDom).parent().find(".select_page_size").find(".page_size_list_box>li").removeClass('active')
            $(pageDom).parent().find(".select_page_size").find(".page_size_list_box>li[data-num='" + pageSize + "']").addClass('active')
                /**选择pageSize */
            $(pageDom).parent().find(".select_page_size").off('click').on('click', function() {
                $(this).find(".page_size_list_box").show()
                $(this).find('em').addClass('active')
            })
            $(document).on('click', function(e) {
                var _con = $('.select_page_size'); // 设置目标区域
                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    $('.page_size_list_box').hide()
                    $('.select_page_size').find('em').removeClass('active')
                }
            });
            //选择每页展示条数
            $(pageDom).parent().find(".select_page_size").find(".page_size_list_box>li").off('click').on('click', function(e) {
                $(this).parent().find('li').removeClass("active")
                $(this).addClass('active')
                    //赋值
                $(this).parents(".select_page_size").find(".select_page_size_num").html(`${$(this).html()}/页`)
                    // let _currentPage = $(pageDom).siblings('#currentPage').val();
                let _currentPage = 1
                    //未退出之前记住选择条数
                electron.remote.getGlobal("sharedObject").pageSize = $(this).html()
                fn(_currentPage, $(this).html());
                setTimeout(() => {
                    $('.page_size_list_box').hide()
                }, 200);
            })
        },
        /**
         * 保存cookie
         * @param name  cookie名称
         * @param value cookie值
         * @param time  存储时间
         * @param dateType 存储时间类型 d:按天，h:小时，m:分钟
         */
        setCookie: (name, value, time, dateType) => {
            let dateLong = time * 60 * 60; //默认按小时
            if (dateType == 'd') {
                dateLong = time * 24 * 60 * 60;
            } else if (dateType == 'h') {
                dateLong = time * 60 * 60;
            } else if (dateType == 'm') {
                dateLong = time * 60;
            }
            let exp = new Date();
            let date = Math.round(exp.getTime() / 1000) + dateLong;
            const cookie = {
                url: loginService,
                name: name,
                value: value,
                hostOnly: true,
                httpOnly: false,
                expirationDate: date
            };
            session.defaultSession.cookies.set(cookie, (error) => {
                if (error) console.error(error);
            });
        },
        // =================求两个日期的间隔===============//
        diffTime: (startDate, endDate) => {
            let stime = Date.parse(new Date(startDate));
            let etime = Date.parse(new Date(endDate));
            if (!startDate) {
                stime = Date.parse(new Date());
            }
            if (!endDate) {
                etime = Date.parse(new Date());
            }
            var usedTime = etime - stime; //两个时间戳相差的毫秒数
            var days = Math.floor(usedTime / (24 * 3600 * 1000));
            //计算出小时数
            var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            var time = days + "天" + hours + "时" + minutes + "分";
            return { day: days, hour: hours, minute: minutes };
        },
        /**
         * 根据对象某字段排序
         * property 字段
         * type 排序类型 0正序 1逆序
         */
        compareJson: (property, type) => {
            return function(a, b) {
                let value1 = parseInt(a[property]);
                let value2 = parseInt(b[property]);
                let diff = value1 - value2;
                if (type == 1) {
                    diff = value2 - value1;
                }
                return diff;
            };
        },
        /**
         * 比较两个数组不同的元素（arr1比arr2多的元素）
         * @param {*} arr1 
         * @param {*} arr2 
         */
        diffArr: (arr1, arr2) => {
            let a = [];
            let b = [];
            for (let i = 0; i < arr2.length; i++) {
                a[arr2[i]] = true;
            }
            for (let i = 0; i < arr1.length; i++) {
                if (!a[arr1[i]] && arr1[i] != null) {
                    b.push(arr1[i]);
                }
            }
            return b;
        },
        /**
         * 验证四则运算公式是否正确
         * checkOnlyVal 是否检查纯数值情况
         */
        checkFormula: (string, obj, checkOnlyVal) => {
            // console.log(string);
            // 剔除空白符
            string = string.replace(/\s/g, '');
            // 错误情况，空字符串
            if ("" === string) {
                // return false;
            }
            if (/^[\x\÷\+\-\*\/]/.test(string)) {
                // console.error(& amp; quot; 运算符开头 & amp; quot;);
                return false;
            }
            //错误情况，运算符结尾
            if (/[\x\÷\+\-\*\/]$/.test(string)) {
                // console.error(& amp; quot; 运算符结尾 & amp; quot;);
                return false;
            }
            // 错误情况，(后面是运算符或者)
            if (/\([\x\÷\+\-\*\/]/.test(string)) {
                // console.error(& amp; quot; (后面是运算符或者) & amp; quot;);
                return false;
            }
            // 错误情况，运算符连续
            if (/[\x\÷\+\-\*\/]{2,}/.test(string)) {
                return false;
            }
            // 空括号
            if (/\(\)/.test(string)) {
                return false;
            }
            // 错误情况，括号不配对
            var stack = [];
            for (var i = 0, item; i < string.length; i++) {
                item = string.charAt(i);
                if ('(' === item) {
                    stack.push('(');
                } else if (')' === item) {
                    if (stack.length > 0) {
                        stack.pop();
                    } else {
                        return false;
                    }
                }
            }

            if (0 !== stack.length) {
                return false;
            }

            // 错误情况，(后面是运算符 
            // if (/\([\x\÷\+\-\*\/]/.test(string)) {
            //     return false;
            // }

            // 错误情况，)前面是运算符
            if (/[\x\÷\+\-\*\/]\)/.test(string)) {
                return false;
            }

            // // 错误情况，(前面不是运算符
            // if (/[\x\÷\+\-\*\/]\(/.test(string)) {
            //     return false;
            // }

            // // 错误情况，)后面不是运算符
            // if (/\)[\x\÷\+\-\*\/]/.test(string)) {
            //     return false;
            // }

            // 错误情况，变量没有来自“待选公式变量”
            // var tmpStr = string.replace(/[\(\)\x\÷\+\-\*\/]{1,}/g, '`');
            // var array = tmpStr.split(',');
            // for (let i = 0, item; i < array.length; i++) {
            //     item = array[i];
            //     if (/[A-Z]/i.test(item) && 'undefined' == typeof (obj[item])) {
            //         return false;
            //     }
            // }
            // let stringarr = string.split(',');
            // let objarr = Object.keys(obj);
            // for (let index = 0; index < stringarr.length; index++) {
            //     if (objarr.indexOf(stringarr[index]) > -1) {
            //         if (stringarr[index + 1]==undefined){
            //         } else if (stringarr[index + 1] !== '+' && stringarr[index + 1] !== '.' && stringarr[index + 1] !== '-' && stringarr[index + 1] !== 'x' && stringarr[index + 1] !== '÷' && stringarr[index + 1] !== '(' && stringarr[index + 1] !== ')'){
            //                 return false 
            //         } 
            //     } 
            // }
            if (checkOnlyVal && obj.length > 0) {
                let onlyVal = false;
                if ($(obj).find('.countValItem').length == 1) {
                    return false;
                }
                $(obj).find('.countValItem').each(function(i, dom) {
                    if ($(dom).next().hasClass('countValItem')) {
                        onlyVal = true;
                        return false;
                    }
                });
                if (onlyVal) {
                    return false;
                }
            }
            return true;
        },
        /**
         * 数字每三位加逗号处理
         */
        thousands: (num) => {
            let splits = [],
                res = [];
            let hasF = false
                //判断负数时
            if (num.indexOf('-') != -1) {
                num = num.replace(/\-/g, '')
                hasF = true
            }
            splits = num.toString().split(".");
            splits[0].split("").reverse().map(function(item, i) {
                if (i % 3 == 0 && i != 0) { res.push(","); }
                res.push(item);
            });
            return (hasF ? '-' : '') + res.reverse().join("") + (splits.length > 1 ? "." + splits[1] : "");
        },
        /**
         * 控制输入框只能输入数字、小数
         * @param {输入框} obj 
         * fix 小数位数
         */
        clearNoNum: (obj, fixNum) => {
            let getStart = $(obj)[0].selectionStart
                //先把非数字的都替换掉，除了数字和.
            obj.val(obj.val().replace(/[^\d.]/g, ""));
            //保证只有出现一个.而没有多个.
            obj.val(obj.val().replace(/\.{2,}/g, "."));
            //必须保证第一个为数字而不是.
            obj.val(obj.val().replace(/^\./g, ""));

            //第一个可为负数字符（‘-’）或数字
            // obj.val(obj.val().replace(/\D/, ""));  

            //保证.只出现一次，而不能出现两次以上
            let fix = '.'
            if (fixNum == 0) {
                fix = ''
            }
            obj.val(obj.val().replace(".", "$#$").replace(/\./g, "").replace("$#$", fix));
            //只能输入两个小数
            // obj.val(obj.val().replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
            //只能输入fixNum小数
            let value = obj.val();
            if (value.indexOf('.') > -1) {
                if (value.split('.')[1].length > fixNum) {
                    obj.val(value.substring(0, value.length - 1))
                }
            }
            $(obj)[0].selectionStart = getStart;
            $(obj)[0].selectionEnd = getStart;
        },
        /**
         * 对象数组去重
         * arr：要去重的数组
         * keyName：去重依据对象的一个键名
         */
        objArrUnique(arr, keyName) {
            const res = new Map();
            return arr.filter((a) => !res.has(a[keyName]) && res.set(a[keyName], 1));
        },
        /*****************************自定义下拉菜单********************** */
        /**
         * areaDom：下拉菜单容器
         * paramObj:{
         * afterSelect:选择菜单选项确定后
         * }
         */
        setSelectEvent: (areaDom, paramObj) => {
            let optlist = $(areaDom).find('.select-list')
                //下拉框绑定事件
            let roleSpan = $(areaDom).find('.role-span')
            if ($(areaDom).find('.role-spans').length > 0) {
                roleSpan = $(areaDom).find('.role-spans')
            }
            roleSpan.off('click').on('click', () => {
                if (optlist.is(':hidden')) {
                    optlist.show();
                } else {
                    optlist.hide();
                }
                // 点击空白处隐藏
                MyCommon.blankClick({
                    bindDom: $('body'),
                    targetDom: $(areaDom),
                    showDom: optlist,
                });

            })

            //下拉框选择绑定事件
            $(areaDom).find('.select-list li').off().on('click', function(e) {
                let _text = $(this).html();
                // 下拉选项id
                let _id = $(this).attr('data-val');
                // 选项类型
                let type = $(this).attr('data-type') || 2;
                // 拓展的其他数据对象
                let dataObj = $(this).attr('data-dataobj') || {};
                optlist.hide();
                $(this).parents('.mySelPlug').find('.sel-show-txt').text(_text).attr('data-val', _id).attr('data-type', type);
                if (paramObj) {
                    if (paramObj.afterSelect) {
                        paramObj.afterSelect({
                            id: _id,
                            name: _text,
                            dataObj: dataObj
                        });
                    }
                }
            })
        },
        /*****************************右键菜单********************** */
        /**
         * 右键菜单生成
         * rowObj：单行数据缓存
         * fromType：来源
         * boxDom：生成菜单的容器（父）节点
         * posDom：用于计算位置的父节点（一般情况与boxDom相同）
         * menuName：菜单节点名（id或类名）
         * content：菜单内容代码
         * skewX:  横向最大宽度 用于计算偏移量
         * skewY:  纵向最大高度 用于计算偏移量
         * noSkewX:为true则不考虑横向偏移溢出情况，不计算偏移量
         * noSkewY:为true则不考虑纵向偏移溢出情况，不计算偏移量
         * triggerDom 当前触发节点对象
         * triggerType：触发类型：1：点击更多按钮；0或不传：右键触发
         * blankClickNo：是否不使用点击空白隐藏节点的方法
         * menuName：菜单节点 类名或id 
         * showExclude:需要排除的节点，点击此节点区域不触发点击空白隐藏方法
         * afterAdd:菜单创建完成后的回调
         */
        rightOptMenuShow: (options) => {
            // 默认参数
            let defaults = {
                noSkewX: false,
                noSkewY: false,
                menuName: '.taskRightMenu',
                blankClickNo: false
            }
            let info = $.extend({}, defaults, options);
            // 防止滚动条突然滚动，先不隐藏之前生成的菜单,继续占位
            $(info.menuName).addClass('rightMenuOld').css({
                opacity: 0
            });
            // 获取鼠标位置
            let e = event || window.event;
            let movex = 0,
                movey = 0;
            if (e.pageX || e.pageY) {
                movex = e.pageX;
                movey = e.pageY
            }
            // 点击更多按钮触发菜单时，菜单初始计算位置按点击按钮位置计算
            if (info.triggerType == 1) {
                // 170：菜单最小宽度
                movex = info.triggerDom.offset().left + info.triggerDom.outerWidth() - 170;
                movey = info.triggerDom.offset().top + info.triggerDom.outerHeight();
            }
            //菜单父元素滚动高度
            let yTop = info.posDom.scrollTop();
            // 菜单位置设置
            let setTop = movey - info.posDom.offset().top + yTop;
            let setLeft = movex - info.posDom.offset().left;
            // 横向溢出情况，自动向左偏移
            // 横向偏移量：如果当前计算位置加菜单最大宽度大于内容宽度，则减去菜单最大宽度
            let skewX = info.skewX ? info.skewX : 0; //偏移量
            if (!info.noSkewX && setLeft + skewX > info.posDom.width()) {
                setLeft = info.posDom.width() - skewX
            }
            // 纵向偏移量：如果当前计算位置加菜单最大高度大于内容总高度，则减去菜单最大高度
            let skewY = info.skewY ? info.skewY : 0;
            if (!info.noSkewY && setTop + skewY > info.posDom[0].scrollHeight) {
                setTop = info.posDom[0].scrollHeight - skewY;
            }
            // 已计算正确位置则移除旧菜单
            $('.rightMenuOld').remove();
            // 添加菜单
            info.boxDom.append(info.content);
            $(info.menuName).css({
                'top': setTop + 'px',
                'left': setLeft + 'px'
            });
            $(info.menuName).show();
            // ===子菜单移入移出事件===//
            let subMenuItem = $(info.menuName).find('.optBtnItem.incChildItem');
            let showExclude = $(info.menuName);
            if (info.showExclude) {
                showExclude = info.showExclude;
            }
            // 是否不使用点击空白处隐藏节点方法
            if (!info.blankClickNo) {
                // 点击空白列表按钮消失
                // 点击空白隐藏的方法需要的参数
                let blankClickParam = {
                    bindDom: $('body'),
                    targetDom: $(info.menuName),
                    showDom: $(info.menuName),
                    showExclude: showExclude,
                }
                if (info.blankClickParam) {
                    blankClickParam = info.blankClickParam;
                }
                MyCommon.blankClick(blankClickParam);
            }
            // 右键菜单子菜单事件
            MyCommon.subMenuEvent({
                subMenuNode: subMenuItem,
            });
            // ===========回调函数===========//
            // 菜单创建完成后
            if (info.afterAdd) {
                info.afterAdd();
            }
            return {
                setLeft: setLeft
            }
        },
        /**
         * 右键菜单子菜单事件
         * subMenuNode：子菜单节点
         * direction:默认0：显示到右侧 1显示在左侧
         * skewX: 左侧便宜量，direction==1时有效
         */
        subMenuEvent: (paramObj) => {
            let subMenuItem = paramObj.subMenuNode
            subMenuItem.off('mouseenter').on('mouseenter', function(ev) {
                let childTop = $(this).offset().top - 4;
                let childLeft = $(this).offset().left + $(this).innerWidth();
                if (paramObj.direction == 1) {
                    childLeft = $(this).offset().left - paramObj.skewX;
                }
                let subMenu = $(this).find('.optBtnMenuSub');
                subMenu.css({
                    top: childTop,
                    left: childLeft
                });
                subMenu.show();
            });
            subMenuItem.off('mouseleave').on('mouseleave', function(ev) {
                let subMenu = $(this).find('.optBtnMenuSub');
                subMenu.hide();
            });
        },
        /**
         * 点击空白处隐藏
         * targetDom:目标区域-点击此区域后显示节点（showDom）
         * showDom：此次点击显示的节点
         * otherBlank:其他需要排除的空白区域节点（点击此区域不会隐藏目标节点）
         * showExclude:隐藏上次显示的节点时，需要排除的节点区域（不常用，可不传，工作计划处有用到）
         * speed：显示隐藏过渡效果速度
         * hideDom：隐藏节点的类名或id，多个用逗号分隔（按查找节点的方式，类名加.，id加#）
         *          不传则默认为showDom
         * blankShowObj：{
         * type：隐藏方式：0-使用hide方法隐藏 1-添加类名隐藏
         * hideClass-使节点隐藏的类名（type==1时有效）
         * lastAfterHide:隐藏之前节点时是否也返回afterHide回调
         * }
         * afterHide：点击空白处隐藏节点后的回调函数
         */
        blankClick: (paramObj) => {
            let bindDom = paramObj.bindDom;
            let targetDom = paramObj.targetDom;
            let showDom = paramObj.showDom;
            let showExclude = paramObj.showExclude;
            let otherBlank = paramObj.otherBlank;
            let isHide = true;
            let speed = paramObj.speed ? paramObj.speed : 0;
            let hideDom = showDom;
            // 传了隐藏节点名时，点击空白处满足条件时将所传的节点进行隐藏，不传则默认为showDom
            if (paramObj.hideDom) {
                hideDom = $(paramObj.hideDom);
            }
            // 上次和本次点击是同一区域或者是需要排除的区域，则不隐藏
            if (blankShowObj.showDom) {
                if (targetDom.is(blankShowObj.showDom) || targetDom.has(blankShowObj.showDom).length > 0) {
                    isHide = false;
                }
                if (showExclude) {
                    if (showExclude.is(blankShowObj.showDom) || showExclude.has(blankShowObj.showDom).length > 0) {
                        isHide = false;
                    }
                }
                if (isHide) {
                    if (blankShowObj.type == 0) {
                        blankShowObj.showDom.hide(speed);
                    } else if (blankShowObj.type == 1) {
                        blankShowObj.showDom.addClass(blankShowObj.hideClass);
                    }
                    // 上次缓存的要隐藏的节点 隐藏后的回调
                    if (blankShowObj.lastAfterHide) {
                        blankShowObj.afterHide();
                    }
                }
            }
            blankShowObj = {
                showDom: showDom,
                type: paramObj.type || 0,
                hideClass: paramObj.hideClass || '',
                hideBefore:paramObj.hideBefore
            }
            bindDom.off('click').on('click', function(e) {
                let _con = targetDom; // 设置目标区域
                let blankHide = true;
                // 点击是否是当前节点或区域内节点
                if (_con.is(e.target)) {
                    blankHide = false;
                }
                if (_con.has(e.target).length != 0) {
                    blankHide = false;
                }
                // otherBlank其他需要排除的节点：点击不隐藏
                if (otherBlank) {
                    if (Array.isArray(otherBlank)) {
                        $.each(otherBlank, function(i, item) {
                            if ($(item).is(e.target)) {
                                blankHide = false;
                            }
                            if ($(item).has(e.target).length != 0) {
                                blankHide = false;
                            }
                        });
                    } else {
                        if ($(otherBlank).is(e.target)) {
                            blankHide = false;
                        }
                        if ($(otherBlank).has(e.target).length != 0) {
                            blankHide = false;
                        }
                    }

                }
                if (blankHide) {
                    // ====绑定同一节点点击后需要隐藏的所有相关节点==//
                    if (!paramObj.type) { //直接隐藏方式
                        hideDom.hide(speed);
                    } else if (paramObj.type == 1) { //使用添加类名方式隐藏
                        hideDom.addClass(paramObj.hideClass);
                    }
                    // 点击空白处确定触发隐藏节点操作后的回调
                    if (paramObj.afterHide) {
                        paramObj.afterHide();
                    }
                    blankShowObj = {
                        showDom: '',
                        type: 0, //0：使用hide隐藏，1：使用添加类名的方式隐藏
                        hideClass: '' //隐藏时用的类名 （type==1的时候使用）
                    };
                    bindDom.off('click');
                }
            });
        },
        /*****************************高级筛选********************** */
        /**
         * 高级筛选事件
         * optElm:点击的节点
         * paramObj:{
         * afterFliter:更新筛选条件后的回调函数
         * datePlug 日期控件绑定
         * }
         */
        filterEvent: (optElm, paramObj) => {
            let domBox = $(optElm).next();
            domBox.find('.filter-reset-box').off().on('click', function(e) { //重置
                if (!$(this).hasClass('disable')) {
                    MyCommon.resetFilterEvent(this, paramObj);
                }
            });

            domBox.find('.filter-status-big>li').off().on('click', function(e) {
                let thisActive = false
                if ($(this).hasClass('active')) {
                    thisActive = true;
                }
                $(this).parents('.filter-status-big').find('li.active').removeClass('active');
                if (!thisActive) {
                    $(this).addClass('active');
                }
                paramObj.afterFliter();
            });
            domBox.find('.filter-status-small>li').off().on('click', function(e) {
                let thisActive = false
                if ($(this).hasClass('active')) {
                    thisActive = true;
                }
                $(this).parents('.filter-status-small').find('li.active').removeClass('active');
                if (!thisActive) {
                    $(this).addClass('active');
                }
                paramObj.afterFliter();
            });
            domBox.find('.filter-level-list li').off('click').on('click', function(e) {
                paramObj.afterFliter();
            });
            //输入框回车搜索事件
            domBox.find('.filterSearchVal').off('keydown').on('keydown', function(event) {
                if (event.keyCode == "13") {
                    paramObj.afterFliter();
                }
            });
            //输入框搜索按钮事件
            domBox.find('.searchIcon').off('click').on('click', function(event) {
                paramObj.afterFliter();
            });

            //输入框回车搜索事件
            domBox.find('.filterTagSearchVal').off('keydown').on('keydown', function(event) {
                if (event.keyCode == "13") {
                    paramObj.afterFliter();
                }
            });
            //标签搜索按钮事件
            domBox.find('.searchTagIcon').off('click').on('click', function(event) {
                paramObj.afterFliter();
            });
            //“今天”按钮点击事件
            domBox.find('.search_today_btn').off('click').on('click', function(event) {
                    $(this).addClass('active');
                    $('#projectDateRangeInput').val('');
                    paramObj.afterFliter();
                })
                // 日期控件初始化
            paramObj.datePlug();
        },
        /**
         * 重置高级筛选
         * optElm:重置按钮
         */
        resetFilterEvent: (optElm, paramObj) => {
            let filterBox = $(optElm).parents('.filtersTermBox');
            $(optElm).removeClass('usable').addClass('disable').removeAttr('onclick');
            filterBox.find('.filterSearchVal').val('');
            filterBox.find('.filterTagSearchVal').val('');
            filterBox.find('.filters-item-con li.active').removeClass('active');
            filterBox.find('.search_today_btn').removeClass('active');
            filterBox.find('.filter-status-small>li').eq(0).addClass('active');
            filterBox.find('.belongDeptSel .sel-show-txt').val('all').text('所有部门');
            filterBox.find('.belongPostSel .sel-show-txt').val('all').text('所有岗位');
            // 日期控件初始化
            paramObj.datePlug();
            // 更新筛选条件后的回调函数
            paramObj.afterFliter();
        },
        /**
         * 检查筛选条件个数 更新重置筛选
         */
        checkFilter: (filterBox) => {
            let filterCount = 0
                //==== 搜索框=====
            if (filterBox.find('.filterSearchVal').val() != '') {
                filterCount++;
            }
            let keyword = filterBox.find('.filterSearchVal').val() || '';
            // =====状态====
            let statusList = [];
            let statusDom = filterBox.find('.filter-status-big>li.active');
            if (statusDom.length > 0) {
                filterCount++;
            }
            let midStatusDom = filterBox.find('.filter-status-small>li.active');
            // '所有状态' 不计入统计
            if (midStatusDom.length > 0 && midStatusDom.val() != -4) {
                filterCount++;
            }
            statusDom.each(function(i, item) {
                let code = $(this).val()
                statusList.push(code);
            });
            midStatusDom.each(function(i, item) {
                let code = $(this).val()
                statusList.push(code);
            });
            if (statusList.length == 0) {
                statusList = [-4]
            }
            // ==标签搜索===//
            if (filterBox.find('.filterTagSearchVal').val() != '') {
                filterCount++;
            }
            let tagKeyword = filterBox.find('.filterTagSearchVal').val() || '';

            //=== 日期===//
            let timeCon = filterBox.find('.filters-item-in-time');
            if (timeCon.find('.search_today_btn').hasClass('active') || timeCon.find('.filterBeginTime').val()) {
                filterCount++;
            }
            let startTime = '',
                endTime = '';
            if (timeCon.length > 0) {
                if (timeCon.find('.search_today_btn').hasClass('active')) {
                    //获取今天开始、结束时间
                    let today = dateRangeUtil.getToday('YYYY/MM/DD');
                    startTime = today.startDate;
                    endTime = today.endDate;
                } else {
                    timeCon.find('.search_today_btn').removeClass('active');
                    startTime = $(".filterBeginTime").val() || ''
                    endTime = $(".filterEndTime").val() || ''
                }
            }
            //====层级===//
            if (filterBox.find('.filter-level-list>li').hasClass('active')) {
                filterCount++;
            }
            let level = filterBox.find('.filter-level-list>li.active').html() || 0

            // 所有部门
            let deptId = filterBox.find('.belongDeptSel .sel-show-txt').val() || ''
            if (deptId != '' && deptId != 'all') {
                filterCount++;
            } else {
                deptId = ''
            }
            // 所有岗位
            let roleId = filterBox.find('.belongPostSel .sel-show-txt').val() || ''
            if (roleId != '' && roleId != 'all') {
                filterCount++;
            } else {
                roleId = ''
            }

            if (filterCount > 0) {
                filterBox.find('.filter-reset-box').removeClass('disable').addClass('usable');
            } else {
                filterBox.find('.filter-reset-box').addClass('disable').removeClass('usable');
            }
            return {
                keyword: keyword,
                status: statusList,
                tagKeyword: tagKeyword,
                startTime: startTime,
                endTime: endTime,
                level: level,
                dept: deptId,
                post: roleId
            }
        },
        /**
         * 日期插件初始化绑定
         */
        dateTimePlugInit: (paramObj) => {
            paramObj.bindDom.datetimepicker({
                language: 'cn',
                format: paramObj.format ? paramObj.format : 'yyyy/mm/dd hh:ii',
                autoclose: paramObj.autoclose ? paramObj.autoclose : false, //自动关闭
                minView: paramObj.minView ? paramObj.minView : 2, //最精准的时间选择为日期0-分 1-时 2-日 3-月
                weekStart: paramObj.weekStart ? paramObj.weekStart : 1,
                pickerPosition: paramObj.pickerPosition ? paramObj.pickerPosition : 'bottom-left',
                clearBtn: paramObj.clearBtn ? paramObj.clearBtn : false,
            }).off('changeDate').on('changeDate', function(e) {
                paramObj.changeDate(e);
            });
            $('.oa-container').off('click').on('click', function(e) {
                let _con = paramObj.bindDom; // 设置目标区域
                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    _con.datetimepicker('hide');
                }
            })

            // 点击空白处隐藏
            // MyCommon.blankClick({
            //     bindDom: $('.oa-container'),
            //     targetDom: timeDom,
            //     showDom: timeDom,
            //     afterHide:()=>{
            //         timeDom.datetimepicker('hide');
            //     }
            // });
        },
        /**
         * 统一获取文件图标方法
         * type 为空时 是普通图标  '_s'小图标  '_w'白色图标
         */
        getFileIcon: (fileSuffix, type) => {
            let fixType = type ? type : ''
                //统一图标前缀路径
            let fileImgPrefix = '../../common/image/task/total-process-manage/'
                //支持的格式
            let fileImgSupportArr = ['ppt', 'docx', 'xlsx', 'pdf', 'mp4', 'mp3', 'zip', 'rar', 'doc', 'pptx', 'xls', 'jpg', 'gif', 'png', 'txt']
            if (fileImgSupportArr.includes(fileSuffix)) {
                if (fileSuffix == 'ppt' || fileSuffix == 'pptx') {
                    return fileImgPrefix + 'ppt' + fixType + '.png'
                } else if (fileSuffix == 'docx' || fileSuffix == 'doc') {
                    return fileImgPrefix + 'docx' + fixType + '.png'
                } else if (fileSuffix == 'xlsx' || fileSuffix == 'xls') {
                    return fileImgPrefix + 'xlsx' + fixType + '.png'
                } else if (fileSuffix == 'zip' || fileSuffix == 'rar') {
                    return fileImgPrefix + 'zip' + fixType + '.png'
                } else if (fileSuffix == 'jpg' || fileSuffix == 'gif' || fileSuffix == 'png') {
                    return fileImgPrefix + 'png' + fixType + '.png'
                } else {
                    return fileImgPrefix + fileSuffix + fixType + '.png'
                }
            } else {
                return fileImgPrefix + 'normal' + fixType + '.png'
            }
        },
        /**
         * 设置打印对象背景色为白色
         */
        setStyleColor: (item) => {
            if ($(item).children().length != 0) {
                $(item).children().each((m, n) => {
                    $(n)[0].style.backgroundColor = '#fff'
                    if ($(n).children().length != 0) {
                        MyCommon.setStyleColor(n)
                    }
                })
            }
        },
        /**
         * 统一获取无数据显示的html
         */
        getNoneDataHtml: (text) => {
            return `<div class="oa_none_data_container">
                <div class="none_data_img"></div>
                <div class="none_data_word">${text || '当前还没有数据哦~'}</div>
            </div>`
        },
        /**
         * 统一获取分页代码
         */
        getPaginationHtml: () => {
            return `<div class="modulePage" style="display:block;">
            <ul class="module-tab-ul bootpag pagination pagination-sm">
            </ul>
            <input type="hidden" id="totalPage" value="1">
            <input type="hidden" id="currentPage" value="1">
            <div class="select_page_size">
                <span class="select_page_size_num">20/页</span>
                <em></em>
                <ul class="page_size_list_box">
                    <li data-num="5">5</li>
                    <li data-num="10">10</li>
                    <li data-num="20">20</li>
                    <li data-num="30">30</li>
                    <li data-num="50">50</li>
                    <li data-num="100">100</li>
                </ul>
            </div>
            </div>`
        }
    }
    return myfn;
}();