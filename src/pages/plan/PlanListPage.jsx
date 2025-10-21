import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCRUD } from "../../hook/useCRUD.jsx";

import ModalComponent from "../../components/ModalComponent";
import ButtonComponent from "../../components/ButtonComponent.jsx";
import BackButtonComponent from "../../components/BackButtonComponent.jsx";
import InlineSelectCell from "../../components/InlineSelectCell.jsx";
import SearchComponent from "../../components/SearchComponent.jsx";

import PlanListForm from "../../form/plan/PlanListForm.jsx";
import { PlanListArrays, initPlanForm } from "../../arrays/PlanArrays";
import { getPlanList, createPlan, updatePlan, deletePlan } from "../../api/PlanListAPI";
import { getItemList } from "../../api/ItemListAPI";
import { patchPlanStatus } from "../../api/PlanListAPI.jsx";

/* =========================
          상수 & 유틸
   ========================= */
const PLAN_STATE_OPTS = ["생산중", "생산완료"];

// 완료 값을 "생산완료"로 통일
const DONE_VALUES = new Set(["생산완료", "완료", "DONE", "done", "complete", "COMPLETED", true, 1]);

const normalizePlan = (p = {}) => {
  const raw = String(p?.planState ?? "").trim();
  const normalized = DONE_VALUES.has(raw) ? "생산완료" : (raw || "생산중");
  return { ...p, planState: normalized };
};

const isDone = (row) => DONE_VALUES.has(String(row?.planState ?? "").trim());

const getItemName = (row) =>
  row.itemName ?? row.itemNm ?? row.pname ?? row.name ?? "";

/* =========================
          컴포넌트
   ========================= */
const api = {
  getAll: getPlanList,
  create: createPlan,
  update: updatePlan,
  delete: deletePlan,
};

const PlanListPage = () => {
  const navigate = useNavigate();

  const {
    items: plans,
    setItems: setPlans,
    formData,
    setFormData,
    handleChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreate,
    openEdit,
    isCreateOpen,
    isEditOpen,
    closeCreate,
    closeEdit,
    selectedItem,
    itemList,
    setItemList,
  } = useCRUD({
    initFormData: () => initPlanForm(),
    api,
    keyField: "planNo",
  });

  /* ---------- 검색 상태 ---------- */
  const [q, setQ] = useState("");      // 입력 즉시 갱신
  const [term, setTerm] = useState(""); // 디바운스 후 적용

  /* ---------- 공통 fetch: 정규화 + 완료된 목록 제거 ---------- */
  const fetchActivePlans = async () => {
    const data = await getPlanList();
    const normalized = Array.isArray(data) ? data.map(normalizePlan) : [];
    setPlans(normalized.filter((p) => !isDone(p)));
  };

  /* ---------- 초기 목록 로딩 ---------- */
  useEffect(() => {
    fetchActivePlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- 상품 옵션 로딩 ---------- */
  useEffect(() => {
    (async () => {
      const items = await getItemList();
      const options = items.map((it) => ({
        value: Number(it.itemNo),
        label: it.itemName,
      }));
      setItemList(options);
    })();
  }, [setItemList]);

  /* ---------- 편집 모달 열릴 때 폼 입력 초기값 ---------- */
  useEffect(() => {
    if (!isEditOpen || !selectedItem) return;

    setFormData((prev) => ({
      ...prev,
      planNo: selectedItem.planNo ?? prev.planNo,
      planName: selectedItem.planName ?? prev.planName,
      planQty: selectedItem.planQty ?? prev.planQty,
      planState: normalizePlan(selectedItem).planState, // 정규화된 값 사용
      // itemName → itemNo 역매핑
      itemNo:
        prev.itemNo ||
        (itemList.find((o) => o.label === selectedItem.itemName)?.value ?? ""),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditOpen, selectedItem, itemList, setFormData]);

  /* ---------- 헬퍼 ---------- */
  const stop = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
  };

  const refetchPlans = fetchActivePlans; // 이름만 포장

  /* ---------- CRUD 래퍼 ---------- */
  const doCreate = async (e) => {
    stop(e);
    await handleCreate();
    await refetchPlans();
    closeCreate();
  };

  const doUpdate = async (e) => {
    stop(e);
    await handleUpdate();
    await refetchPlans();
    closeEdit();
  };

  const doDelete = async (e) => {
    stop(e);
    await handleDelete();
    await refetchPlans();
    closeEdit();
  };

  /* ---------- 상태 패치 (옵티미스틱 + 정규화) ---------- */
  const onPatchPlanState = async (planNo, next) => {
    if (!planNo || !next) {
      console.error("onPatchPlanState: bad args", { planNo, next });
      return;
    }

    // 낙관적 반영
    setPlans((prev) =>
      prev.map((p) => (p.planNo === planNo ? normalizePlan({ ...p, planState: next }) : p))
    );

    try {
      const res = await patchPlanStatus(planNo, { planState: next });
      const serverState = res?.planState ?? next;

      setPlans((prev) =>
        prev.map((p) =>
          p.planNo === planNo ? normalizePlan({ ...p, planState: serverState }) : p
        )
      );

      if (isDone({ planState: serverState })) {
        // 완료된 항목은 목록에서 제거하고 이동
        setPlans((prev) => prev.filter((p) => p.planNo !== planNo));
        navigate("/stock/stocklist");
      }
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error ?? "상태 변경 실패 (서버 에러)");
      // 안전하게 서버 진실값으로 되돌림
      await refetchPlans();
    }
  };

  /* ---------- 검색: 상품명만 기준 ---------- */
  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return plans;
    return plans.filter((p) => getItemName(p).toLowerCase().includes(t));
  }, [plans, term]);

  /* =========================
                렌더
     ========================= */
  return (
    <div className="page-wrapper">
      <BackButtonComponent text="< 이전페이지" onClick={() => navigate(-1)} />
      <h2 style={{ textAlign: "center" }}>생산 리스트</h2>

      {/* 상단 툴바: 상품명 검색 + 새로고침 */}
      <div className="top-searchbar">
        <SearchComponent
          value={q}
          onChange={setQ}
          onDebounced={setTerm}
          delay={300}
          minLength={0}
          placeholder="상품명 검색"
          className="border rounded px-3 py-2"
        />
        
        <ButtonComponent onClick={refetchPlans} text="새로고침" cln="refresh" />
      </div>

      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            {PlanListArrays.map((col) => (
              <th key={col.id}>{col.content}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered && filtered.length > 0 ? (
            filtered.map((row) => (
              <tr key={row.planNo} className="row" onClick={() => openEdit(row)}>
                {PlanListArrays.map((col) =>
                  col.clmn === "planState" ? (
                    <td key={`${row.planNo}-${col.id}`}>
                      <InlineSelectCell
                        rowKey={row.planNo}
                        value={row.planState ?? "생산중"}
                        options={PLAN_STATE_OPTS}
                        onPatch={onPatchPlanState}
                        stopRowClick
                      />
                    </td>
                  ) : (
                    <td key={`${row.planNo}-${col.id}`}>{row[col.clmn]}</td>
                  )
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={PlanListArrays.length} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      

      {/* 등록 */}
      <br />
      <ButtonComponent onClick={openCreate} text={"생산 등록"} cln="submit" />

      {/* 등록 모달 */}
      <ModalComponent
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title="생산 등록"
        onConfirm={doCreate}
      >
          <PlanListForm formData={formData} onChange={handleChange} itemList={itemList}>
          <div className="btn-wrapper">
            <ButtonComponent text={"등록"} onClick={doCreate} cln="submit" />
          </div>
          </PlanListForm>
      </ModalComponent>

      {/* 수정/삭제 모달 */}
      <ModalComponent
        isOpen={isEditOpen}
        onClose={closeEdit}
        title="생산 수정/삭제"
        onConfirm={doUpdate}
      >
        {selectedItem && (
            <PlanListForm formData={formData} onChange={handleChange} itemList={itemList}>
              <ButtonComponent text="수정" onClick={doUpdate} cln="fixbtn" />
              <ButtonComponent text="삭제" onClick={doDelete} cln="delbtn" />
            </PlanListForm>
        )}
      </ModalComponent>
    </div>
  );
};

export default PlanListPage;
