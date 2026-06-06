import re
import os

with open("src/app/ueber-uns/page.tsx", "r") as f:
    content = f.read()

# Replace framer-motion import
content = content.replace("import { motion } from 'framer-motion';", "import { motion, useReducedMotion } from 'framer-motion';")
# Add CSS import
if "import styles from './ueber-uns.module.css';" not in content:
    content = content.replace("import { cn } from '@/lib/cn';", "import { cn } from '@/lib/cn';\nimport styles from './ueber-uns.module.css';")

# Replace hook usage - inside UeberUnsPage function
content = re.sub(r'export default function UeberUnsPage\(\) \{', 
                 'export default function UeberUnsPage() {\n  const prefersReducedMotion = useReducedMotion();', 
                 content)

# Use useReducedMotion for transition durations
content = re.sub(r'transition=\{\{ duration: 0\.6, ease: \[0\.16, 1, 0\.3, 1\]( as const)? \}\}', 
                 'transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, ease: [0.16, 1, 0.3, 1] }}', 
                 content)

# Use useReducedMotion for viewport
content = re.sub(r'viewport=\{\{ once: true, margin: \'-10%\' \}\}', 
                 'viewport={{ once: true, margin: \'-10%\' }}', 
                 content) # actually doesn't need to change viewport

content = content.replace('className="min-h-screen"', '')

# Hero section
content = content.replace('className="relative overflow-hidden bg-background"', 'className={styles.hero}')
content = content.replace('className="container-x section-y relative z-10 flex flex-col items-start gap-6 pt-32 pb-20 lg:pt-40 lg:pb-28"', 'className={cn("container-x", "section-y", styles.heroContent)}')
content = content.replace('className="text-display max-w-4xl"', 'className={cn("text-display", styles.heroTitle)}')

# Section 1
content = content.replace('className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"', 'className={styles.historyGrid}')
content = content.replace('className="rounded-xl"', 'className={styles.historyImage}')
content = content.replace('className="flex flex-col gap-6"', 'className={styles.historyContent}')
content = content.replace('className="text-body-lg leading-relaxed text-muted-foreground space-y-4"', 'className={cn("text-body-lg", styles.historyText)}')
content = content.replace('className="float-left text-[length:var(--t-4xl)] leading-[0.8] font-display font-bold text-foreground mr-3 mt-1"', 'className={styles.dropCap}')
content = content.replace('className="relative border-l-4 border-primary pl-6 py-2"', 'className={styles.blockquote}')
content = content.replace('className="text-primary/30 mb-2"', 'className={styles.quoteIcon}')
content = content.replace('className="text-body-lg italic text-foreground leading-relaxed"', 'className={cn("text-body-lg", styles.quoteText)}')
content = content.replace('className="mt-3 text-sm text-muted-foreground"', 'className={styles.quoteFooter}')

# Section 2 (Timeline)
content = content.replace('className="mb-12"', 'className={styles.sectionHeader}')
content = content.replace('className="eyebrow mb-3"', 'className={cn("eyebrow", styles.eyebrowMargin)}')
content = content.replace('className="relative"', 'className={styles.timeline}')
content = content.replace('className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px"', 'className={styles.timelineLine}')
content = content.replace('className="space-y-12 md:space-y-16"', 'className={styles.timelineGrid}')

content = content.replace("'relative flex items-start gap-6 md:gap-0',\n                      'md:grid md:grid-cols-2'", 'styles.timelineItem')

content = content.replace('className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background -translate-x-1/2 z-10 md:-translate-x-1/2"', 'className={styles.timelineDot}')
content = content.replace("'md:pr-12 md:text-right',\n                      !isLeft && 'md:order-2 md:pl-12 md:pr-0 md:text-left'", "styles.timelineLeft, !isLeft && styles.timelineLeftReversed")
content = content.replace("'md:pl-12',\n                      !isLeft && 'md:order-1 md:pr-12 md:pl-0 md:text-right'", "styles.timelineRight, !isLeft && styles.timelineRightReversed")
content = content.replace('className="text-muted-foreground mt-1"', 'className={styles.timelineDesc}')
content = content.replace('className="hidden md:block"', 'className={styles.hiddenMd}')
content = content.replace('className="pl-8 md:hidden"', 'className={styles.mobileTimelineText}')

# Section 3 (Values)
content = content.replace('className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"', 'className={styles.valuesGrid}')
content = content.replace('className="card card-hoverable p-6 flex flex-col gap-4"', 'className={cn("card", "card-hoverable", styles.valueCard)}')
content = content.replace('className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary"', 'className={styles.valueIconWrap}')
content = content.replace('className="text-h4 mb-1"', 'className={cn("text-h4", styles.valueTitle)}')
content = content.replace('className="text-sm text-muted-foreground leading-relaxed"', 'className={styles.valueDesc}')

# Section 4 (Team)
content = content.replace('className="grid grid-cols-1 sm:grid-cols-3 gap-6"', 'className={styles.teamGrid}')
content = content.replace('className="card p-8 flex flex-col items-center text-center gap-5"', 'className={cn("card", styles.teamCard)}')
content = content.replace("'w-20 h-20 rounded-full flex items-center justify-center',\n                    'bg-gradient-to-br text-primary-foreground font-display text-xl font-bold shadow-lg',\n                    member.gradient", "styles.teamAvatar, member.gradient")
content = content.replace('className="text-sm text-muted-foreground mt-1"', 'className={styles.teamRole}')


with open("src/app/ueber-uns/page.tsx", "w") as f:
    f.write(content)
