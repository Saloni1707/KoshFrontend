import './index.css';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import {Signup} from './pages/Signup';
import {Dashboard} from "./pages/Dashboard";
import {SendMoney} from "./pages/SendMoney";
import {Signin} from "./pages/Signin";
import {Home} from "./pages/Home";
import {PaymentStatus} from "./pages/PaymentStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/send' element={<SendMoney/>}/>
        <Route path='/paymentstatus' element={<PaymentStatus/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
