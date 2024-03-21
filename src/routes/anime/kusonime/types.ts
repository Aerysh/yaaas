export interface KusonimeSearchResult {
  id: number;
  thumbnail: string;
  title: string;
  endpoint: string;
}

export interface DownloadLink {
  title: string;
  url: string;
}

export interface DownloadDiv {
  quality: string;
  links: DownloadLink[];
}
