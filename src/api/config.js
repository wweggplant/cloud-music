import axios from 'axios'

export const baseUrl = 'http://www.ipanda.site:3000/'

const axiosInstance = axios.create({
  baseURL: baseUrl
})

axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, '网络错误')
  }
)

export const categoryTypes = [{
  name: "全部",
  key: "-1"
},
  {
    name: "男歌手",
    key: "1"
  },
  {
    name: "女歌手",
    key: "2"
  },
  {
    name: "乐队",
    key: "3"
  }
];

// 歌手首字母
export const areaTypes = [
  {
    name: "全部",
    key: "-1"
  },
  {
    name: "华语",
    key: "7"
  },
  {
    name: "欧美",
    key: "96"
  },
  {
    name: "日本",
    key: "8"
  },
  {
    name: "韩国",
    key: "16"
  },
  {
    name: "其他",
    key: "0"
  },
];


export {
  axiosInstance
}
