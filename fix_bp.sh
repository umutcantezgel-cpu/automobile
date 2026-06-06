#!/bin/bash

# Function to get relative path
get_relpath() {
    local source=$1
    local target=$2

    # Remove filename from source to get source directory
    local source_dir=$(dirname "$source")
    
    local common_part=$source_dir
    local back=""
    
    while [ "${target#$common_part/}" = "$target" ] && [ "$common_part" != "." ] && [ "$common_part" != "/" ]; do
        common_part=$(dirname "$common_part")
        back="../${back}"
    done
    
    if [ "$common_part" = "." ]; then
        # if no common part
        echo "$target"
    else
        local rel="${back}${target#$common_part/}"
        # If rel doesn't start with . or /, prepend ./
        if [[ "$rel" != .* && "$rel" != /* ]]; then
            rel="./$rel"
        fi
        echo "$rel"
    fi
}

for file in $(find src/components src/app -name "*.css"); do
  if grep -qE "(@media.*(640px|768px|1024px|1280px|1023px))" "$file"; then
    echo "Fixing $file"
    rel=$(get_relpath "$file" "src/app/tokens/breakpoints.module.css")
    
    # Prepend the value imports
    imports="@value sm, md, lg, xl, maxlg from \"$rel\";"
    
    # Insert at the top of the file, then replace the px values
    # We use a temporary file
    echo "$imports" > "$file.tmp"
    sed -E 's/640px/sm/g; s/768px/md/g; s/1024px/lg/g; s/1280px/xl/g; s/1023px/maxlg/g' "$file" >> "$file.tmp"
    mv "$file.tmp" "$file"
  fi
done
