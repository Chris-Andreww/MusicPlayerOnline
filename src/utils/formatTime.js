export const formatDate = (timestamp) => {
  // 创建一个新的Date对象，使用时间戳作为参数
  const date = new Date(timestamp);

  // 获取年份
  const year = date.getFullYear();

  // 获取月份，由于getMonth()返回的月份范围是0-11，所以需要加1
  const month = ("0" + (date.getMonth() + 1)).slice(-2);

  // 获取日期，slice（-2）代表从字符串末尾截取2位，例如011就截取为11,06就截取为06
  const day = ("0" + date.getDate()).slice(-2);

  // // 获取小时
  // const hours = ("0" + date.getHours()).slice(-2);

  // // 获取分钟
  // const minutes = ("0" + date.getMinutes()).slice(-2);

  // // 获取秒数
  // const seconds = ("0" + date.getSeconds()).slice(-2);

  // 返回格式化后的日期时间字符串，使用模板字符串的形式拼接各个部分
  return `${year}年${month}月${day}日`;
}