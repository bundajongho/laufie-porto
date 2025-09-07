import { Home, UserRound, Code2, Package, Trophy, Mail } from 'lucide-react'
import { SECTION_IDS } from '@/lib/constants'

export const navItems = [
  { id: SECTION_IDS.home, label: 'Home', icon: Home },
  { id: SECTION_IDS.about, label: 'About', icon: UserRound },
  { id: SECTION_IDS.skills, label: 'Skills', icon: Code2 },
  { id: SECTION_IDS.projects, label: 'Projects', icon: Package },
  { id: SECTION_IDS.achievements, label: 'Achievements', icon: Trophy },
  { id: SECTION_IDS.contact, label: 'Contact', icon: Mail },
] as const