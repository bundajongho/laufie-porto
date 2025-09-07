import MotionProvider from '@/providers/MotionProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import DockNav from '@/components/nav/DockNav'
import TopProgressBar from '@/components/progress/TopProgressBar'
import CircleProgress from '@/components/progress/CircleProgress'
import ParticleField from '@/components/fx/ParticleField'
import CursorFollower from '@/components/fx/CursorFollower'
import HomeSection from '@/sections/HomeSection'
import AboutSection from '@/sections/AboutSection'
import SkillsSection from '@/sections/SkillsSection'
import ProjectsSection from '@/sections/ProjectsSection'
import AchievementsSection from '@/sections/AchievementsSection'
import ContactSection from '@/sections/ContactSection'
import useSectionObserver from '@/hooks/useSectionObserver'
import useHashSync from '@/hooks/useHashSync'
import { navItems } from '@/data/nav'
import AmbientBackground from '@/components/fx/AmbientBackground'  // ← tambahkan
import MobileTabNav from '@/components/nav/MobileNav'            // ← NEW

export default function App() {
  const ids = navItems.map((n) => n.id)
  const active = useSectionObserver(ids)
  useHashSync(active)

  return (
    <ThemeProvider>
      <ToastProvider>
        <MotionProvider>
          <TopProgressBar />
          {/* Background baru (paling belakang) */}
          <AmbientBackground />
          {/* Particle kecil (tetap) */}
          <ParticleField />
          <CursorFollower />
          <main>
            <HomeSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <AchievementsSection />
            <ContactSection />
          </main>

          {/* Mobile bottom nav */}
          <MobileTabNav activeId={active} className="md:hidden" />

          {/* Desktop dock nav */}
          <div className="hidden md:block">
            <DockNav activeId={active} />
          </div>

          <CircleProgress />
        </MotionProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}