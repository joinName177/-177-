/*!
 * jRaiser 2 Javascript Library
 * sizzle - v1.9.1 (2020-04-28T10:11:50+0800)
 * http://jraiser.org/ | Released under MIT license
 *
 * Include sizzle (http://sizzlejs.com/)
 * author:CZQ
 */
// https://www.jb51.net/article/148702.htm   开发常用的20个JS技巧
let methodName = 'getArea';
class Commonly {
    constructor(x, y) {
        this.x = x || 1;
        this.y = y || 2;
    }
    [methodName]() {
        console.log("属性表达式")
    }
    //检测数据类型
    checkType(param) {
        return Object.prototype.toString.call(param)
    }
    //数组去重
    removalArr(arr) {
        let newArr = []
        arr.forEach((item) => {
            if (newArr.indexOf(item) == -1) {
                newArr.push(item)
            }
        })
        return newArr
    }
    removalArr_es6(arr) {//2种方法都可用
        // return Array.from(arr)  
        return [...new Set(arr)]
    }
    static toString() {
        return `x:${this.x}+y:${this.y}`
    }

    static getName() {
        return 'TOM'
    }


}

let Bob = new Commonly(3, 4)
console.log(Bob.checkType([]))
console.log(Bob.toString())
console.log(Bob.getArea())

//继承
class Bar extends Commonly {
    static getName() {
        return super.getName() + ', hello!';
    }
}
console.log(Bar.getName())