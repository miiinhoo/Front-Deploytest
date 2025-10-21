import axios_api from "./axios";
import { BASE_URL } from "./config";

const host = `${BASE_URL}/order/sellercustomer`;

// 전체 조회
export const getCustomer = async () => {
  const res = await axios_api.get(host);
  return res.data;
};

// 등록
export const createCustomer = async (formData) => {
  const res = await axios_api.post(host, formData);
  return res.data;
};

// 수정
export const updateCustomer = async (cusNo, formData) => {
  const res = await axios_api.put(`${host}/${cusNo}`, formData);
  return res.data;
};

// 삭제
export const deleteCustomer = async (cusNo) => {
  const res = await axios_api.delete(`${host}/${cusNo}`);
  return res.data;
};
