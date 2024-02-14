import {apiSlice, TagType} from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { generatePath } from "react-router";

export const keeperApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<ZooKeeper, CreateKeeperDto>({
      invalidatesTags: [{ type: TagType.KEEPER, id: "LIST" }],
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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: TagType.KEEPER, id })),
              { type: TagType.KEEPER, id: "LIST" },
            ]
          : [{ type: TagType.KEEPER, id: "LIST" }],
      query: () => ApiRoute.KEEPER.ROOT,
    }),
    getOneById: builder.query<ZooKeeper | null, number>({
      providesTags: (_, __, id) => [{ type: TagType.KEEPER, id }],
      query: (id) => generatePath(ApiRoute.KEEPER.BY_ID, { id: id.toString() }),
    }),
    update: builder.mutation<ZooKeeper, UpdateKeeperDto>({
      invalidatesTags: (_, __, { id }) => [{ type: TagType.KEEPER, id }],
      query: ({ id, body }) => ({
        url: generatePath(ApiRoute.KEEPER.BY_ID, { id: id.toString() }),
        method: HttpMethod.PATCH,
        body,
      }),
    }),
    remove: builder.mutation<ZooKeeper, number>({
      invalidatesTags: (_, __, id) => [{ type: TagType.KEEPER, id }],
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
