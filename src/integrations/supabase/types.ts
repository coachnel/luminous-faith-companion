export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Chrétien: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          author_name: string
          comment: string
          content_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          author_name: string
          comment: string
          content_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          author_name?: string
          comment?: string
          content_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "community_content"
            referencedColumns: ["id"]
          },
        ]
      }
      community_content: {
        Row: {
          author_name: string
          comments_count: number
          content: string
          created_at: string
          id: string
          is_public: boolean
          likes_count: number
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          is_public?: boolean
          likes_count?: number
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean
          likes_count?: number
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          content_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "community_content"
            referencedColumns: ["id"]
          },
        ]
      }
      community_notifications: {
        Row: {
          content_id: string | null
          email_sent: boolean
          id: string
          is_read: boolean
          message: string
          sent_at: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          email_sent?: boolean
          id?: string
          is_read?: boolean
          message: string
          sent_at?: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          email_sent?: boolean
          id?: string
          is_read?: boolean
          message?: string
          sent_at?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_notifications_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "community_content"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_verses: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          language: string
          text: string
          user_id: string
          verse: number
          verse_id: string
          version: string
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          language: string
          text: string
          user_id: string
          verse: number
          verse_id: string
          version: string
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          language?: string
          text?: string
          user_id?: string
          verse?: number
          verse_id?: string
          version?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          prayer_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          prayer_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          prayer_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          message: string | null
          recurrence_pattern: string | null
          scheduled_for: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          message?: string | null
          recurrence_pattern?: string | null
          scheduled_for: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          message?: string | null
          recurrence_pattern?: string | null
          scheduled_for?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          bible_version: string | null
          created_at: string
          language: string | null
          notification_preferences: Json | null
          reminder_times: Json | null
          theme: string | null
          theme_mode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bible_version?: string | null
          created_at?: string
          language?: string | null
          notification_preferences?: Json | null
          reminder_times?: Json | null
          theme?: string | null
          theme_mode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bible_version?: string | null
          created_at?: string
          language?: string | null
          notification_preferences?: Json | null
          reminder_times?: Json | null
          theme?: string | null
          theme_mode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
