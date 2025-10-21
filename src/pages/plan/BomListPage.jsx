import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCRUD } from "../../hook/useCRUD.jsx";

import ModalComponent from "../../components/ModalComponent";
import ButtonComponent from "../../components/ButtonComponent.jsx";
import BackButtonComponent from "../../components/BackButtonComponent.jsx";
import SearchComponent from "../../components/SearchComponent.jsx"; // ✅ 추가

import BomForm from "../../form/plan/BomForm.jsx";

import { getBomList, createBom, updateBom, deleteBom } from "../../api/BomAPI.jsx";
import { getItemList } from "../../api/ItemListAPI";
import { getPartList } from "../../api/PartListAPI";
import { BomArrays } from "../../arrays/BomArrays.jsx";

const initBomForm = () => ({
  bomId: null,
  itemNo: "",
  partNo: "",
  qtyPerItem: 1,
});

// useCRUD 계약에 맞게 api 세팅
const bomApi = {
  getAll: getBomList,
  create: (fd) =>
    createBom({
      itemNo: Number(fd.itemNo),
      partNo: Number(fd.partNo),
      qtyPerItem: Number(fd.qtyPerItem ?? 1),
    }),
  update: updateBom,
  delete: (id) => deleteBom(Number(id)),
};

const BomListPage = () => {
  const navigate = useNavigate();

  const {
    items,
    setItems,
    formData,
    setFormData,
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
  } = useCRUD({
    initFormData: () => initBomForm(),
    api: bomApi,
    keyField: "bomId",
  });

  // ✅ 검색 상태: 즉시 입력값(q) vs 디바운스 적용값(term)
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  // 목록 로딩
  useEffect(() => {
    (async () => {
      try {
        const list = await getBomList();
        setItems(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("getBomList failed", e);
        setItems([]);
      }
    })();
  }, [setItems]);

  // 드롭다운 옵션
  const [itemOptions, setItemOptions] = useState([]);
  const [partOptions, setPartOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const items = await getItemList();
        setItemOptions(
          (items ?? []).map((it) => ({ value: Number(it.itemNo), label: it.itemName }))
        );
        const parts = await getPartList();
        setPartOptions(
          (parts ?? []).map((pt) => ({ value: Number(pt.partNo), label: pt.partName }))
        );
      } catch (e) {
        console.error("load options failed", e);
        setItemOptions([]);
        setPartOptions([]);
      }
    })();
  }, []);

  // 편집 모달 열릴 때 초기값 세팅 (이름 → 번호 역매핑)
  useEffect(() => {
    if (!isEditOpen || !selectedItem) return;
    const itemNo = itemOptions.find((o) => o.label === selectedItem.itemName)?.value ?? "";
    const partNo = partOptions.find((o) => o.label === selectedItem.partName)?.value ?? "";
    setFormData((prev) => ({
      ...prev,
      bomId: selectedItem.bomId,
      itemNo,
      partNo,
      qtyPerItem: Number(selectedItem.qtyPerItem ?? 1),
    }));
  }, [isEditOpen, selectedItem, itemOptions, partOptions, setFormData]);

  // 기본 submit/버블 방지
  const stop = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
  };

  // ✅ 재조회 일원화
  const refetch = async () => {
    try {
      const list = await getBomList();
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    }
  };

  // BOM 등록
  const doCreate = async (e) => {
    stop(e);
    const ok = await handleCreate();
    if (!ok) {
      alert("등록 중 오류");
      return;
    }
    await refetch();
    closeCreate();
  };

  // BOM 수정
  const doUpdate = async (e) => {
    stop(e);
    if (!formData?.bomId) {
      alert("선택된 BOM ID가 없습니다. 행을 클릭해 수정하세요.");
      return;
    }
    const ok = await handleUpdate();
    if (ok) {
      await refetch();
      closeEdit();
    }
  };

  // BOM 삭제
  const doDelete = async (e) => {
    stop(e);
    await handleDelete();
    await refetch();
    closeEdit();
  };

  // 상품명만으로 필터 (itemName이 표준. 컬럼명이 다르면 후보로 대체)
  const getItemName = (row) => row.itemName ?? row.itemNm ?? row.pname ?? row.name ?? "";

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return items ?? [];
    return (items ?? []).filter((r) => getItemName(r).toLowerCase().includes(t));
  }, [items, term]);

  return (
    <div className="page-wrapper">
      <BackButtonComponent text="< 이전페이지" onClick={() => navigate(-1)} />
      <h2 style={{ textAlign: "center" }}>BOM 목록</h2>

      {/* 상단 툴바: 상품명 검색 + 새로고침 */}
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

      <div className="table-wrapper">
        <table>
        <thead>
          <tr>{BomArrays.map((c) => <th key={c.id}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {filtered?.length ? (
            filtered.map((row) => (
              <tr key={row.bomId} onClick={() => openEdit(row)} className="row">
                {BomArrays.map((c) => (
                  <td key={c.id} style={{ textAlign: c.align || "right" }}>
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={BomArrays.length} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      </div>
      
      <br />
      {/* 공용 버튼이므로 onClick만 사용 */}
      <ButtonComponent onClick={openCreate} text="BOM 등록" cln="submit" />

      {/* 등록 */}
      <ModalComponent
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title="BOM 등록"
        onConfirm={doCreate}
      >
          <BomForm
            formData={formData}
            onChange={handleChange}
            itemOptions={itemOptions}
            partOptions={partOptions}
          />
          <div className="btn-wrapper">
            <ButtonComponent text="등록" onClick={doCreate} cln="submit" />
          </div>
      </ModalComponent>

      {/* 수정/삭제 */}
      <ModalComponent
        isOpen={isEditOpen}
        onClose={closeEdit}
        title="BOM 수정/삭제"
        onConfirm={doUpdate}
      >
        {selectedItem && (

            <BomForm
              formData={formData}
              onChange={handleChange}
              itemOptions={itemOptions}
              partOptions={partOptions}
            >
            <div className="btn-wrapper">
              <ButtonComponent text="수정" onClick={doUpdate} cln="fixbtn" />
              <ButtonComponent text="삭제" onClick={doDelete} cln="delbtn" />
            </div>
            </BomForm>
        )}
      </ModalComponent>
    </div>
  );
};

export default BomListPage;
