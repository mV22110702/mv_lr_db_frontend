export const AppRoute = {
    ROOT: '/',
    ANIMALS: {
        ROOT: '/animals',
        DETAILS:'/animals/:id',
    },
    FEED_HISTORY: {
        ROOT: '/feed-history',
    },
    FOOD: {
        ROOT: '/food',
    },
    KEEPERS: {
        ROOT: '/keepers',
    },
    SHIFTS: {
        ROOT: '/shifts',
    },
} as const;
