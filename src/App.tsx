import {store} from "@/store/store.ts";
import {Provider} from "react-redux";
import {Router} from "@/components/router/router.tsx";
import {Toaster} from "@/pages/components/toaster.tsx";

function App() {
  return (
    <Provider store={store}>
        <Router/>
        <Toaster position={'top-right'} closeButton duration={5000}/>
    </Provider>
  )
}

export default App
