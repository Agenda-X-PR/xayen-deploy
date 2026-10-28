import type { LucideIcon } from 'lucide-react'
import { Layers3, Radio, ShieldCheck, WalletCards } from 'lucide-react'

export type ProjectCategory = 'Payments' | 'Security'

export interface Project {
  number: string
  name: string
  eyebrow: string
  description: string
  contribution: string
  tech: string[]
  category: ProjectCategory
  icon: LucideIcon
  repoUrl: string | null
  liveUrl?: string
}

export const projects: Project[] = [
  {
    number: '01',
    name: 'ALATPay Java SDK',
    eyebrow: 'PAYMENTS / JAVA',
    description: 'A community-built Java client for ALAT Pay transactions and settlement workflows.',
    contribution: 'Designed and built the entire SDK solo: config, client, services, exception hierarchy, 5 unit tests, CI.',
    tech: ['Java 21+', 'Maven', 'MockWebServer tests'],
    category: 'Payments',
    icon: WalletCards,
    repoUrl: 'https://github.com/Agenda-X-PR/alatpay-java-sdk',
  },
  {
    number: '02',
    name: 'Webhook Relay',
    eyebrow: 'BACKEND / WEBHOOKS',
    description: 'A payment webhook receiver with signature verification, idempotency, and automatic retries.',
    contribution: 'Built the full service solo: FastAPI endpoints, HMAC verification, retry worker with exponential backoff, 28 tests, deployed on Render.',
    tech: ['Python 3.10+', 'FastAPI', 'Pytest', 'HMAC-SHA256'],
    category: 'Payments',
    icon: Radio,
    repoUrl: 'https://github.com/Agenda-X-PR/webhook-relay',
    liveUrl: 'https://webhook-relay-xxvu.onrender.com/docs',
  },
  {
    number: '03',
    name: 'Multi-Gateway Java SDK',
    eyebrow: 'PAYMENTS / JAVA',
    description: 'One Java interface for initiating and verifying payments across four Nigerian gateways.',
    contribution: 'Built the unified interface and 4 gateway implementations, plus 23 MockWebServer tests and CI on Java 17 & 21.',
    tech: ['Java 17+', 'Maven', 'HttpClient', 'Jackson'],
    category: 'Payments',
    icon: Layers3,
    repoUrl: 'https://github.com/Agenda-X-PR/multi-gateway-java',
  },
  {
    number: '04',
    name: 'sec-triage',
    eyebrow: 'DEFENSIVE TOOLING',
    description: 'An offline Python CLI for first-pass triage of web and SSH logs using the standard library.',
    contribution: 'Wrote the HMAC-SHA512 verification and 25-test suite; teammate built the CLI parser.',
    tech: ['Python 3.9+', 'Standard library', 'unittest', 'CLI'],
    category: 'Security',
    icon: ShieldCheck,
    repoUrl: 'https://github.com/Agenda-X-PR/sec-triage',
  },
]

export const skillGroups = [
  {
    name: 'Cybersecurity',
    index: '01',
    skills: ['SIEM', 'Threat Hunting', 'IDS / IPS', 'HMAC', 'Log Analysis'],
  },
  {
    name: 'Backend',
    index: '02',
    skills: ['Python', 'Java', 'FastAPI', 'SQLAlchemy', 'Maven', 'JUnit'],
  },
  {
    name: 'Frontend',
    index: '03',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    name: 'DevOps & Tooling',
    index: '04',
    skills: ['GitHub Actions', 'Docker', 'Git', 'CI / CD'],
  },
] as const

export const contact = {
  name: 'Ekundayo Oyinkansola',
  email: 'ceo@agendax.com.ng',
  github: 'https://github.com/Agenda-X-PR',
  linkedin: 'https://linkedin.com/in/xayen',
  cvPath: '/cv/ekundayo-oyinkansola-cv-placeholder.pdf',
  cvIsPlaceholder: true,
}

export const webhookDemoUrl = 'https://webhook-relay-xxvu.onrender.com/docs'
