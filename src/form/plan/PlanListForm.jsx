import { PlanListArrays } from "../../arrays/PlanArrays";

/**
 * 드롭다운이 “반드시” 반영되도록 만든 폼
 * - itemName 컬럼은 실제 전송 필드 itemNo 로 제어
 * - planState 는 "생산중" | "완료" 중 하나로만 제어
 * - 숫자 필드는 Number 변환
 */
const PlanListForm = ({ formData, onChange, itemList, children }) => {
  // 공통 변경 핸들러: Number 변환이 필요한 필드는 여기서 처리
  const handleChangeSmart = (e) => {
    const { name, value, type } = e.target;
    const next =
      name === "planQty" || name === "itemNo"
        ? (value === "" ? "" : Number(value))
        : value;
    onChange({ target: { name, value: next, type } });
  };

  // itemName 표시용 select → 실제 name 은 itemNo
  const renderItemSelect = () => (
    <select
      name="itemNo"
      value={formData.itemNo ?? ""}
      onChange={handleChangeSmart}
      required
    >
      <option value="" disabled>
        상품을 선택하세요
      </option>
      {itemList.map((i) => (
        <option key={i.value} value={i.value}>
          {i.label}
        </option>
      ))}
    </select>
  );

  const renderPlanStateSelect = () => {
    const safe = ["생산중", "생산완료"].includes(formData.planState)
      ? formData.planState
      : "생산중";
    return (
      <select
        name="planState"
        value={safe}
        onChange={handleChangeSmart}
      >
        <option value="생산중">생산중</option>
        <option value="생산완료">생산완료</option>
      </select>
    );
  };

  return (
    <div className="form-wrapper">
      {PlanListArrays.slice(1).map((col) => (
        <div className="form-content" key={col.id}>
          <p>
            <span className="form-child">{col.content}</span>

            {col.clmn === "itemName" ? (
              renderItemSelect()
            ) : col.clmn === "planState" ? (
              renderPlanStateSelect()
            ) : (
              <input
                type={col.input || (col.clmn === "planQty" ? "number" : "text")}
                name={col.clmn}
                value={formData[col.clmn] ?? ""}
                onChange={handleChangeSmart}
                min={col.clmn === "planQty" ? 1 : undefined}
                placeholder={`${col.content}을(를) 입력하세요`}
              />
            )}
          </p>
        </div>
      ))}
      {children}
    </div>
  );
};

export default PlanListForm;
