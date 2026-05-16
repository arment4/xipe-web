import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MockProvider } from './data/MockProvider.jsx'
import { ThemeProvider } from './theme/Theme.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MockProvider>
          <App />
        </MockProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
