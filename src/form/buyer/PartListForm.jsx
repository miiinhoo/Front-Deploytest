import { PartListArray } from "../../arrays/PartListArrays";

const PartListForm = ({
  formData,
  onChange,
  customer,
  setCustomerId,
  children,
}) => {

  const handleSmart = (e) => {
    const { name, value } = e.target;
    const numeric = new Set(["partPrice", "buyerComp"]); // buyerComp는 buyerNo
    onChange({
      target: {
        name,
        value: numeric.has(name) && value !== "" ? Number(value) : value,
      },
    });
    if (name === "buyerComp" && setCustomerId) {
      setCustomerId(Number(value));
    }
  };

  return (
    <div className="form-wrapper">
      {PartListArray.slice(1).map((data) => (
        <div className="form-content" key={data.id}>
          <p>
            <span className="form-child">{data.content}</span>

            {data.clmn === "buyerComp" ? (
              <select
                name="buyerComp"
                value={formData.buyerComp ?? ""}
                onChange={handleSmart}
                required
              >
                <option value="" disabled>거래처 선택</option>
                {customer.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={data.input || "text"}
                name={data.clmn}
                value={formData[data.clmn] ?? ""}
                onChange={handleSmart}
                min={data.clmn === "partPrice" ? 0 : undefined}
                required
              />
            )}
          </p>
        </div>
      ))}

      {children}
    </div>
  );
};

export default PartListForm;
