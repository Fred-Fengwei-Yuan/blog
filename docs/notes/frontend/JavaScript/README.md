# JavaScript基本语法笔记

## 数据类型

### 类型概述

```javascript
function f() {}
typeof f // "function"
typeof {} // "object"
typeof [] // "object"
typeof null // "object"  -For compatibility
typeof undefined // "undefined"
typeof NaN // 'number'
```

实例用途

```javascript
v // ReferenceError: v is not defined
typeof v // "undefined"

// 错误的写法
if (v) {
  // ...
}
// ReferenceError: v is not defined

// 正确的写法
if (typeof v === "undefined") {
  // ...
}
```

### null, undefined, 布尔值

```javascript
//null 在计算时自动转为0
Number(null) // 0
5 + null // 5
//undefined 在计算时自动转为 NaN
Number(undefined) // NaN
5 + undefined // NaN
```

返回undefined的经典场景

```javascript
// 变量声明了，但没有赋值
var i;
i // undefined

// 调用函数时，应该提供的参数没有提供，该参数等于 undefined
function f(x) {
  return x;
}
f() // undefined

// 对象没有赋值的属性
var o = new Object();
o.p // undefined

// 函数没有返回值时，默认返回 undefined
function f() {}
f() // undefined
```

如果 JavaScript 预期某个位置应该是布尔值，会将该位置上现有的值自动转为布尔值。转换规则是除了下面六个值被转为`false`，其他值都视为`true`。

- `undefined`
- `null`
- `false`
- `0`
- `NaN`
- `""`或`''`（空字符串）

###　数值

#### 精度与范围

浮点数不精确。从-2^53^到2^53^，可以精确表示。当运算结果超过这个范围后无法保持精度。由于2^53^是一个16位的十进制数值，所以简单的法则就是，JavaScript 对15位的十进制数都可以精确处理。

```javascript
0.1 + 0.2 === 0.3 // false
0.3 / 0.1 // 2.9999999999999996
(0.3 - 0.2) === (0.2 - 0.1) // false
Math.pow(2, 53)		// 9007199254740992
Math.pow(2, 53) + 1	// 9007199254740992
Math.pow(2, 53) + 2	// 9007199254740994
Math.pow(2, 53) + 3	// 9007199254740996
Math.pow(2, 53) + 4	// 9007199254740996
// 多出的三个有效数字，将无法保存，变成0
9007199254740992111 // 9007199254740992000
```

JavaScript 能够表示的数值范围为2^1024^到2^-1023^（开区间），超出这个范围的数无法表示。

```javascript
//如果一个数大于等于2的1024次方，那么就会发生“正向溢出”
Math.pow(2, 1024) // Infinity
//如果一个数小于等于2的-1075次方（指数部分最小值-1023，再加上小数部分的52位），那么就会发生为“负向溢出”
Math.pow(2, -1075) // 0
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324
```

#### 表示法与进制

科学记数法

```javascript
//小数点前的数字多于21位，就自动转为科学计数法。
1234567890123456789012 // 1.2345678901234568e+21
// 小数点后紧跟5个以上的零，就自动转为科学计数法。
0.0000003 // 3e-7
```

默认情况下，JavaScript 内部会自动将八进制、十六进制、二进制转为十进制。

- 十进制：没有前导0的数值。
- 八进制：有前缀`0o`或`0O`的数值，或者有前导0、且只用到0-7的八个阿拉伯数字的数值。
- 十六进制：有前缀`0x`或`0X`的数值。
- 二进制：有前缀`0b`或`0B`的数值。

```javascript
0xff // 255
0o377 // 255
0b11 // 3
//通常来说，有前导0的数值会被视为八进制，但是如果前导0后面有数字8和9，则该数值被视为十进制。
//前导0表示八进制，处理时很容易造成混乱。ES5 的严格模式和 ES6，已经废除了这种表示法，但是浏览器为了兼容以前的代码，目前还继续支持这种表示法。
0888 // 888
0777 // 511
```

#### 特殊数值

##### 正零和负零

区别就是64位浮点数表示法的符号位不同。它们是等价的。唯一有区别的场合是，`+0`或`-0`当作分母，返回的值是不相等的。

```javascript
(1 / +0) === (1 / -0) // false
```

##### NaN (Not a Number)

主要出现在将字符串解析成数字出错的场合。

```javascript
//以下代码运行时，会自动将字符串'x'转为数值，但是由于'x'不是数值，所以最后得到结果为 NaN。
5 - 'x' // NaN
//运算时得到的NaN
Math.acos(2) // NaN
Math.log(-1) // NaN
Math.sqrt(-1) // NaN
0 / 0 // NaN
```

**`NaN`不等于任何值，包括它本身。**

```javascript
NaN === NaN // false
```

数组的`indexOf`方法内部使用的是严格相等运算符，所以该方法对`NaN`不成立。

```javascript
[NaN].indexOf(NaN) // -1
```

**`NaN` `undefined`与任何值运算等到的都是`NaN`。**

**`NaN`与任何值比较等到的都是`false`。**

##### Infinity

```
1 / 0 // Infinity 非零数值除以0，得到Infinity
0 * Infinity // NaN
Infinity - Infinity // NaN
Infinity / Infinity // NaN
```

#### 全局方法

##### parseInt()

字符串转为整数的时候，是一个个字符依次转换，如果遇到不能转为数字的字符，就不再进行下去，返回已经转好的部分。如果字符串的第一个字符不能转化为数字（后面跟着数字的正负号除外），返回`NaN`。

```javascript
//依次转换
parseInt('8a') // 8
parseInt('12**') // 12
parseInt('12.34') // 12
parseInt('15e2') // 15
parseInt('15px') // 15
//首字符不能转换
parseInt('abc') // NaN
parseInt('.3') // NaN
parseInt('') // NaN
parseInt('+') // NaN
parseInt('+1') // 1
```

如果字符串以`0x`或`0X`开头，`parseInt`会将其按照十六进制数解析。如果字符串以`0`开头，将其按照10进制解析。

```javascript
parseInt('0x10') // 16
parseInt('011') // 11
```

如果`parseInt`的参数不是字符串，则会先转为字符串再转换。对于那些会自动转为科学计数法的数字，`parseInt`会将科学计数法的表示方法视为字符串，因此导致一些奇怪的结果。

```javascript
parseInt(1000000000000000000000.5) // 1
// 等同于
parseInt('1e+21') // 1

parseInt(0.0000008) // 8
// 等同于
parseInt('8e-7') // 8
```

`parseInt`方法还可以接受第二个参数（2到36之间），表示被解析的值的进制，返回该值对应的十进制数。如果第二个参数不是数值，会被自动转为一个整数。这个整数只有在2到36之间，才能得到有意义的结果，超出这个范围，则返回`NaN`。如果第二个参数是`0`、`undefined`和`null`，则直接忽略。如果字符串包含对于指定进制无意义的字符，则从最高位开始，只返回可以转换的数值。如果最高位无法转换，则直接返回`NaN`。

```javascript
//正常转换
parseInt('1000', 2) // 8
parseInt('1000', 6) // 216
parseInt('1000', 8) // 512
//第二参数超出范围
parseInt('10', 37) // NaN
parseInt('10', 1) // NaN
//直接忽略
parseInt('10', 0) // 10
parseInt('10', null) // 10
parseInt('10', undefined) // 10
//无法转换
parseInt('1546', 2) // 1
parseInt('546', 2) // NaN
```

以下结果于Number()有区别

```javascript
parseInt([]) // NaN
Number([]) // 0

parseInt(true)  // NaN
Number(true) // 1

parseInt(null) // NaN
Number(null) // 0

parseInt('') // NaN
Number('') // 0

parseInt('123.45#') // 123.45
Number('123.45#') // NaN
```

#####　parseFloat()

如果字符串符合科学计数法，则会进行相应的转换。

```javascript
parseFloat('314e-2') // 3.14
parseFloat('0.0314E+2') // 3.14
```

没有第二个参数。

其余于parseInt()相似。

##### isNaN()

不可靠。判断`NaN`更可靠的方法是，利用`NaN`为唯一不等于自身的值的这个特点，进行判断。

```javascript
function myIsNaN(value) {
  return value !== value;
}
```

##### isFinite()

除了`Infinity`、`-Infinity`、`NaN`和`undefined`这几个值会返回`false`，`isFinite`对于其他的数值都会返回`true`。

### 字符串

由于 HTML 语言的属性值使用双引号，所以很多项目约定 JavaScript 语言的字符串只使用单引号。

#### 转义 反斜杠(\\)

需要用反斜杠转义的特殊字符，主要有下面这些。

- `\0` ：null（`\u0000`）
- `\b` ：后退键（`\u0008`）
- `\f` ：换页符（`\u000C`）
- `\n` ：换行符（`\u000A`）
- `\r` ：回车键（`\u000D`）
- `\t` ：制表符（`\u0009`）
- `\v` ：垂直制表符（`\u000B`）
- `\'` ：单引号（`\u0027`）
- `\"` ：双引号（`\u0022`）
- `\\` ：反斜杠（`\u005C`）

反斜杠还有三种特殊用法。

（1）`\HHH`

反斜杠后面紧跟三个八进制数（`000`到`377`），代表一个字符。`HHH`对应该字符的 Unicode 码点，比如`\251`表示版权符号。显然，这种方法只能输出256种字符。

（2）`\xHH`

`\x`后面紧跟两个十六进制数（`00`到`FF`），代表一个字符。`HH`对应该字符的 Unicode 码点，比如`\xA9`表示版权符号。这种方法也只能输出256种字符。

（3）`\uXXXX`

`\u`后面紧跟四个十六进制数（`0000`到`FFFF`），代表一个字符。`XXXX`对应该字符的 Unicode 码点，比如`\u00A9`表示版权符号。

#### 字符串与数组 ‘abc’[0]

如果方括号中的数字超过字符串的长度，或者方括号中根本不是数字，则返回`undefined`。

但是，无法改变字符串之中的单个字符。

```javascript
var s = 'hello';
s[1] = 'a';
s // "hello"
```

#### 字符集

总结一下，对于码点在`U+10000`到`U+10FFFF`之间的字符，JavaScript 总是认为它们是两个字符（`length`属性为2）。所以处理的时候，必须把这一点考虑在内，也就是说，JavaScript 返回的字符串长度可能是不正确的。

####　Base64转码

有时，文本里面包含一些不可打印的符号，比如 ASCII 码0到31的符号都无法打印出来，这时可以使用 Base64 编码，将它们转成可以打印的字符。另一个场景是，有时需要以文本格式传递二进制数据，那么也可以使用 Base64 编码。

JavaScript 原生提供两个 Base64 相关的方法。

- `btoa()`：任意值转为 Base64 编码
- `atob()`：Base64 编码转为原来的值

注意，这两个方法不适合非 ASCII 码的字符，会报错。

```javascript
btoa('你好') // 报错
```

要将非 ASCII 码字符转为 Base64 编码，必须中间插入一个转码环节，再使用这两个方法。

```javascript
function b64Encode(str) {
  return btoa(encodeURIComponent(str));
}

function b64Decode(str) {
  return decodeURIComponent(atob(str));
}

b64Encode('你好') // "JUU0JUJEJUEwJUU1JUE1JUJE"
b64Decode('JUU0JUJEJUEwJUU1JUE1JUJE') // "你好"
```

### 对象

#### 属性的读取与赋值 （点运算符 和 方括号运算符）

读取对象的属性，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

```javascript
var obj = {
  p: 'Hello World'
};

obj.p // "Hello World"
obj['p'] // "Hello World"
```

请注意，如果使用方括号运算符，键名必须放在引号里面，否则会被当作变量处理。下面代码中，引用对象`obj`的`foo`属性时，如果使用点运算符，`foo`就是字符串；如果使用方括号运算符，但是不使用引号，那么`foo`就是一个变量，指向字符串`bar`。

```javascript
var foo = 'bar';

var obj = {
  foo: 1,
  bar: 2
};

obj.foo  // 1
obj[foo]  // 2
//上一行相当于以下代码
obj['bar'] // 2
```

方括号运算符内部还可以使用表达式。而且数字键可以不加引号，因为会自动转成字符串。但是，数值键名不能使用点运算符（因为会被当成小数点）。

读取都就能赋值。

#### 属性的查看与删除

```javascript
var obj = {key1: 1, key2: 2};
Object.keys(obj); // ['key1', 'key2']
delete obj.key1 // true
Object.keys(obj) // ['key2']
delete obj.p // true
```

`delete`命令只有在删除存在且不得删除的属性时回返回false。

`delete`命令只能删除对象本身的属性，无法删除继承的属性。

#### 属性的遍历与是否存在 （in 和 for…in）

用对象的`hasOwnProperty`方法，可以判断是否为对象自身的属性。

```javascript
var obj = {a: 1, b: 2};
'a' in obj // true
'toString' in obj // true
obj.hasOwnProperty('toString') // false
for (var i in obj) {
  console.log('键名：', i);
  console.log('键值：', obj[i]);
}
// 键名： a
// 键值： 1
// 键名： b
// 键值： 2
```

`for...in`循环有两个使用注意点。

- 它遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性。
- 它不仅遍历对象自身的属性，还遍历继承的属性。

#### with 语句

建议不要使用`with`语句，可以考虑用一个临时变量代替`with`。

```javascript
with(obj1.obj2.obj3) {
  console.log(p1 + p2);
}

// 可以写成
var temp = obj1.obj2.obj3;
console.log(temp.p1 + temp.p2);
```

### 函数

#### 声明

**（1）function命令**

```javascript
//这叫做函数的声明（Function Declaration）。
function print(s) {
  console.log(s);
}
```

**（2）函数表达式**

```javascript
//这个匿名函数又称函数表达式（Function Expression），因为赋值语句的等号右侧只能放表达式。采用函数表达式声明函数时，function命令后面不带有函数名。如果加上函数名，该函数名只在函数体内部有效，在函数体外部无效。
var print = function(s) {
  console.log(s);
};
```

采用函数表达式声明函数时，`function`命令后面不带有函数名。如果加上函数名，该函数名只在函数体内部有效，在函数体外部无效。这种写法的用处有两个，一是可以在函数体内部调用自身，二是方便除错（除错工具显示函数调用栈时，将显示函数名，而不再显示这里是一个匿名函数）。因此，下面的形式声明函数也非常常见。

```javascript
var f = function f() {};
```

**（3）Function 构造函数**

总的来说，这种声明函数的方式非常不直观，几乎无人使用。

#### 函数名的提升

JavaScript 引擎将函数名视同变量名，所以采用`function`命令声明函数时，整个函数会像变量声明一样，被提升到代码头部。

```
var f = function () {
  console.log('1');
}

function f() {
  console.log('2');
}

f() // 1
```

上面例子中，表面上后面声明的函数`f`，应该覆盖前面的`var`赋值语句，但是由于存在函数提升，实际上正好反过来。

#### 函数的属性和方法

**name**

如果是通过变量赋值定义的函数，那么`name`属性返回变量名。

```javascript
var f2 = function () {};
f2.name // "f2"
```

但是，上面这种情况，只有在变量的值是一个匿名函数时才是如此。如果变量的值是一个具名函数，那么`name`属性返回`function`关键字之后的那个函数名。

```javascript
var f3 = function myName() {};
f3.name // 'myName'
```

**length**

函数的`length`属性返回函数预期传入的参数个数，即函数定义之中的参数个数。

```javascript
function f(a, b) {}
f.length // 2
```

**toString()**

函数的`toString()`方法返回一个字符串，内容是函数的源码。函数内部的注释也可以返回。

对于那些原生的函数，`toString()`方法返回`function (){[native code]}`。

#### 函数的作用域

函数本身也是一个值，也有自己的作用域。它的作用域与变量一样，就是其声明时所在的作用域，与其运行时所在的作用域无关。

####　参数

运行时无论提供多少个参数（或者不提供参数），JavaScript 都不会报错。省略的参数的值就变为`undefined`。但是，没有办法只省略靠前的参数，而保留靠后的参数。如果一定要省略靠前的参数，只有显式传入`undefined`。

**同名参数**

如果有同名的参数，则取最后出现的那个值。

```javascript
function f(a, a) {
  console.log(a);
}
f(1, 2) // 2
```

上面代码中，函数`f()`有两个参数，且参数名都是`a`。取值的时候，以后面的`a`为准，即使后面的`a`没有值或被省略，也是以其为准。

```javascript
function f(a, a) {
  console.log(a);
}
f(1) // undefined
```

#### arguments 对象

`arguments`对象包含了函数运行时的所有参数，`arguments[0]`就是第一个参数，`arguments[1]`就是第二个参数，以此类推。这个对象只有在函数体内部，才可以使用。

严格模式下，修改`arguments`对象，不会影响到真实参数`a`和`b`。

通过`arguments`对象的`length`属性，可以判断函数调用时到底带几个参数。

#### *闭包

闭包（closure）是 JavaScript 语言的一个难点，也是它的特色，很多高级应用都要依靠闭包实现。

理解闭包，首先必须理解变量作用域。前面提到，JavaScript 有两种作用域：全局作用域和函数作用域。函数内部可以直接读取全局变量。

```javascript
var n = 999;

function f1() {
  console.log(n);
}
f1() // 999
```

上面代码中，函数`f1`可以读取全局变量`n`。

但是，函数外部无法读取函数内部声明的变量。

```javascript
function f1() {
  var n = 999;
}

console.log(n)
// Uncaught ReferenceError: n is not defined(
```

上面代码中，函数`f1`内部声明的变量`n`，函数外是无法读取的。

如果出于种种原因，需要得到函数内的局部变量。正常情况下，这是办不到的，只有通过变通方法才能实现。那就是在函数的内部，再定义一个函数。

```javascript
function f1() {
  var n = 999;
  function f2() {
　　console.log(n); // 999
  }
}
```

上面代码中，函数`f2`就在函数`f1`内部，这时`f1`内部的所有局部变量，对`f2`都是可见的。但是反过来就不行，`f2`内部的局部变量，对`f1`就是不可见的。这就是 JavaScript 语言特有的"链式作用域"结构（chain scope），子对象会一级一级地向上寻找所有父对象的变量。所以，父对象的所有变量，对子对象都是可见的，反之则不成立。

既然`f2`可以读取`f1`的局部变量，那么只要把`f2`作为返回值，我们不就可以在`f1`外部读取它的内部变量了吗！

```javascript
function f1() {
  var n = 999;
  function f2() {
    console.log(n);
  }
  return f2;
}

var result = f1();
result(); // 999
```

上面代码中，函数`f1`的返回值就是函数`f2`，由于`f2`可以读取`f1`的内部变量，所以就可以在外部获得`f1`的内部变量了。

闭包就是函数`f2`，即能够读取其他函数内部变量的函数。由于在 JavaScript 语言中，只有函数内部的子函数才能读取内部变量，因此可以把闭包简单理解成“定义在一个函数内部的函数”。闭包最大的特点，就是它可以“记住”诞生的环境，比如`f2`记住了它诞生的环境`f1`，所以从`f2`可以得到`f1`的内部变量。在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

闭包的最大用处有两个，一个是可以读取函数内部的变量，另一个就是让这些变量始终保持在内存中，即闭包可以使得它诞生环境一直存在。请看下面的例子，闭包使得内部变量记住上一次调用时的运算结果。

```javascript
function createIncrementor(start) {
  return function () {
    return start++;
  };
}

var inc = createIncrementor(5);

inc() // 5
inc() // 6
inc() // 7
```

上面代码中，`start`是函数`createIncrementor`的内部变量。通过闭包，`start`的状态被保留了，每一次调用都是在上一次调用的基础上进行计算。从中可以看到，闭包`inc`使得函数`createIncrementor`的内部环境，一直存在。所以，闭包可以看作是函数内部作用域的一个接口。

为什么会这样呢？原因就在于`inc`始终在内存中，而`inc`的存在依赖于`createIncrementor`，因此也始终在内存中，不会在调用结束后，被垃圾回收机制回收。

闭包的另一个用处，是封装对象的私有属性和私有方法。

```javascript
function Person(name) {
  var _age;
  function setAge(n) {
    _age = n;
  }
  function getAge() {
    return _age;
  }

  return {
    name: name,
    getAge: getAge,
    setAge: setAge
  };
}

var p1 = Person('张三');
p1.setAge(25);
p1.getAge() // 25
```

上面代码中，函数`Person`的内部变量`_age`，通过闭包`getAge`和`setAge`，变成了返回对象`p1`的私有变量。

注意，外层函数每次运行，都会生成一个新的闭包，而这个闭包又会保留外层函数的内部变量，所以内存消耗很大。因此不能滥用闭包，否则会造成网页的性能问题。

#### 立即调用的函数表达式(IIFE)

通常情况下，只对匿名函数使用这种“立即执行的函数表达式”。它的目的有两个：一是不必为函数命名，避免了污染全局变量；二是 IIFE 内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量。

`function`这个关键字即可以当作语句，也可以当作表达式。为了避免解析上的歧义，JavaScript 引擎规定，如果`function`关键字出现在行首，一律解释成语句。用以下方法可以避免`function`关键字出现在行首

```javascript
(function(){ /* code */ }());
// 或者
(function(){ /* code */ })();
```

#### eval命令

`eval`的本质是在当前作用域之中，注入代码。由于安全风险和不利于 JavaScript 引擎优化执行速度，所以一般不推荐使用。通常情况下，`eval`最常见的场合是解析 JSON 数据的字符串，不过正确的做法应该是使用原生的`JSON.parse`方法。

### 数组

#### length 属性

 `length`属性是可写的。

如果人为设置一个小于当前成员个数的值，该数组的成员数量会自动减少到`length`设置的值。

如果人为设置`length`大于当前元素个数，则数组的成员数量会增加到这个值，新增的位置都是空位(`undefined`)。

如果人为设置`length`为不合法的值，JavaScript 会报错。

值得注意的是，由于数组本质上是一种对象，所以可以为数组添加属性，但是这不影响`length`属性的值。

如果数组的键名是添加超出范围的数值，该键名会自动转为字符串。

`length`属性不过滤空位。

#### 遍历

`for...in`循环不仅可以遍历对象，也可以遍历数组，但是，`for...in`不仅会遍历数组所有的数字键，还会遍历非数字键。空位会被跳过。

数组的`forEach`方法，也可以用来遍历数组，且不会遍历非数字键。空位会被跳过。

也可以用`for`循环或`while`循环。

#### 空位

当数组的某个位置是空元素，即两个逗号之间没有任何值，我们称该数组存在空位（hole）。如果最后一个元素后面有逗号，并不会产生空位。也就是说，有没有这个逗号，结果都是一样的。

`delete`命令删除了数组的元素，这个位置就形成了空位，但是对`length`属性没有影响。

数组的空位是可以读取的，返回`undefined`。数组的某个位置是空位，与某个位置是`undefined`，是不一样的。

#### 类似数组的对象

如果一个对象的所有键名都是正整数或零，并且有`length`属性，那么这个对象就很像数组，语法上称为“类似数组的对象”（array-like object）。

典型的“类似数组的对象”是函数的`arguments`对象，以及大多数 DOM 元素集，还有字符串。

数组的`slice`方法可以将“类似数组的对象”变成真正的数组。

```javascript
var arr = Array.prototype.slice.call(arrayLike);
```

除了转为真正的数组，“类似数组的对象”还有一个办法可以使用数组的方法，就是通过`call()`把数组的方法放到对象上面。

```javascript
function print(value, index) {
  console.log(index + ' : ' + value);
}

Array.prototype.forEach.call(arrayLike, print);
```

注意，这种方法比直接使用数组原生的`forEach`要慢，所以最好还是先将“类似数组的对象”转为真正的数组，然后再直接调用数组的`forEach`方法。

## 运算符

### 算术运算符

#### 加法运算符

##### 基本规则

加法运算符是在运行时决定，到底是执行相加，还是执行连接。也就是说，运算子的不同，导致了不同的语法行为，这种现象称为“重载”（overload）。由于加法运算符存在重载，可能执行两种运算，使用的时候必须很小心。

```javascript
'3' + 4 + 5 // "345"
3 + 4 + '5' // "75"
```

##### 对象的相加

如果运算子是对象，必须先转成原始类型的值，然后再相加。

先使用`valueOf`方法返回对象自身，如果不是原始类型的值，则使用`toString`方法，否则不使用`toString`.

```javascript
//修改valueOf
var obj = {
  valueOf: function () {
    return 1;
  }
};
obj + 2 // 3

//修改toString
var obj = {
  toString: function () {
    return 'hello';
  }
};
obj + 2 // "hello2"
```

特例：`Date`对象的实例会优先执行`toString`.

#### 余数运算符

需要注意的是，运算结果的正负号由第一个运算子的正负号决定。

```javascript
-1 % 2 // -1
1 % -2 // 1
```

余数运算符还可以用于浮点数的运算。但是，由于浮点数不是精确的值，无法得到完全准确的结果。

```javascript
6.5 % 2.1
// 0.19999999999999973
```

#### 指数运算符

指数运算符（`**`）完成指数运算，前一个运算子是底数，后一个运算子是指数。

注意，指数运算符是右结合，而不是左结合。即多个指数运算符连用时，先进行最右边的计算。

```javascript
// 相当于 2 ** (3 ** 2)
2 ** 3 ** 2
// 512
```

### 比较运算符

#### 非相等运算符

字符串的比较

按字典顺序，比较Unicode码点。 小写字母**大于**大写字母。

非字符串的比较

对象转换为原始类型再转换为数值再比较。

#### 严格相等运算

::: danger
TBC
:::