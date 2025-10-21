// partOrderArrays.jsx > 부품발주부분 table의 clmn:(springboot에서 선언한 )


// 예시, id : 1,2,3,4,5... 
// clmn : 자기가 맡은 부분의 백 entity에 선언한 변수명들 이름불러오기
// input : 
export const partOrderArrays = [            
  { id: 1, clmn: "poNo", input: "number",content: "발주번호" },
  { id: 2, clmn: "buyerComp", input: "number", content: "구매처명" },
  { id: 3, clmn: "partName", input: "number", content: "부품명" },
  { id: 4, clmn: "poQty", input: "number", content: "구매수량" },
  { id: 5, clmn: "poPrice", input: "number", content: "구매단가" },
  { id: 6, clmn: "poState", content: "구매상태" },
  { id: 7, clmn: "poDate", input: "date", content: "입고일자" },
  { id: 8, clmn: "buyerAddr", input: "text", content: "구매처주소" }
];