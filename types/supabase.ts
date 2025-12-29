export type JSON =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSON | undefined }
  | JSON[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          cake_settings: JSON;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          cake_settings?: JSON;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          cake_settings?: JSON;
          created_at?: string;
          updated_at?: string;
        };
      };
      accomplishments: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          cake_settings: JSON;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          cake_settings?: JSON;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          cake_settings?: JSON;
          created_at?: string;
          updated_at?: string;
        };
        candles: {
          Row: {
            id: string;
            username: string | null;
            display_name: string | null;
            avatar_url: string | null;
            cake_settings: JSON;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id: string;
            username?: string | null;
            display_name?: string | null;
            avatar_url?: string | null;
            cake_settings?: JSON;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            username?: string | null;
            display_name?: string | null;
            avatar_url?: string | null;
            cake_settings?: JSON;
            created_at?: string;
            updated_at?: string;
          };
        };
      };
    };
  };
}
