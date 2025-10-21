
const BomForm = ({
  formData,              // { bomId?, itemNo, partNo, qtyPerItem }
  onChange,              // e.target.name / e.target.value 기반 setState
  itemOptions,           // [{value:itemNo, label:itemName}, ...]
  partOptions,            // [{value:partNo,  label:partName}, ...]
  children
}) => {

  const handleSmart = (e) => {
    const { name, value } = e.target;
    const numFields = new Set(["itemNo", "partNo", "qtyPerItem"]);
    onChange({
      target: { name, value: numFields.has(name) && value !== "" ? Number(value) : value }
    });
  };

  return (
    <div className="form-wrapper">
      <div className="form-content">
        <p>
          <span className="form-child">완제품(ITEM)</span>
          <select name="itemNo" value={formData.itemNo ?? ""} onChange={handleSmart} required>
            <option value="" disabled>완제품을 선택하세요</option>
            {itemOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </p>
      </div>

      <div className="form-content">
        <p>
          <span className="form-child">부품(PART)</span>
          <select name="partNo" value={formData.partNo ?? ""} onChange={handleSmart} required>
            <option value="" disabled>부품을 선택하세요</option>
            {partOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </p>
      </div>

      <div className="form-content">
        <p>
          <span className="form-child">수량(qtyPerItem)</span>
          <input
            type="number"
            name="qtyPerItem"
            min={1}
            value={formData.qtyPerItem ?? ""}
            onChange={handleSmart}
            placeholder="완제품 1개당 부품 수"
            required
          />
        </p>
      </div>
      {children}
    </div>
  );
};

export default BomForm;
