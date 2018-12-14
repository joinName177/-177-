/**
 * @author CZQ
 * @version 1.0, 2018/12/6
 */
var dialogId,topData;
require(["jquery","tyUI","easyModule","Ajax"], function ($,ty,el) {
    $(function () {
        $.loading(650);
        dialogId = $.getUrlParam("dialogId");
        topData = ty.getDataFromIframeDialog(dialogId);
        using(["textbox","combobox"],function () {
            initElements();
        })
    })
});

//初始化下拉框，文本框
function initElements() {
    require(['tyValidateRules'],function (tv) {
        var arr = {
            "0":[{"id":0,"text":"允许","selected":true},{"id":1,"text":"不允许"}],
            "1":[{"id":0,"text":"是","selected":true},{"id":1,"text":"否"}],
            "2":[{"id":0,"text":"管理员及本人","selected":true},{"id":1,"text":"仅管理员"}]
        };
        initCombobox("required",arr[1]);
        initCombobox("maintainer",arr[2]);
        initCombobox("allowUpdate",arr[0]);

        $("#fieldName").textbox({readonly:"readonly"});
        $("#fieldName").textbox("setValue",topData.fieldName);

        //如果是批量设置则隐藏“字段名称”;
        if(Array.isArray(topData)){
            $(".hideName").hide().find('input').attr("disabled","disabled");
        }else {
            using(['form'],function () {
                $("#mainForm").form("load",topData);
                defaultSelect("allowUpdate");
                defaultSelect("maintainer");
                defaultSelect("required");
                if(topData.allowUpdate ===1){
                    $(".hideTr").hide().find('input').attr("disabled","disabled");
                }
            });
        }
    });
}

//抽离下拉框
function initCombobox(name,data) {
    $('input[name="'+name+'"]').combobox({
        data:data,
        required: true,
        editable:false,
        panelHeight:120,
        valueField:'id',
        textField:'text',
        onSelect:function (recode) {
            if(name ==="allowUpdate" && recode.id!==0){
                $(".hideTr").hide().find('input').attr("disabled","disabled");
            }else{
                $(".hideTr").show().find('input').removeAttr("disabled");
            }
        }
    });
}

//参数类型转换
function revert(property) {
    if(property) property = parseInt(property);
    return property;
}

//如果字段未设置任何选项，默认选中第一项
function defaultSelect(property) {
    if(topData[property] === -1){
        $("#"+property).combobox('select', 0);
    }
}

//确认
function dialogOk(){
    using(['form'],function () {
        var str = [],form = $("#mainForm");
        var formJson = form.serializeJson();
        formJson["allowUpdate"] = revert(formJson.allowUpdate);
        formJson["maintainer"] = revert(formJson.maintainer);
        formJson["required"] = revert(formJson.required);
        if(!Array.isArray(topData)){
            str.push(topData.id);
            topData = str;
        }
        if (form.form("validate")) {
            formJson.ids = topData;
             Ajax["put"]({
                 url:"/ps/recordField/batch/update",
                 data:formJson
             }, function (res) {
                 if(res.success){
                     ty.closeIframeDialog(dialogId,true);
                 }
             }, function (msg) {
                 $.message({type: "error", text: msg});
             });
        }
    })
}

//取消
function dialogCancel() {
    ty.closeIframeDialog(dialogId)
}