
//useCrud.jsx (훅)

// ***역할: 모든 CRUD 로직과 상태를 관리***

// ***페이지에서는 UI만 담당하게 함***


import { useState } from "react"; // React의 상태 관리용 훅
import axios from "axios";
import { BASE_URL } from "../api/config";

// - initFormData: 각 페이지별 초기 폼 데이터를 반환하는 함수
// - api: CRUD를 수행할 API { getAll, create, update, delete }
// - keyField: 각 아이템의 고유 키 필드명, 기본값은 "id"
export const useCRUD = ({ initFormData, api, keyField = "id" }) => { 
  // items: 목록 데이터, setItems: 목록 상태 업데이트 함수
  const [items, setItems] = useState([]);

  
  // formData: 입력 폼 상태, setFormData: 폼 데이터 업데이트
  const [formData, setFormData] = useState(initFormData());
  
  // selectedItem: 현재 선택된 항목 (수정/삭제용)
  const [selectedItem, setSelectedItem] = useState(null);

  // 등록 창을 열 수 있는 useState(boolean)
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 수정 창을 열 수 있는 useState(boolean)
  const [isEditOpen, setIsEditOpen] = useState(false);

  //--------------------------------
  // FK ORDER FORM 예시 useState
  // 판매거래처 useState(배열)
  const [customer,setCustomer] = useState([]);
  
  // 상품리스트 useState(배열)
  const [itemList,setItemList] = useState([]);

  // 판매거래처ID값 useState(빈값)
  const [customerId, setCustomerId] = useState(null);

  // 상품리스트 useState(빈값)
  const [itemListId,setItemListId] = useState(null);

  // OrderList페이지 주문수량 useState(빈값)
  const [orderQty, setOrderQty] = useState(1);

  //--------------------------------
  const crudKey = keyField;
  // handleChange: input 요소 변경 시 formData 갱신
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 이전 상태를 유지하면서 변경된 필드만 업데이트
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // handleCreate: 새 항목 등록
  const handleCreate = async () => {
    try {
      const created = await api.create(formData);

      // api.getAll 있으면 서버에서 새 목록, 없으면 로컬에 추가
      if (api && typeof api.getAll === "function") {
        const list = await api.getAll();
        setItems(list);
      } else {
        setItems(prev => [...prev, created]);
      }

      // UI 정리
      setIsCreateOpen(false);   // 모달 닫기
      setFormData(initFormData()); // 폼 초기화
      return true;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message || "등록 중 에러";

      alert(msg);
      console.error(err);
      // 얼럿은 훅에서 X . 호출한 페이지에서 ok 값 보고 처리
      return false;
    }
  };

  // handleUpdate: 선택 항목 수정
  const handleUpdate = async () => {
  try {
    const payload = { ...selectedItem, ...formData };
    const idKey = crudKey;    // "bomId"

    if (!payload?.[idKey]) {
      alert("ID가 없습니다 행을 클릭해 다시 시도하세요");
      return false;
    }
    await api.update(payload);

    // 목록 상태 갱신: 수정된 항목만 업데이트
    setItems(prev => prev.map(item => 
      item[idKey] === formData[idKey] ? { ...item, ...payload } : item
    ));
    setIsEditOpen(false); // 수정 모달 창 닫기
    return true; // 성공 여부 반환
  } catch (err) { 
    const msg = err?.response?.data?.error || err?.message || "수정 중 에러";
    alert(`수정 실패 : ${msg}`);
    console.error(err);
    return false;
    }
  };

  // handleDelete: 선택 항목 삭제
  const handleDelete = async () => {
    if (!selectedItem) return; // 선택된 항목이 없으면 종료
    try {
      await api.delete(selectedItem[crudKey]); // ~~~ListPage.jsx 내부 const로 선언한 api의 delete 호출 
      alert("삭제 완료.")
      setIsEditOpen(false) // 수정 모달 창 닫기
      setItems(prev => prev.filter(item => item[crudKey] !== selectedItem[crudKey])); // 목록에서 삭제
    } catch (err) {
      const msg = 
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "삭제 중 에러"
      alert(`삭제 실패 : ${msg}`);
      console.error(err); 
    }
  };

  // openEdit: 수정 모드로 열기 (선택 항목 데이터를 폼에 넣음)
  const openEdit = (item) => {
    setFormData(prev => ({ ...initFormData(), ...item }));  // 폼 데이터 갱신
    setSelectedItem(item);  // 선택 항목 저장
    setIsEditOpen(true);    // 수정 창 열기
  };

  // openCreate: 등록 모드로 열기 (폼 초기화)
  const openCreate = () => {
    setFormData(initFormData());  // 폼초기화
    setIsCreateOpen(true);    // 등록 창 열기
    setSelectedItem(null);    // 선택 항목 삭제
  };
  const closeCreate = () => setIsCreateOpen(false);
  const closeEdit = () => setIsEditOpen(false);

  // ---------------------------------------
  
  const onSubmit = async (e) => {
  e.preventDefault();

  // 필수값 확인
  if (!customerId || !itemListId || !orderQty) {
    alert("거래처, 상품, 수량을 모두 선택/입력해주세요.");
    return;
  }

  const host = `${BASE_URL}/order/orderlist`;

  try {
    console.log("요청 URL:", host);
    console.log("전송 데이터:", { customerId, itemId: itemListId, orderQty });

    await axios.post(host, {
      customerId,
      itemId: itemListId,
      orderQty,
      orderPrice: formData.orderPrice,   // 단가
      orderState: formData.orderState || "판매대기",
      orderDeliState: formData.orderDeliState || "납품대기",
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      cusAddr: formData.cusAddr,
}, {
  headers: { "Content-Type": "application/json" }
});

    alert("주문 완료");
  } catch (err) {
    console.error("주문 실패:", err);
    alert("주문 중 오류가 발생했습니다.");
  }
};


  // 반환: 페이지에서 상태와 함수 사용 가능
  return {
    items,
    setItems,
    formData,
    formData, setFormData,
    selectedItem,
    handleChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreate,
    openEdit,
    closeCreate,
    closeEdit,
    isCreateOpen,
    isEditOpen,
    // --------------------
    // fk 병합 useState 반환
    customer,
    itemList,
    customerId,       
    itemListId,
    setCustomer,
    setItemList,
    setCustomerId,
    setItemListId,
    setOrderQty,
    onSubmit,
  };
};
