BEGIN {
    var_count = 1000
}
{
    out = ""
    i = 1
    len = length($0)
    while (i <= len) {
        c = substr($0, i, 1)
        
        # Check for px or rem
        # A bit complex to parse backwards for numbers, let's just use match for px/rem
        
        if (substr($0, i, 4) == "hsl(" || substr($0, i, 4) == "rgb(") {
            start_idx = i
            parens = 0
            j = i + 3
            while (j <= len) {
                char = substr($0, j, 1)
                if (char == "(") parens++
                else if (char == ")") {
                    parens--
                    if (parens == 0) {
                        break
                    }
                }
                j++
            }
            if (j <= len) {
                # Found the whole hsl(...) or rgb(...)
                val = substr($0, i, j - i + 1)
                
                # Assign to token
                if (!(val in val2var)) {
                    var_name = "--auto-" var_count++
                    val2var[val] = var_name
                    print "  " var_name ": " val ";" > "tokens_to_add.txt"
                } else {
                    var_name = val2var[val]
                }
                
                out = out "var(" var_name ")"
                i = j + 1
                continue
            }
        }
        
        out = out c
        i++
    }
    
    # Now we need to handle px and rem in `out`
    # We can just do a regex replace for px and rem?
    # awk's gsub doesn't have callback. So we iterate using match
    
    final_out = ""
    while (match(out, /[0-9\.]+(px|rem)/)) {
        val = substr(out, RSTART, RLENGTH)
        
        if (!(val in val2var)) {
            var_name = "--auto-" var_count++
            val2var[val] = var_name
            print "  " var_name ": " val ";" > "tokens_to_add.txt"
        } else {
            var_name = val2var[val]
        }
        
        final_out = final_out substr(out, 1, RSTART - 1) "var(" var_name ")"
        out = substr(out, RSTART + RLENGTH)
    }
    final_out = final_out out
    
    # print to output array or directly modify?
    # awk -i inplace isn't standard on macOS.
    # We will print to a temp file, then replace.
    print final_out > (FILENAME ".tmp")
}
