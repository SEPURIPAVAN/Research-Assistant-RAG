import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import MainApp from "./pages/MainApp.jsx";
import Signup from "./pages/Signup.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Landing/> } />
        <Route path='/login' element={ <Login/> }/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/app' element={ <MainApp/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
