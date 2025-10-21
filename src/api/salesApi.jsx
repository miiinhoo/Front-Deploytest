import axios_api from "./axios";

/** 월별 판매수익 */
export async function fetchMonthlyRevenue() {
  const { data } = await axios_api.get("/sales/monthly");
  return Array.isArray(data) ? data : data?.rows ?? [];
}

/** 특정 월 Top10 수량 */
export async function fetchItemQtyMonthlyByYm(ym) {
  const { data } = await axios_api.get("/sales/item-qty-monthly", { params: { ym }});
  return Array.isArray(data) ? data : data?.rows ?? [];
}

/** 모든 월×상품 수량 (월 목록 뽑는 용도) */
export async function fetchItemQtyMonthlyAll() {
  const { data } = await axios_api.get("/sales/item-qty-monthly-all");
  return Array.isArray(data) ? data : data?.rows ?? [];
}
