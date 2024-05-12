const KusonimeUrlHelper = {
  base: `https://kusonime.com/`,
  search: (query: string, page = 1) =>
    `${KusonimeUrlHelper.base}/page/${page}/?s=${query}&post_type=post`,
  info: (endpoint: string) => `${KusonimeUrlHelper.base}${endpoint}`,
};

export default KusonimeUrlHelper;
