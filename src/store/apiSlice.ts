import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const TagType = {
    ANIMAL: 'animal',
    KEEPER: 'keeper',
    SHIFT:'shift',
    FOOD:'food',
    FEED_HISTORY:'feed_history',
};

export const apiSlice = createApi({
    reducerPath: 'base',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/',mode:'cors'}),
    tagTypes: Object.values(TagType),
    endpoints: () => ({}),
});
