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
  public: {
    Tables: {
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
      jobs: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string
          job_type: string
          next_run: string | null
          payload: Json
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          job_type: string
          next_run?: string | null
          payload: Json
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          job_type?: string
          next_run?: string | null
          payload?: Json
        }
        Relationships: []
      }
      kyanda_callback: {
        Row: {
          created_at: string
          data: Json | null
          id: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: number
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
      mpesa_callback: {
        Row: {
          created_at: string
          data: Json | null
          id: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          metadata: Json | null
          phone: string | null
          phone_verified_at: string | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          metadata?: Json | null
          phone?: string | null
          phone_verified_at?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          metadata?: Json | null
          phone?: string | null
          phone_verified_at?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          id: string
          kind: string
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id: string
          kind: string
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          kind?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          amount_integer: number
          biller_receipt: string | null
          canonical_status: string | null
          category: string | null
          checkout_request_id: string | null
          created_at: string | null
          currency: string
          description: string | null
          direction: string | null
          external_id: string | null
          id: string
          initiator_phone: string
          kyanda_message: string | null
          kyanda_status_code: string | null
          kyanda_transaction_ref: string | null
          merchant_request_id: string | null
          meta: Json | null
          mpesa_receipt: string | null
          network: string
          parent_transaction_id: string | null
          payer_first_name: string | null
          payer_last_name: string | null
          payer_middle_name: string | null
          provider: string
          provider_status_code: string | null
          recipient_phone: string
          reference: string | null
          result_code: number | null
          result_desc: string | null
          status: string
          telco_reference: string | null
          transaction_date: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          amount_integer: number
          biller_receipt?: string | null
          canonical_status?: string | null
          category?: string | null
          checkout_request_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          direction?: string | null
          external_id?: string | null
          id?: string
          initiator_phone: string
          kyanda_message?: string | null
          kyanda_status_code?: string | null
          kyanda_transaction_ref?: string | null
          merchant_request_id?: string | null
          meta?: Json | null
          mpesa_receipt?: string | null
          network: string
          parent_transaction_id?: string | null
          payer_first_name?: string | null
          payer_last_name?: string | null
          payer_middle_name?: string | null
          provider: string
          provider_status_code?: string | null
          recipient_phone: string
          reference?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: string
          telco_reference?: string | null
          transaction_date?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          amount_integer?: number
          biller_receipt?: string | null
          canonical_status?: string | null
          category?: string | null
          checkout_request_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          direction?: string | null
          external_id?: string | null
          id?: string
          initiator_phone?: string
          kyanda_message?: string | null
          kyanda_status_code?: string | null
          kyanda_transaction_ref?: string | null
          merchant_request_id?: string | null
          meta?: Json | null
          mpesa_receipt?: string | null
          network?: string
          parent_transaction_id?: string | null
          payer_first_name?: string | null
          payer_last_name?: string | null
          payer_middle_name?: string | null
          provider?: string
          provider_status_code?: string | null
          recipient_phone?: string
          reference?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: string
          telco_reference?: string | null
          transaction_date?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_parent"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "mv_failed_topups"
            referencedColumns: ["payment_id"]
          },
          {
            foreignKeyName: "fk_transactions_parent"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "mv_failed_topups"
            referencedColumns: ["topup_id"]
          },
          {
            foreignKeyName: "fk_transactions_parent"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_daily_payments: {
        Row: {
          day: string | null
          payments_count: number | null
          payments_total_kes: number | null
        }
        Relationships: []
      }
      mv_failed_topups: {
        Row: {
          kyanda_message: string | null
          kyanda_status_code: string | null
          parent_transaction_id: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_id: string | null
          topup_amount: number | null
          topup_date: string | null
          topup_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_parent"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "mv_failed_topups"
            referencedColumns: ["payment_id"]
          },
          {
            foreignKeyName: "fk_transactions_parent"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "mv_failed_topups"
            referencedColumns: ["topup_id"]
          },
          {
            foreignKeyName: "fk_transactions_parent"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      claim_transactions_for_user: {
        Args: { p_days?: number; p_phone: string; p_user: string }
        Returns: number
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      auth_provider: "password" | "phone" | "google"
      currency_code: "KES"
      payment_provider: "MPESA"
      txn_status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "EXPIRED"
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
  public: {
    Enums: {
      auth_provider: ["password", "phone", "google"],
      currency_code: ["KES"],
      payment_provider: ["MPESA"],
      txn_status: ["PENDING", "SUCCESS", "FAILED", "CANCELLED", "EXPIRED"],
    },
  },
} as const
