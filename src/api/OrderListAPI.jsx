import axios_api from "./axios";
import { BASE_URL } from "./config";

const host = `${BASE_URL}/order`;

// 전체 주문 조회
export const getOrderList = async () => {
  const res = await axios_api.get(host);
  return res.data;
};

// 등록
export const createOrderList = async (formData) => {
  const res = await axios_api.post(host, formData);
  return res.data;
};

// 수정
export const updateOrderList = async (orderNo, formData) => {
  const res = await axios_api.put(`${host}/${orderNo}`, formData);
  return res.data;
};

// 상태 값 변경
export const updateOrderStatus = async (orderNo, body) => {
  axios_api.patch(`${BASE_URL}/order/${orderNo}/status`, body).then(r => r.data);
};

// 상태 값 완료
export const getCompletedOrders = async () => {
  const res = await axios_api.get(`${BASE_URL}/order/completed`);
  return res.data;
}

// 삭제
export const deleteOrderList = async (orderNo) => {
  const res = await axios_api.delete(`${host}/${orderNo}`);
  return res.data;
};
