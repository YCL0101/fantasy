const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
let cors = require('cors');
app.use(cors()); // 跨域
// 秘钥用于签署令牌
const secretKey = 'YOd+1doeFhZ8Y~m';
// 秘钥（Secret Key）在 JSON Web Tokens（JWT）中用于签署令牌，以确保令牌的完整性和真实性。令牌签名是一种数字签名，用于验证令牌是否被篡改或伪造。只有拥有相同秘钥的服务器才能成功签署和验证令牌。

// 在 JWT 中，令牌分为三个部分：头部（Header）、有效载荷（Payload）和签名（Signature）。头部和有效载荷是基于 Base64 编码的 JSON 对象，可以直接被解码。签名部分是由头部、有效载荷和秘钥共同生成的，用于验证令牌的真实性。

// 通过将秘钥用于签署令牌，服务器可以确保：

// 令牌的完整性：任何对令牌的修改都会影响签名，从而使令牌失效。
// 令牌的真实性：仅有持有正确秘钥的服务器才能生成有效的签名，防止伪造令牌。
// 创建数据库连接池
// const pool = mysql.createPool({
//   host: 'mysql.sqlpub.com',
//   user: 'ycl001',
//   password: 'f4079d084c137e4a',
//   database: 'ycltest',
//   port: '3306',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// 创建数据库连接池
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'ycl',
//   port: '3306',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
const pool = mysql.createPool({
  host: 'sh-cynosdbmysql-grp-afh9xpek.sql.tencentcdb.com',
  user: 'root',
  password: '20001215Yuchenglong',
  database: 'data',
  port: '27935',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const connection = pool.promise();


app.use(express.urlencoded({ extended: true }));

const port = 3000;
app.listen(port, () => {
  console.log(`服务器正在监听端口 ${port}`);
});

app.use(express.json());

app.post('/api/login', async (req, res) => {
  console.log('post 请求执行');
  // 获取到的信息
  const username = req.body.username;
  const password = req.body.password;

  // 简单示例的数据验证
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '请提供完整的登录信息' });
  }

  try {
    // 检查用户名是否已注册
    const checkSql = 'SELECT * FROM users WHERE username = ?';
    const checkValues = [username];

    const [checkResults] = await connection.query(checkSql, checkValues);

    if (checkResults.length === 0) {
      // 用户名不存在
      return res.status(404).json({ success: false, message: '用户名不存在' });
    }

    // 检查密码是否正确
    const user = checkResults[0];
    if (user.password !== password) {
      // 密码错误
      return res.status(401).json({ success: false, message: '密码错误' });
    }

    
    // 登录成功，生成令牌
    const payload = { username: user.username }; // 令牌的有效载荷
    const options = { expiresIn: '1h' }; // 令牌的过期时间

    // 使用 JWT 生成令牌
    const token = jwt.sign(payload, secretKey, options);

    // 返回令牌给客户端
    return res.status(200).json({ success: true, message: '登录成功', token });

  } catch (error) {
    console.error('查询数据失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
});
// POST 请求
app.post('/api/register', async (req, res) => {
  console.log('post 请求执行');
  // 获取到的信息
  const username = req.body.username;
  const password = req.body.password;

  // 简单示例的数据验证
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '请提供完整的注册信息' });
  }

  try {
    // 检查用户名是否已注册
    const checkSql = 'SELECT * FROM users WHERE username = ?';
    const checkValues = [username];

    const [checkResults] = await connection.query(checkSql, checkValues);

    if (checkResults.length > 0) {
      // 用户名已注册
      return res.status(409).json({ success: false, message: '用户名已注册' });
    }

    // 执行插入操作
    const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const insertValues = [username, password];

    const [insertResults] = await connection.query(insertSql, insertValues);

    console.log('数据插入成功');
    console.log('插入的记录ID:', insertResults.insertId);
    return res.status(200).json({ success: true, message: '注册成功' });
  } catch (error) {
    console.error('查询或插入数据失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
});
app.post('/api/forum', async (req, res) => {
  console.log('post 请求执行');
  // 获取到的信息
  const keywords = req.body.keyWord;
  const content = req.body.content;

  // 简单示例的数据验证
  if (!keywords || !content) {
    return res.status(400).json({ success: false, message: '请提供完整的信息' });
  }

  try {
    // const checkSql = 'SELECT * FROM posts WHERE keywords = ?';
    // const checkValues = [keywords];

    // const [checkResults] = await connection.query(checkSql, checkValues);

    // if (checkResults.length > 0) {
    //   // 用户名已注册
    //   return res.status(409).json({ success: false, message: '关键词已存在' });
    // }

    // 执行插入操作
    const insertSql = 'INSERT INTO posts (keywords, content) VALUES (?, ?)';
    const insertValues = [keywords, content];

    const [insertResults] = await connection.query(insertSql, insertValues);

    console.log('数据插入成功');
    console.log('插入的记录ID:', insertResults.insertId);
    return res.status(200).json({ success: true, message: '成功' });
  } catch (error) {
    console.error('查询或插入数据失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
});
app.post('/api/search', async (req, res) => {
  console.log('post 请求执行');
  
  try {
//     const authorizationHeader = req.headers.authorization;

//     if (!authorizationHeader) {
//       return res.status(401).json({ success: false, message: '没有提供令牌' });
//     }
// console.log(authorizationHeader);
//     const token = authorizationHeader.split(' ')[1]; // 分割后取第二部分，即令牌部分
//     console.log(token);

      // 获取关键词
      const keywords = req.body.keyWord;

      // 在数据库中执行查询操作
      const searchSql = 'SELECT * FROM posts WHERE keywords LIKE ?'; // 修改为你的表名和列名
      const searchValues = [`%${keywords}%`]; // 使用 LIKE 进行模糊匹配

      const [searchResults] = await connection.query(searchSql, searchValues);

      // 返回查询结果
      return res.status(200).json({ success: true, message: '成功', data: searchResults });
  } catch (error) {
      console.error('查询数据失败:', error);
      return res.status(500).json({ success: false, message: '服务器错误' });
  }
});
