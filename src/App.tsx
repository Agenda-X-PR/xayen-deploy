import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Command,
  Copy,
  Github,
  Mail,
  Menu,
  Radio,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { contact, projects, skillGroups, webhookDemoUrl } from './data/portfolio'
import type { ProjectCategory } from './data/portfolio'

const navItems = [
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
  { label: 'Stack', id: 'skills' },
  { label: 'Contact', id: 'contact' },
]

const filters = ['All work', 'Payments', 'Security'] as const
type Filter = (typeof filters)[number]


function Logo({ className, fallbackClass }: { className: string; fallbackClass?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <svg className={fallbackClass ?? className} viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 14 50 50M50 14 14 50" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      </svg>
    )
  }
  return <img className={className} src="/logo.png" alt="" onError={() => setFailed(true)} />
}

function trackPointer(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

function useTyped(words: string[]) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w = 0, i = 0, del = false
    const id = window.setInterval(() => {
      const word = words[w] ?? ''
      i += del ? -1 : 1
      setText(word.slice(0, i))
      if (!del && i === word.length) { del = true; i = word.length + 8 }
      else if (del && i <= 0) { del = false; w = (w + 1) % words.length; i = 0 }
    }, 70)
    return () => window.clearInterval(id)
  }, [words])
  return text
}

const roles = ['Cybersecurity Analyst', 'Full-Stack Developer', 'Defensive Tool Builder']

function CommandMenu({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    return () => previouslyFocused?.focus()
  }, [])

  const matches = navItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <div
      className="command-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="command-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-title"
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
          if (!focusable?.length) return
          const first = focusable.item(0)
          const last = focusable.item(focusable.length - 1)
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          }
        }}
      >
        <div className="command-search">
          <Command size={17} aria-hidden="true" />
          <label className="sr-only" id="command-title" htmlFor="command-input">Jump to a section</label>
          <input
            id="command-input"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Where do you want to go?"
          />
          <button className="icon-button command-close" onClick={onClose} aria-label="Close command menu" type="button">
            <X size={17} />
          </button>
        </div>
        <p className="command-label">JUMP TO</p>
        <div className="command-results">
          {matches.length ? matches.map((item) => (
            <a key={item.id} className="command-result" href={`#${item.id}`} onClick={onClose}>
              <span>{item.label}</span><ChevronRight size={15} aria-hidden="true" />
            </a>
          )) : <p className="command-empty">No section matches that search.</p>}
        </div>
        <div className="command-footer"><span>Navigate the portfolio</span><kbd>ESC</kbd><span>to close</span></div>
      </section>
    </div>
  )
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const Icon = project.icon
  return (
    <article className={`project-card reveal project-${project.number}`} onMouseMove={trackPointer}>
      <div className="project-topline">
        <span className="project-number">{project.number} / 04</span>
        <span className="project-category">{project.eyebrow}</span>
      </div>
      <div className="project-title-row">
        <span className="project-icon"><Icon size={19} strokeWidth={1.7} aria-hidden="true" /></span>
        <h3>{project.name}</h3>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-stack" aria-label={`Technology stack for ${project.name}`}>
        {project.tech.map((technology) => <span key={technology}>{technology}</span>)}
      </div>
      <p className="project-contribution"><span>CONTRIBUTION NOTE</span>{project.contribution}</p>
      <div className="project-links">
        {project.repoUrl ? (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-link">
            <Github size={15} aria-hidden="true" /> Source <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ) : (
          <span className="repo-pending" title="Add the verified repository URL in src/data/portfolio.ts">
            <Github size={15} aria-hidden="true" /> Repository URL not provided
          </span>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-link live-project-link">
            Live API docs <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}

function SignalConsole() {
  const [running, setRunning] = useState(false)
  const [sequence, setSequence] = useState(0)

  const runSequence = () => {
    if (running) return
    setRunning(true)
    window.setTimeout(() => {
      setRunning(false)
      setSequence((current) => current + 1)
    }, 720)
  }

  return (
    <div className="signal-console">
      <div className="console-topbar">
        <div className="console-brand"><span className="console-orbit"><Radio size={14} /></span> signal / 001</div>
        <span className="console-live"><span /> {running ? 'RUNNING' : 'SYSTEM READY'}</span>
      </div>
      <div className="console-visual" aria-hidden="true">
        <div className="visual-grid" />
        <svg className={`signal-map ${running ? 'signal-map-running' : ''}`} viewBox="0 0 420 260" fill="none">
          <path className="signal-line signal-line-a" d="M31 189 96 157 139 174 208 109 267 133 327 80 389 98" />
          <path className="signal-line signal-line-b" d="m49 80 55 43 58-18 64 63 69-12 67 53 34-21" />
          <path className="signal-line signal-line-c" d="m73 224 64-50 38-39 76-2 30-55 78-30" />
          <path className="signal-line signal-line-d" d="m31 189 18-109m47 77 8-34m35 51 20-69m49 4 15 58m44-25 25-56m35-24 8 102m54-55 0 32m-316 61 42-22m197-81 31 19" />
          {[['31','189'],['96','157'],['139','174'],['208','109'],['267','133'],['327','80'],['389','98'],['49','80'],['104','123'],['162','105'],['226','168'],['295','156'],['362','209'],['73','224'],['175','135'],['251','133'],['281','78'],['359','48']].map(([cx, cy], index) => (
            <circle key={`${cx}-${cy}`} className={`signal-node ${index % 4 === 0 ? 'signal-node-bright' : ''}`} cx={cx} cy={cy} r={index % 4 === 0 ? '3.5' : '2.5'} />
          ))}
        </svg>
        <Logo className="console-logo" fallbackClass="console-logo" />
        <div className="console-coordinate coordinate-a">TRUST / VERIFY</div>
        <div className="console-coordinate coordinate-b">SECURE BY DESIGN</div>
      </div>
      <div className="console-log">
        <span className="log-mark">{running ? '›' : '✓'}</span>
        <div><span className="log-label">{running ? 'VISUAL SEQUENCE' : sequence ? 'VISUAL SEQUENCE' : 'DEMO EVENT'}</span><p>{running ? 'Tracing the signal path…' : sequence ? 'Visual sequence complete.' : 'Sample event: signature verified'}</p></div>
        <span className="log-time">{sequence ? `RUN 0${sequence}` : '00:01 AGO'}</span>
      </div>
      <button className="console-action" type="button" onClick={runSequence} disabled={running}>
        <span>{running ? 'Running visual check' : 'Run a visual check'}</span><ArrowRight size={15} aria-hidden="true" />
      </button>
      <p className="console-disclaimer">Interactive visual demo only · no network traffic is sent</p>
    </div>
  )
}

function App() {
  const typedRole = useTyped(roles)
  const [active, setActive] = useState('')
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<Filter>('All work')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const visibleProjects = useMemo(
    () => activeFilter === 'All work' ? projects : projects.filter((project) => project.category === activeFilter as ProjectCategory),
    [activeFilter],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
      if (event.key === 'Escape') {
        setCommandOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])


  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const reveal = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target) } }), { threshold: 0.12 })
    document.querySelectorAll('.reveal, .section-heading, .about-content, .security-notice, .cv-row').forEach((el) => { el.classList.add('reveal'); reveal.observe(el) })
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-45% 0px -50% 0px' })
    navItems.forEach((n) => { const el = document.getElementById(n.id); if (el) spy.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); reveal.disconnect(); spy.disconnect() }
  }, [activeFilter])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setEmailCopied(true)
      window.setTimeout(() => setEmailCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <header className="site-header">
        <nav className="nav-shell" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Xayen home">
            <Logo className="brand-logo" fallbackClass="brand-logo-fallback" />
            <span className="brand-word">XAYEN<span className="brand-dot">.</span></span>
          </a>
          <span className="nav-context">INDEPENDENT DEVELOPER <span>·</span> PORTFOLIO 2026</span>
          <div className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className={active === item.id ? 'nav-active' : ''} onClick={() => setMobileMenuOpen(false)}>{item.label}</a>
            ))}
            <button className="command-trigger" type="button" onClick={() => { setCommandOpen(true); setMobileMenuOpen(false) }} aria-label="Open section search" aria-keyshortcuts="Control+K Meta+K">
              <Command size={14} /><span>Jump to</span><kbd>⌘ K</kbd>
            </button>
          </div>
          <button className="mobile-menu-toggle icon-button" type="button" aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <main id="main">
        <section className="hero-section page-shell" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-square" /> SECURITY-FIRST ENGINEERING <span className="eyebrow-line" /></p>
            <h1 id="hero-title">Security-minded<br /><span>by design<span className="title-period">.</span></span></h1>
            <p className="hero-role">{contact.name}<span className="hero-role-sep"> / </span><span className="sr-only">{roles.join(', ')}</span><span aria-hidden="true">{typedRole}</span><span className="typed-caret" aria-hidden="true">&nbsp;</span></p>
            <p className="hero-description">I build resilient web services and practical defensive tools — connecting secure software engineering with hands-on cybersecurity.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={webhookDemoUrl} target="_blank" rel="noreferrer">View Live Webhook Service <ArrowUpRight size={16} aria-hidden="true" /></a>
              <a className="button button-quiet" href="#work">Explore the work <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
            <div className="hero-footnote"><span className="status-dot" /> <span>BUILDING AT THE INTERSECTION OF SOFTWARE &amp; SECURITY</span></div>
          </div>
          <div className="hero-visual" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5; const y = (e.clientY - r.top) / r.height - .5; const c = e.currentTarget.firstElementChild as HTMLElement; c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)` }} onMouseLeave={(e) => { (e.currentTarget.firstElementChild as HTMLElement).style.transform = '' }}><SignalConsole /></div>
          <div className="hero-side-label" aria-hidden="true">XAYEN.TECH <span>01 — 04</span></div>
        </section>

        <section className="work-section page-shell section-block" id="work" aria-labelledby="work-title">
          <div className="section-heading work-heading">
            <div><p className="section-kicker">01 / SELECTED WORK</p><h2 id="work-title">Built to <span>hold up.</span></h2></div>
            <p className="section-intro">Payment integrations, reliable services, and defensive tooling — each project is a different kind of trust problem.</p>
          </div>
          <div className="project-toolbar">
            <div className="filter-group" role="group" aria-label="Filter projects">
              {filters.map((filter) => (
                <button key={filter} className={`filter-button ${activeFilter === filter ? 'filter-active' : ''}`} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
            <span className="project-count">{String(visibleProjects.length).padStart(2, '0')} PROJECTS</span>
          </div>
          <div className="project-grid" aria-live="polite">
            {visibleProjects.map((project) => <ProjectCard key={project.number} project={project} />)}
          </div>
          <aside className="security-notice" aria-label="Responsible use notice">
            <span className="notice-icon"><ShieldCheck size={18} aria-hidden="true" /></span>
            <div><strong>Built for defense. Used with permission.</strong><p>sec-triage is a defensive utility. Use it only on systems and data you’re authorized to assess, and always within ethical and legal boundaries.</p></div>
            <span className="notice-code">RESPONSIBLE USE // 01</span>
          </aside>
        </section>

        <section className="about-section page-shell section-block" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <div><p className="section-kicker">02 / THE APPROACH</p><h2 id="about-title">Security isn’t a layer.<br /><span>It’s the blueprint.</span></h2></div>
            <p className="section-intro">My approach starts with how a system can fail, then works back toward something clear, useful, and resilient.</p>
          </div>
          <div className="about-content">
            <div className="about-statement"><span className="quote-mark">“</span><p>From constant-time HMAC verification in webhook services to offline triage tools, I focus on building systems that behave predictably when it matters.</p><span className="about-attribution">SECURITY-FIRST, FROM THE FIRST LINE OF CODE</span></div>
            <div className="approach-list">
              <div className="approach-item"><span>01</span><div><h3>Threat-aware</h3><p>Think about abuse cases, inputs, and trust boundaries early.</p></div><Sparkles size={17} aria-hidden="true" /></div>
              <div className="approach-item"><span>02</span><div><h3>Built to verify</h3><p>Make important behavior understandable, testable, and observable.</p></div><ShieldCheck size={17} aria-hidden="true" /></div>
              <div className="approach-item"><span>03</span><div><h3>Made to be useful</h3><p>Ship practical software with a clear purpose and honest boundaries.</p></div><ArrowRight size={17} aria-hidden="true" /></div>
            </div>
          </div>
        </section>

        <section className="skills-section page-shell section-block" id="skills" aria-labelledby="skills-title">
          <div className="section-heading skills-heading">
            <div><p className="section-kicker">03 / TOOLS OF THE TRADE</p><h2 id="skills-title">The working <span>stack.</span></h2></div>
            <p className="section-intro">Four connected disciplines. One goal: software that earns trust.</p>
          </div>
          <div className="skills-list">
            {skillGroups.map((group) => (
              <div className="skill-row reveal" key={group.name} onMouseMove={trackPointer}>
                <span className="skill-index">{group.index}</span>
                <h3>{group.name}</h3>
                <div className="skill-tags">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                <ArrowUpRight className="skill-arrow" size={16} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section page-shell section-block" id="contact" aria-labelledby="contact-title">
          <div className="contact-inner">
            <div className="contact-copy"><p className="section-kicker">04 / OPEN CHANNEL</p><h2 id="contact-title">Have a good<br /><span>problem?</span></h2><p>Let’s talk about secure software, backend engineering, or a challenge worth untangling.</p></div>
            <div className="contact-actions">
              <a className="contact-email" href={`mailto:${contact.email}`}><span>{contact.email}</span><ArrowUpRight size={18} aria-hidden="true" /></a>
              <div className="social-links">
                <a href={contact.github} target="_blank" rel="noreferrer"><Github size={15} aria-hidden="true" /> GitHub <ArrowUpRight size={13} aria-hidden="true" /></a>
                {contact.linkedin ? <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} aria-hidden="true" /></a> : <span className="social-pending">LinkedIn URL not provided</span>}
                <button type="button" className="copy-email" onClick={copyEmail}>{emailCopied ? <Check size={14} /> : <Copy size={14} />}{emailCopied ? 'Copied' : 'Copy email'}</button>
              </div>
            </div>
          </div>
          <div className="cv-row">
            <div><span className="cv-label">THE FULL STORY</span><p>Want the résumé version? Grab the CV below.</p></div>
            <a className="button button-outline" href={contact.cvPath} download>Download CV <ArrowDown size={15} aria-hidden="true" /></a>
            {contact.cvIsPlaceholder && <span className="cv-notice">PLACEHOLDER PDF — REPLACE BEFORE PUBLISHING</span>}
          </div>
        </section>
      </main>

      <footer className="site-footer page-shell">
        <a className="footer-brand" href="#top">XAYEN<span>.</span></a>
        <span className="footer-note">DESIGNED WITH CURIOSITY. BUILT WITH INTENT.</span>
        <a className="back-top" href="#top">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a>
        <span className="footer-year">© {new Date().getFullYear()}</span>
      </footer>

      <a className="floating-mail" href={`mailto:${contact.email}`} aria-label="Email Xayen"><Mail size={17} aria-hidden="true" /></a>
      {commandOpen && <CommandMenu onClose={() => setCommandOpen(false)} />}
    </>
  )
}

export default App
