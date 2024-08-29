import { getUserInfo } from "../api/login"


const userInfo = ref({
  username: '',
  nickName: '',
  headPic: '',
  email: '',
})

export const useUserInfo = () => {

  const getInfo = async () => {
    const { data } = await getUserInfo();
    Object.assign(userInfo.value, data)
  }

  return {
    userInfo,
    getInfo
  }
}