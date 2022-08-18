import { Sequelize } from 'sequelize' // 引入sequelize
// 使用url连接的形式进行连接，注意将root: 后面的XXXX改成自己数据库的密码
const MHDb = new Sequelize('mysql://root:admin123@localhost:3306/mh_db_schema', {
  define: {
    timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  },
  query: {
    raw: true
  }
})

export { MHDb }