import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);// 보관 기간
  return cookies.set(name, value, {path : "/", expires: expires});
}

export const getCookie = (name) => {
  return cookies.get(name)
}

export const removeCookie = (name, path = "/") => {
  cookies.remove(name, {path});
}