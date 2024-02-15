import { Route } from "react-router";
import { RouterProvider } from "@/components/router-provider/router-provider.tsx";
import { AppRoute } from "@/lib/enums/app-route.enum.ts";
import { HomePage } from "@/pages/homePage.tsx";
import { AnimalsPage } from "@/pages/animals-page/animalsPage.tsx";
import { DetailsPage } from "@/pages/animals-page/detailsPage.tsx";
import { KeepersPage } from "@/pages/keepers-page/keepersPage.tsx";
import { ShiftsPage } from "@/pages/shifts-page/shiftsPage.tsx";
import { FoodPage } from "@/pages/food-page/foodPage.tsx";

export const Router = () => {
  return (
    <RouterProvider>
      <Route path={AppRoute.ROOT} element={<HomePage />} />
      <Route path={AppRoute.ANIMALS.ROOT} element={<AnimalsPage />} />
      <Route path={AppRoute.ANIMALS.DETAILS} element={<DetailsPage />} />
      <Route path={AppRoute.KEEPERS.ROOT} element={<KeepersPage />} />
      <Route path={AppRoute.SHIFTS.ROOT} element={<ShiftsPage />} />
      <Route path={AppRoute.FOOD.ROOT} element={<FoodPage />} />
    </RouterProvider>
  );
};
