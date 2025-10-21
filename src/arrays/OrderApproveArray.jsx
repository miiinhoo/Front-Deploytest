
export const OrderApproveArray = [
  { id: 1, key: "orderNo",      label: "주문번호" },
  { id: 2, key: "orderDate",    label: "주문일자" },
  { id: 3, key: "cusComp",      label: "판매처명" },
  { id: 4, key: "itemName",     label: "상품명" },
  { id: 5, key: "orderQty",     label: "수량" },
  { id: 6, key: "orderPrice",   label: "단가" },
  { id: 7, key: "totalPrice",   label: "총 금액" },
  { id: 8, key: "deliveryDate", label: "납품일자" },
  { id: 9, key: "cusAddr",      label: "주소" },
];

// 숫자 포맷 필요한 컬럼 모음 (페이지에서 그대로 씀)
export const ORDER_APPROVE_NUMERIC_KEYS = new Set(["orderQty", "orderPrice", "totalPrice"]);
