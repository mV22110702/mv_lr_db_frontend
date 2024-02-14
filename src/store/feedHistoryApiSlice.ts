import { apiSlice } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { ZooKeeper } from "@/store/keeperApiSlice.ts";
import { ZooAnimal } from "@/store/animalApiSlice.ts";
import { Food } from "@/store/foodApiSlice.ts";

export const keeperApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    create: builder.mutation<FeedHistory, CreateFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.POST,
        body,
      }),
      transformResponse: (response: FeedHistory) => {
        return {
          ...response,
          createdAt: new Date(response.createdAt),
        };
      },
    }),
    getAll: builder.query<FeedHistory[], FilterFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ALL,
        method: HttpMethod.GET,
        body,
      }),
      transformResponse: (response: FeedHistory[]) => {
        return response.map((feedHistory) => {
          return {
            ...feedHistory,
            createdAt: new Date(feedHistory.createdAt),
          };
        });
      },
    }),
    getOne: builder.query<FeedHistory | null, FindFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.GET,
        body,
      }),
      transformResponse: (response: FeedHistory | null) => {
        if (response) {
          return {
            ...response,
            createdAt: new Date(response.createdAt),
          };
        }
        return null;
      },
    }),
    update: builder.mutation<FeedHistory | null, UpdateFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.PATCH,
        body,
      }),
      transformResponse: (response: FeedHistory | null) => {
        if (response) {
          return {
            ...response,
            createdAt: new Date(response.createdAt),
          };
        }
        return null;
      },
    }),
    delete: builder.mutation<FeedHistory | null, FindFeedHistoryDto>({
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.DELETE,
        body,
      }),
      transformResponse: (response: FeedHistory | null) => {
        if (response) {
          return {
            ...response,
            createdAt: new Date(response.createdAt),
          };
        }
        return null;
      },
    }),
  }),
});

export type CreateFeedHistoryDto = {
  keeperId: number;

  animalId: number;

  createdAt: Date;

  foodId: number;

  amount: number;
};

export type FeedHistory = {
  animal: ZooAnimal;

  keeper: ZooKeeper;

  food: Food;

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

export type FilterFeedHistoryDto = Partial<
  Pick<CreateFeedHistoryDto, "animalId" | "keeperId">
>;
