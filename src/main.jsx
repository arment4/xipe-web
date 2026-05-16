import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MockProvider } from './data/MockProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MockProvider>
        <App />
      </MockProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
