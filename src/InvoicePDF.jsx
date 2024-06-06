import React, {useEffect, useState } from 'react';
import './invoicePDF.css';
import { usePDF } from 'react-to-pdf';
import numberToWords from 'number-to-words';
import axios from 'axios';

function InvoicePDF() {


  //retrive the invoiceData from localstorage
  const [invoiceData, setInvoiceData] = useState(null);

  // giving default values to avoid undefined errors
  const seller = invoiceData?.sellerDetails || {};
  const billing = invoiceData?.billingDetails || {};
  const shipping = invoiceData?.shippingDetails || {};
  const order = invoiceData?.orderDetails || {};
  const invoice = invoiceData?.invoiceDetails || {};
  const items = invoiceData?.items || [];

  const taxType = shipping?.stateCode === billing?.stateCode ? "CGST/SGST" : "IGST";
  const [totalItemTax, setTotalItemTax] = useState(0);
  const [totalItemAmount, setTotalItemAmount] = useState(0);

  
  /**
   * @name : kalyan
   * @desc : Take out value from localstorage and clear.
   * @method : 1
  */
 
  useEffect(() => {
    // Retrieve form data from localStorage
    const storedData = localStorage.getItem('invoiceData');
    if (storedData) {
      setInvoiceData(JSON.parse(storedData));
      localStorage.removeItem('invoiceData');  //remove item
    }
  }, []);


  /**
   * @name : kalyan
   * @desc : make get request to backend and get the data.
   * @method : 2
  */

  // useEffect(() => {
  //   const fetchInvoiceData = async () => {
  //       try {
  //           const response = await axios.get('http://localhost:5000/api/invoice');
  //           console.log("response data: ", response.data)
  //           setInvoiceData(response.data);
  //       } catch (error) {
  //           console.error('Error fetching invoice data', error);
  //       }
  //   };

  //   fetchInvoiceData();
  // }, []);





  /**
   * @name : kalyan
   * @desc :calculate netAmount, taxAmount, totalItemAmount  if item and taxType changes.
   */
  useEffect(() => {
    let totalTax = 0;
    let totalAmount = 0;

    items.forEach((item) => {
      const netAmount = item.unitPrice * item.quantity - item.discount;
      const taxAmount =  (taxType === "CGST/SGST" ? (netAmount * 0.09).toFixed(2) : (netAmount * 0.18).toFixed(2));
      const totalItemAmount = netAmount + parseFloat(taxAmount);

      totalTax += parseFloat(taxAmount);
      totalAmount += parseFloat(totalItemAmount);
    });

    setTotalItemTax(totalTax.toFixed(2));
    setTotalItemAmount(totalAmount.toFixed(2));
  }, [items, taxType]);


const { toPDF, targetRef } = usePDF({ filename: 'invoice.pdf' });

if (!invoiceData) {
  return <p>Loading...</p>;
}


  const printInvoice =() => {
    // toPDF(targetRef.current);  //generaete pdf using react-pdf but- not good looking
    window.print();
  };
  
  // return taxType and totalTax.
  return (
    <>
    <div ref={targetRef} className="invoice">

      {/* logo and Tax Invoice heading */}
      <div className='logo-taxHeading'>
        <div>
          <img src="/amazon_logo.jpg" alt="Company Logo" />
        </div>
        <div className='tax-invoice-heading'>
          <h1>Tax Invoice/Bill of Supply/Cash Memo</h1>
          <p>(Original for Recipient)</p>
        </div>
      </div>
      
      {/* SoldBy and Billing Address */}
      <div className="flex-container">
        <div className="flex-item section sold-by">
          <h2>Sold By:</h2>
          <p>{seller.name}</p>
          <p>{seller.address}</p>
        </div>
        
        <div className="flex-item section billing-address">
          <h2>Billing Address:</h2>
          <p>{billing.name}</p>
          <p>{billing.company}</p>
          <p>{billing.address}</p>
          <p>{billing.city}</p>
          <p><span>State/UT Code: </span>{billing.stateCode}</p>
        </div>
      </div>


      <div className="pan-gst">
        <p><span>Pan No:</span> {seller.pan}</p>
        <p><span>GST Registration No:</span> {seller.gst}</p>
      </div>
      
      <div className="section shipping-address">
        <h2>Shipping Address:</h2>
        <p>{shipping.name}</p>
        <p>{shipping.company}</p>
        <p>{shipping.address}</p>
        <p><span>Place of Supply:</span> {shipping.city}</p>
        <p><span>Place of Delivery:</span> {billing.city}</p>
        <p><span>State/UT Code:</span> {shipping.stateCode}</p>
      </div>
      
      <div className="section order-invoice">
        <div className='order-num-date'>
          <p><span>Order Number:</span> {order.orderNo}</p>
          <p><span>Order Date:</span> {order.orderDate}</p>
        </div>
        <div className='invoice-num-date'>
          <p><span>Invoice Number:</span> {invoice.invoiceNo}</p>
          <p><span>Invoice Detail:</span> {invoice.invoiceDetail}</p>
          <p><span>Invoice Date:</span> {invoice.invoiceDate}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Sl. No</th>
            <th>Description</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Discount</th>
            <th>Net Amount</th>
            <th>Tax Rate</th>
            <th>Tax Type</th>
            <th>Tax Amount</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item, index) => {
              const netAmount = item.unitPrice * item.quantity - item.discount;
              const taxAmount = taxType === "CGST/SGST" ? (netAmount * 0.09).toFixed(2) : (netAmount * 0.18).toFixed(2);
              const totalAmount = (netAmount+ parseFloat(taxAmount)).toFixed(2);// * (taxType === "CGST/SGST" ? 2 : 1)).toFixed(2);

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.quantity}</td>
                  <td>{item.discount}</td>
                  <td>{netAmount}</td>
                  <td>{taxType=="CGST/SGST"?"9%":"18%"}</td>
                  <td>{taxType}</td>
                  <td>{taxAmount}</td>
                  <td>{totalAmount}</td>
                </tr>
              );
            })
          }
          
        </tbody>
        <tfoot>
          <tr className='total-amount'>
            <td colSpan="8">TOTAL:</td>
            <td colSpan="1"> &#8377;{totalItemTax}</td>
            <td colSpan="1"> &#8377;{totalItemAmount}</td>
          </tr>
          
          <tr>
            <td colSpan="10">
              <div className='amount-word'>
                <p><span>Amount in Words:</span></p>
                <p><span>{numberToWords.toWords(totalItemAmount)}</span></p>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="10">
              <div className="signatory-class">
                <p><span>For {seller.name}</span></p>
                <img src="/signature.jpeg" alt="Company Logo" />
                <p>Authorized Signatory</p>
              </div>
            </td>
          </tr>
          {/* <tr>
            <td colSpan="10">Whether tax is payable under reverse charge - No</td>
          </tr> */}
        </tfoot>
      </table>
      <div style={{ display: 'flex', marginTop: '-15px' }}>
          <p>Whether tax is payable under reverse charge - {invoice.reverseCharge?"Yes":"No"}</p>
        </div>
    </div>
    <button onClick={printInvoice} className="no-print">Print Invoice PDF</button>
    </>
  );
}

export default InvoicePDF;
