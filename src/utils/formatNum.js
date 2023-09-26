export const formatNum = (num) => {
  if (num < 10000) return num;
  else if (num < 100000000) return (num / 10000).toFixed(1) + '万';
  else return (num / 100000000).toFixed(1) + '亿';
}