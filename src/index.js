import React from 'react';
import ReactDOM from 'react-dom/client';
import {ErrorsPage} from './components'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
function Redirect(){
  window.location.pathname = '../Generator'
}
root.render(
    <Router>
      <Routes>
        <Route path='/Generator' element={<ErrorsPage/>} />
        <Route path="*" element={<Redirect/>} />
      </Routes>
    </Router>
);