import os
import re

def walk(directory):
    results = []
    if not os.path.exists(directory):
        return results
    for root, dirs, files in os.walk(directory):
        for file in files:
            if re.search(r'\.(jsx?|tsx?|css|scss)$', file, re.IGNORECASE):
                results.append(os.path.join(root, file))
    return results

def extract_tokens():
    src_dir = os.path.join(os.path.dirname(__file__), 'src')
    files = walk(src_dir)
    
    hsl_tokens = {}
    style_tokens = {}
    
    hsl_regex = re.compile(r'hsla?\([^)]+\)')
    style_regex = re.compile(r'style=\{\{([\s\S]*?)\}\}')

    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        rel_path = os.path.relpath(file, os.path.dirname(__file__))
        
        for match in hsl_regex.finditer(content):
            token = re.sub(r'\s+', ' ', match.group(0).strip())
            if token not in hsl_tokens:
                hsl_tokens[token] = []
            if rel_path not in hsl_tokens[token]:
                hsl_tokens[token].append(rel_path)
                
        for match in style_regex.finditer(content):
            token = re.sub(r'\s+', ' ', match.group(1).strip())
            if token not in style_tokens:
                style_tokens[token] = []
            if rel_path not in style_tokens[token]:
                style_tokens[token].append(rel_path)
                
    return hsl_tokens, style_tokens

def generate_markdown(hsl_tokens, style_tokens):
    md = '# Token Inventory\n\n'
    
    md += '## HSL Colors\n\n'
    md += '| Color | Files |\n'
    md += '|---|---|\n'
    if not hsl_tokens:
        md += '| None found | |\n'
    else:
        for token in sorted(hsl_tokens.keys()):
            md += f"| `{token}` | {', '.join(hsl_tokens[token])} |\n"
            
    md += '\n## Inline Styles (`style={{...}}`)\n\n'
    md += '| Style Object | Files |\n'
    md += '|---|---|\n'
    if not style_tokens:
        md += '| None found | |\n'
    else:
        for token in sorted(style_tokens.keys()):
            md += f"| `{{ {token} }}` | {', '.join(style_tokens[token])} |\n"
            
    return md

def main():
    print('Extracting tokens from src/ ...')
    hsl_tokens, style_tokens = extract_tokens()
    md = generate_markdown(hsl_tokens, style_tokens)
    
    output_file = os.path.join(os.path.dirname(__file__), '.antigravity', 'design-system', 'token-inventory.md')
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(md)
        
    print(f'Inventory written to {output_file}')

if __name__ == '__main__':
    main()
