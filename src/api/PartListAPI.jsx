import axios_api from "./axios";

const host = "/buyer/partlist";

// 전체 조회
export const getPartList = async () => {
  const res = await axios_api.get(host);
  return res.data;
};

// 등록
export const createPartList = async (formData) => {
  const payload = {
    partCode: formData.partCode,
    partName: formData.partName,
    partSpec: formData.partSpec,
    partPrice: Number(formData.partPrice),
    buyerNo: Number(formData.buyerComp) || null, // buyerComp select의 value = buyerNo
  };

  if (!payload.buyerNo) {
    // 서버 round-trip 없이 빠르게 막기
    throw new Error("구매처(buyerNo) 선택은 필수입니다.");
  }

  const res = await axios_api.post(host, payload);
  return res.data;
};

export const updatePartList = async (formData) => {
  const { partNo } = formData;
  if (!partNo) throw new Error("partNo가 없습니다.");

  const payload = {
    partCode: formData.partCode,
    partName: formData.partName,
    partSpec: formData.partSpec,
    partPrice: Number(formData.partPrice),
    buyerNo: Number(formData.buyerComp) || null,
  };
  if (!payload.buyerNo) throw new Error("구매처(buyerNo) 선택은 필수입니다.");

  const res = await axios_api.put(`${host}/${partNo}`, payload);
  return res.data;
};

// 삭제
export const deletePartList = async (partNo) => {
  const res = await axios_api.delete(`${host}/${partNo}`);
  return res.data;
};
