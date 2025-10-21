// src/pages/order/SellerCustomerListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useCRUD } from "../../hook/useCRUD";
import { getCustomer, createCustomer, updateCustomer, deleteCustomer } from "../../api/CustomerAPI";
import ModalComponent from "../../components/ModalComponent";
import SellCustomerForm from "../../form/order/SellCustomerForm";
import ButtonComponent from "../../components/ButtonComponent";
import BackButtonComponent from "../../components/BackButtonComponent";
import SearchComponent from "../../components/SearchComponent";
import { initForms } from "../../arrays/TableArrays";
import { sellCustomerArray } from "../../arrays/SellerCustomerArray";
import { useNavigate } from "react-router-dom";

const api = {
  getAll: getCustomer,
  create: createCustomer,
  // useCRUD.handleUpdate가 formData 통째로 넘기니까 여기서 래핑
  update: (formData) => updateCustomer(formData.cusNo, formData),
  delete: (cusNo) => deleteCustomer(cusNo),
};

const SellerCustomerListPage = () => {
  const navigate = useNavigate();

  const {
    items,            // 목록
    setItems,
    formData,         // 폼 상태
    handleChange,     // input onChange
    handleCreate,     // 등록
    handleUpdate,     // 수정 버튼에 연결
    handleDelete,     // 삭제 버튼에 연결
    openCreate,       // 등록 모달 열기
    openEdit,         // 수정 모달 열기 (행 클릭)
    closeCreate,
    closeEdit,
    isCreateOpen,
    isEditOpen,
    selectedItem,
  } = useCRUD({
    initFormData: () => initForms.sellerCustomer,
    api,
    keyField: "cusNo",
  });

  // 검색 상태
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  // 공통 재조회
  const refetch = async () => {
    const data = await getCustomer();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    refetch();
  }, []);

  // 판매처명으로 검색
  const getSellerName = (row) =>
    row?.cusComp ?? row?.sellerComp ?? row?.company ?? "";

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    const base = Array.isArray(items) ? items : [];
    if (!t) return base;
    return base.filter((row) => getSellerName(row).toLowerCase().includes(t));
  }, [items, term]);

  return (
    <div className="page-wrapper">
      <BackButtonComponent text="<  이전페이지" onClick={() => navigate(-1)} />
      <h2 style={{ textAlign: "center" }}>판매거래처 리스트</h2>

      {/* 판매처명 검색 + 새로고침 */}
      <div className="top-searchbar">
        <SearchComponent
          value={q}
          onChange={setQ}
          onDebounced={setTerm}
          delay={300}
          minLength={0}
          placeholder="검색"
          className="border rounded px-3 py-2"  
        />
        <ButtonComponent onClick={refetch} text="새로고침" cln="refresh" />
      </div>

      {/* 테이블 */}
      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            {sellCustomerArray.map(col => <th key={col.id}>{col.content}</th>)}
          </tr>
        </thead>
        <tbody>
          {filtered && filtered.length > 0 ? (
            filtered.map(row => (
              <tr key={row.cusNo} className="row" onClick={() => openEdit(row)}>
                {sellCustomerArray.map(col => (
                  <td
                    key={col.id}
                    style={col.clmn === "cusComp" ? { color: "blue", textDecoration: "underline", cursor: "pointer" } : {}}
                  >
                    {row[col.clmn]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={sellCustomerArray.length} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      

      <br />
      <ButtonComponent onClick={openCreate} text="거래처 등록" cln="submit" />

      {/* 등록 모달 */}
      <ModalComponent
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title="거래처 등록"
        onConfirm={handleCreate}
      >
        <SellCustomerForm formData={formData} onChange={handleChange}>
          <ButtonComponent text="등록" onClick={handleCreate} cln="submit" />
        </SellCustomerForm>
      </ModalComponent>

      {/* 수정/삭제 모달: '완료(수정)' 버튼 + '삭제' 버튼 */}
      <ModalComponent
        isOpen={isEditOpen}
        onClose={closeEdit}
        title="거래처 수정/삭제"
        onConfirm={handleUpdate}
      >
        {selectedItem && (
          <>
            <SellCustomerForm formData={formData} onChange={handleChange}>
              {/* 완료 버튼 = 수정 */}
              <ButtonComponent text="완료" onClick={handleUpdate} cln="fixbtn" />
              {/* 삭제 버튼 */}
              <ButtonComponent text="삭제" onClick={handleDelete} cln="delbtn" />
            </SellCustomerForm>
          </>
        )}
      </ModalComponent>
    </div>
  );
};

export default SellerCustomerListPage;
