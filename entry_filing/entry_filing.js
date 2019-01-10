/**
 * @author CZQ
 * @version 1.0, 2018/12/10
 */
//引入必要的控件组件
var dialogId,topData,isFirstSubmit = false;
var ral = [{"id":"1","text":"是"},{"id":"0","text":"否",selected:true}];
var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
require(["jquery","tyUI","easyModule","Ajax"], function ($,ty,el) {
    $(function () {
        $.loading(650);
        dialogId = $.getUrlParam("dialogId");
        topData = ty.getDataFromIframeDialog(dialogId);
        using(["textbox","combobox","datebox","combotree"],function () {
            initElements();
            $.extend($.fn.validatebox.defaults.rules, {
                'idCard': {
                    validator:function (value) {
                        return reg.test(value);
                    },
                    message: "请输入合法的身份证号码！"
                }
            });
        })
    })
});
//初始化表单元素
function initElements() {
    require(['tyValidateRules'],function (tv) {
        initCodeType();
        initText("userName",1,0);
        initText("identityCard",1,0,"idCard");
        initText("jobName",0,0);
        initText("entryDepartment",1,1,0,"icon iconfont icon-liucheng1");
        initText("dateOnBoard");
        $("#dateOnBoard").datebox("setValue",getDate());
        resetStyle();
        initCombobox("entryPost",[],function (row) {
            $(this).data("selectId",row.id);
        });
        initCombobox("isPluralityPost",ral,function (row) {
            hideTr(row.id,"hideTr");
            if(row.id =="1") createPost();
        });
        function getDate(){ //获取当前时间
            var ary = new Date();
            var d = ary.getDate();
            var m = ary.getMonth() + 1;
            var y = ary.getFullYear();
            var str = y + "-";
            if(m < 10) str += "0";
            str += m + "-";
            if(d < 10) str += "0";
            str += d;
            return str;
        }
    });
}
//获取码表数据
function initCodeType() {
    var param = {
        url:"/ps/item/getTreeByCodes",
        data:{"list":"ZT,XB,SYQ,JGLX"}
    };
    Ajax.post(param,function (response) {
        var data = response.content;
        data["ZT"][1].selected = true;
        data["SYQ"][0].selected = true;
        initCombobox("probation",data["SYQ"],function (row) {
            $("#probationCode").val(row.code);
        });
        initCombobox("staffType",data["JGLX"],function (row) {
            $("#staffCode").val(row.code);
        },function (node) {
           if(!$("#staffType").combotree("tree").tree('isLeaf',node.target)){
               $.message({type: "warning", text: "请选择子节点!"});
               return false;
           }
        });
        initCombobox("sex",data["XB"],function (row) {
            $("#sexCode").val(row.code);
        });
        initCombobox("status",data["ZT"],function (row) {
            $("#statusCode").val(row.code);
            hideTr(row.code,"hideTrPeriod");
        },null,function (data) {
            var arr = [];
            for(var i = data.length;i--;){
                if(data[i].code=="10" || data[i].code=="11"){
                    arr.push(data[i]);
                }
            }
            return arr;
        });
    },function (error) {
        $.message({type: "error", text: error});
    })
}
//新增兼职部门及岗位
var num = 0;
function createPost(){
    if($(".hideTr").length > 2){
        return $.message({type: "warning", text: "最多添加3个兼职岗位!"});
    }
    num++;
    var departmentId ="pluralityDepartment"+num;
    var postId="pluralityPost"+num;
    $('<tr class="hideTr">' +
        '    <td><label><span class="spn">*</span>兼职部门:</label></td>' +
        '    <td><span onclick="chooseDepartment(this)">' +
        '        <input type="text" id="'+departmentId+'"/></span>' +
        '    </td>' +
        '    <td><label><span class="spn">*</span>兼职岗位:</label></td>' +
        '    <td><input type="text" id="'+postId+'" prompt="请先选择部门后选择岗位！"/>' +
        '        <i class="icon iconfont icon-jiahao1 icons" onclick="createPost()"></i>' +
        '        <i class="icon iconfont icon-jianhao icons tyIcon" onclick="removePost(this)"></i>' +
        '    </td>' +
        '</tr>').appendTo($(".frm"));
    //初始化新增的岗位、部门对应的控件类型//
    initText(departmentId,1,1,0,"icon iconfont icon-liucheng1");
    resetStyle();
    initCombobox(postId,[],function (recode) {
        $(this).data("selectId",recode.id);
    });
}
//移除兼职部门及岗位
function removePost(_this_) {
    $(_this_).closest('tr').remove();
    if($(".hideTr").length == 0) {
        $("#isPluralityPost").combobox('select',0);
    }
}
//初始化文本框
function initText(name,re,ly,valid,icon) {
    name !== "dateOnBoard" ? $("#"+name).textbox({
        validType:valid ? valid : null,
        iconCls:icon ? icon : null,
        required:re ? true : false,
        readonly:ly ? true : false,
        width:200
    }) : $("#"+name).datebox({width:200});
}
//初始化下拉框
function initCombobox(name,comboData,select,bSelect,filter) {
    var param = [{
            data:comboData,
            width:200,
            required: true,
            onSelect:select,
            panelHeight:'auto'
        }, {
            limitToList:true,
            editable:false,
            panelHeight:'auto',
            valueField:'id',
            textField:'text'
        }];
    if(filter) param[0].loadFilter = filter;
    if(name !== "staffType"){
        $("#"+name).combobox($.extend({},param[0],param[1]));
        return
    }
    param[0].onBeforeSelect = bSelect;
    param[0].onShowPanel = function(){
        $(this).combobox('panel').width("auto");
    };
    $("#"+name).combotree(param[0]);
}
//获取岗位缓存数据
function getPlurality() {
    var arr = [];
    $(".hideTr").each(function (i,item) {
        var child = $(item).find(".textbox-f");
        arr.push({
            "position":$(child[1]).data("selectId"),
            "orgId":$(child[0]).data("selectId")
        })
    });
    return arr;
}
//条件隐藏元素
function hideTr(str,name) {
    switch (str) {
        case "10":
            return $("."+name).hide('fast');
        case "0":
            return $("#mainForm").find('.hideTr').remove();
        default:
            return $("."+name).show('fast');
    }
}

//设置icon样式
function resetStyle() {
    $(".icon-liucheng1").css({"text-align":"center","font-size":"18px","color":"#1990fc"});
}
//部门选择
function chooseDepartment(_this_) {
    var $input = $(_this_).children('input');
    ty.createIframeDialog({
        title: "选择",
        src: "/ps/common/chooseFilterOrg.html",
        width: 350,
        height: 380,
        indata:$input.data("selectId"),
        minimizable: false,
        maximizable: false,
        buttons:[{
            id : "cancel",
            name : "取消",
            funcName : "dialogCancel"
        },{
            id : "sure",
            name : "确定",
            funcName : "dialogOk"
        }],
        callback: function (responseData) {
            if (responseData) {
                $input.textbox("setValue",responseData.orgName).data("selectId",responseData.id);
                Ajax.get({  //通过部门去查找对应的岗位信息
                    url:"/ps/personBase/list/post/"+responseData.id
                },function (response) {
                    if(response.success){
                        var data = response.content;
                        var $postIpt = $(_this_).parent().siblings().children('input');
                        var len = $postIpt.combobox("getData");
                        if(len.length !==0){
                            $postIpt.combobox("clear");
                        }
                        $postIpt.combobox('loadData',revertData(data));
                    }
                },function (error) {
                    $.message({type: "error", text: error});
                });
                function revertData(arr) {
                    for(var i = arr.length; i--;){
                        arr[i].text = arr[i].postName;
                    }
                    return arr;
                }
            }
        }
    });
}
//建立档案
function createArchives(obj) {
    $.mask();
    if(obj.status === "10") delete obj.probation;
    if(obj.parttimeJob === "1"){
        obj.parttimeJob = true;
        obj.pluralistics =  getPlurality();//副岗信息
    }else {
        obj.parttimeJob = false;
    }
    obj.formal = {//主岗信息
        orgId:$("#entryDepartment").data("selectId"),
        position:$("#entryPost").data("selectId"),
        dutyName:$("#jobName").textbox("getValue")
    };
    var __config = {url:"/ps/personBase/create", data:obj};
    Ajax.post(__config, function (res) {
        if(res.success){
            $.closeMask();
            ty.closeIframeDialog(dialogId,true);
        }
    }, function (msg) {
        isFirstSubmit = false;
        $.message({type: "error", text: msg});
    });
}
//提交请求
function dialogOk(){
    using(['form'],function () {
        var $form = $("#mainForm");
        if ($form.form("validate")) {
            if(!isFirstSubmit){
                isFirstSubmit = true;
                var formJson = $form.serializeJson();
                Ajax.get({ //身份证校验
                    url:"/ps/personBase/create/check",
                    data:{"search_identity_card_eq":formJson.identityCard}
                },function (suc) {
                    if(suc.success) {
                        createArchives(formJson);//建立档案
                    }
                },function (err) {
                    isFirstSubmit = false;
                    $.message({type: "error", text: err});
                    $("#identityCard").siblings('span').find("input").focus();
                });
            }
        }
    })
}
//关闭窗口
function dialogCancel() {
    ty.closeIframeDialog(dialogId);
}



