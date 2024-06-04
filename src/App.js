import './App.css';
import InvoiceForm from './InvoiceForm';
import InvoicePDF from './InvoicePDF';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<InvoiceForm/>} />
        <Route path="/test1" element={<InvoicePDF/>} />
      </Routes>
    </Router>
  );
}

export default App;
