import axios_api from "./axios";
import { BASE_URL } from "./config";

const host = `${BASE_URL}/plan/bom`;

// 목록
export const getBomList = async () => {
  const res = await axios_api.get(host);
  return res.data;
}

// 단건
export const getBomOne = (bomId) =>
  axios_api.get(`${host}/${bomId}`).then(r => r.data);

// 등록
export const createBom = (formData) => {
  const payload = {
    itemNo: Number(formData.itemNo),
    partNo: Number(formData.partNo),
    qtyPerItem: Number(formData.qtyPerItem),
  };
  return axios_api.post(host, payload).then(r => r.data);
};

// 수정: useCRUD 스타일(한 개 인자)로 변경
export const updateBom = (formData) => {
  const { bomId, itemNo, partNo, qtyPerItem } = formData;
  if (!bomId && bomId !== 0) throw new Error("bomId 누락");
  const payload = {
    itemNo: Number(itemNo),
    partNo: Number(partNo),
    qtyPerItem: Number(qtyPerItem),
  };
  return axios_api.put(`${host}/${bomId}`, payload).then(r => r.data);
};

// 삭제
export const deleteBom = (bomId) =>
  axios_api.delete(`${host}/${bomId}`).then(r => r.data);
