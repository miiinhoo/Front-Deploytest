// 테이블의 초기값을 줄 수 있는 배열들을 다루는 곳 > TableArrays.jsx



// 공통 초기 폼 데이터
export const initForms = {
  // 판매거래처 > /order/sellercustomer
    sellerCustomer: {   // 폼 초기화 데이터 배열
    cusNo: "",      // springboot에서 생성한 ResponseDTO파일의 필드변수명들을 여기에 적어야함. (다르면 무조건 오류)
    cusComp: "",   // 예시 : private Long poNo; 등등 .... 
    cusName: "",
    cusEmail: "",
    cusPhone: "",
    cusAddr: "",
  },
  // 상품주문서 > /order/orderlist
  orderList: {
    orderNo: "",
    cusComp: "",   // 고객사명
    itemName: "",  // 상품명
    orderQty: "",
    orderPrice: "",
    totalPrice: "",
    orderState: "",
    orderDeliState: "",
    orderDate: "",
    deliveryDate: "",
    cusAddr: "",
},

  // 구매거래처 > /buyer/buyercustomer
  buyerCustomer: {
    buyerNo: "",
    buyerComp:"",
    buyerName:"",
    buyerEmail:"",
    buyerPhone:"",
    buyerAddr:"",
  },
  // 부품리스트  > /buyer/partlist
  part: {  // 폼 초기화 데이터 배열
    partNo: "",
    partCode: "",
    partName: "",
    partSpec: "",
    partPrice: "",
  },
  // 부품 발주. > /buyer/partorder
  partOrder: {     
  poNo: "",       
  buyerNo: "",  // 숫자형 FK
  partNo: "",   // 숫자형 FK
  poQty: "",
  poPrice: "",
  poState: "입고대기",
  poDate: "",
  buyerAddr: "",
},

  // 아이템 리스트 > /plan/itemlist
  itemList: {
    itemNo:"",
    itemCode:"",
    itemName:"",
    itemSpec:"",
    itemPrice:"",
  },
  // 생산리스트 > /plan/planlist
  plan : {
    planNo: "",
    itemName: "",
    planQty: "",
    planState: "",
    planStartDate: "",
    planEndDate: "",
  },
  // 사용자 회원가입 폼 초기화
  signup : {
    loginId: "",
    password: "",
    userName: "",
  }
  
};