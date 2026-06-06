import os
import re
import collections

regex = re.compile(r'className=(?:\{cn\((.*?)\)\}|"(.*?)")', re.DOTALL)
classes = set()

for root, dirs, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.tsx'):
            with open(os.path.join(root, file), 'r') as f:
                content = f.read()
                matches = regex.findall(content)
                for m in matches:
                    cls_str = m[0] if m[0] else m[1]
                    # strip quotes and newlines
                    cls_str = re.sub(r'["\'\`]', ' ', cls_str)
                    cls_str = re.sub(r',', ' ', cls_str)
                    cls_str = cls_str.replace('\n', ' ')
                    for cls in cls_str.split():
                        cls = cls.strip()
                        if cls and not cls.startswith('var(') and not cls.startswith('${') and not cls.startswith('&&'):
                            classes.add(cls)

print(f"Unique classes: {len(classes)}")
for c in sorted(classes):
    print(c)
