import React from "react";

const PartOrderForm = ({
  formData,
  onChange,
  buyerOptions = [],
  onSelectBuyer, 
  children
}) => {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value } });
  };

  return (
    <div className="form-wrapper">
      <form className="form-content">
        <p>
          <span className="form-child">
          구매처명
          </span>
          <select
            name="buyerNo"
            value={formData.buyerNo ?? ""}
            onChange={(e) => { onChange(e); onSelectBuyer(Number(e.target.value)) }}
            required
          >
            <option value="">-- 선택 --</option>
            {buyerOptions.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </p>
        <p>
            <span className="form-child">
            구매처주소
            </span>
            <input
              type="text"
              name="buyerAddr"
              value={formData.buyerAddr ?? ""}
              readOnly
              placeholder="구매처 선택 시 자동 입력"
            />
        </p>

        <p>
            <span className="form-child">
              부품명
            </span>
              <input
                type="text"
                name="partName"
                value={formData.partName ?? ""}
                readOnly
                placeholder="구매처 선택 시 자동 입력"
              />
        </p>
      
        <p><input type="hidden" name="partNo" value={formData.partNo ?? ""} /></p>
      
        <p>
          <span className="form-child">
            구매단가
          </span>
            <input
              type="number"
              name="poPrice"
              value={formData.poPrice ?? ""}
              readOnly
              placeholder="부품 자동 선택 시 자동 입력"
            />
        </p>

      
        <p>
            <span className="form-child">
              구매수량
            </span>
              <input
                type="number"
                name="poQty"
                value={formData.poQty ?? ""}
                onChange={handleInput}
                min={1}
                required
              />
        </p>

      
        <p>
            <span className="form-child">
              구매상태
            </span>
              <select
                name="poState"
                value={formData.poState ?? "입고대기"}
                onChange={handleInput}
              >
                <option value="입고대기">입고대기</option>
              </select>
        </p>
      

        <p>
            <span className="form-child">
            입고일자
            </span>
            <input
              type="date"
              name="poDate"
              value={formData.poDate ?? ""}
              onChange={handleInput}
            />
        </p>
      </form>
      {children}
    </div>
  );
};

export default PartOrderForm;
