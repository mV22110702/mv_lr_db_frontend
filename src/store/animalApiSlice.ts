import { apiSlice } from "@/store/apiSlice.ts";
import { generatePath } from "react-router";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";

export const animalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getFreightsByUserId: builder.query<GetFreightsResponseDto, FindFreightDto>({
    //     query: ({
    //                 ownerId,
    //                 pagination: { page = 0, pageSize = 10 },
    //                 filter: { name },
    //                 sort: { order, field },
    //             }) => {
    //         const initialPath = generatePath(ApiRoute.FREIGHTS.GET_BY_OWNER_ID, {
    //             ownerId: ownerId.toString(),
    //         });
    //         const searchParams = new URLSearchParams();
    //         if (name) {
    //             searchParams.set('name', name);
    //         }
    //         if (order && field) {
    //             searchParams.set('order', order);
    //             searchParams.set('field', field);
    //         }
    //         searchParams.set('page', page.toString());
    //         searchParams.set('pageSize', pageSize.toString());
    //         return `${initialPath}?${searchParams.toString()}`;
    //     },
    //     providesTags: [TagType.FREIGHT],
    // }),
    // removeFreightById: builder.mutation<void, number>({
    //     query: (id: number) => ({
    //         url: generatePath(ApiRoute.FREIGHTS.REMOVE_BY_ID, {
    //             id: id.toString(),
    //         }),
    //         method: HttpMethod.DELETE,
    //         body: undefined,
    //     }),
    //     invalidatesTags: [TagType.FREIGHT],
    // }),
    create: builder.mutation<CreateAnimalDto, CreateAnimalDto>({
      query: (body) => ({
        url: ApiRoute.ANIMAL.ROOT,
        method: HttpMethod.POST,
        body,
      }),
    }),
  }),
});

export type CreateAnimalDto = {
  scientificName: string;
  name: string;
};
