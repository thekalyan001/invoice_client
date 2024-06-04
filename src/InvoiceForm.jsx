import React, { useState } from 'react';
import './invoiceform.css';
import { useNavigate } from 'react-router-dom';

const InvoiceForm =()=>{
    
    /**
     * @desc structure of the form data.
     */
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sellerDetails: { name: '', address: '', city: '', state: '', pincode: '', pan: '', gst: '' },
        placeOfSupply: '',
        billingDetails: { name: '', address: '', city: '', state: '', pincode: '', stateCode: '' },
        shippingDetails: { name: '', address: '', city: '', state: '', pincode: '', stateCode: '' },
        placeOfDelivery: '',
        orderDetails: { orderNo: '', orderDate: '' },
        invoiceDetails: { invoiceNo: '', invoiceDate: '', reverseCharge: false },
        items: [{ description: '', unitPrice: 0, quantity: 0, discount: 0 }]
      });

      /**
       * @desc : if change happened in item section then make a copy and update value at specified index field, 
       *       other case update form data by creating new object.
       */
      const handleInputChange = (e, section, index) => {
        const { name, value } = e.target;
        if (section === 'items') {
          const items = [...formData.items];
          items[index][name] = value;
          setFormData({ ...formData, items });
        } else {
          setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
        }
      };
    
      /**
       * @desc : append new item by creating new item object.
      */
      const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { description: '', unitPrice: 0, quantity: 0, discount: 0 }] });
      };

      const removeItem = (index) => {
        const items = [...formData.items];
        items.splice(index, 1);
        setFormData({ ...formData, items });
      };

    // backend api call and return the server side rendernig form
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   try {
    //     const response = await axios.post('http://localhost:5000/generate-invoice', formData, {
    //         responseType: 'blob', // Important to handle binary data
    //     });
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'invoice.pdf');
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();

    //     navigate('/test1');
    //   } catch (error) {
    //     console.error('Error generating invoice:', error);
    //   }
    // };

    /**
      * @desc : save to localstorgae after submssion.
    */
    const handleSubmit = (e) => {
      e.preventDefault();
      try {
        // Store form data in localStorage
        localStorage.setItem('invoiceData', JSON.stringify(formData));
  
        // Navigate to the Test1 screen
        navigate('/invoicepdf');
      } catch (error) {
        console.error('Error generating invoice:', error);
      }
    };

    return (
        <form onSubmit={handleSubmit}>


        {/* Seller Details */}
        <div>
          <h3>Seller Details</h3>
          <input type="text" name="name" placeholder="Seller Name" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
          <input type="text" name="company" placeholder="Company" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
          <div className="CityAddPin">
            <input type="text" name="city" placeholder="City" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
            <input type="text" name="state" placeholder="State" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
            <input type="number" name="pin" placeholder="Pin Code" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
          </div>
          <input type="text" name="address" placeholder="Seller Address" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
          <input type="text" name="pan" placeholder="Seller PAN" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
          <input type="text" name="gst" placeholder="Seller GST" onChange={(e) => handleInputChange(e, 'sellerDetails')} />
          {/* ... other seller fields */}
        </div>



        {/* Billing Details */}
        <div>
          <h3>Billing Details</h3>
          <input type="text" name="name" placeholder="Billing Name" onChange={(e) => handleInputChange(e, 'billingDetails')} />
          <input type="text" name="company" placeholder="Company" onChange={(e) => handleInputChange(e, 'billingDetails')} />
         
          <div className="CityAddPin">
            <input type="text" name="city" placeholder="City" onChange={(e) => handleInputChange(e, 'billingDetails')} />
            <input type="text" name="stateCode" placeholder="State Code" onChange={(e) => handleInputChange(e, 'billingDetails')} />
            <input type="number" name="pin" placeholder="Pin Code" onChange={(e) => handleInputChange(e, 'billingDetails')} />
          </div>

          <input type="text" name="address" placeholder="Billing Address" onChange={(e) => handleInputChange(e, 'billingDetails')} />
          {/* ... other billing fields */}
        </div>



        {/* Shipping Details */}
        <div>
          <h3>Shipping Details</h3>
          <input type="text" name="name" placeholder="Shipping Name" onChange={(e) => handleInputChange(e, 'shippingDetails')} />
          <input type="text" name="company" placeholder="Shipping Company" onChange={(e) => handleInputChange(e, 'shippingDetails')} />
          
          <div className="CityAddPin">
            <input type="text" name="city" placeholder="City" onChange={(e) => handleInputChange(e, 'shippingDetails')} />
            <input type="text" name="stateCode" placeholder="State Code" onChange={(e) => handleInputChange(e, 'shippingDetails')} />
            <input type="number" name="pin" placeholder="Pin Code" onChange={(e) => handleInputChange(e, 'shippingDetails')} />
          </div>

          <input type="text" name="address" placeholder="Shipping Address" onChange={(e) => handleInputChange(e, 'shippingDetails')} />
          {/* ... other shipping fields */}
        </div>



        {/* Order Details */}
        <div>
          <h3>Order Details</h3>
          <input type="text" name="orderNo" placeholder="Order No." onChange={(e) => handleInputChange(e, 'orderDetails')} />
          <input type="date" name="orderDate" placeholder="Order Date" onChange={(e) => handleInputChange(e, 'orderDetails')} />
        </div>


        {/* Invoice Details */}
        <div>
          <h3>Invoice Details</h3>
          <input type="text" name="invoiceNo" placeholder="Invoice No." onChange={(e) => handleInputChange(e, 'invoiceDetails')} />
          <input type="text" name="invoiceDetail" placeholder="Invoice Detail." onChange={(e) => handleInputChange(e, 'invoiceDetails')} />
        <input type="date" name="invoiceDate" placeholder="Invoice Date" onChange={(e) => handleInputChange(e, 'invoiceDetails')} />
          <label>
            Reverse Charge
            <input type="checkbox" name="reverseCharge" onChange={(e) => handleInputChange(e, 'invoiceDetails')} />
          </label>
        </div>



        {/* Items */}
        <div>
          <h3>Items</h3>
          {formData.items.map((item, index) => (
            <div key={index}>
              <input type="text" name="description" placeholder="Description" onChange={(e) => handleInputChange(e, 'items', index)} />
              <input type="number" min={0} name="unitPrice" placeholder="Unit Price" onChange={(e) => handleInputChange(e, 'items', index)} />
              <input type="number"  min={0} name="quantity" placeholder="Quantity" onChange={(e) => handleInputChange(e, 'items', index)} />
              <input type="number"  min={0} name="discount" placeholder="Discount" onChange={(e) => handleInputChange(e, 'items', index)} />
              {(formData.items.length)>1 && <button type="button" onClick={() => removeItem(index)} style={{backgroundColor: '#dc3545'}}>Delete</button> }
            </div>
          ))}
          <button type="button" onClick={addItem}>Add Item</button>
        </div>
        <button type="submit">Generate Invoice</button>
      </form>
    )
}
export default InvoiceForm;