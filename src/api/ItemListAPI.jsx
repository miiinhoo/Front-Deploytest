import axios_api from "./axios";
import { BASE_URL } from "./config";

const host = `${BASE_URL}/plan/itemlist`;

// 전체 조회
export const getItemList = async () => {
  const res = await axios_api.get(host);
  return res.data;
};

// 등록
export const createItemList = async (formData) => {
  const payload = {
    itemCode: formData.itemCode,
    itemName: formData.itemName,
    itemPrice: Number(formData.itemPrice),
    itemSpec: formData.itemSpec ?? "",
  };
  const res = await axios_api.post(host, payload);
  return res.data;
};

// 수정
export const updateItemList = (formData) => {
  const { itemNo, itemCode, itemName, itemPrice, itemSpec } = formData;
  if (!itemNo) throw new Error("itemNo 누락");

  const payload = {
    itemCode,
    itemName,
    itemPrice: Number(itemPrice),
    itemSpec: itemSpec ?? "",
  };
  return axios_api.put(`${host}/${itemNo}`, payload).then(r => r.data);
};

// 삭제
export const deleteItemList = async (itemNo) => {
  const res = await axios_api.delete(`${host}/${itemNo}`);
  return res.data;
};
