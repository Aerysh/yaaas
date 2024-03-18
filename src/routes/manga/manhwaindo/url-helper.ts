export const manhwaindoUrlHelper: {
  base: string;
  popular: (page?: number) => string;
  latest: (page?: number) => string;
  detail: (endpoint: string) => string;
  read: (endpoint: string) => string;
} = {
  base: `https://manhwaindo.id/`,
  popular: (page = 1) => `${manhwaindoUrlHelper.base}series/?order=popular&page=${page}`,
  latest: (page = 1) => `${manhwaindoUrlHelper.base}series/?order=update&page=${page}`,
  detail: (endpoint: string) => `${manhwaindoUrlHelper.base}series/${endpoint}`,
  read: (endpoint: string) => `${manhwaindoUrlHelper.base}${endpoint}`,
};
