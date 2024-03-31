export const AnoboyUrlHelper = {
  base: `https://anoboy.ch/`,
  search: (query: string, page = 1) => `${AnoboyUrlHelper.base}page/${page}/?s=${query}`,
  info: (endpoint: string) => `${AnoboyUrlHelper.base}anime/${endpoint}`,
};
