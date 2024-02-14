import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {store} from "@/store/store.ts";
import {Provider} from "react-redux";

function App() {
  return (
    <Provider store={store}>
        <Router/>
    </Provider>
  )
}

export default App
