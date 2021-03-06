// Created 20180501

// 20180501-P73 - 属性初始值的简写: 当一个对象的属性与本地变量同名时，不必再写冒号和值，简单地只写属性名即可。
function createperson(name, age) {
    return {
        // 原始写法 name: name,  age: age
        // 简写
        name, age
    }
}

// 20180501-P74 - 对象方法的简写语法
const person = {
    name: "Nicholas",
    sayName() {
        console.log(this.name);
    }
};


// 20180501-P75 - 可计算属性名 (Computed Property Name)
let people = {},
    lastName = "last name";
// 如果想通过计算得到属性名，就需要用方括号来代替点记法。
people["first name"] = "Nicholas";
people[lastName] = 'Zakas';
console.log(people["first name"]);
console.log(people[lastName]);

// 20180913-add: 来自: https://vuex.vuejs.org/zh/guide/mutations.html
// mutation-types.js
export const SOME_MUTATION = "SOME_MUTATION";

// store.js
import { SOME_MUTATION } from "./mutation-types"
const store = new Vuex.Store({
    state: { ... },
    mutations: {
        // 使用"计算属性命名"功能来使用一个常量作为函数名
        [SOME_MUTATION]: function(state){
            // mutate state
        }
    }
});


// 20180501-P76 - 新增方法: Object.is(): 弥补全等运算符的不准确运算。 比如之前 +0等于-0, NaN不等于NaN, 使用后:
console.log(+0 === -0);            // true
console.log(NaN === NaN);          // false


console.log(Object.is(+0, -0));   // false
console.log(Object.is(NaN, NaN));  // true


// 20180501-P76 - 新增方法: Object.assign():
// 20180502: 混合(Mixin)是 js 中实现对象组合的一种模式。在一个 mixin 方法中，一个对象接受来自另一个对象的属性和方法，
// 许多 js 库中都有类似的 mixin 方法:  receiver /rɪ'siːvə/ n.接收器  supplier /səˈplaɪə/ n.提供者
function mixin(receiver, supplier) {
    // github-clone\js-sundry-goods\js--A语法--MDN文档\js高程---Object.keys().js
    // Object.keys() 方法取得对象上所有可枚举的实例属性。这个方法接受一个对象作为参数，返回一个包含所有可枚举属性的字符串数组。
    Object.keys(supplier).forEach(function (key) {
        receiver[key] = supplier[key];
    })
}

/* mixin() 函数遍历 supplier 的自有属性赋并复制到 receiver 中(此处的复制只是浅复制，当属性值为对象时只复制对象的引用)。
 * 这样一来，receiver 不通过继承就可以获得新属性，请参考这段代码: */
function EventTarget() { /**/
}

EventTarget.prototype = {
    constructor: EventTarget,
    emit: function (parameter) {
        console.log(parameter);
    },
    on: function () { /**/
    }
};
const myObj = {};
mixin(myObj, EventTarget.prototype);
// myObj 接受 EventTarget.prototype 对象的所有行为从而使 myObj 可以通过 emit() 方法发布事件或通过 on() 方法订阅事件。
myObj.emit("somethingChanged");     // somethingChanged

// 上面的 mixin() 调用可以直接替换为 Object.assign()
// 201809015-add: 即使这样 Object.assign() 仍然是潜拷贝，深拷贝见: JS集锦.js
Object.assign(myObj, EventTarget.prototype);
myObj.emit("somethingChange again");


/** 20180502-P81 自由属性枚举顺序 */
    // ES5 Object.getOwnPropertyNames(): 【取得自身的属性名】
// ES6 规定了对象的自有属性被枚举时的返回顺序，这会影响到 Object.getOWnPropertyNames()【取得自身的属性名】方法及
// Reflect.ownKeys (将在第 12 章讲解) 返回属性的方式， Object.assign() 方法处理属性的顺序也将随之改变。 例如:
let aObj = {
        a: 1,
        0: 1,
        c: 1,
        2: 1,
        b: 1,
        1: 1
    };
aObj.d = 1;
// js高程: chapter5: join()方法：数组方法。只接收一个参数，即用作分隔符的字符串，返回包含所有数组项的字符串。
console.log(Object.getOwnPropertyNames(aObj));          // [ '0', '1', '2', 'a', 'c', 'b', 'd' ]
console.log(Object.getOwnPropertyNames(aObj).join("")); // 012acbd


/** 20180502-P82 增强对象原型 */
// 增强对象原型 - 改变对象的原型:
// ES5 添加的 Object.getPrototypeOf() 方法返回任意指定对象的原型。对象原型的真实值被存储在内部专用属性 [[Prototype]] 中，调用 getPrototypeOf() 方法返回存储在其中的值。
// ES6 添加了 Object.setPrototypeOf() 方法可以改变任意指定对象的原型。接受2个参数: 1.被改变原型的对象 2.替代第一个参数原型的对象。
let animal = {
    getGreeting() {
        return "Hello";
    }
};
let dog = {
    getGreeting() {
        return "woof";
    }
};

// ES5 提供了 Object.create 方法，可以用来克隆对象。 示例: ECMAScript6-Study\Javascript设计模式与编程实践\第一部分--基础知识\第1章\P14-Object.create.js
// 使用 create 方法克隆一个 animal 对象
let friend = Object.create(animal);
console.log(friend.getGreeting());          // Hello
console.log(Object.getPrototypeOf(friend)); // { getGreeting: [Function: getGreeting] }
console.log(Object.getPrototypeOf(friend) === animal); // true

// 使用 Object.setPrototypeOf() 把原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting());          // woof
console.log(Object.getPrototypeOf(friend) === dog);    // true


/** 20180502-P83 简化原型访问的 Super 引用 */

