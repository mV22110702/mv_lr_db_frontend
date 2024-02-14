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
    }),
    getAll: builder.query<Shift[], void>({
      query: () => ApiRoute.SHIFT.ROOT,
    }),
    getOneByAnimalAndKeeperId: builder.query<Shift | null, ShiftAnimalKeeperId>(
      {
        query: ({ animalId, keeperId }) =>
          generatePath(ApiRoute.SHIFT.BY_ANIMAL_ID_KEEPER_ID, {
            animalId: animalId.toString(),
            keeperId: keeperId.toString(),
          }),
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
    }),
    remove: builder.mutation<Shift, ShiftAnimalKeeperId>({
      query: ({ animalId, keeperId }) => ({
        url: generatePath(ApiRoute.SHIFT.BY_ANIMAL_ID_KEEPER_ID, {
          animalId: animalId.toString(),
          keeperId: keeperId.toString(),
        }),
        method: HttpMethod.DELETE,
      }),
    }),
  }),
});

export type Shift = {
  animal: ZooAnimal;
  keeper: ZooKeeper;
  //todo
  startsAt: Date;
  //todo
  endsAt: Date;
  salary: number;
};

export type ShiftAnimalKeeperId = {
  animalId: number;
  keeperId: number;
};

export type CreateShiftDto = ShiftAnimalKeeperId & {
  //todo
  startsAt: Date;
  //todo
  endsAt: Date;
  salary: number;
};

export type UpdateShiftDto = ShiftAnimalKeeperId & {
  body: Partial<Omit<CreateShiftDto, "keeperId" | "animalId">>;
};
