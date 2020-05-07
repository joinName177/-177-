function sayHello(person) {
    return "hello," + person;
}
var user = 'baobo';
console.log(sayHello(user));
var myName = 'Tom';
var myAge = 25;
// 1模板字符串
var sentence = "Hello, my name is " + myName + ".\nI'll be " + (myAge + 1) + " years old next month.";
var tom = {
    name: 'Arlun'
};
//数组类型
var persons = [1, 2, 3, 4, 5, 6, 7, 8];
persons.push(8);
console.log(persons);
//======================泛型==============================
function createArray(length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
console.log(createArray(3, 'x')); // ['x', 'x', 'x']
console.log(createArray(3, 11)); // ['x', 'x', 'x']
createArray(3, 'x'); // ['x', 'x', 'x']
//泛型-多个类型的参数
function swap(tuple) {
    return [tuple[1], tuple[0]];
}
console.log(swap([7, 'seven'])); // ['seven', 7]
function loggingIdentity(arg) {
    console.log(arg.length);
    return arg;
}
console.log(loggingIdentity([]));
//多个泛型参数之间也可以互相约束
//例:
//下例中，我们使用了两个类型参数，其中要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。
function copyFields(target, source) {
    for (var id in source) {
        target[id] = source[id];
    }
    return target;
}
var x = { a: 1, b: 2, c: 3, d: 4 };
console.log(copyFields(x, { b: 10, d: 20 }));
//4函数声明
function sum(x, y) {
    return x + y;
}
console.log(sum(1, 3));
//5函数表达式
/**
 * !!注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>。
 *在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
 *在 ES6 中，=> 叫做箭头函数
 */
var mySum = function (x, y) {
    return x + y;
};
console.log(mySum(8, 8));
var mySearch;
mySearch = function (source, subString) {
    return source.search(subString) !== -1;
};
console.log(mySearch('english', 'lish'));
//7可选参数
/**!!
 * 可选参数必须接在必需参数后面。换句话说，《必须参数不能位于可选参数后面》
 */
function createName(firstName, lastName) {
    if (lastName) {
        return firstName + "_" + lastName;
    }
    else {
        return firstName;
    }
}
console.log(createName('TOM', 'DOM'));
console.log(createName('TOM'));
//参数默认值
/**!!
 * ES6 中，我们允许给函数的参数添加默认值，TypeScript 会将添加了<默认值的参数识别为可选参数>
 *
 */
function buildName1(lastName, firstName) {
    if (firstName === void 0) { firstName = 'BOM'; }
    return firstName + lastName;
}
console.log(buildName1('TOM', 'DOM'));
console.log(buildName1('TOM'));
/**此时就不受「可选参数必须接在必需参数后面」的限制了 */
function buildName2(firstName, lastName) {
    if (firstName === void 0) { firstName = 'Tom'; }
    return firstName + ' ' + lastName;
}
var tomcat = buildName2('Tom', 'Cat');
var cat = buildName2(undefined, 'Cat');
function reverse(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
console.log(reverse(321));
console.log(reverse('hello'));
//8声明文件
console.log($('body'));
