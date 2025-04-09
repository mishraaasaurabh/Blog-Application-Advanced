

import axios from "axios";

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countroute,
  data_to_send = {},
}) => {
  let obj;

  if (state != null && !create_new_arr) {
    // Appending data
    obj = {
      ...state,
      results: [...state.results, ...data],
      page: page,
      hasMore: state.totalDocs > [...state.results, ...data].length
    };
  } else {
    // Fresh fetch, so we get total count
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + countroute, data_to_send)
      .then(({ data: { totalDocs } }) => {
        obj = {
          results: data,
          page: 1,
          totalDocs,
          hasMore: totalDocs > data.length
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return obj;
};
