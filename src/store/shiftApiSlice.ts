import { apiSlice } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { generatePath } from "react-router";
import { ZooAnimal } from "@/store/animalApiSlice.ts";
import { ZooKeeper } from "@/store/keeperApiSlice.ts";

export const shiftApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<Shift, CreateShiftDto>({
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
    getAll: builder.query<Shift[], void>({
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
    getOneByAnimalAndKeeperId: builder.query<Shift | null, ShiftAnimalKeeperId>(
      {
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
      },
    ),
    update: builder.mutation<Shift, UpdateShiftDto>({
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
    remove: builder.mutation<Shift, ShiftAnimalKeeperId>({
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
