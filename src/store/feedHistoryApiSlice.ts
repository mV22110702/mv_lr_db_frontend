import { apiSlice } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { ZooKeeper } from "@/store/keeperApiSlice.ts";
import { ZooAnimal } from "@/store/animalApiSlice.ts";
import { Food } from "@/store/foodApiSlice.ts";

export const keeperApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<ZooKeeper, CreateFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.POST,
        body,
      }),
    }),
    getAll: builder.query<FeedHistory[], void>({
      query: () => ApiRoute.FEED_HISTORY.ALL,
    }),
    getOne: builder.query<FeedHistory | null, FindFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.GET,
        body,
      }),
    }),
    update: builder.mutation<FeedHistory | null, UpdateFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.PATCH,
        body,
      }),
    }),
    delete: builder.mutation<FeedHistory | null, FindFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.DELETE,
        body,
      }),
    }),
  }),
});

export type CreateFeedHistoryDto = {
  keeperId: number;

  animalId: number;
  //todo
  createdAt: Date;

  foodId: number;

  amount: number;
};

export type FeedHistory = {
  animal: ZooAnimal;

  keeper: ZooKeeper;

  food: Food;
  //todo
  createdAt: Date;

  amount: number;
};

export type FindFeedHistoryDto = Pick<
  CreateFeedHistoryDto,
  "animalId" | "keeperId" | "createdAt"
>;

export type UpdateFeedHistoryDto = Partial<
  Pick<CreateFeedHistoryDto, "amount" | "foodId">
> &
  FindFeedHistoryDto;
