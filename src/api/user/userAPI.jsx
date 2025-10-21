import axios_api from "../axios";
import { BASE_URL } from "../config";

const host = `${BASE_URL}/login`;

export const LoginAPI = async(loginData) => {
  
  try{
    const res = await axios_api.post(host,loginData);
    return res.data;
  } catch (err) {
    console.error("로그인 실패:", err);
    return { error: true };
  }
 
}