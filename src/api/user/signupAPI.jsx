import { BASE_URL } from "../config";
import axios_api from "../axios";

const host = `${BASE_URL}/signup`;

export const getUserInfo = async() => {
  const res = await axios_api.get(host);
  return res.data;
}
export const createUserInfo = async(formData) => {
  delete formData.userNo;
  const payload = {
    userName: String(formData.userName),
    loginId: String(formData.loginId),
    password: String(formData.password)
  }
  const res = await axios_api.post(host,payload);
  console.log(res.data);
  return res.data;
}