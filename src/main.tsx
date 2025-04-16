import React from "react";
import ReactDOM from "react-dom/client";
import { DBProvider } from './contexts/DatabaseContext';
import App from "./App";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>    
      <DBProvider>
        <App />
      </DBProvider>
  </React.StrictMode>,
);
