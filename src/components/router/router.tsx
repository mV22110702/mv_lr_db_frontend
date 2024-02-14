import { Route } from "react-router";
import { RouterProvider } from "@/components/router-provider/router-provider.tsx";
import { AppRoute } from "@/lib/enums/app-route.enum.ts";
import { HomePage } from "@/pages/homePage.tsx";

export const Router = () => {
  return (
    <RouterProvider>
      <Route path={AppRoute.ROOT} element={<HomePage />} />
    </RouterProvider>
  );
};
