import axios_api from "./axios";

// 전체 리스트
export const getPartStockList = async () => {
  const { data } = await axios_api.get("/stock/partstocks");
  return data; // PartStockResponseDto[]
};