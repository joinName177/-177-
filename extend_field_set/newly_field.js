/**
 * @author CZQ
 * @version 1.0, 2018/12/10
 */
var dialogId,topData;
require(["jquery","tyUI","easyModule","Ajax"], function ($,ty,el) {
    $(function () {
        $.loading(10);
        using(["textbox","combobox"],function () {
            initElements();
        })
    })
});

//初始化下拉框，文本框
function initElements() {
    dialogId = $.getUrlParam("dialogId");
    topData = ty.getDataFromIframeDialog(dialogId);
    require(['tyValidateRules'],function (tv) {
        initText("recordClassifyName",false);
        $("#recordClassifyName").textbox("setValue","基本信息");
        !topData.isAdd ? filedEdit() : filedCreate();
    })
}

//编辑操作
function filedEdit() {
    $("#icon").hide('fast');
    $("#form").find(".spn").hide();
    initText("fieldName",true);
    initText("dataSource",false);
    initText("controlTypes",false);
    $("#dataCode").attr("disabled","disabled");
    using(['form'],function () { //加载表单
        $("#form").form('load',topData.row);
        $("#dataSource").textbox("setValue",topData["row"].dataSource);
    });
}

//新增操作
function filedCreate() {
    $("#icon").show('fast').on("click",chooseDiction);
    initText("fieldName",true);
    initText("dataSource",true);
    $("#controlTypes").combobox({
        url:"/platform/common/item/combo/code/KJLX",
        method:"GET",
        limitToList:true,
        editable:false,
        panelMaxHeight:100,
        valueField:'id',
        textField:'text',
        required: true,
        loadFilter:function (data) {
            if(!data.success){
                $.message({type: "error", text: data.message});
            }
            return data.content;
        }
    });
}

//字典选择
function chooseDiction() {
    ty.createIframeDialog({
        title: "数据字典",
        src: "/ps/system_set/extend_field_set/data_dictionary.html",
        width: 450,
        height: 420,
        indata:{},
        minimizable: false,
        maximizable: false,
        callback: function (flag) {
            if (flag) {
                $("#dataSource").textbox("setValue",flag.name);
                $("#dataCode").val(flag.code);
            }
        }
    });
}

//false只读，true必填
function initText(name,property) {
    return $("#"+name).textbox(!property ? {readonly:"readonly",disabled:true} : {required:"required"});
}

//确认
function dialogOk(){
    using(['form'],function () {
        var form = $("#form");
        if (form.form("validate")) {
            var formJson = form.serializeJson();
            formJson["recordTableName"] = "JBXX";
            if(!topData.isAdd){
                formJson.id = topData["row"].id;
                ajaxFn("put","/ps/recordField/update",formJson);//编辑
            }else {
                formJson["extend"] = false;
                ajaxFn("post","/ps/recordField/create",formJson);//新增
            }
        }
    })
}

//新增 编辑请求方法抽离
function ajaxFn(type,url,param){
    Ajax[type]({
        url:url,
        data:param
    }, function () {
        ty.closeIframeDialog(dialogId,true);
    }, function (msg) {
        $.message({type: "error", text: msg});
    });
}

//取消
function dialogCancel() {
    ty.closeIframeDialog(dialogId);
}