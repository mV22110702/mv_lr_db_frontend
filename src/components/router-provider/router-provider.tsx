import { FC, ReactNode } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider as LibraryRouterProvider,
} from "react-router-dom";

type RouterProviderProperties = {
  children: ReactNode;
};

export let _router: null | ReturnType<typeof createBrowserRouter> = null;
const RouterProvider: FC<RouterProviderProperties> = ({ children }) => {
  const routes = createRoutesFromElements(children);
  _router = createBrowserRouter(routes);
  return <LibraryRouterProvider router={_router} />;
};
export { RouterProvider };
