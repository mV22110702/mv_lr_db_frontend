import { Route } from "react-router";
import { RouterProvider } from "@/components/router-provider/router-provider.tsx";
import { AppRoute } from "@/lib/enums/app-route.enum.ts";
import { HomePage } from "@/pages/homePage.tsx";
import {AnimalsPage} from "@/pages/animalsPage.tsx";
import {DetailsPage} from "@/pages/detailsPage.tsx";

export const Router = () => {
  return (
    <RouterProvider>
      <Route path={AppRoute.ROOT} element={<HomePage />} />
      <Route path={AppRoute.ANIMALS.ROOT} element={<AnimalsPage />} />
        <Route path={AppRoute.ANIMALS.DETAILS} element={<DetailsPage/>}/>
    </RouterProvider>
  );
};
