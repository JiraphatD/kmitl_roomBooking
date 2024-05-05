import { useState } from 'react'
import './App.css'
import Home from './component/Home'
import Login from './component/Admin/Login'
import { BrowserRouter, Link, Route, Routes, Navigate, HashRouter } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import AdminPage from './component/Admin/AdminPage/AdminPage'



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token'));
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Home />} />
          <Route path='/Login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          {isAuthenticated ? (
            <Route
              path='/Admin/*'
              element={<AdminPage />}
            />
          ) : (
            <Route
              path='/Admin/*'
              element={<Navigate to='/Login' />}
            />
          )}
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
