import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCRUD } from "../../hook/useCRUD.jsx";
import { initForms } from "../../arrays/TableArrays.jsx";
import { partOrderArrays } from "../../arrays/partOrderArrays.jsx";
import ModalComponent from "../../components/ModalComponent";
import ButtonComponent from "../../components/ButtonComponent.jsx";
import BackButtonComponent from "../../components/BackButtonComponent.jsx";
import PartOrderForm from "../../form/buyer/PartOrderForm.jsx";
import InlineSelectCell from "../../components/InlineSelectCell.jsx";
import SearchComponent from "../../components/SearchComponent.jsx";

// API
import {
  getPartOrders,
  createPartOrder,
  updatePartOrder,
  deletePartOrder,
} from "../../api/PartOrderAPI";
import { getBuyerCustomer } from "../../api/BuyerListAPI";
import { getPartList } from "../../api/PartListAPI";

const api = {
  getAll: getPartOrders,
  create: (fd) =>
    createPartOrder({
      poNo: fd.poNo ? Number(fd.poNo) : undefined,
      buyerNo: Number(fd.buyerNo),
      partNo: Number(fd.partNo),
      poQty: Number(fd.poQty),
      poPrice: Number(fd.poPrice),
      poState: fd.poState,
      poDate: fd.poDate || null,
      buyerAddr: fd.buyerAddr ?? "",
    }),
  update: (fd) =>
    updatePartOrder(Number(fd.poNo), {
      buyerNo: Number(fd.buyerNo),
      partNo: Number(fd.partNo),
      poQty: Number(fd.poQty),
      poPrice: Number(fd.poPrice),
      poState: fd.poState,
      poDate: fd.poDate || null,
      buyerAddr: fd.buyerAddr ?? "",
    }),
  delete: (id) => deletePartOrder(Number(id)),
};

const PartOrderListPage = () => {
  const navigate = useNavigate();
  const PO_STATE_OPTS = ["입고대기", "입고완료"];  // 상태 옵션
  const NAV_TO_ON_DONE = "/stock/partstock";       // 완료시 해당 경로로 리스트 이동

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
    initFormData: () => initForms.partOrder,
    api,
    keyField: "poNo",
  });

  // 옵션 로딩
  const [buyerOptions, setBuyerOptions] = useState([]); // {value: buyerNo, label: buyerComp, extra: buyerAddr}
  const [partOptions, setPartOptions] = useState([]); // {value: partNo, label: partName, extra: partPrice}

  // 검색
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const buyers = await getBuyerCustomer(); // [{buyerNo,buyerComp,buyerAddr,...}]
        setBuyerOptions(
          (buyers ?? []).map((b) => ({
            value: Number(b.buyerNo),
            label: b.buyerComp,
            extra: b.buyerAddr,
          }))
        );
        const parts = await getPartList(); // [{partNo,partName,partPrice,...}]
        console.log("parts sample", parts?.[0]);
        setPartOptions(
          (parts ?? []).map((p) => ({
            value: Number(p.partNo),
            label: p.partName,
            price: Number(p.partPrice ?? 0),
            buyerComp: p.buyerComp,
          }))
        );
      } catch (e) {
        console.error(e);
        setBuyerOptions([]);
        setPartOptions([]);
      }
    })();
  }, []);

  // 빠른 Lookup Map
  const buyerMap = useMemo(() => {
    const m = new Map();
    buyerOptions.forEach((b) => m.set(b.value, b));
    return m;
  }, [buyerOptions]);

  const partMap = useMemo(() => {
    const m = new Map();
    partOptions.forEach((p) => m.set(p.value, p));
    return m;
  }, [partOptions]);

  // -----------------------------------이벤트 핸들러----------------------------------------

  // 선택 핸들러: 구매처
  const onSelectBuyer = (buyerNo) => {
    const opt = buyerMap.get(buyerNo);
    const list = partOptions.filter(p => p.buyerComp === buyerMap.get(buyerNo)?.label);
    const first = list[0];
    setFormData((prev) => ({
      ...prev,
      buyerNo: buyerNo || "",
      buyerAddr: opt?.extra ?? "",
      // 구매처명만 선택해도 자동 세팅
      partNo: first?.value ?? "",
      partName: first?.label ?? "",
      poPrice: first ? first.price : "",
    }));
  };

  // 선택 핸들러: 부품
  const onSelectPart = (partNo) => {
    const opt = partMap.get(partNo);
    setFormData((prev) => ({
      ...prev,
      partNo: partNo || "",
      partName: opt?.label ?? "", // 이름 동기화
      poPrice: opt?.price ?? "",  // 단가 동기화
    }));
  };

  // 인라인 상태 변경 핸들러
    // 목록 내 특정 행 patch
    const replaceRow = (list, id, patch) => 
      list.map(r => (Number(r.poNo) === Number(id) ? { ...r, ...patch } : r));
    
    const onPatchPoState = async (poNo, next) => {
      const prevRow = (items || []).find(r => Number(r?.poNo) === Number(poNo));
      if (!prevRow) return;

    // 필수 키 복구 (리스트에 숫자 ID가 없을 수도 있으니 라벨로 역매핑)
    const buyerNo = 
      prevRow.buyerNo ?? 
      buyerOptions.find(b => b.label === (prevRow.buyerComp ?? prevRow.cusComp))?.value ?? null;
    
    const partObj = 
      prevRow.partNo 
      ? partMap.get(Number(prevRow.partNo)) || null 
      : partOptions.find(p => p.label === prevRow.partName) || null;

    // 서버에 보낼 바디 (날짜 제외)
    const payload = {
      buyerNo: Number(buyerNo),
      partNo: Number(partObj?.value ?? prevRow.partNo),
      poQty: Number(prevRow.poQty, 0),
      poPrice: Number((prevRow.poPrice ?? partObj?.price) ?? 0),
      poState: next,
      buyerAddr: prevRow.buyerAddr ?? buyerMap.get(Number(buyerNo))?.extra ?? "",
    };

    if (!payload.buyerNo || !payload.partNo || Number.isNaN(payload.buyerNo || Number.isNaN(payload.partNo))) {
      console.log("필수 ID 없음", {payload, prevRow});
      alert("구매처 또는 부품 식별자가 없음 리스트 응답에 buyerNo/partNo 포함 확인");
      return;
    };

    // 낙관적 UI 업데이트
    setItems(list => replaceRow(list, poNo, { poState: next }));

    try {
      // 서버 반영: 이 API가 부분 업데이트를 지원하지 않으면 전체 DTO로 보낸다
      await updatePartOrder(Number(poNo), payload);

      if (next === "입고완료") {
        // 완료면 목록에서 제거하고 이동
        setItems(list => list.filter(r => Number(r?.poNo) !== Number(poNo)));
        navigate(NAV_TO_ON_DONE, {replace: true}); // 이동 경로 호출
      } else {
        // 미완료면 서버 값 기준으로 재조화
        await refetch();
      }
    } catch (e) {
      // 실패 롤백
      console.error("upDatePartOrder fail", e, { payload });
      alert(e?.response?.data?.error || "상태 변경 실패");
      setItems(list => replaceRow(list, poNo, { poState: prevRow.poState || "입고대기" }));
    }
  };


  // 폼에 내려줄 부품 옵션을 구매처 기준으로 필터
  const filteredPartOptions = useMemo(() => {
    if (!formData?.buyerNo) return partOptions;
    const label = buyerMap.get(Number(formData.buyerNo))?.label;
    return partOptions.filter(p => p.buyerComp === label);
  }, [partOptions, formData?.buyerNo, buyerMap]);

  // 최초 목록 로딩
  useEffect(() => {
    (async () => {
      try {
        const list = await api.getAll();
        const cleaned = (Array.isArray(list) ? list : [])
          .filter(Boolean)                                    // undefined/null 행 제거
          .map(r => ({ ...r, poState: r?.poState || "입고대기" })); // 기본값
        setItems(cleaned);
      } catch (e) {
        console.error(e);
        setItems([]);
      }
    })();
  }, [setItems]);

  const refetch = async () => {
    const list = await api.getAll();
    const cleaned = (Array.isArray(list) ? list : [])
      .filter(Boolean)
      .map(r => ({ ...r, poState: r?.poState || "입고대기"}));
    setItems(cleaned);
  };

  // 모달 열릴 때, 편집 모드면 기존 데이터 반영 (response는 buyerComp/partName이라 역매핑 필요할 수 있음)
  useEffect(() => {
    if (!isEditOpen || !selectedItem) return;

    // buyerComp -> buyerNo 역매핑
    const buyerNo =
      buyerOptions.find((b) => b.label === selectedItem.buyerComp)?.value ?? "";

    // partName -> partNo 역매핑
    const partNo =
      partOptions.find((p) => p.label === selectedItem.partName)?.value ?? "";

    setFormData((prev) => ({
      ...prev,
      poNo: selectedItem.poNo,
      buyerNo,
      buyerAddr: selectedItem.buyerAddr ?? buyerMap.get(buyerNo)?.extra ?? "",
      partNo,
      partName: selectedItem.partName ?? partMap.get(partNo)?.label ?? "",
      poPrice: selectedItem.poPrice ?? partMap.get(partNo)?.price ?? "",
      poQty: selectedItem.poQty ?? "",
      poState: selectedItem.poState ?? "입고대기",
      poDate: selectedItem.poDate ?? "",
    }));
  }, [
    isEditOpen,
    selectedItem,
    setFormData,
    buyerOptions,
    partOptions,
    buyerMap,
    partMap,
  ]);

  // 기본 submit 막기
  const stop = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
  };

  const doCreate = async (e) => {
    stop(e);
    const ok = await handleCreate();
    if (ok) {
      await refetch();
      closeCreate();
      alert("등록 완료!");
    } else {
      alert("등록 실패");
    }
  };

  const doUpdate = async (e) => {
    stop(e);
    const ok = await handleUpdate();
    if (ok) {
      await refetch();
      closeEdit();
      alert("수정 완료!");
    } else {
      alert("수정 실패");
    }
  };

  const doDelete = async (e) => {
    stop(e);
    const ok = await handleDelete();
    if (ok !== false) {
      await refetch();
      closeEdit();
      alert("삭제 완료!");
    } else {
      alert("삭제 실패");
    }
  };

  // 부품명으로 검색
  const safeItems = Array.isArray(items) ? items : [];

  // 디바운스된 필터 (부품명 기준)
  const filtered = useMemo(() => {
    const t = (term || "").trim().toLowerCase();
    if (!t) return safeItems;
    return safeItems.filter(r => (r.partName || "").toLowerCase().includes(t));
  }, [safeItems, term]);

  return (
    <div className="page-wrapper">
      <BackButtonComponent text="< 이전페이지" onClick={() => navigate(-1)} />
      <h2 style={{ textAlign: "center" }}>부품 발주</h2>

      <div className="top-searchbar">
        <SearchComponent
          value={q}
          onChange={setQ}
          onDebounced={setTerm}
          delay={300}
          placeholder="부품명 검색"
          className="border rounded px-3 py-2"
        />
        <ButtonComponent onClick={refetch} text="새로고침" cln="refresh" />
      </div>

      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            {partOrderArrays.map((c) => (
              <th key={c.id}>{c.content}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filtered) && filtered.length > 0 ? (
            filtered.filter(Boolean).map((row) => (
              <tr key={row.poNo} className="row" onClick={() => openEdit(row)}>
                {partOrderArrays.map((c) => {
                  // poState 컬럼만 인라인 셀로
                  if (c.clmn === "poState") {
                    const state = row?.poState || "입고대기";
                    return (
                      <td key={`${row.poNo}-${c.id}`}>
                        <InlineSelectCell 
                          rowKey={row?.poNo}
                          value={state}
                          options={PO_STATE_OPTS}
                          onPatch={onPatchPoState}
                          stopRowClick
                        />
                      </td>
                    );
                  }
                  return (
                    <td key={`${row.poNo}-${c.id}`}>
                      {row?.[c.clmn] ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={partOrderArrays.length} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      

      <br />
      <ButtonComponent onClick={openCreate} text="발주 등록" cln="submit" />

      {/* 등록 모달 */}
      <ModalComponent
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title="발주 등록"
        onConfirm={doCreate}
      >
          <PartOrderForm
            formData={formData}
            onChange={handleChange}
            buyerOptions={buyerOptions}
            partOptions={filteredPartOptions}
            onSelectBuyer={onSelectBuyer}
            onSelectPart={onSelectPart}
          />
          <div className="btn-wrapper" style={{ marginTop: 12 }}>
            <ButtonComponent text="등록" onClick={doCreate} cln="submit" />
          </div>
      </ModalComponent>

      {/* 수정/삭제 모달 */}
      <ModalComponent
        isOpen={isEditOpen}
        onClose={closeEdit}
        title="발주 수정/삭제"
        onConfirm={doUpdate}
      >
        {selectedItem && (
            <PartOrderForm
              formData={formData}
              onChange={handleChange}
              buyerOptions={buyerOptions}
              partOptions={filteredPartOptions}
              onSelectBuyer={onSelectBuyer}
              onSelectPart={onSelectPart}
            >
            <div className="btn-wrapper" style={{ marginTop: 12 }}>
              <ButtonComponent text="수정" onClick={doUpdate} cln="fixbtn" />
              <ButtonComponent text="삭제" onClick={doDelete} cln="delbtn" />
            </div>
            </PartOrderForm>
        )}
      </ModalComponent>
    </div>
  );
};

export default PartOrderListPage;
