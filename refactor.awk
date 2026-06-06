{
    if ($0 ~ /import.*useReducedMotion.*framer-motion/) {
        if ($0 ~ /\{.*motion.*,.*useReducedMotion.*\}/ || $0 ~ /\{.*useReducedMotion.*,.*motion.*\}/ || $0 ~ /\{.*AnimatePresence.*motion.*useReducedMotion.*\}/ || $0 ~ /\{.*AnimatePresence.*useReducedMotion.*\}/ || $0 ~ /\{.*useReducedMotion.*,.*AnimatePresence.*\}/) {
            if ($0 ~ /AnimatePresence/ && $0 ~ /motion/) {
                print "import { motion, AnimatePresence } from 'framer-motion';"
            } else if ($0 ~ /AnimatePresence/) {
                print "import { AnimatePresence } from 'framer-motion';"
            } else if ($0 ~ /motion/) {
                print "import { motion } from 'framer-motion';"
            } else {
                print "import { motion } from 'framer-motion';"
            }
            print "import { useMotionTokens } from '@/lib/motion';"
            next
        } else if ($0 ~ /\{.*useReducedMotion.*\}/ && !($0 ~ /motion/)) {
            print "import { useMotionTokens } from '@/lib/motion';"
            next
        }
    }
    
    gsub(/const prefersReducedMotion = useReducedMotion\(\);/, "const { getDuration, getDelay, prefersReducedMotion } = useMotionTokens();")
    gsub(/const shouldReduceMotion = useReducedMotion\(\);/, "const { getDuration, getDelay, prefersReducedMotion: shouldReduceMotion } = useMotionTokens();")

    while (match($0, /(prefersReducedMotion|shouldReduceMotion) \? 0\.0[0-9]* : [0-9.]+/)) {
        start = RSTART
        len = RLENGTH
        full_match = substr($0, start, len)
        match(full_match, /: [0-9.]+/)
        num = substr(full_match, RSTART + 2, RLENGTH - 2)
        repl = "getDuration(" num ")"
        $0 = substr($0, 1, start - 1) repl substr($0, start + len)
    }

    while (match($0, /(prefersReducedMotion|shouldReduceMotion) \? 0 : [0-9.]+/)) {
        start = RSTART
        len = RLENGTH
        full_match = substr($0, start, len)
        match(full_match, /: [0-9.]+/)
        num = substr(full_match, RSTART + 2, RLENGTH - 2)
        repl = "getDelay(" num ")"
        $0 = substr($0, 1, start - 1) repl substr($0, start + len)
    }

    while (match($0, /(prefersReducedMotion|shouldReduceMotion) \? \{ [^}]* \} : \{ duration: [0-9.]+/)) {
        start = RSTART
        len = RLENGTH
        full_match = substr($0, start, len)
        match(full_match, /: \{ duration: [0-9.]+/)
        num_part = substr(full_match, RSTART + 14, RLENGTH - 14)
        num = num_part
        repl = "{ duration: getDuration(" num ")"
        $0 = substr($0, 1, start - 1) repl substr($0, start + len)
    }

    print $0
}
