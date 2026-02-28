export interface PropertyImageEntity {
  id?: string
  property_id: string
  public_url?: string

  filename: string
  file_size?: number
  mime_type?: string
  width?: number
  height?: number

  display_order?: number
  is_primary?: boolean

  alt_text?: string
  caption?: string

  created_at?: string
}