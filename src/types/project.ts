export type ProjectLink = { type: 'demo' | 'repo'; url: string; label?: string }
export type ProjectImage = { src: string; alt: string }

export type ProjectCategory = 'web' | 'mobile'

export type Project = {
  id: string
  title: string
  description: string
  status?: 'Completed' | 'In Progress' | 'Coming Soon' | 'Archived'
  techs: string[]
  links: ProjectLink[]
  images: ProjectImage[]
  category?: ProjectCategory
  categories?: ProjectCategory[]
}