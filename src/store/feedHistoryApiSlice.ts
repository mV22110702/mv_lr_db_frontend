import { apiSlice, TagType } from "@/store/apiSlice.ts";
import { ApiRoute } from "@/lib/enums/api-route.enum.ts";
import { HttpMethod } from "@/lib/enums/http-method.enum.ts";
import { ZooKeeper } from "@/store/keeperApiSlice.ts";
import { ZooAnimal } from "@/store/animalApiSlice.ts";
import { Food } from "@/store/foodApiSlice.ts";

export const feedHistoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFeedHistory: builder.mutation<FeedHistory, CreateFeedHistoryDto>({
      invalidatesTags: [
        { type: TagType.FEED_HISTORY, id: "LIST" },
        { type: TagType.FOOD },
      ],
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
    getAllFeedHistories: builder.query<
      FeedHistory[],
      FilterFeedHistoryDto | undefined
    >({
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({
                  animal: { id: animalId },
                  keeper: { id: keeperId },
                  createdAt,
                }) => ({
                  type: TagType.FEED_HISTORY,
                  id: `${animalId}-${keeperId}-${createdAt.toISOString()}`,
                }),
              ),
              { type: TagType.FEED_HISTORY, id: "LIST" },
            ]
          : [{ type: TagType.FEED_HISTORY, id: "LIST" }],
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ALL,
        method: HttpMethod.POST,
        body: body ?? {},
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
    getOneFeedHistory: builder.query<FeedHistory | null, FindFeedHistoryDto>({
      providesTags: (_, __, { animalId, keeperId, createdAt }) => [
        {
          type: TagType.FEED_HISTORY,
          id: `${animalId}-${keeperId}-${createdAt.toISOString()}`,
        },
      ],
      query: (body) => ({
        url: ApiRoute.FEED_HISTORY.ONE,
        method: HttpMethod.POST,
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
    updateFeedHistory: builder.mutation<
      FeedHistory | null,
      UpdateFeedHistoryDto
    >({
      invalidatesTags: (_, __, { animalId, keeperId, createdAt }) => [
        {
          type: TagType.FEED_HISTORY,
          id: `${animalId}-${keeperId}-${createdAt.toISOString()}`,
        },
        { type: TagType.FOOD },
      ],
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
    removeFeedHistory: builder.mutation<FeedHistory | null, FindFeedHistoryDto>(
      {
        invalidatesTags: (_, __, { animalId, keeperId, createdAt }) => [
          {
            type: TagType.FEED_HISTORY,
            id: `${animalId}-${keeperId}-${createdAt.toISOString()}`,
          },
        ],
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
      },
    ),
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
