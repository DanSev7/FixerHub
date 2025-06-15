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
      admin_auth: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          job_id: string
          professional_id: string
          scheduled_date: string | null
          status: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          job_id: string
          professional_id: string
          scheduled_date?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          job_id?: string
          professional_id?: string
          scheduled_date?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          category_id: string
          category_name: string
          created_at: string | null
        }
        Insert: {
          category_id?: string
          category_name: string
          created_at?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string
          created_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          created_at: string | null
          email: string
          otp: string
        }
        Insert: {
          created_at?: string | null
          email: string
          otp: string
        }
        Update: {
          created_at?: string | null
          email?: string
          otp?: string
        }
        Relationships: []
      }
      job_sub_category_pricing: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          price: number
          sub_category_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          price: number
          sub_category_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          price?: number
          sub_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_sub_category_pricing_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "professional_jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "job_sub_category_pricing_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["sub_category_id"]
          },
        ]
      }
      medicines: {
        Row: {
          category: string
          created_at: string
          expiry_date: string
          id: string
          min_stock: number
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date: string
          id?: string
          min_stock?: number
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string
          id?: string
          min_stock?: number
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          is_read: boolean | null
          message_id: string
          message_text: string
          receiver_id: string | null
          sender_id: string | null
          timestamp: string | null
        }
        Insert: {
          is_read?: boolean | null
          message_id?: string
          message_text: string
          receiver_id?: string | null
          sender_id?: string | null
          timestamp?: string | null
        }
        Update: {
          is_read?: boolean | null
          message_id?: string
          message_text?: string
          receiver_id?: string | null
          sender_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      professional_documents: {
        Row: {
          created_at: string | null
          document_id: string
          national_id_document_url: string | null
          updated_at: string | null
          user_id: string | null
          verification_otp: string | null
          verification_status: string | null
          verified_name: string | null
          work_clearance_document_url: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string
          national_id_document_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_otp?: string | null
          verification_status?: string | null
          verified_name?: string | null
          work_clearance_document_url?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string
          national_id_document_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_otp?: string | null
          verification_status?: string | null
          verified_name?: string | null
          work_clearance_document_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      professional_jobs: {
        Row: {
          category_id: string | null
          category_price: number
          created_at: string | null
          is_active: boolean | null
          job_id: string
          location: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          category_price: number
          created_at?: string | null
          is_active?: boolean | null
          job_id?: string
          location?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          category_price?: number
          created_at?: string | null
          is_active?: boolean | null
          job_id?: string
          location?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "professional_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string | null
          professional_id: string | null
          rating: number
          review_id: string
          review_text: string | null
          timestamp: string | null
        }
        Insert: {
          client_id?: string | null
          professional_id?: string | null
          rating: number
          review_id?: string
          review_text?: string | null
          timestamp?: string | null
        }
        Update: {
          client_id?: string | null
          professional_id?: string | null
          rating?: number
          review_id?: string
          review_text?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reviews_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          id: string
          medicine_id: string
          medicine_name: string
          price: number
          quantity: number
          sale_date: string
          sale_time: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          medicine_id: string
          medicine_name: string
          price: number
          quantity: number
          sale_date: string
          sale_time: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          medicine_id?: string
          medicine_name?: string
          price?: number
          quantity?: number
          sale_date?: string
          sale_time?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_categories: {
        Row: {
          category_id: string | null
          created_at: string | null
          sub_category_id: string
          sub_category_name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          sub_category_id?: string
          sub_category_name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          sub_category_id?: string
          sub_category_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      user_bots: {
        Row: {
          ai_prompt: string | null
          bot_name: string | null
          created_at: string
          id: string
          telegram_bot_token: string
          updated_at: string
          user_id: string
          webhook_secret: string | null
        }
        Insert: {
          ai_prompt?: string | null
          bot_name?: string | null
          created_at?: string
          id?: string
          telegram_bot_token: string
          updated_at?: string
          user_id: string
          webhook_secret?: string | null
        }
        Update: {
          ai_prompt?: string | null
          bot_name?: string | null
          created_at?: string
          id?: string
          telegram_bot_token?: string
          updated_at?: string
          user_id?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          is_verified: boolean | null
          location: string | null
          password_hash: string
          phone_number: string
          role: string
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          is_verified?: boolean | null
          location?: string | null
          password_hash: string
          phone_number: string
          role: string
          updated_at?: string | null
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          is_verified?: boolean | null
          location?: string | null
          password_hash?: string
          phone_number?: string
          role?: string
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_job_price: {
        Args: { job_uuid: string }
        Returns: number
      }
    }
    Enums: {
      user_role: "client" | "professional"
      verification_status: "pending" | "verified" | "failed"
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
    Enums: {
      user_role: ["client", "professional"],
      verification_status: ["pending", "verified", "failed"],
    },
  },
} as const
