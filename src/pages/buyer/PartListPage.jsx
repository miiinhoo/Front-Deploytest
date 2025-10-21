// src/pages/buyer/PartListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { getPartList, createPartList, updatePartList, deletePartList } from "../../api/PartListAPI";
import { useCRUD } from "../../hook/useCRUD";
import ModalComponent from "../../components/ModalComponent";
import PartListForm from "../../form/buyer/PartListForm";
import ButtonComponent from "../../components/ButtonComponent";
import BackButtonComponent from "../../components/BackButtonComponent";
import SearchComponent from "../../components/SearchComponent.jsx";
import { initForms } from "../../arrays/TableArrays";
import { useNavigate } from "react-router-dom";
import { PartListArray } from "../../arrays/PartListArrays";
import axios_api from "../../api/axios";

// API 상수
const api = {
  getAll: getPartList,
  create: createPartList,
  update: updatePartList,
  delete: deletePartList,
};

const PartListPage = () => {
  const navigate = useNavigate();

  const {
    items: partList,
    setItems: setPartList,
    formData,
    setFormData,
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
    customer,
    setCustomer,
    setCustomerId,
  } = useCRUD({
    initFormData: () => initForms.part,
    api,
    keyField: "partNo",
  });

  // 검색 상태
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  // 구매처 옵션 + 목록 로딩
  useEffect(() => {
    (async () => {
      const res = await axios_api.get("/buyer/buyercustomer");
      const options = (res.data ?? []).map((t) => ({
        label: t.buyerComp,
        value: t.buyerNo,
      }));
      setCustomer(options);

      const data = await getPartList();
      setPartList(Array.isArray(data) ? data : []);
    })();
  }, [setCustomer, setPartList]);

  // 수정모달 열릴 때 buyerComp → buyerNo 역매핑
  useEffect(() => {
    if (!isEditOpen || !selectedItem || !customer?.length) return;
    const buyerNo =
      customer.find((c) => c.label === selectedItem.buyerComp)?.value ?? "";
    setFormData((prev) => ({
      ...prev,
      partNo: selectedItem.partNo,
      partName: selectedItem.partName,
      partCode: selectedItem.partCode,
      partSpec: selectedItem.partSpec,
      partPrice: selectedItem.partPrice,
      buyerComp: buyerNo,
    }));
  }, [isEditOpen, selectedItem, customer, setFormData]);

  const stop = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
  };

  const refetch = async () => {
    const data = await getPartList();
    setPartList(Array.isArray(data) ? data : []);
  };

  const doCreate = async (e) => { stop(e); await handleCreate(); await refetch(); closeCreate(); };
  const doUpdate = async (e) => { stop(e); await handleUpdate(); await refetch(); closeEdit(); };
  const doDelete = async (e) => { stop(e); await handleDelete(); await refetch(); closeEdit(); };

  // 부품명으로 검색
  const getPartName = (row) =>
    row?.partName ?? row?.name ?? row?.pname ?? "";

  // 디바운스된 term으로만 필터 (부품명 기준)
  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return partList ?? [];
    return (partList ?? []).filter((p) =>
      getPartName(p).toLowerCase().includes(t)
    );
  }, [partList, term]);

  return (
    <div className="page-wrapper">
      <BackButtonComponent text="< 이전페이지" 
      onClick={() => navigate(-1)} 
      />
      <h2 style={{ textAlign: "center" }}>부품리스트</h2>

      {/* 상단 툴바: 부품명 검색 + 새로고침 */}
      <div className="top-searchbar">
        <SearchComponent
          value={q}
          onChange={setQ}
          onDebounced={setTerm}
          delay={300}
          minLength={0}
          placeholder="부품명 검색"
          className="border rounded px-3 py-2"
        />
        <ButtonComponent onClick={refetch} text="새로고침" cln="refresh" />
      </div>

      <div className="table-wrapper">
          <table>
        <thead>
          <tr>
            {PartListArray.map((col) => (
              <th key={col.id}>{col.content}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtered?.length ? (
            filtered.map((part) => (
              <tr key={part.partNo} className="row">
                <td>{part.partNo}</td>
                {/* 부품명 클릭 시 수정 모달 */}
                <td
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => openEdit(part)}
                >
                  {part.partName}
                </td>
                <td>{part.buyerComp}</td>
                <td>{part.partCode}</td>
                <td>{part.partSpec}</td>
                <td>{part.partPrice}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={PartListArray.length} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      
      
      {/* 등록 버튼 */}
      <br/>
      <ButtonComponent onClick={openCreate} text={"부품 등록"} cln="submit" />

      {/* 등록 모달 */}
      <ModalComponent
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title="부품 등록"
        onConfirm={doCreate}
      >
          <PartListForm
            formData={formData}
            onChange={handleChange}
            customer={customer}
            setCustomerId={setCustomerId}
          >
            <ButtonComponent text={"등록"} onClick={doCreate} cln="submit" />
          </PartListForm>
      </ModalComponent>

      {/* 수정/삭제 모달 */}
      <ModalComponent
        isOpen={isEditOpen}
        onClose={closeEdit}
        title="부품 수정/삭제"
        onConfirm={doUpdate}
      >
        {selectedItem && (
            <PartListForm
              formData={formData}
              onChange={handleChange}
              customer={customer}
              setCustomerId={setCustomerId}
            >
                <ButtonComponent text="수정" onClick={doUpdate} cln="fixbtn" />
                <ButtonComponent text="삭제" onClick={doDelete} cln="delbtn" />
            </PartListForm>
        )}
      </ModalComponent>
    </div>
  );
};

export default PartListPage;
