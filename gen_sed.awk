BEGIN {
    count = 2000
    print "sed -i '' -E \\" > "run_sed.sh"
}
{
    val = $0
    # Clean any accidental trailing carriage returns
    sub(/\r$/, "", val)
    if (val == "") next
    
    var_name = "--global-val-" count++
    
    print "  " var_name ": " val ";" > "new_tokens.css"
    
    # Escape for sed
    # Escape dots, parentheses, and slashes
    escaped = val
    gsub(/\./, "\\.", escaped)
    gsub(/\(/, "\\(", escaped)
    gsub(/\)/, "\\)", escaped)
    gsub(/\//, "\\/", escaped)
    
    if (val ~ /px$/ || val ~ /rem$/) {
        # Use word boundaries for px and rem
        print "  -e 's/[[:<:]]" escaped "[[:>:]]/var(" var_name ")/g' \\" > "run_sed.sh"
    } else {
        # For hsl/rgb
        print "  -e 's|" escaped "|var(" var_name ")|g' \\" > "run_sed.sh"
    }
}
END {
    print "  src/app/globals.css" > "run_sed.sh"
}
