import axios from "axios";
import { getCookie } from "./cookieUtil";

const jwtAxios = axios.create();

// 요청 전 단계
const beforeReq = (config) => {
  console.log("before request .............");
  
  const memberInfo = getCookie("member");

  if (!memberInfo) {
  console.log("Member NOT FOUND");
  const error = new Error("REQUIRE_LOGIN");
  error.response = { data: { error: "REQUIRE_LOGIN" } };
  return Promise.reject(error);
}
  return config;
}

// 요청 실패
const requestFail = (error) => {
  console.log("request error............")
  return Promise.reject(error)
}

// 응답 반환 전 단계
const beforeRes = async (res) => {
  console.log("before return response.............")
  return res
}

// 응답 실패
const repsonseFali = (error) => {
  console.log("response fail error..............")
  return Promise.reject(error)
}

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, repsonseFali);
export default jwtAxios;