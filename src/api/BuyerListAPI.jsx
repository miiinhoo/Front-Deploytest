import axios_api from "./axios";
import { BASE_URL } from "./config";

const host = `${BASE_URL}/buyer/buyercustomer`;

// 전체 조회
export const getBuyerCustomer = async () => {
  const res = await axios_api.get(host);
  return res.data;
};

// 등록
export const createBuyerCustomer = async (formData) => {
  const res = await axios_api.post(host, formData);
  return res.data;
};

// 수정
export const updateBuyerCustomer = async (buyerNo, formData) => {
  const res = await axios_api.put(`${host}/${buyerNo}`, formData);
  return res.data;
};

// 삭제
export const deleteBuyerCustomer = async (buyerNo) => {
  const res = await axios_api.delete(`${host}/${buyerNo}`);
  return res.data;
};
