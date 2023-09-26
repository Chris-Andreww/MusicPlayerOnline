import { showToast } from "vant"
import { usePlayId } from "@/store"
import { getSongCheckAPI } from "@/api"

//歌曲id和歌曲列表
export const playFn = async (id, songs) => {
  const store = usePlayId()
  const checkRes = await getSongCheckAPI(id)
  if (!checkRes.data.success) {
    showToast('当前歌曲为会员歌曲，只能试听30秒~~')
  }
  if (store.id == id) {  //如果点击的歌曲和当前正在播放的歌曲相同，则显示播放页
    store.showSlideBar = true
    return
  }
  store.id = id
  //用于歌曲切换而创建的列表
  store.curPlayList = songs.map(val => {
    return val.id
  })
}