// import { useEffect, useState } from "react";
// import { getPartOrders, createPartOrder, updatePartOrder, deletePartOrder } from "../../api/PartOrderAPI";
// import ModalComponents from "../../components/ModalComponent.jsx"
// import { partOrderArrays } from "../../arrays/partOrderArrays.jsx";
// import PartOrderForm from "../../form/buyer/PartOrderForm.jsx"
// import BackButtonComponent from "../../components/BackButtonComponent.jsx";
// import { useNavigate } from "react-router-dom";

// const BuyerDeliveryPage = () => {
//   const [partOrders, setPartOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const navigate = useNavigate();
//   const [selectedId, setSelectedId] = useState(null); 

//   const [formData, setFormData] = useState({
//     poNo: "",
//     buyerAddr: "",
//     buyerComp: "",
//     partName: "",
//     poDate: "",
//     poPrice: "",
//     poQty: "",
//     poState: "입고대기"
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getPartOrders();
//       setPartOrders(data);
//     }
//     fetchData();
//   },[])

//   const getTableData = () => {
//     const data = formData.poState.includes("완료") ? console.log("완료") : console.log("test,없음");
//     return data;
//   }
//   console.log(formData)
//   getTableData();
//   return(
//     <div style={{ padding: "20px" }} className="customer-wrapper">
//       <BackButtonComponent text="< &nbsp;이전페이지" onClick={()=>navigate(-1)}/>
//       <h2 style={{ textAlign: "center" }}>입고 현황</h2>
//       <div className="table-wrapper">
//         <table
//         border="1"
//         style={{ width: "100%", textAlign: "center", borderCollapse: "collapse", marginTop: "20px" }}
//       >
//         <thead>
//           <tr>
//             {partOrderArrays.map((list, index) => (
//               <th key={index}>{list.content}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {
//           partOrders && partOrders.length > 0 ? (
//             partOrders.slice(1).map((c, index) => (
//               <tr key={c.poNo} className="row">
//                 <td>{index + 1}</td>
//                 <td>{c.buyerComp}</td>
//                 <td>{c.partName}</td>
//                 <td>{c.poQty}</td>
//                 <td>{c.poPrice}</td>
//                 <td>{c.poState}</td>
//                 <td>{c.poDate}</td>
//                 <td>{c.buyerAddr}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={8} style={{ textAlign: "center" }}>
//                 데이터가 없습니다.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       </div>
      
      
//     </div>
//   )
// }
// export default BuyerDeliveryPage;