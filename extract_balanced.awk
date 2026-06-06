BEGIN {
    # Extract balanced hsl and rgb from globals.css
    count = 3000
}
{
    line = $0
    i = 1
    len = length(line)
    while (i <= len) {
        if (substr(line, i, 4) == "hsl(" || substr(line, i, 4) == "rgb(") {
            start = i
            parens = 0
            j = i + 3
            while (j <= len) {
                c = substr(line, j, 1)
                if (c == "(") parens++
                else if (c == ")") {
                    parens--
                    if (parens == 0) {
                        break
                    }
                }
                j++
            }
            if (j <= len) {
                val = substr(line, start, j - start + 1)
                if (!(val in seen)) {
                    seen[val] = 1
                    print val
                }
                i = j + 1
                continue
            }
        }
        i++
    }
}
