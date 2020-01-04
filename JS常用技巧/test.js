let showBranchHandle = (branch) => {
    //条件判断表达式
    let branchList = branch
    //解析字符串正则
    let reg = /\((.+?)\)/g
    //获取所有分支条件表达式
    let handBranch = branchList.match(reg)
    //获取所有链接符号
    let symbolArr = branchList.replace(/\([^\)]*\)/g, "").match(/([&]{2})|([|]{2})/g)
    if (symbolArr != null) { //判空，当只有一个条件的时候不用加”“
        symbolArr.splice(0, 0, "")
    } else {
        symbolArr = [""]
    }
    let branchInfoList = []
    $.each(handBranch, (j, idx) => {
        //获取小括号内的内容
        let trueName = idx
        let newB = idx.match(/\(([^)]*)\)/)[1].replace(/(^\s*)|(\s*$)/g, "")
        trueName = `( ${newB} )`
        //获取小括号内符号组
        let trueSymbol = trueName.match(/([&]{2})|([|]{2})/g)
        //获取条件值集合
        let infoDetail = trueName.split(" ")
        //转换分支符号值
        let showBranchVal = 0
        //变量值
        let infoRealDetail = infoDetail[1].split("a_")[1]
        infoRealDetail = infoRealDetail.replace(/_/g, "-")
        //显示的变量名
        let showBranchName = getShowBranchName(infoRealDetail)
        //获取展示变量类型
        let showBranchType = getShowBranchType(infoRealDetail)
        //链接符号解析
        let connectSym = ''
        if ($.trim(symbolArr[j]) != '') {
            connectSym = symbolArr[j] == '&&' ? 'and' : 'or'
        }
        //正常分支
        if (showBranchType == 'select' || showBranchType == 'input' || showBranchType == 'radio' || showBranchType == 'checkbox' || showBranchType == 'numval' || showBranchType == 'formula') { //根据类型
            if (trueSymbol != null && trueSymbol.indexOf("&&") != -1 && infoDetail[1] == infoDetail[5]) { //介于条件时
                branchInfoList.push({
                    branchName: infoRealDetail,
                    branchShowName: showBranchName,
                    branchType: showBranchType,
                    bracketL: infoDetail[0],
                    bracketR: infoDetail[8],
                    branchIf: 7,
                    branchVal: infoDetail[3] + '#' + infoDetail[7],
                    branchAnd: connectSym,
                    between_branchIf: infoDetail[2] + '#' + infoDetail[6]
                })
            } else if (trueSymbol == null && infoDetail[3] == "''") { //为空不为空时
                branchInfoList.push({
                    branchName: infoRealDetail,
                    branchShowName: showBranchName,
                    branchType: showBranchType,
                    bracketL: infoDetail[0],
                    bracketR: infoDetail[4],
                    branchIf: infoDetail[2] == '==' ? 8 : 9,
                    branchVal: infoDetail[3],
                    branchAnd: connectSym,
                    between_branchIf: infoDetail[2] + '#' + infoDetail[6]
                })
            } else {
                if (infoDetail[2] == '==') { //等于
                    showBranchVal = 1
                } else if (infoDetail[2] == '!=') { //不等于
                    showBranchVal = 2
                } else if (infoDetail[2] == '<') { //小于
                    showBranchVal = 3
                } else if (infoDetail[2] == '>') { //大于
                    showBranchVal = 4
                } else if (infoDetail[2] == '<=') { //小于等于
                    showBranchVal = 5
                } else if (infoDetail[2] == '>=') { //大于等于
                    showBranchVal = 6
                }
                branchInfoList.push({
                    branchName: infoRealDetail,
                    branchShowName: showBranchName,
                    branchType: showBranchType,
                    bracketL: infoDetail[0],
                    bracketR: infoDetail[4],
                    branchIf: showBranchVal,
                    branchVal: infoDetail[3].replace(/\'/g, ""),
                    branchAnd: connectSym,
                    between_branchIf: ""
                })
                //拆分多个条件合并
                let newDetail = infoDetail.concat([]).splice(5, infoDetail.length - 4)
                if (newDetail.length > 3) {
                    let newBranchList = splitBrachnFunc(newDetail)
                    branchInfoList = branchInfoList.concat(newBranchList)
                }
            }
        }
        if (showBranchType == 'peoSel') { //人员选择
            let newDetail = infoDetail.concat([]).splice(1, infoDetail.length - 2)
            let showBranchVal = 0
            if (newDetail[1] == '==') { //等于
                showBranchVal = 1
            } else if (newDetail[1] == '!=') { //不等于
                showBranchVal = 2
            }
            let nowVal = ''
            let showSymbol = 0
            let spliceNum = 0
            //处理数据
            $.each(newDetail, (k, val) => {
                if (k % 4 == 0 && val.split("_")[1]) {
                    let _symbol = val.split("_")[1]
                    if (_symbol == 'post') {
                        showSymbol = 31
                    } else if (_symbol == 'postdept') {
                        showSymbol = 3
                    } else if (_symbol == 'role') {
                        showSymbol = 5
                    } else if (_symbol == 'manager') {
                        if (val.split("_")[2] == 'direct') {
                            showSymbol = 6
                        } else if (val.split("_")[2] == 'indirect') {
                            showSymbol = 7
                        } else {
                            showSymbol = 8
                        }
                    } else if (_symbol == 'self') {
                        showSymbol = 9
                    } else if (_symbol == 'branch') {
                        showSymbol = 10
                    } else if (_symbol == 'dept') {
                        showSymbol = 11
                    } else if (_symbol == 'org') {
                        showSymbol = 12
                    }
                } else if (k % 4 == 0 && !val.split("_")[1]) {
                    showSymbol = 0
                }
                if (k % 4 == 2 && k == newDetail.length - 1) {
                    nowVal += `${val}_${showSymbol}`
                }
                if (k % 4 == 2 && k != newDetail.length - 1) {
                    nowVal += `${val}_${showSymbol}#`
                }
                //截断数组
                if (k % 4 == 3 && val != '||' && k != 0) {
                    spliceNum = k
                    nowVal = nowVal.replace(/^(\s|#)+|(\s|#)+$/g, '')
                    return false
                }
            })
            branchInfoList.push({
                branchName: infoRealDetail,
                branchShowName: showBranchName,
                branchType: showBranchType,
                bracketL: infoDetail[0],
                bracketR: infoDetail[spliceNum + 1],
                branchIf: showBranchVal,
                branchVal: nowVal.replace(/\'/g, ""),
                branchAnd: connectSym,
                between_branchIf: ""
            })
            //递归拆分
            let nextDetail = infoDetail.concat([]).splice(spliceNum + 2)
            if (spliceNum != 0 && nextDetail.length > 3) {
                let newBranchList = splitBrachnFunc(nextDetail)
                branchInfoList = branchInfoList.concat(newBranchList)
            }
        }
    })
    showBranchList(branchInfoList)
}




( creater == '沈燕玲' || creater == '吴颖' || creater == 'wuying邮箱888'  &&  cxfMzvtlGg == '15'  &&  QSpHtizFYP == 56.0 )
( a_9E7668C6_B988_4E3F_B240_2F11C8351357 != 15.0  &&  a_D41A0D33_C8FD_403F_958E_E034858C33A3 == '沈燕玲'  &&  a_086B989E_A1E0_41D9_8B00_E9CC788626B6 != 16.0 )