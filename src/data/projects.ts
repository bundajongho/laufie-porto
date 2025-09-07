import type { Project } from '@/types/project'

// Ambil semua gambar sebagai URL bundling Vite (update sesuai deprecation)
const images = import.meta.glob('/src/assets/images/projects/*', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

// Map: filename & basename → URL
const imageByKey: Record<string, string> = {}
for (const [path, url] of Object.entries(images)) {
  const file = path.split('/').pop()! // contoh: project-2.jpg
  const base = file.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '').toLowerCase()
  imageByKey[file.toLowerCase()] = url
  imageByKey[base] = url
}

/**
 * Resolve menjadi URL build jika ada.
 * - Jika file ditemukan di bundling: gunakan URL-nya.
 * - Jika TIDAK ditemukan: kembalikan string input apa adanya (agar 404 → fallback ditangani ImageWithFallback).
 * - Jika tidak ada input dan ada id yang match basename: pakai itu.
 * - Jika tetap tidak ketemu: kembalikan '' (biar komponen fallback jalan).
 */
function resolveImage(input?: string, id?: string): string {
  if (input) {
    const file = input.split('/').pop()!.toLowerCase()
    const base = file.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
    return imageByKey[file] ?? imageByKey[base] ?? input
  }
  if (id) {
    const base = id.toLowerCase()
    return imageByKey[base] ?? ''
  }
  return ''
}

export const projects: Project[] = [
  {
    id: 'face-recognition',
    title: 'AURA (Automated Unfound Recognition & Alert)',
    description:
      'An AI-powered face recognition program that utilizes pre-trained models to generate and compare face embeddings from input images and CCTV footage, assisting in identifying and locating missing persons in public areas.',
    status: 'Completed',
    techs: ['Python', 'InsightFace', 'MiniFASNet', 'FFmpeg'],
    categories: ['web'], // NEW
    links: [
      { type: 'demo', url: '', label: 'View Project' },
      { type: 'repo', url: '', label: 'Source Code' },
    ],
    images: [{ src: resolveImage('project-1.png', 'ecommerce-dashboard'), alt: 'Project 1' }],
  },
  {
    id: 'attendence-app',
    title: 'UIN Attendence App',
    description:
      'A lightweight web application for managing attendance of teaching assistants, featuring meeting material uploads, documentation tracking, and responsive design for ease of use.',
    status: 'In Progress',
    techs: ['React', 'Tailwind CSS', 'JavaScript', 'Next.js'],
    categories: ['web', 'mobile'], // NEW (ubah ke 'mobile' bila nanti memang mobile)
    links: [
      { type: 'demo', url: '' },
      { type: 'repo', url: '' },
    ],
    images: [{ src: resolveImage('project-2.jpg', 'attendence-app'), alt: 'Project 2' }],
  },
  {
    id: 'classifier-model',
    title: 'Naive Bayes Classifier from Scratch',
    description:
      'A custom Multinomial Naive Bayes classifier built from scratch in Python with an interactive GUI for classification tasks.',
    status: 'Completed',
    techs: ['Python', 'Numpy', 'Pandas', 'Seaborn', 'Tkinter'],
    categories: ['web'], // NEW
    links: [
      { type: 'demo', url: '' },
      { type: 'repo', url: '' },
    ],
    images: [{ src: resolveImage('project-3.jpg', 'portfolio'), alt: 'Project 3' }],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    description:
      'A personal portfolio website showcasing creative work with smooth animations, dark mode support, and responsive design.',
    status: 'Coming Soon',
    techs: ['React', 'Motion', 'Tailwind CSS', 'Vite'],
    categories: ['web', 'mobile'], // NEW
    links: [
      { type: 'demo', url: '' },
      { type: 'repo', url: '' },
    ],
    images: [{ src: resolveImage('project-4.jpg', 'portfolio'), alt: 'Project 3' }],
  },
]