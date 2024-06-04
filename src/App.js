import './App.css';
import InvoiceForm from './InvoiceForm';
import Test1 from './Test1';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<InvoiceForm/>} />
        <Route path="/test1" element={<Test1/>} />
      </Routes>
    </Router>
  );
}

export default App;
