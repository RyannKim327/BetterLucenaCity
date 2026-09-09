export interface Announcement {
  id: number
  title: string
  content: string
  date_added: string
  data_source?: string[] | null
}
