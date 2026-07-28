export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          active_before_archive: boolean | null
          alias: string
          archived_at: string | null
          archived_by: string | null
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
          active_before_archive?: boolean | null
          alias: string
          archived_at?: string | null
          archived_by?: string | null
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
          active_before_archive?: boolean | null
          alias?: string
          archived_at?: string | null
          archived_by?: string | null
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
        Relationships: [
          {
            foreignKeyName: "technician_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
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
          active_before_archive: boolean | null
          archived_at: string | null
          archived_by: string | null
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
          active_before_archive?: boolean | null
          archived_at?: string | null
          archived_by?: string | null
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
          active_before_archive?: boolean | null
          archived_at?: string | null
          archived_by?: string | null
          can_be_commercial?: boolean
          can_be_gas?: boolean
          can_be_stacked?: boolean
          display_order?: number
          id?: string
          is_built_in?: boolean
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_management_audit: {
        Row: {
          actor_id: string
          after_state: Json | null
          before_state: Json | null
          created_at: string
          error_message: string | null
          id: string
          operation: string
          outcome: string
          requires_reconciliation: boolean
          target_user_id: string | null
        }
        Insert: {
          actor_id: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          operation: string
          outcome: string
          requires_reconciliation?: boolean
          target_user_id?: string | null
        }
        Update: {
          actor_id?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          operation?: string
          outcome?: string
          requires_reconciliation?: boolean
          target_user_id?: string | null
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          active: boolean
          active_before_archive: boolean | null
          alias: string
          archived_at: string | null
          archived_by: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          active_before_archive?: boolean | null
          alias: string
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          active_before_archive?: boolean | null
          alias?: string
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
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
      archive_technician: { Args: { p_technician_id: string }; Returns: string }
      archive_unit: { Args: { p_unit_id: string }; Returns: string }
      archive_user: { Args: { p_user_id: string }; Returns: string }
      create_technician: {
        Args: {
          p_ignore_items?: Json
          p_profile: Json
          p_skills: Json
          p_zone_ids: string[]
        }
        Returns: {
          active: boolean
          active_before_archive: boolean | null
          alias: string
          archived_at: string | null
          archived_by: string | null
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
        SetofOptions: {
          from: "*"
          to: "technician"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      current_user_has_role: {
        Args: { required_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      purge_technician: { Args: { p_technician_id: string }; Returns: string }
      purge_unit: { Args: { p_unit_id: string }; Returns: string }
      purge_user: { Args: { p_user_id: string }; Returns: string }
      restore_technician: { Args: { p_technician_id: string }; Returns: string }
      restore_unit: { Args: { p_unit_id: string }; Returns: string }
      restore_user: { Args: { p_user_id: string }; Returns: string }
      update_technician_ignore_list: {
        Args: {
          p_added_items?: Json
          p_removed_item_ids?: string[]
          p_technician_id: string
        }
        Returns: {
          brand_id: string | null
          id: string
          specific_issue_id: string | null
          technician_id: string
          unit_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "technician_ignore_list"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_technician_service_zones: {
        Args: {
          p_added_zone_ids?: string[]
          p_removed_zone_ids?: string[]
          p_technician_id: string
        }
        Returns: {
          technician_id: string
          zone_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "technician_service_zone"
          isOneToOne: false
          isSetofReturn: true
        }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["user", "secondary_admin", "main_admin", "owner"],
    },
  },
} as const


