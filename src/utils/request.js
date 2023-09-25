// 这段代码是在使用axios进行网络请求时
//设置默认的请求URL为"http://localhost:3000"
//同时，将axios作为默认的导出值，以便在其他文件中使用。
import axios from 'axios'
axios.defaults.baseURL = "http://192.168.31.3:3000/"
//axios.defaults.baseURL = "https://music.lzah.top/api/"
axios.defaults.withCredentials = true
export default axios