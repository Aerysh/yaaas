const KomikindoUrlHelper = {
  base: 'https://komikindo.moe/',
  info: (endpoint: string) => `${KomikindoUrlHelper.base}manga/${endpoint}/`,
  read: (endpoint: string) => `${KomikindoUrlHelper.base}chapter/${endpoint}/`,
  search: (query: string, page = 1) =>
    `${KomikindoUrlHelper.base}?s=${query}&page=${page}/`,
};

export default KomikindoUrlHelper;
