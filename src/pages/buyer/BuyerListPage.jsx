import { useEffect, useState, useMemo } from "react";
import { useCRUD } from "../../hook/useCRUD.jsx";
import { getBuyerCustomer, createBuyerCustomer, updateBuyerCustomer, deleteBuyerCustomer } from "../../api/BuyerListAPI";
import ModalComponent from "../../components/ModalComponent";
import BuyerCustomerForm from "../../form/buyer/BuyerCustomerForm.jsx";
import ButtonComponent from "../../components/ButtonComponent.jsx";
import BackButtonComponent from "../../components/BackButtonComponent.jsx";
import SearchComponent from "../../components/SearchComponent.jsx";
import { initForms } from "../../arrays/TableArrays.jsx";
import { buyerCustomerArray } from "../../arrays/BuyerListArrays.jsx";
import { useNavigate } from "react-router-dom";

// API 상수
const api = {
  getAll: getBuyerCustomer,
  create: (fd) =>
    createBuyerCustomer({
      buyerComp: fd.buyerComp,
      buyerName: fd.buyerName,
      buyerEmail: fd.buyerEmail,
      buyerPhone: fd.buyerPhone,
      buyerAddr: fd.buyerAddr,
    }),
  update: (fd) =>
    updateBuyerCustomer(fd.buyerNo, {
      buyerComp: fd.buyerComp,
      buyerName: fd.buyerName,
      buyerEmail: fd.buyerEmail,
      buyerPhone: fd.buyerPhone,
      buyerAddr: fd.buyerAddr,
    }),
  delete: (id) => deleteBuyerCustomer(id),
};

const SellerCustomerListPage = () => {
  const navigate = useNavigate();

  const {
    items: buyerCustomer,
    setItems: setBuyerCustomer,

    formData,
    handleChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    openEdit,
    openCreate,
    isCreateOpen,
    isEditOpen,
    closeCreate,
    closeEdit,
    selectedItem,
  } = useCRUD({
    initFormData: () => initForms.buyerCustomer,
    api,
    keyField: "buyerNo",
  });

  // 검색 상태: 입력값(q) vs 디바운스 적용값(term)
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  // 공통 재조회
  const refetch = async () => {
    try {
      const data = await getBuyerCustomer();
      setBuyerCustomer(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setBuyerCustomer([]);
      alert(e?.response?.data?.error || "구매거래처 목록을 가져오지 못했습니다.");
    }
  };

  // 초기 목록 로드
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 구매처명으로 검색
  const getBuyerComp = (row) =>
    row?.buyerComp ?? row?.buyerName ?? row?.company ?? "";

  // 디바운스된 term으로만 필터 (구매처명 기준)
  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return buyerCustomer ?? [];
    return (buyerCustomer ?? []).filter((po) =>
      getBuyerComp(po).toLowerCase().includes(t)
    );
  }, [buyerCustomer, term]);

  // 기본 submit/버블 방지
  const stop = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
  };

  // CRUD 래퍼: 성공 시 재조회
  const doCreate = async (e) => {
    stop(e);
    const ok = await handleCreate();
    if (!ok) return;
    await refetch();
    closeCreate();
  };

  const doUpdate = async (e) => {
    stop(e);
    const ok = await handleUpdate();
    if (!ok) return;
    await refetch();
    closeEdit();
  };

  const doDelete = async (e) => {
    stop(e);
    const ok = await handleDelete();
    if (!ok) return;
    await refetch();
    closeEdit();
  };

  return (
    <div className="page-wrapper">
      <BackButtonComponent text="<  이전페이지" onClick={() => navigate(-1)} />
      <h2 style={{ textAlign: "center" }}>구매거래처</h2>

      {/* 상단 툴바: 구매처명 검색 + 새로고침 */}
      <div className="top-searchbar">
        <SearchComponent
          value={q}
          onChange={setQ}
          onDebounced={setTerm}
          delay={300}
          minLength={0}
          placeholder="구매처명 검색"
          className="border rounded px-3 py-2"
        />
        <ButtonComponent onClick={refetch} text="새로고침" cln="refresh" />
      </div>

      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            {buyerCustomerArray.map((col) => (
              <th key={col.id}>{col.content}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filtered) && filtered.length > 0 ? (
            filtered.map((po) => (
              <tr key={po.buyerNo} className="row">
                {buyerCustomerArray.map((col) => (
                  <td
                    key={`${po.buyerNo}-${col.id}`}
                    style={
                      col.clmn === "buyerComp"
                        ? { color: "blue", textDecoration: "underline", cursor: "pointer" }
                        : {}
                    }
                    onClick={() => col.clmn === "buyerComp" && openEdit(po)}
                  >
                    {po[col.clmn] ?? ""}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={buyerCustomerArray.length} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      

      {/* 등록 버튼 */}
      <br />
      <ButtonComponent onClick={openCreate} text={"구매거래처 등록"} cln="submit" />

      {/* 등록 모달 */}
      <ModalComponent
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title="구매거래처 등록"
        onConfirm={doCreate}
        stop={stop}
      >
        <BuyerCustomerForm formData={formData} onChange={handleChange} onSubmit={doCreate}>
          <div className="btn-wrapper">
            <ButtonComponent text={"등록"} onClick={doCreate} cln="submit" />
          </div>
        </BuyerCustomerForm>
      </ModalComponent>

      {/* 수정/삭제 모달 */}
      <ModalComponent
        isOpen={isEditOpen}
        onClose={closeEdit}
        title="구매거래처 수정/삭제"
        onConfirm={doUpdate}
      >
        {selectedItem && (
          <BuyerCustomerForm formData={formData} onChange={handleChange} onSubmit={doUpdate}>
            <div className="btn-wrapper">
              <ButtonComponent text="수정" onClick={doUpdate} cln="fixbtn" />
              <ButtonComponent text="삭제" onClick={doDelete} cln="delbtn" />
            </div>
          </BuyerCustomerForm>
        )}
      </ModalComponent>
    </div>
  );
};

export default SellerCustomerListPage;
