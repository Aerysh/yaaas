export interface Manhwa {
  title: string;
  thumbnail: string;
  latest_chapter: string;
  endpoint: string;
}

export interface ManhwaDetails {
  thumbnail: string;
  title: string;
  altTitle: string;
  genres: Genre[];
  synopsis: string;
  chapters: Chapter[];
}

export interface Genre {
  name: string;
  endpoint: string;
}

export interface Chapter {
  name: string;
  date: string;
  endpoint: string;
}
