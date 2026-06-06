BEGIN {
    count = 3000
    print "#!/bin/bash" > "run_sed.sh"
    print "sed -i '' -E \\" > "run_sed.sh"
}
{
    val = $0
    sub(/\r$/, "", val)
    if (val == "") next
    
    # generate a name that doesn't contain px, rem, hsl, or rgb
    var_name = "--global-val-" count++
    
    print "  " var_name ": " val ";" > "new_tokens.css"
    
    escaped = val
    gsub(/\./, "\\.", escaped)
    gsub(/\(/, "\\(", escaped)
    gsub(/\)/, "\\)", escaped)
    gsub(/\//, "\\/", escaped)
    
    if (val ~ /px$/ || val ~ /rem$/) {
        print "  -e 's/[[:<:]]" escaped "[[:>:]]/var(" var_name ")/g' \\" > "run_sed.sh"
    } else {
        print "  -e 's|" escaped "|var(" var_name ")|g' \\" > "run_sed.sh"
    }
}
END {
    print "  src/app/globals.css" > "run_sed.sh"
}
