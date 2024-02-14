import { apiSlice, TagType } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { generatePath } from "react-router";

export const keeperApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<Food, CreateFoodDto>({
      invalidatesTags: [{ type: TagType.FOOD, id: "LIST" }],
      query: (body) => ({
        url: ApiRoute.FOOD.ROOT,
        method: HttpMethod.POST,
        body,
      }),
      transformResponse: (response: Food) => {
        return {
          ...response,
          restockedAt: new Date(response.restockedAt),
          usedAt: new Date(response.usedAt),
        };
      },
    }),
    getAll: builder.query<Food[], void>({
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: TagType.FOOD, id })),
              { type: TagType.FOOD, id: "LIST" },
            ]
          : [{ type: TagType.FOOD, id: "LIST" }],
      query: () => ApiRoute.FOOD.ROOT,
      transformResponse: (response: Food[]) => {
        return response.map((food) => {
          return {
            ...food,
            restockedAt: new Date(food.restockedAt),
            usedAt: new Date(food.usedAt),
          };
        });
      },
    }),
    getOneById: builder.query<Food | null, number>({
      providesTags: (_, __, id) => [{ type: TagType.FOOD, id }],
      query: (id) => generatePath(ApiRoute.FOOD.BY_ID, { id: id.toString() }),
      transformResponse: (response: Food | null) => {
        if (response) {
          return {
            ...response,
            restockedAt: new Date(response.restockedAt),
            usedAt: new Date(response.usedAt),
          };
        }
        return null;
      },
    }),
    update: builder.mutation<Food, UpdateFoodDto>({
      invalidatesTags: (_, __, { id }) => [{ type: TagType.FOOD, id }],
      query: ({ id, body }) => ({
        url: generatePath(ApiRoute.FOOD.BY_ID, { id: id.toString() }),
        method: HttpMethod.PATCH,
        body,
      }),
      transformResponse: (response: Food) => {
        return {
          ...response,
          restockedAt: new Date(response.restockedAt),
          usedAt: new Date(response.usedAt),
        };
      },
    }),
    remove: builder.mutation<Food, number>({
      invalidatesTags: (_, __, id) => [{ type: TagType.FOOD, id }],
      query: (id) => ({
        url: generatePath(ApiRoute.FOOD.BY_ID, { id: id.toString() }),
        method: HttpMethod.DELETE,
      }),
      transformResponse: (response: Food) => {
        return {
          ...response,
          restockedAt: new Date(response.restockedAt),
          usedAt: new Date(response.usedAt),
        };
      },
    }),
  }),
});

export type Food = {
  id: number;
  name: string;
  amount: number;
  restockedAt: Date;
  usedAt: Date;
};

export type CreateFoodDto = {
  name: string;
  amount: number;
  restockedAt: Date;
  usedAt: Date;
};

export type UpdateFoodDto = { id: number; body: Partial<CreateFoodDto> };
