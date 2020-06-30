# ADO.NET 入门笔记

System.Data.dll中，System.Data命名空间，提供Ado.net类。



## 组成

1. DataSet 非链接的核心组件。独立于任何数据源的数据访问，多种不同的数据源。

2. Data Provider（数据提供程序）：用于连接数据库、执行命令、检索结果。

   SQLServer数据提供程序 System.Data.SqlClient命名空间

   OLEDB数据提供程序   System.Data.Oledb命名空间

   ODBC数据提供程序    System.Data.Odbc命名空间

   Oracle数据提供程序   System.Data.OracleClient命名空间



## Connection 提供与数据源的连接 (SqlConnection)

* 连接到数据库 打开连接 创建执行命令对象（创建命令） 执行命令 关闭连接

* SqlConnection类 继承于DbConnection抽象基类，不能被实例化。提供与SqlServer数据库的连接。

* 常用属性

  * ConnectionString连接字符串

    * 类型

      * Windows身份验证
        * Data Source: XXX ; Initial Catalog: XXX ; Integrated Security=True/SSPI; 或 Trusted_Connection=True;
      * Sql Server身份验证
        * Data Source= XXX ; Initial Catalog= XXX ; User Id= XXX ; Password= XXX ;
      * Oracle身份验证
        * Data Source= XXX ; User Id= XXX ; Password= XXX ;
      * MySQL身份验证
        * Data Source= XXX ; Initial Catalog= XXX ; User Id= XXX ; Password= XXX ;
      * Access身份验证
        * Provider= XXX ; Data Source= XXX ; User Id= XXX ; Password= XXX ;

    * 构建方法

      * 手写
      * 专门的类来构建连接字符串 DbConnectionStringBuilder基类 SqlConnectionStringBuilder

    * 配置文件中存储 XXX.config （XML）

      * \<connectionStrings> (推荐)

        string connStr = ConfigurationManager.ConnectionStrings[“在节点中的命名”].ConnectionString;

      * \<appSettings> (不推荐)

        string connStr = ConfigurationManager. AppSettings [“在节点中的命名”].ToString();

  * State

    * Closed Open Connecting Executing Fetching Broken

  * DataBase

  * DataSource

  * Pooling

    * 容器：存放了一定数量的与数据库服务器的物理连接。
    * 容器里取出一条空闲的连接，而不是创建一条新的连接。
    * 作用：减少了连接数据库开销，从而提高了应用程序的性能。
    * 分类：类别区分，同一时刻同一应用程序域可以有多个不同类型的连接池。
    * 什么来识别分区：进程、应用程序域、连接字符串、Windows标识共同组成的签名来标识区分。对同一应用程序域来说，由连接字符串来区分。打开一条连接，如果这条连接的类型签名与现有的连接不匹配会创建一个新的连接池，反之则不会创建，它们会共用一个连接池。
    * 如何分配：根据连接请求的类型，找到与它相匹配的连接池，尽力的分配一天空闲的连接。当有空闲的连接，返回这条连接。当已用完，创建一个新的连接添加到连接池中。当已达到最大连接数，等待，直到有空的连接。
    * 移除无效的连接：不能正确的连接到数据库服务器的连接。连接池存储的与数据库的连接数量是有限的。连接池管理器会处理无效连接的移除问题。
    * 回收连接：当使用完连接应当即时关闭或释放，conn对象的Close() Dispose() 连接回到连接池。
    * Max Pool Size = XXX
    * Min Pool Size = XXX
    * Pooling = True/False

* 常用方法

  * Open () Close () Dispose ()

    ```c#
    try { 
        Using (连接字符串 当using结束自动释放连接){
            连接字符串.Open ();
            ……;
        }
    }
    
    catch (SqlException ex){
        ……;
    }
    
    finally{
        ……;
    }
    ```



## Command 执行数据库命令的对象 (SqlCommand)

* 重要属性

  * Connection: Sql Command对象使用的Connection

  * CommandText: 获取或设置要执行的T-SQL语句或存储过程名

  * CommandType:CommandType.Text - 执行一个Sql语句

    ​							CommandType.StoreProcedure - 执行一个存储过程

    ​							默认Type是Text，如果是存储过程设置成StoreProcedure

  * Parameters: SqlCommand对象的命令参数集合 空集合

  * Transaction: 获取或设置要在其中执行的事务

* 创建方法

  * 先打开一条连接 ---conn

  * 创建命令 T-SQL存储过程 ---sql

  * 创建SqlCommand对象

    * SqlCommand cmd = new SqlCommand();

      cmd.Connection = conn;

      cmd.CommandText = sql;

      cmd.commandType = Text/StoreProcedure;

    * SqlCommand cmd = new SqlCommand(sql);

      cmd.Connection = conn;

    * SqlCommand cmd = new SqlCommand(sql, conn); **(推荐使用)**

    * SqlCommand cmd = conn.CreatCommand();

      cmd. CommandText = sql;

    * SqlCommand cmd = new SqlCommand(sql, conn，事务);

* 执行方法

  * ExecuteNonQuery

    * 执行T-SQL语句或存储过程并返回受影响的行数
    * 命令类型：插入、更新、删除 --- DML
    * 共有的条件：conn状态必须是Open
    * 连接使用原则：最晚打开最早关闭
    * Int count = cmd.ExecuteNonQuery();
    * 拼接式SQL 致命弱点：很容易被SQL注入
      * string sql = “insert into UserInfos (UserName, UserPwd, Age, DeptID) values (‘”+uName+”’, ‘”uPwd+”’, ”+age+”, “+deptID+”)”;

  * ExecuteScalar

    * 执行T-SQL语句或存储过程并返回查询结果集中的第一行第一列的值，忽略其他行或列。返回的是一个值或NULL

    * 命令类型：查询 --- DQL

    * 适应：作查询、返回一个值、记录数、数据运算而出的结果

    * 共有的条件：conn状态必须是Open

    * 有时，插入数据后，想返回自动生成的标识列的值，我们也可以用这个方法

      string sql = “insert into DeptInfos (DeptName) values (‘采购部’); select @@identity”;

  * ExecuteReader

    * 查询 返回一个对象：SqlDataReader 数据流

      * SqlDataReader 实时读取 游标 指针 固定—不灵活：只进不出，只能前进，不能后退 只读

      * 适用：只是读取数据，不做修改的情况下，数据量比较小

      * 创建方法

        * SqlDataReader dr = cmd.ExecteReader();

          关闭dr并不会释放连接

        * SqlDataReader dr = cmd.ExecteReader(CommondBehavior.CloseConnection); 

      * 不管关闭dr，还是conn，它们都会一致关闭

      * 连接释放后无法读取SqlDataReader中的数据

      * dr读取数据过程中，要即时保存，读一条丢一条

      * ```c#
        while (dr.Read ()){
            //确认是否可以前进到一条记录
            int UserId = int.Parase(dr[“UserId”].ToString());
            string username = dr[“UserNmae”].ToString();
        }
        dr.Close()
        ```

* 添加参数

  * 作用

    * 当不使用参数时，不带任何条件，不是通过参数传递，拼接SQL语句来生成SQL和具体的值。容易被SQL注入。
    * 防止SQL注入和转义

  * SqlParemeter对象

    * 表示SqlCommand对象的参数，或与DataSet中列的映射。 

    * 常用属性

      * DbType 参数的SqlDbType（数据类型 数据库的类型而言）

      * Direction 参数的类型：输入|输出|输入输出|返回值参数

        * 输入参数：参数化SQL语句或存储过程，默认使用的参数

        * 以下三种用在存储过程里

          * 输出：output 程序中是可以接收到值

            ```sql
            create proc GetDeptName
            @DeptID int,
            @DeptName nvarchar(50) output --输出参数
            as
            begin
            	select @DeptName=DeptName from DeptInfos
            where DeptId = @DeptID
            end
            ```

      ```
      
      ```

  * ParameterName 参数名称

  * Size 最大大小，以字节为单位

        * Value 参数的值
          
        * SqlValue 作为SQL类型的参数的值

    * 构造方法

      * 1.无参

        ```c#
        SqlParemeter pral = new SqlParemeter();
        pral.ParameterName = “@userName”; 参数名
        pral.SqlDbType = SqlDbType.VarChar; 数据类型
        pral.Value = “admin”; 参数值
        pral.Size = 20 大小
        ```

      * 2.参数名，参数值

        ```c#
        SqlParemeter pral = new SqlParemeter(“@Age”,24);
        ```

      * 3.参数名，类型

        ```c#
        SqlParemeter pral = new SqlParemeter(“@DepId”, SqlDbType.Int);
        ```

  * 4.参数名，类型，大小
        

        ```c#
        SqlParemeter pral = new SqlParemeter(“@UserPwd”, SqlDbType.VarChar,50);

      ```
      * 5.参数名，类型，大小,源列名（对应DataTable中的列名）
    
        ```c#
        SqlParemeter pral = new SqlParemeter(“@UserName”, SqlDbType.VarChar, 20, “UName”);
      ```

  ```
  
  ```

* 参数化Sql语句或一般储存过程里使用的是输入参数

* 添加单个参数

  * ```c#
    Cmd.Parameter.Add(new SqlParameter(“@userName”,”liag’ping”))
    ```

  * ```c#
    Cmd.Parameter.AddWithValue(“@userName”,”ling’ping”) 推荐
    ```

  * 添加多个参数

    * ```c#
      SqlParameter[] paras = {
      new SqlParameter (“@userName”,”ling’ping”)
      };
      
      Cmd.Parameters.AddRange(paras);
      ```



## DataReader 从数据源中提供快速的只读数据流 （SqlDataReader）

lDataAdapter 提供DataSet对象与数据的桥梁  Fill  Update

::: danger
TBC
:::