function sayHello(person: string) {
    return "hello," + person
}

let user = 'baobo';
console.log(sayHello(user));

let myName: string = 'Tom';
let myAge: number = 25;
// 1模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;

//2接口
interface Person {
    name: string;
    age?: number//可选属性
}

let tom: Person = {
    name: 'Arlun'
}


//数组类型
let persons: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
persons.push(8)
console.log(persons)
//======================泛型==============================
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

console.log(createArray<string>(3, 'x')); // ['x', 'x', 'x']
console.log(createArray<number>(3, 11)); // ['x', 'x', 'x']
createArray(3, 'x')          // ['x', 'x', 'x']

//泛型-多个类型的参数
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}
console.log(swap([7, 'seven'])) // ['seven', 7]

//泛型约束<>
interface attribute {
    length: number
}

function loggingIdentity<T extends attribute>(arg: T): T {
    console.log(arg.length)
    return arg
}

console.log(loggingIdentity([]))
//多个泛型参数之间也可以互相约束
//例:
//下例中，我们使用了两个类型参数，其中要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target
}
let x = { a: 1, b: 2, c: 3, d: 4 };
console.log(copyFields(x, { b: 10, d: 20 }))



//4函数声明
function sum(x: number, y: number): number {
    return x + y;
}
console.log(sum(1, 3))

//5函数表达式
/**
 * !!注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>。
 *在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
 *在 ES6 中，=> 叫做箭头函数
 */
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y
}
console.log(mySum(8, 8))

//6用接口定义函数的形状
/**!!
 * 函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。
 */
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function (source: string, subString: string) {
    return source.search(subString) !== -1;
}
console.log(mySearch('english', 'lish'))

//7可选参数
/**!!
 * 可选参数必须接在必需参数后面。换句话说，《必须参数不能位于可选参数后面》
 */
function createName(firstName: string, lastName?: string) {
    if (lastName) {
        return `${firstName}_${lastName}`
    } else {
        return firstName
    }
}
console.log(createName('TOM', 'DOM'))
console.log(createName('TOM'))

//参数默认值
/**!!
 * ES6 中，我们允许给函数的参数添加默认值，TypeScript 会将添加了<默认值的参数识别为可选参数>
 * 
 */

function buildName1(lastName: string, firstName: string = 'BOM') {
    return firstName + lastName
}
console.log(buildName1('TOM', 'DOM'))
console.log(buildName1('TOM'))
/**此时就不受「可选参数必须接在必需参数后面」的限制了 */
function buildName2(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName2('Tom', 'Cat');
let cat = buildName2(undefined, 'Cat');

//重载
/**!!
 * 重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。
 */
/**
 * 注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。
 * @param x 
 */
//重载定义多个 reverse 的函数类型
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

console.log(reverse(321))
console.log(reverse('hello'))

//8声明文件
// console.log($('body'))



