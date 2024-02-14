import {store} from "@/store/store.ts";
import {Provider} from "react-redux";
import {Router} from "@/components/router/router.tsx";

function App() {
  return (
    <Provider store={store}>
        <Router/>
    </Provider>
  )
}

export default App
