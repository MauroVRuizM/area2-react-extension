import React from "react";
import ReactDOM from "react-dom/client";
import { init } from './firebase/config';
import { HomePage } from "./pages/HomePage";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// ? Init Firebase
init();

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);
