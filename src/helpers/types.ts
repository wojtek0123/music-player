export interface Song {
  id: string;
  title: string;
  author_id: string;
  created_at: string;
  link: string;
  album?: string;
  author?: Author;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface Author {
  id: string;
  name: string;
}
