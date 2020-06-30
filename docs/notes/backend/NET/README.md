# .Net 入门笔记

## 基础定义

###　CIL(通用中间语言) 

Common Intermediate Language是一种属于通用语言架构和.NET框架的低阶（lowest-level）的人类可读的编程语言。目标为.NET 框架的语言被编译成CIL，然后汇编成字节码。CIL类似一个面向对象的汇编语言，并且它是完全基于堆栈的。它运行在虚拟机上，其主要的语言有C#、Visual Basic .NET、C++/CLI以及 J#。



### CLR(通用语言运行时)

Common language runtime即公共语言运行库，是托管代码执行核心中的引擎。CLR为托管代码提供各种服务，如跨语言集成、跨语言异常处理、增强的安全性、版本控制和部署支持、简化的组件交互模型、调试和分析服务等。使CLR能够向托管代码提供服务，语言编译器必须生成一些元数据来描述代码中的类型、成员和引用。

![image-20200629135216135](C:\Users\cjcj1\AppData\Roaming\Typora\typora-user-images\image-20200629135216135.png)

 

### CTS(通用类型系统)

Common type system一种确定公共语言运行库如何定义、使用和管理类型的规范。CLR 通过CTS （通用类型系统），实现严格的类型和代码验证，来增强代码鲁棒性。CTS 确保所有托管代码是自我描述的。各种Microsoft编译器和第三方语言编译器都可生成符合CTS的托管代码。这意味着，托管代码可在严格实施类型保真和类型安全的同时，使用其他托管类型和实例。



### CLS(通用语言规范)

Common Language Specification .NET Framework将CLS定义为一组规则，所有.NET语言都应该遵循此规则才能创建与其他语言可互操作的应用程序，但要注意的是为了使各语言可以互操作，只能使用CLS所列出的功能对象，这些功能统称为与CLS兼容的功能。 例如：C#支持无符号数字类型，该特征能通过CTS的测试，但CLS却仅仅识别符号数字类型。因此，如果用户在一个组件中使用C#的无符号类型，就可能不能与不使用无符号类型的语言(如VB.NET)设计的.NET组件实现互操作。这里用的是“可能不”，而不是“不可能”，因为这一问题实际依赖于对non-CLS-compliant项的可见性。事实上，CLS规则只适用于或部分适用于那些与其他组件存在联系的组件中的类型。实际上，用户能够安全实现含私有组件的项目，而该组件使用了用户所选择使用的.NET语言的全部功能，且无需遵守CLS的规范。另一方面，如果用户需要.NET语言的 互操作性，那么用户的组件中的公共项必须完全符合CLS规范。

![image-20200629141324530](C:\Users\cjcj1\AppData\Roaming\Typora\typora-user-images\image-20200629141324530.png)

### CLI(通用语言基础结构)

Common Language Infrastructure是CLR的一个子集，也就是 .NET中最终对编译成MSIL代码的 应用程序的运行环境进行管理的那一部分。在CLR结构图中CLI位于下半部分，主要包括类加载器(Class Loader)、实时[编译器](https://baike.sogou.com/lemma/ShowInnerLink.htm?lemmaId=106869&ss_c=ssc.citiao.link)(IL To Native Compilers)和一个运行时环境的垃圾收集器(Garbage Collector)。CLI是.Net和CLR的灵魂，CLI为IL代码提供运行的环境，你可以将使用任何语言编写的代码通过其特定的 编译器转换为MSIL代码之后运行其上，甚至还可以自己写MSIL代码在CLI上面运行。



### JIT编译器(即时编译器)

Just-In-Time Compiler JIT是一种提高程序运行效率的方法。通常，程序有两种运行方式：静态编译与动态解释。静态编译的程序在执行前全部被翻译为机器码，而解释执行的则是一句一句边运行边翻译。



### BCL(基类库)

代表了.NET框架的核心。不管人们开发何种应用程序，BCL总是作为构建其他所有功能的起点。基类库目录位于系统目录下面的Lib目录，框架内置的有Think核心类库，还可以扩展ORG 、Com扩展类库。核心基类库的作用是完成框架的通用性开发而必须的基础类和常用工具类等，包含有：Think.Core 核心类库包;Think.Db 数据库类库包;Think.Exception 异常处理类库包;Think.Template 内置模板引擎类库包;Think.Util 系统工具类库包。



### FLC(框架类库)

从功能上来看，可以将FCL框架类库划分成以下几层。

最内一层，由BCL的大部分组成，主要作用是对.NET框架、.NET运行时及CIL语言本身进行支持，例如基元类型、集合类型、线程处理、应用程序域、运行时、安全性、互操作等。

中间一层，包含了对操作系统功能的封装，例如文件系统、网络连接、图形图像、XML操作等。

最外一层，包含各种类型的应用程序，例如Windows Forms、Asp.NET、WPF、WCF、WF等。



### Assembly(程序集) 

那么什么样格式的文件才是一个Windows可执行文件？这个格式被称作PE/COFF（Microsoft Windows Portable Executable/Common Object File Format），Windows可移植可执行/通用对象文件格式。Windows操作系统能够加载并运行.dll和.exe是因为它能够理解PE/COFF文件的格式。显然，所有在Windows操作系统上运行的程序都需要符合这个格式，当然也包括.NET程序集在内。在这一级，程序的控制权还属于操作系统，PE/COFF头包含了供操作系统查看和利用的信息。此时，程序集可以表示成如图6-14所示。

![image-20200629141343684](C:\Users\cjcj1\AppData\Roaming\Typora\typora-user-images\image-20200629141343684.png)

在前面提到过，程序集中包含的CIL语言代码并不是计算机可以直接执行的，还需要进行即时编译，那么在对CIL语言代码进行编译前，需要先将编译的环境运行起来，因此PE/COFF头之后的就是CLR头了。CLR头最重要的作用之一就是告诉操作系统这个PE/COFF文件是一个.NET程序集，区别于其他类型的可执行程序。

![image-20200629141350748](C:\Users\cjcj1\AppData\Roaming\Typora\typora-user-images\image-20200629141350748.png)

在CLR头之后就是大家相对熟悉一些的内容了。首先，程序集包含一个清单（manifest），这个清单相当于一个目录，描述了程序集本身的信息，例如程序集标识（名称、版本、文化）、程序集包含的资源（Resources）、组成程序集的文件等。

![image-20200629141356747](C:\Users\cjcj1\AppData\Roaming\Typora\typora-user-images\image-20200629141356747.png)

清单之后就是元数据了。如果说清单描述了程序集自身的信息，那么元数据则描述了程序集所包含的内容。这些内容包括：程序集包含的模块（会在第7章介绍）、类型、类型的成员、类型和类型成员的可见性等。注意，元数据并不包含类型的实现，有点类似于C++中的.h头文件。在.NET中，查看元数据的过程就叫做反射（Reflection）。

![image-20200629141403267](C:\Users\cjcj1\AppData\Roaming\Typora\typora-user-images\image-20200629141403267.png)

接下来就是已经转换为CIL的程序代码了，也就是元数据中类型的实现，包括方法体、字段等，类似于C++中的.cpp文件。

![img](file:///C:/Users/cjcj1/AppData/Local/Temp/msohtmlclip1/01/clip_image002.jpg)

注意，上图中还多添加了一个资源文件，例如.jpg图片。从这幅图可以看出，程序集是自解释型的（Self-Description），不再需要任何额外的东西，例如注册表，就可以完整地知道程序集的一切信息。

::: danger
TBC
:::