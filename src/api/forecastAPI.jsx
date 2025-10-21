import axios_api from "./axios";

// 드롭다우 아이템 목록
export const getItems = async () => {
  const { data } = await axios_api.get("/plan/itemlist/main");
  return data; // [{itemNo, itemName}]
};

export const getForecastSeries = async (itemNo, h = 12) => {

  // 1 )
  const { data } = await axios_api.get("/forecast/series", {
    params: { itemNo, h },
  });
  return data;
};
