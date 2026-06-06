import os
import re
import sys

def find_tailwind_in_tsx(directory):
    # Common tailwind prefixes/patterns
    tailwind_pattern = re.compile(r"""
        (?<![a-zA-Z0-9_-])
        (?:
            # Layout & Display
            (?:flex|grid|block|hidden|inline|inline-block|inline-flex|inline-grid|table|table-row|table-cell|contents|list-item|flow-root)|
            # Positioning
            (?:absolute|relative|fixed|sticky|static|inset-\d+|top-\d+|bottom-\d+|left-\d+|right-\d+)|
            # Spacing
            (?:p[tbrlxy]?-\d+|m[tbrlxy]?-\d+|p-\[.*?\]|m-\[.*?\])|
            # Sizing
            (?:w-\d+|w-full|w-screen|h-\d+|h-full|h-screen|min-w-[a-z0-9]+|min-h-[a-z0-9]+|max-w-[a-z0-9]+|max-h-[a-z0-9]+)|
            # Typography
            (?:text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)|text-[a-z]+-\d+|font-(?:sans|serif|mono|thin|extralight|light|normal|medium|semibold|bold|extrabold|black)|tracking-[a-z]+|leading-[0-9a-z]+)|
            # Colors/Backgrounds
            (?:bg-[a-z]+-\d+|bg-(?:white|black|transparent|none)|text-[a-z]+-\d+|text-(?:white|black)|border-[a-z]+-\d+)|
            # Flex/Grid properties
            (?:flex-(?:row|col|wrap|1|auto|initial|none)|items-(?:start|end|center|baseline|stretch)|justify-(?:start|end|center|between|around|evenly)|gap-\d+|gap-[xy]-\d+)|
            # Borders & Effects
            (?:rounded(?:-[a-z0-9]+)?|border(?:-[0-9]+)?|shadow(?:-[a-z]+)?|opacity-\d+)|
            # Variants
            (?:(?:hover|focus|active|group-hover|md|lg|sm|xl|2xl|dark):[a-zA-Z0-9_-]+)
        )
        (?![a-zA-Z0-9_-])
    """, re.VERBOSE)

    # We shouldn't flag local variables or CSS modules properties unless they perfectly match tailwind.
    # To be extremely comprehensive, we can just search for ANY string literal containing tailwind-like classes inside cn() or backticks.
    
    issues = []
    
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs: dirs.remove('node_modules')
        if '.next' in dirs: dirs.remove('.next')
            
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Find cn(...) contents and see if they contain tailwind
                # Since nested parens can be tricky in regex, we can just search all string literals
                # that look like tailwind classes, especially those wrapped in cn(...) or template literals.
                
                # Check for cn( "..." ) or cn( `...` ) or cn( styles.foo, "..." )
                # Actually, let's just find ANY string literal in the file and check if it has tailwind classes.
                # However, this might match console.log("something border").
                
                # Let's write a simple parser or just use regex to extract all string literals and template strings
                string_literals = re.findall(r'(["\'`])(.*?)\1', content, re.DOTALL)
                
                for _, string_content in string_literals:
                    # check if it looks like a tailwind class string
                    words = string_content.replace('\n', ' ').split()
                    for word in words:
                        if tailwind_pattern.fullmatch(word):
                            # if it matches, it might be a tailwind class
                            # let's be careful with false positives like 'hidden' which might just be a word
                            issues.append((path, word, string_content[:50]))

    for path, word, snippet in issues:
        print(f"File: {path} - Found TW class: '{word}' in literal: {snippet!r}")

if __name__ == '__main__':
    find_tailwind_in_tsx('src')
