export const manhwaindoUrlHelper = {
  base: 'https://manhwaindo.net/',
  genres: (endpoint: string, page = 1) =>
    `${manhwaindoUrlHelper.base}genres/${endpoint}/?page=${page}&order=popular`,
  series: (page = 1) => `${manhwaindoUrlHelper.base}series/?page=${page}`,
  popular: (page = 1) => `${manhwaindoUrlHelper.base}series/?order=popular&page=${page}`,
  latest: (page = 1) => `${manhwaindoUrlHelper.base}series/?order=update&page=${page}`,
  detail: (endpoint: string) => `${manhwaindoUrlHelper.base}series/${endpoint}`,
  read: (endpoint: string) => `${manhwaindoUrlHelper.base}${endpoint}`,
};
