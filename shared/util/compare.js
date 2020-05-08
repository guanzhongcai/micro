/**
 * 版本号比较
 * @param left string 版本1
 * @param right string 版本2
 * @returns {int|number} -1/0/1 小于/等于/大于
 */
module.exports = (left, right) => require('version-comparison')(left, right);
