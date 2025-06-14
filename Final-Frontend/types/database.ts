export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          username: string;
          email: string;
          phone_number: string;
          password_hash: string;
          role: 'client' | 'professional';
          is_verified: boolean;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          username: string;
          email: string;
          phone_number: string;
          password_hash: string;
          role: 'client' | 'professional';
          is_verified?: boolean;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          username?: string;
          email?: string;
          phone_number?: string;
          password_hash?: string;
          role?: 'client' | 'professional';
          is_verified?: boolean;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      professional_documents: {
        Row: {
          document_id: string;
          user_id: string;
          national_id_document_url: string | null;
          work_clearance_document_url: string | null;
          verification_status: 'pending' | 'verified' | 'failed';
          verification_otp: string | null;
          verified_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          document_id?: string;
          user_id: string;
          national_id_document_url?: string | null;
          work_clearance_document_url?: string | null;
          verification_status?: 'pending' | 'verified' | 'failed';
          verification_otp?: string | null;
          verified_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          document_id?: string;
          user_id?: string;
          national_id_document_url?: string | null;
          work_clearance_document_url?: string | null;
          verification_status?: 'pending' | 'verified' | 'failed';
          verification_otp?: string | null;
          verified_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          category_id: string;
          category_name: string;
          created_at: string;
        };
        Insert: {
          category_id?: string;
          category_name: string;
          created_at?: string;
        };
        Update: {
          category_id?: string;
          category_name?: string;
          created_at?: string;
        };
      };
      sub_categories: {
        Row: {
          sub_category_id: string;
          category_id: string;
          sub_category_name: string;
          created_at: string;
        };
        Insert: {
          sub_category_id?: string;
          category_id: string;
          sub_category_name: string;
          created_at?: string;
        };
        Update: {
          sub_category_id?: string;
          category_id?: string;
          sub_category_name?: string;
          created_at?: string;
        };
      };
      professional_jobs: {
        Row: {
          job_id: string;
          user_id: string;
          category_id: string;
          category_price: number;
          location: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          job_id?: string;
          user_id: string;
          category_id: string;
          category_price: number;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          job_id?: string;
          user_id?: string;
          category_id?: string;
          category_price?: number;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_sub_category_pricing: {
        Row: {
          id: string;
          job_id: string;
          sub_category_id: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          sub_category_id: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          sub_category_id?: string;
          price?: number;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          message_id: string;
          sender_id: string;
          receiver_id: string;
          message_text: string;
          timestamp: string;
          is_read: boolean;
        };
        Insert: {
          message_id?: string;
          sender_id: string;
          receiver_id: string;
          message_text: string;
          timestamp?: string;
          is_read?: boolean;
        };
        Update: {
          message_id?: string;
          sender_id?: string;
          receiver_id?: string;
          message_text?: string;
          timestamp?: string;
          is_read?: boolean;
        };
      };
      reviews: {
        Row: {
          review_id: string;
          client_id: string;
          professional_id: string;
          rating: number;
          review_text: string | null;
          timestamp: string;
        };
        Insert: {
          review_id?: string;
          client_id: string;
          professional_id: string;
          rating: number;
          review_text?: string | null;
          timestamp?: string;
        };
        Update: {
          review_id?: string;
          client_id?: string;
          professional_id?: string;
          rating?: number;
          review_text?: string | null;
          timestamp?: string;
        };
      };
       email_verifications: {
        Row: {
          email: string;
          otp: string;
          created_at: string; // timestamp with timezone is typically string in JS
        };
        Insert: {
          email: string;
          otp: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          otp?: string;
          created_at?: string;
        };
      };

    };
  };
}