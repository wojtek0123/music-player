export interface Song {
  id: string;
  title: string;
  author_id: string;
  created_at: string;
  link: string;
  time: number;
  author?: Author;
}

export interface Playlist {
  id: string;
  name: string;
  user_id: string;
  songs: Song[];
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
}
