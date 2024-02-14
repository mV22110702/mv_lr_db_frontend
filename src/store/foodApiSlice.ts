import { apiSlice } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { generatePath } from "react-router";

export const keeperApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<Food, CreateFoodDto>({
      query: (body) => ({
        url: ApiRoute.FOOD.ROOT,
        method: HttpMethod.POST,
        body,
      }),
    }),
    getAll: builder.query<Food[], void>({
      query: () => ApiRoute.FOOD.ROOT,
    }),
    getOneById: builder.query<Food | null, number>({
      query: (id) => generatePath(ApiRoute.FOOD.BY_ID, { id: id.toString() }),
    }),
    update: builder.mutation<Food, UpdateFoodDto>({
      query: ({ id, body }) => ({
        url: generatePath(ApiRoute.FOOD.BY_ID, { id: id.toString() }),
        method: HttpMethod.PATCH,
        body,
      }),
    }),
    remove: builder.mutation<Food, number>({
      query: (id) => ({
        url: generatePath(ApiRoute.FOOD.BY_ID, { id: id.toString() }),
        method: HttpMethod.DELETE,
      }),
    }),
  }),
});

export type Food = {
  id: number;
  name: string;
  amount: number;
  //todo
  restockedAt: Date;
  //todo
  usedAt: Date;
};

export type CreateFoodDto = {
  name: string;
  amount: number;
  restockedAt: Date;
  usedAt: Date;
};

export type UpdateFoodDto = { id: number; body: Partial<CreateFoodDto> };
