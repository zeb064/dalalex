import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Tab {
  title: string
  icon: LucideIcon
}

interface ExpandableTabsProps {
  tabs: Tab[]
  className?: string
  activeColor?: string
  selectedIndex?: number | null
  onChange?: (index: number) => void
}

const buttonVariants = {
  initial: { gap: 0, paddingLeft: '.5rem', paddingRight: '.5rem' },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? '.5rem' : 0,
    paddingLeft: isSelected ? '1rem' : '.5rem',
    paddingRight: isSelected ? '1rem' : '.5rem',
  }),
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

const transition = { delay: 0.1, type: 'spring' as const, bounce: 0, duration: 0.6 }

export function ExpandableTabs({
  tabs,
  className,
  selectedIndex = null,
  onChange,
}: ExpandableTabsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-white/10 bg-white/5 p-1 backdrop-blur-xl',
        className
      )}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon
        const isSelected = selectedIndex === index

        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isSelected}
            onClick={() => onChange?.(index)}
            transition={transition}
            className={cn(
              'relative flex items-center rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap',
              isSelected
                ? 'bg-desert-500/30 text-white shadow-lg shadow-desert-500/10'
                : 'text-white/60 hover:bg-white/5 hover:text-white/80'
            )}
          >
            <Icon size={20} />
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
