export const ApiRoute = {
  ANIMAL: {
    ROOT: "/animal",
    GET_DETAILS_BY_ID: "/animal/details/:id",
    BY_ID: "/animal/:id",
  },
  FEED_HISTORY: {
    ONE: "/feed-history/one",
    ONE_FIND: "/feed-history/one/find",
    ALL: "/feed-history/all",
    ALL_FIND: "/feed-history/all/find",
  },
  FOOD: {
    ROOT: "/food",
    BY_ID: "/food/:id",
  },
  KEEPER: {
    ROOT: "/keeper",
    GET_SHIFTS_COUNT_BY_ID: "/keeper/shifts-count/:id",
    BY_ID: "/keeper/:id",
  },
  SHIFT: {
    ROOT: "/shift",
    BY_ANIMAL_ID_KEEPER_ID: "/shift/:animalId/:keeperId",
  },
} as const;
