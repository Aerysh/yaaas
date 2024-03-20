export interface Manhwa {
  title: string;
  thumbnail: string;
  latestChapter: string;
  endpoint: string;
}

export interface ManhwaDetails {
  thumbnail: string;
  title: string;
  alternativeTitle: string;
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

export interface ChapterDetails {
  title: string;
  images: ChapterImages[];
}

export interface ChapterImages {
  id: number;
  src: string;
}
