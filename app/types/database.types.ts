export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          created_at: string | null
          id: string
          scheduled_for: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          scheduled_for?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          scheduled_for?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor: string | null
          created_at: string | null
          id: string
          meta: Json | null
        }
        Insert: {
          action: string
          actor?: string | null
          created_at?: string | null
          id?: string
          meta?: Json | null
        }
        Update: {
          action?: string
          actor?: string | null
          created_at?: string | null
          id?: string
          meta?: Json | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string
          title: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url: string
          title?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string
          title?: string | null
        }
        Relationships: []
      }
      kyanda_callback: {
        Row: {
          amount: number | null
          created_at: string
          data: Json | null
          destination_msisdn: string | null
          id: number
          merchant_id: string | null
          message: string | null
          mpesa_receipt: string | null
          status: string | null
          status_code: string | null
          transaction_ref: string | null
          transaction_ts: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          data?: Json | null
          destination_msisdn?: string | null
          id?: number
          merchant_id?: string | null
          message?: string | null
          mpesa_receipt?: string | null
          status?: string | null
          status_code?: string | null
          transaction_ref?: string | null
          transaction_ts?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          data?: Json | null
          destination_msisdn?: string | null
          id?: number
          merchant_id?: string | null
          message?: string | null
          mpesa_receipt?: string | null
          status?: string | null
          status_code?: string | null
          transaction_ref?: string | null
          transaction_ts?: string | null
        }
        Relationships: []
      }
      kyanda_error_codes: {
        Row: {
          code: string
          description: string | null
          severity: string | null
          short_message: string | null
        }
        Insert: {
          code: string
          description?: string | null
          severity?: string | null
          short_message?: string | null
        }
        Update: {
          code?: string
          description?: string | null
          severity?: string | null
          short_message?: string | null
        }
        Relationships: []
      }
      kyanda_notification_failures: {
        Row: {
          created_at: string
          error: string | null
          fcm_token: string | null
          id: number
          kyanda_callback_id: number
        }
        Insert: {
          created_at?: string
          error?: string | null
          fcm_token?: string | null
          id?: never
          kyanda_callback_id: number
        }
        Update: {
          created_at?: string
          error?: string | null
          fcm_token?: string | null
          id?: never
          kyanda_callback_id?: number
        }
        Relationships: []
      }
      kyanda_notifications: {
        Row: {
          id: number
          kyanda_callback_id: number
          notified_at: string
        }
        Insert: {
          id?: never
          kyanda_callback_id: number
          notified_at?: string
        }
        Update: {
          id?: never
          kyanda_callback_id?: number
          notified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_kyanda_callback"
            columns: ["kyanda_callback_id"]
            isOneToOne: false
            referencedRelation: "kyanda_callback"
            referencedColumns: ["id"]
          },
        ]
      }
      mpesa_payments: {
        Row: {
          account_reference: string
          amount: number
          business_shortcode: string
          callback_raw: Json | null
          callback_url: string
          checkout_request_id: string | null
          created_at: string
          customer_message: string | null
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          paid_amount: number | null
          party_a_msisdn: string
          party_b_shortcode: string
          payer_msisdn: string | null
          phone_number_msisdn: string
          response_code: string | null
          response_description: string | null
          result_code: number | null
          result_desc: string | null
          status: Database["public"]["Enums"]["payment_status_enum"]
          transaction_desc: string | null
          transaction_time: string | null
          transaction_type: string
          updated_at: string
        }
        Insert: {
          account_reference: string
          amount: number
          business_shortcode?: string
          callback_raw?: Json | null
          callback_url: string
          checkout_request_id?: string | null
          created_at?: string
          customer_message?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          paid_amount?: number | null
          party_a_msisdn: string
          party_b_shortcode?: string
          payer_msisdn?: string | null
          phone_number_msisdn: string
          response_code?: string | null
          response_description?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: Database["public"]["Enums"]["payment_status_enum"]
          transaction_desc?: string | null
          transaction_time?: string | null
          transaction_type?: string
          updated_at?: string
        }
        Update: {
          account_reference?: string
          amount?: number
          business_shortcode?: string
          callback_raw?: Json | null
          callback_url?: string
          checkout_request_id?: string | null
          created_at?: string
          customer_message?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          paid_amount?: number | null
          party_a_msisdn?: string
          party_b_shortcode?: string
          payer_msisdn?: string | null
          phone_number_msisdn?: string
          response_code?: string | null
          response_description?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: Database["public"]["Enums"]["payment_status_enum"]
          transaction_desc?: string | null
          transaction_time?: string | null
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      mpesa_stkpush_events: {
        Row: {
          account_reference: string | null
          amount: number | null
          app_transaction_id: string | null
          archived: boolean
          business_name: string
          callback_payload: Json | null
          checkout_request_id: string | null
          created_at: string
          currency: string | null
          customer_message: string | null
          id: string
          immediate_response_payload: Json | null
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          notes: string | null
          phone_number: string | null
          provider: string | null
          read: boolean | null
          request_payload: Json | null
          response_code: string | null
          response_description: string | null
          response_processed_at: string | null
          retry_count: number
          short_code: string | null
          status: string
          transaction_date: string | null
          transaction_desc: string | null
          transaction_type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_reference?: string | null
          amount?: number | null
          app_transaction_id?: string | null
          archived?: boolean
          business_name?: string
          callback_payload?: Json | null
          checkout_request_id?: string | null
          created_at?: string
          currency?: string | null
          customer_message?: string | null
          id?: string
          immediate_response_payload?: Json | null
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          notes?: string | null
          phone_number?: string | null
          provider?: string | null
          read?: boolean | null
          request_payload?: Json | null
          response_code?: string | null
          response_description?: string | null
          response_processed_at?: string | null
          retry_count?: number
          short_code?: string | null
          status?: string
          transaction_date?: string | null
          transaction_desc?: string | null
          transaction_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_reference?: string | null
          amount?: number | null
          app_transaction_id?: string | null
          archived?: boolean
          business_name?: string
          callback_payload?: Json | null
          checkout_request_id?: string | null
          created_at?: string
          currency?: string | null
          customer_message?: string | null
          id?: string
          immediate_response_payload?: Json | null
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          notes?: string | null
          phone_number?: string | null
          provider?: string | null
          read?: boolean | null
          request_payload?: Json | null
          response_code?: string | null
          response_description?: string | null
          response_processed_at?: string | null
          retry_count?: number
          short_code?: string | null
          status?: string
          transaction_date?: string | null
          transaction_desc?: string | null
          transaction_type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          additional_numbers: Json | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          metadata: Json | null
          phone_number: string | null
          preferred_provider: string | null
          updated_at: string | null
        }
        Insert: {
          additional_numbers?: Json | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          metadata?: Json | null
          phone_number?: string | null
          preferred_provider?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_numbers?: Json | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          metadata?: Json | null
          phone_number?: string | null
          preferred_provider?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      telcos: {
        Row: {
          active: boolean
          code: Database["public"]["Enums"]["telco_enum"]
          display_name: string
          vendor_name: string
        }
        Insert: {
          active?: boolean
          code: Database["public"]["Enums"]["telco_enum"]
          display_name: string
          vendor_name: string
        }
        Update: {
          active?: boolean
          code?: Database["public"]["Enums"]["telco_enum"]
          display_name?: string
          vendor_name?: string
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          created_at: string
          fcm_token: string
          id: number
          phone_number: string
          platform: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          fcm_token: string
          id?: never
          phone_number: string
          platform?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          fcm_token?: string
          id?: never
          phone_number?: string
          platform?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_transactions_for_user: {
        Args: { p_days?: number; p_phone: string; p_user: string }
        Returns: number
      }
      is_admin: { Args: { uid: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      auth_provider: "password" | "phone" | "google"
      currency_code: "KES"
      currency_enum: "KES"
      payment_provider: "MPESA"
      payment_status_enum:
        | "initiated"
        | "awaiting_customer"
        | "paid"
        | "cancelled"
        | "timed_out"
        | "failed"
        | "reversed"
        | "refunded"
        | "unknown"
      telco_enum: "SAFARICOM" | "AIRTEL" | "TELKOM" | "EQUITEL" | "FAIBA"
      txn_status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "EXPIRED"
      vend_status_enum:
        | "submitted"
        | "pending"
        | "success"
        | "failed"
        | "reversed"
        | "unknown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      auth_provider: ["password", "phone", "google"],
      currency_code: ["KES"],
      currency_enum: ["KES"],
      payment_provider: ["MPESA"],
      payment_status_enum: [
        "initiated",
        "awaiting_customer",
        "paid",
        "cancelled",
        "timed_out",
        "failed",
        "reversed",
        "refunded",
        "unknown",
      ],
      telco_enum: ["SAFARICOM", "AIRTEL", "TELKOM", "EQUITEL", "FAIBA"],
      txn_status: ["PENDING", "SUCCESS", "FAILED", "CANCELLED", "EXPIRED"],
      vend_status_enum: [
        "submitted",
        "pending",
        "success",
        "failed",
        "reversed",
        "unknown",
      ],
    },
  },
} as const
