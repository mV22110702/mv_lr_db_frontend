import { apiSlice, TagType } from "@/store/apiSlice.ts";
import { generatePath } from "react-router";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";

export const animalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAnimal: builder.mutation<ZooAnimal, CreateAnimalDto>({
      invalidatesTags: [{ type: TagType.ANIMAL, id: "LIST" }],
      query: (body) => ({
        url: ApiRoute.ANIMAL.ROOT,
        method: HttpMethod.POST,
        body,
      }),
    }),
    getAnimalDetailsById: builder.query<GetAnimalDetailsResponseDto, number>({
      providesTags: (_, __, id) => [{ type: TagType.ANIMAL, id }],
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
      },
    }),
    getAllAnimals: builder.query<ZooAnimal[], void>({
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: TagType.ANIMAL, id })),
              { type: TagType.ANIMAL, id: "LIST" },
            ]
          : [{ type: TagType.ANIMAL, id: "LIST" }],
      query: () => ApiRoute.ANIMAL.ROOT,
    }),
    getOneAnimalById: builder.query<ZooAnimal | null, number>({
      providesTags: (_, __, id) => [{ type: TagType.ANIMAL, id }],
      query: (id) => generatePath(ApiRoute.ANIMAL.BY_ID, { id: id.toString() }),
    }),
    update: builder.mutation<ZooAnimal, UpdateAnimalDto>({
      invalidatesTags: (_, __, { id }) => [{ type: TagType.ANIMAL, id }],
      query: ({ id, body }) => ({
        url: generatePath(ApiRoute.ANIMAL.BY_ID, { id: id.toString() }),
        method: HttpMethod.PATCH,
        body,
      }),
    }),
    removeAnimal: builder.mutation<ZooAnimal, number>({
      invalidatesTags: (_, __, id) => [{ type: TagType.ANIMAL, id }],
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
  createdAt: Date;
  amount: number;
};

export type AnimalShiftDetails = {
  keeperId: number;
  keeperFullname: string;
  salary: number;
  startsAt: Date;
  endsAt: Date;
};

export type GetAnimalDetailsResponseDto = [
  AnimalFoodDetails[],
  AnimalShiftDetails[],
];
