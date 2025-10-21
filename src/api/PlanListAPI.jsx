import axios_api from "./axios";
import { BASE_URL } from "./config";

const host = "/plan/planlist";

export const getPlanList = async () => {
  try {
    const res = await axios_api.get("/plan/planlist");
    return res.data;
  } catch (err) {
    console.error("[getPlanList] status:", err?.response?.status);
    console.error("[getPlanList] data:", err?.response?.data); // ← 서버 에러 메시지
    throw err;
  }
};


// 등록: 서버는 itemNo(숫자), planQty(숫자) 등만 받음
export const createPlan = async (formData) => {
  const payload = {
    itemNo: Number(formData.itemNo),
    planQty: Number(formData.planQty),
    planState: formData.planState,
    planStartDate: formData.planStartDate,  // YYYY-MM-DD
    planEndDate: formData.planEndDate,      // YYYY-MM-DD
  };
  const res = await axios_api.post(host, payload);
  return res.data;
};

// 수정: useCRUD가 api.update(formData)로 호출
export const updatePlan = async (formData) => {
  const planNo = formData.planNo;
  const payload = {
    itemNo: Number(formData.itemNo),
    planQty: Number(formData.planQty),
    planState: formData.planState,
    planStartDate: formData.planStartDate,
    planEndDate: formData.planEndDate,
  };
  const res = await axios_api.put(`${host}/${planNo}`, payload);
  return res.data;
};

// 상태 PATCH
export const patchPlanStatus = (planNo, payload) => {
  return axios_api.patch(`${BASE_URL}/plan/planlist/${planNo}/status`, payload, {
    headers: {"Content-Type" : "application/json"}
    }).then(r => r.data);
};

// 완료된 생산 리스트
export const getCompletedPlanList = async () => {
  const res = await axios_api.get(`${host}/completed`);
  return res.data;
}

// 삭제
export const deletePlan = async (planNo) => {
  const res = await axios_api.delete(`${host}/${planNo}`);
  return res.data;
};


