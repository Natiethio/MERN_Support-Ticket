import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store }  from './redux/store.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer position="top-right" autoClose={5001} />
   <Provider store={store}>   {/* componets inside the provider will access the store */}
      <App />
    </Provider>
    <ToastContainer />
  </React.StrictMode>,
)
