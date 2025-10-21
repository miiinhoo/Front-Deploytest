// 테이블/폼 자동 렌더링용 메타
export const PlanListArrays = [
  { id: 0, clmn: "planNo",         content: "생산번호" },
  { id: 1, clmn: "itemName",       content: "상품명",      input: "text" },   // 화면 표시용
  { id: 2, clmn: "planQty",        content: "생산수량",    input: "number" },
  { id: 3, clmn: "planState",      content: "상태",        input: "text" , options: ["생산중","완료"]},   // 생산중, 완료
  { id: 4, clmn: "planStartDate",  content: "생산시작일",  input: "date" },
  { id: 5, clmn: "planEndDate",    content: "생산종료일",  input: "date" },
];

// 폼 초기값
export const initPlanForm = () => ({
  planNo: null,
  itemNo: "",       // ✅ 서버 전송용 (select value)
  itemName: "",     // 화면 표시용
  planQty: 1,
  planState: "생산중",
  planStartDate: "",
  planEndDate: "",
});
