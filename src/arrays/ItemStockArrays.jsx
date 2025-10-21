export const ItemStockColumns = [
  { id: "itemName", label: "상품명", key: "itemName" },
  { id: "isQty",    label: "현재재고", key: "isQty",    align: "right" },
  { id: "totalIn",  label: "누적입고", key: "totalIn",  align: "right" },
  { id: "totalOut", label: "누적출고", key: "totalOut", align: "right" },
];

export const ItemStockListArray = [
  { id: 1, clmn: "isNo",     content: "재고번호", input: "number" },
  { id: 2, clmn: "itemName", content: "품목명",   input: "text"   },
  { id: 3, clmn: "isQty",    content: "재고수량", input: "number" },
];

// 생산완료 리스트(Plan) 테이블 헤더
export const CompletedPlanArrays = [
  { id: 1, clmn: "planNo",        content: "생산계획번호" },
  { id: 2, clmn: "itemName",      content: "품목명" },
  { id: 3, clmn: "planQty",       content: "생산수량" },
  { id: 4, clmn: "planStartDate", content: "시작일" },
  { id: 5, clmn: "planEndDate",   content: "완료일" },
];