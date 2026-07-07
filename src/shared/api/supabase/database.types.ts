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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brand: {
        Row: {
          active: boolean
          group_id: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          active?: boolean
          group_id?: string
          id?: string
          name?: string
          slug?: string
        }
        Update: {
          active?: boolean
          group_id?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_groupId_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "brand_group"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_group: {
        Row: {
          active: boolean
          display_order: number
          id: string
          name: string
          slug: string
        }
        Insert: {
          active?: boolean
          display_order?: number
          id?: string
          name?: string
          slug?: string
        }
        Update: {
          active?: boolean
          display_order?: number
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      service_zone: {
        Row: {
          active: boolean
          display_order: number
          id: string
          name: string
          slug: string
        }
        Insert: {
          active?: boolean
          display_order: number
          id?: string
          name: string
          slug: string
        }
        Update: {
          active?: boolean
          display_order?: number
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      specific_issue: {
        Row: {
          active: boolean
          id: string
          name: string
          slug: string
          unit_id: string
        }
        Insert: {
          active?: boolean
          id?: string
          name: string
          slug?: string
          unit_id: string
        }
        Update: {
          active?: boolean
          id?: string
          name?: string
          slug?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "specific_issue_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      technician: {
        Row: {
          active: boolean
          alias: string
          can_service_built_in: boolean
          can_service_stacked_dryer: boolean
          can_service_stacked_washer: boolean
          commercial: boolean
          gas: boolean
          home_zip_code: string
          id: string
          jobs_per_day: string
          name: string
          notes: string | null
        }
        Insert: {
          active?: boolean
          alias: string
          can_service_built_in: boolean
          can_service_stacked_dryer: boolean
          can_service_stacked_washer: boolean
          commercial: boolean
          gas: boolean
          home_zip_code?: string
          id?: string
          jobs_per_day?: string
          name: string
          notes?: string | null
        }
        Update: {
          active?: boolean
          alias?: string
          can_service_built_in?: boolean
          can_service_stacked_dryer?: boolean
          can_service_stacked_washer?: boolean
          commercial?: boolean
          gas?: boolean
          home_zip_code?: string
          id?: string
          jobs_per_day?: string
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      technician_ignore_list: {
        Row: {
          brand_id: string | null
          id: string
          specific_issue_id: string | null
          technician_id: string
          unit_id: string | null
        }
        Insert: {
          brand_id?: string | null
          id?: string
          specific_issue_id?: string | null
          technician_id: string
          unit_id?: string | null
        }
        Update: {
          brand_id?: string | null
          id?: string
          specific_issue_id?: string | null
          technician_id?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_ignore_list_brandId_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_ignore_list_specific_issue_id_fkey"
            columns: ["specific_issue_id"]
            isOneToOne: false
            referencedRelation: "specific_issue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_ignore_list_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_ignore_list_unitId_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_service_zone: {
        Row: {
          technician_id: string
          zone_id: string
        }
        Insert: {
          technician_id: string
          zone_id: string
        }
        Update: {
          technician_id?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_service_zone_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_service_zone_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "service_zone"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_skill_set: {
        Row: {
          brand_group_id: string | null
          commercial: boolean
          id: string
          specific_issue_id: string | null
          technician_id: string
          unit_id: string
        }
        Insert: {
          brand_group_id?: string | null
          commercial?: boolean
          id?: string
          specific_issue_id?: string | null
          technician_id?: string
          unit_id?: string
        }
        Update: {
          brand_group_id?: string | null
          commercial?: boolean
          id?: string
          specific_issue_id?: string | null
          technician_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_skill_set_brand_group_id_fkey"
            columns: ["brand_group_id"]
            isOneToOne: false
            referencedRelation: "brand_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_set_brandGroupId_fkey"
            columns: ["brand_group_id"]
            isOneToOne: false
            referencedRelation: "brand_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_set_specific_issue_id_fkey"
            columns: ["specific_issue_id"]
            isOneToOne: false
            referencedRelation: "specific_issue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_set_specificIssueId_fkey"
            columns: ["specific_issue_id"]
            isOneToOne: false
            referencedRelation: "specific_issue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_set_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_set_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_set_unitId_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      unit: {
        Row: {
          active: boolean
          can_be_commercial: boolean
          can_be_gas: boolean
          can_be_stacked: boolean
          display_order: number
          id: string
          is_built_in: boolean
          name: string
          slug: string
        }
        Insert: {
          active?: boolean
          can_be_commercial?: boolean
          can_be_gas?: boolean
          can_be_stacked?: boolean
          display_order?: number
          id?: string
          is_built_in?: boolean
          name?: string
          slug?: string
        }
        Update: {
          active?: boolean
          can_be_commercial?: boolean
          can_be_gas?: boolean
          can_be_stacked?: boolean
          display_order?: number
          id?: string
          is_built_in?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          active: boolean
          alias: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          alias?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          alias?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      app_role_rank: {
        Args: { role: Database["public"]["Enums"]["app_role"] }
        Returns: number
      }
      current_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      current_user_has_role: {
        Args: { required_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      update_technician_skills: {
        Args: {
          p_added_skills?: Json
          p_removed_skill_ids?: string[]
          p_technician_id: string
        }
        Returns: {
          brand_group_id: string | null
          commercial: boolean
          id: string
          specific_issue_id: string | null
          technician_id: string
          unit_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "technician_skill_set"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      app_role: "user" | "secondary_admin" | "main_admin" | "owner"
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
      app_role: ["user", "secondary_admin", "main_admin", "owner"],
    },
  },
} as const
