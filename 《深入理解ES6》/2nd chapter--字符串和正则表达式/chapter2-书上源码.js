/** UTF-16 码位 **/
// "𠮷"为日文字，不是中文"吉"
let text = '𠮷'
console.log(text.length)           // 2     :   变量text的长度事实上为1，但它的length属性值为2
console.log(/^.$/.test(text))      // false :   text被判断为2个字符，因此匹配单一字符的正则表达式会失效。
console.log(text.charAt(0))        // ""    :   前后两个16位的编码单元都不表示任何可打印的字符，因此 charAt()方法不会返回合法的字符。
console.log(text.charAt(1))        // ""    :   同上
console.log(text.charCodeAt(0))    // 55362 :   charCodeAt()方法同样不能正确地识别字符，它会返回每个16位编码单元对应的数值，在ECMAScript5中，这是能得到的最近text真实的结果了。


/** CodePointAt() : 这个方法接受编码单元的位置而非字符位置作为参数，返回与字符串中给定位置对应的码位，即一个整数值。 **/
console.log(text.codePointAt(0))   // 134071
console.log(text.codePointAt(1))   // 57271

// 要检测一个字符占用的编码单元数量，最简单的方法是调用字符的 codePointAt() 方法，可以写这一样一个函数来检测:
function is32Bit(c) {
    // 用 16 位表示的字符集上界为十六进制 FFFF, 所有超过这个上界的码位一定由两个编码单元来表示，总共有 32 位。
    return c.codePointAt(0) > 0xFFFF
}

console.log(is32Bit('𠮷'))         // true
console.log(is32Bit('a'))          // false


/** String.fromCodePoint() 方法根据指定的码位生成一个字符。(和上面的 codePointAt()相反的方法。) **/
console.log(String.fromCodePoint(134071))    //"𠮷"


/** normalize()方法      /ˈnɔ:məˌlaɪz/  n.标准化，正常化  vt&vi (使)正常化 **/
// 将 values 数组中的所有字符串都转化成同一种标准形式。
let values = ['English', 'fuck', '吉', '123', '𠮷']   // 注意第一个为"吉"字，第二个为日语

let normalized = values.map(function (text) {
    return text.normalize()    // 以标准等价方式分解，然后以标准等价方式重组("NFC")，默认选项。
})

// 先经过上面把数组中的每一项转换为标准形式，下面再次排序
// f: first, s:second
normalized.sort(function (f, s) {
    if (f < s) {
        return -1
    } else if (f === s) {
        return 0
    } else {
        return 1
    }
})
console.log(values)
console.log(normalized)  // 这里生成了一个新数组


/** u 修饰符 **/
// 还是上面的 "𠮷"
console.log(text.length)         // 2
// /^.$/匹配所有单字符字符串 : "小数点" 匹配除换行符之外的任何单个字符
console.log(/^.$/.test(text))    // false
console.log(/^.$/u.test(text))   // true


/** 计算码位数量 **/
// 此方法运行效率低，作者建议使用第8章的字符串迭代器。
function codePointLength(text) {
    // \s : 匹配一个空白字符。 \S: 匹配一个非空白字符
    let result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
}

console.log(codePointLength("abc"));     // 3
console.log(codePointLength("𠮷bc"));    // 3: 因为我们利用了u修饰符把含有2个字符编码的字符转化为1个，所以此处的长度还是3
console.log(codePointLength("𠮷abc"));   // 4

/** 检测 u 修饰符是否支持 **/
function hasRegExpU() {
    try {
        // 构造函数中传入字符 "u" 作为参数，如果当前引擎不支持 u 修饰符会抛出错误。
        /*
         * 另一种创建正则表达式的方式是使用RegExp 构造函数，它接收两个参数：一个是要匹配的字符串模式，另一个是可选的标志字符串。
         * 可以使用字面量定义的任何表达式，都可以使用构造函数来定义，如下面的例子所示。
         * 匹配第一个"bat"或"cat"，不区分大小写
         * var pattern1 = /[bc]at/i;    //以字面量形式来定义的正则表达
         * 与 pattern1 相同，只不过是使用构造函数创建的
         * var pattern2 = new RegExp("[bc]at", "i");
         *      -- 《js高程》chapter 5 应用类型
         */
        var pattern = new RegExp(".", "u");
    } catch (ex) {
        return false;
    }
}


// 20180427 字符串中的子串识别 : includes(), startWith(), endWith(); -->
// 都接受2个参数，第一个为要查找的字符； 第二个可选，指定一个索引值表示从哪里开始搜索。

// 20180427 把字符串重复一定次数: repeat()
console.log("Hello ES6 ".repeat(2));     // Hello ES6 Hello ES6


// 20180427: P26 正则表达式的复制  正则修饰符: i: 忽略大小写。 g: 全局匹配。 m: 多行查找
let re1 = /ab/i,

    // ES6 修改了正则表达式不可以使用第二个参数的 bug, 修改后的参数为: 第一个参数为正则表达式， 第二个参数修改为其修饰符。
    re2 = new RegExp(re1, "g");

console.log(re1.toString());    // ab/i
console.log(re2.toString());    // ab/g


// 20180427: P27 ES6 新增 flags 属性:
// 1.正则的 resource 属性获取正则表达式的文本。
// 2. flags 属性返回所有应用于当前正则表达式的修饰符字符串。 flags/resource 都是只读的原型属性访问器。
let re = /ab/g;
console.log(re.source);     // ab
console.log(re.flags);      // g


// 20180427 模板自变量
// P28 基础语法
let message = `\`Hello,\`world!`;
console.log(message);           // `Hello, `world!
console.log(typeof message);    // string
console.log(message.length);    // 14

// P30 简化多行字符串
let msg = `Multiline 
string`;
console.log(msg);       // Multiline
                        // string
console.log(msg.length);// 17

// 20180428-P31: 字符串占位符
let name = "Nicholas",
    str = `Hello,${name}`;
console.log(str);

let name2 = "Nicholas",
    // 模板字面量本身也是 js 表达式，所以你可以在一个模板字面量里嵌入另外一个，像下面这样
    str2 = `Hello, ${
        `my name is ${name2}`
        }`;
console.log(str2);


// 20180428-P32: 标签模板: 每个标签模板都可以执行模板字面量上的转换并返回最终的字符串值。
/*
 * 标签指的是在模板字面量第一个反撇号(`)前方标注的字符串，像这样:
 * let msg = tag`Hello word`; (意思是: 应用与模板字面量 `Hello world` 的模板标签是 tag.)
 * 标签也可是函数: 1st 参数是一个数组包含js解释过后的字面量字符串， 之后的所有参数都是每一个占位符的解释值。
 * 当然剩余参数也可以用 ...substitutions 代替。  substitution /sʌbstɪ'tjuːʃn/ n.代替、替换。
 * */

// 基本语法如下
function tag(literals, ...substitutions) {
    // 返回一个字符串
}

function passthru(literals, ...substitutions) {
    let result = "";

    // 根据 substitution 的数量来确定循环的执行次数
    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i];
        result += substitutions[i];
    }

    // 合并最后一个 literal
    result += literals[literals.length - 1];
    return result;
}

let count = 10,
    price = 0.25,
    total = passthru`${count} items cost $${count * price.toFixed(2)}`;
console.log(total);     // 10 items cost $2.5


// P35 String.raw() 在模板字面量中使用原始值 (主要用于输出源代码之类)
function raw(literals, ...substitutions) {
    let result = "";
    for (let i = 0; i < substitutions.length; i++) {
        // 利用 String.raw() 方法使用原生字符串
        result += literals.raw[i];
        result += substitutions[i];
    }
    // 合并最后一个 literal, 提示:因为 for 循环内的 literals 数组每一项都利用了 raw 方法，最后一项也要使用。
    result += literals.raw[literals.length - 1];
    return result;
}

let rawMsg = raw`Multiline\nstring`;
console.log(rawMsg);        // Multiline\nstring
console.log(rawMsg.length); // 17
