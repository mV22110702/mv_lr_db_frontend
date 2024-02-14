import { apiSlice } from "@/store/apiSlice.ts";
import { generatePath } from "react-router";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";

export const animalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<ZooAnimal, CreateAnimalDto>({
      query: (body) => ({
        url: ApiRoute.ANIMAL.ROOT,
        method: HttpMethod.POST,
        body,
      }),
    }),
    getDetailsById: builder.query<GetAnimalDetailsResponseDto, number>({
      query: (id) =>
        generatePath(ApiRoute.ANIMAL.GET_DETAILS_BY_ID, { id: id.toString() }),
      transformResponse: (response: GetAnimalDetailsResponseDto) => {
        return [
          response[0].map((food) => {
            return {
              ...food,
              createdAt: new Date(food.createdAt),
            };
          }),
          response[1].map((shift) => {
            return {
              ...shift,
              startsAt: new Date(shift.startsAt),
              endsAt: new Date(shift.endsAt),
            };
          }),
        ];
      }
    }),
    getAll: builder.query<ZooAnimal[], void>({
      query: () => ApiRoute.ANIMAL.ROOT,
    }),
    getOneById: builder.query<ZooAnimal|null, number>({
      query: (id) => generatePath(ApiRoute.ANIMAL.BY_ID, { id: id.toString() }),
    }),
    update: builder.mutation<ZooAnimal, UpdateAnimalDto>({
      query: ({ id, body }) => ({
        url: generatePath(ApiRoute.ANIMAL.BY_ID, { id: id.toString() }),
        method: HttpMethod.PATCH,
        body,
      }),
    }),
    remove: builder.mutation<ZooAnimal, number>({
      query: (id) => ({
        url: generatePath(ApiRoute.ANIMAL.BY_ID, { id: id.toString() }),
        method: HttpMethod.DELETE,
      }),
    }),
  }),
});

export type CreateAnimalDto = {
  scientificName: string;
  name: string;
};
export type UpdateAnimalDto = {
  id: number;
  body: Partial<CreateAnimalDto>;
};

export type ZooAnimal = {
  id: number;
  scientificName: string;
  name: string;
};

export type AnimalFoodDetails = {
  keeperId: number;
  keeperFullname: string;
  foodId: number;
  foodName: string;
  //todo
  createdAt: Date;
  amount: number;
};

export type AnimalShiftDetails = {
  keeperId: number;
  keeperFullname: string;
  salary: number;
  //todo
  startsAt: Date;
  //todo
  endsAt: Date;
};

export type GetAnimalDetailsResponseDto = [
  AnimalFoodDetails[],
  AnimalShiftDetails[],
];
