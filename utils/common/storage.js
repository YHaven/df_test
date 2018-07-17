/**
 * 设置缓存
 */
export const setStorage = (key, value) => {
  wx.setStorageSync(key, value)
}
/**
 * 获取缓存
 */
export const getStorage = (key) => {
  return wx.getStorageSync(key)
}
/**
 * 删除缓存
 */
export const removeStorage = (key) => {
  wx.removeStorageSync(key)
}
/**
 * 清空所有缓存
 */
export const clearStorage = () => {
  wx.clearStorageSync()
}