import { apiSlice, TagType } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { generatePath } from "react-router";
import { ZooAnimal } from "@/store/animalApiSlice.ts";
import { ZooKeeper } from "@/store/keeperApiSlice.ts";

export const shiftApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createShift: builder.mutation<Shift, CreateShiftDto>({
      invalidatesTags: [{ type: TagType.SHIFT, id: "LIST" }],
      query: (body) => ({
        url: ApiRoute.SHIFT.ROOT,
        method: HttpMethod.POST,
        body,
      }),
      transformResponse: (response: Shift) => {
        return {
          ...response,
          startsAt: new Date(response.startsAt),
          endsAt: new Date(response.endsAt),
        };
      },
    }),
    getAllShifts: builder.query<Shift[], void>({
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ animal: { id: animalId }, keeper: { id: keeperId } }) => ({
                  type: TagType.SHIFT,
                  id: `${animalId}-${keeperId}`,
                }),
              ),
              { type: TagType.SHIFT, id: "LIST" },
            ]
          : [{ type: TagType.SHIFT, id: "LIST" }],
      query: () => ApiRoute.SHIFT.ROOT,
      transformResponse: (response: Shift[]) => {
        return response.map((shift) => {
          return {
            ...shift,
            startsAt: new Date(shift.startsAt),
            endsAt: new Date(shift.endsAt),
          };
        });
      },
    }),
    getOneShiftByAnimalAndKeeperId: builder.query<
      Shift | null,
      ShiftAnimalKeeperId
    >({
      providesTags: (_, __, { animalId, keeperId }) => [
        { type: TagType.SHIFT, id: `${animalId}-${keeperId}` },
      ],
      query: ({ animalId, keeperId }) =>
        generatePath(ApiRoute.SHIFT.BY_ANIMAL_ID_KEEPER_ID, {
          animalId: animalId.toString(),
          keeperId: keeperId.toString(),
        }),
      transformResponse: (response: Shift | null) => {
        if (response) {
          return {
            ...response,
            startsAt: new Date(response.startsAt),
            endsAt: new Date(response.endsAt),
          };
        }
        return null;
      },
    }),
    updateShift: builder.mutation<Shift, UpdateShiftDto>({
      invalidatesTags: (_, __, { animalId, keeperId }) => [
        { type: TagType.SHIFT, id: `${animalId}-${keeperId}` },
      ],
      query: ({ animalId, keeperId, body }) => ({
        url: generatePath(ApiRoute.SHIFT.BY_ANIMAL_ID_KEEPER_ID, {
          animalId: animalId.toString(),
          keeperId: keeperId.toString(),
        }),
        method: HttpMethod.PATCH,
        body,
      }),
      transformResponse: (response: Shift) => {
        return {
          ...response,
          startsAt: new Date(response.startsAt),
          endsAt: new Date(response.endsAt),
        };
      },
    }),
    removeShift: builder.mutation<Shift, ShiftAnimalKeeperId>({
      invalidatesTags: (_, __, { animalId, keeperId }) => [
        { type: TagType.SHIFT, id: `${animalId}-${keeperId}` },
      ],
      query: ({ animalId, keeperId }) => ({
        url: generatePath(ApiRoute.SHIFT.BY_ANIMAL_ID_KEEPER_ID, {
          animalId: animalId.toString(),
          keeperId: keeperId.toString(),
        }),
        method: HttpMethod.DELETE,
      }),
      transformResponse: (response: Shift) => {
        return {
          ...response,
          startsAt: new Date(response.startsAt),
          endsAt: new Date(response.endsAt),
        };
      },
    }),
  }),
});

export type Shift = {
  animal: ZooAnimal;
  keeper: ZooKeeper;
  startsAt: Date;
  endsAt: Date;
  salary: number;
};

export type ShiftAnimalKeeperId = {
  animalId: number;
  keeperId: number;
};

export type CreateShiftDto = ShiftAnimalKeeperId & {
  startsAt: Date;
  endsAt: Date;
  salary: number;
};

export type UpdateShiftDto = ShiftAnimalKeeperId & {
  body: Partial<Omit<CreateShiftDto, "keeperId" | "animalId">>;
};
