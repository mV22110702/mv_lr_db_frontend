import { apiSlice } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { generatePath } from "react-router";

export const keeperApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<ZooKeeper, CreateKeeperDto>({
      query: (body) => ({
        url: ApiRoute.KEEPER.ROOT,
        method: HttpMethod.POST,
        body,
      }),
    }),
    getShiftsCountById: builder.query<GetShiftsCountResponseDto, number>({
      query: (id) =>
        generatePath(ApiRoute.KEEPER.GET_SHIFTS_COUNT_BY_ID, {
          id: id.toString(),
        }),
    }),
    getAll: builder.query<ZooKeeper[], void>({
      query: () => ApiRoute.KEEPER.ROOT,
    }),
    getOneById: builder.query<ZooKeeper | null, number>({
      query: (id) => generatePath(ApiRoute.KEEPER.BY_ID, { id: id.toString() }),
    }),
    update: builder.mutation<ZooKeeper, UpdateKeeperDto>({
      query: ({ id, body }) => ({
        url: generatePath(ApiRoute.KEEPER.BY_ID, { id: id.toString() }),
        method: HttpMethod.PATCH,
        body,
      }),
    }),
    remove: builder.mutation<ZooKeeper, number>({
      query: (id) => ({
        url: generatePath(ApiRoute.KEEPER.BY_ID, { id: id.toString() }),
        method: HttpMethod.DELETE,
      }),
    }),
  }),
});
export type ZooKeeper = {
  id: number;
  firstName: string;
  lastName: string;
};
export type CreateKeeperDto = {
  firstName: string;
  lastName: string;
};
export type UpdateKeeperDto = { id: number; body: Partial<CreateKeeperDto> };
export type GetShiftsCountResponseDto = { shiftsCount: number };
