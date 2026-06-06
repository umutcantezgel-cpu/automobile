function replace_px(str) {
    res = ""
    while (match(str, /-?[0-9.]+px/)) {
        matched = substr(str, RSTART, RLENGTH)
        val_str = substr(matched, 1, length(matched) - 2)
        val_f = val_str + 0
        if (val_f == 0) {
            rep = "0"
        } else if (val_f == 9999) {
            rep = "var(--radius-full)"
        } else {
            ratio = val_f / 4
            if (ratio == int(ratio)) {
                rep = sprintf("calc(var(--space-1) * %d)", ratio)
            } else {
                rep = sprintf("calc(var(--space-1) * %g)", ratio)
            }
        }
        res = res substr(str, 1, RSTART - 1) rep
        str = substr(str, RSTART + RLENGTH)
    }
    return res str
}

function replace_rem(str) {
    res = ""
    while (match(str, /-?[0-9.]+rem/)) {
        matched = substr(str, RSTART, RLENGTH)
        val_str = substr(matched, 1, length(matched) - 3)
        val_f = val_str + 0
        if (val_f == 0) {
            rep = "0"
        } else {
            rep = sprintf("calc(var(--space-4) * %g)", val_f)
        }
        res = res substr(str, 1, RSTART - 1) rep
        str = substr(str, RSTART + RLENGTH)
    }
    return res str
}

function replace_em(str) {
    res = ""
    while (match(str, /-?[0-9.]+em/)) {
        matched = substr(str, RSTART, RLENGTH)
        val_str = substr(matched, 1, length(matched) - 2)
        val_f = val_str + 0
        if (val_f == 0) {
            rep = "0"
        } else {
            rep = sprintf("%gch", val_f * 2)
        }
        res = res substr(str, 1, RSTART - 1) rep
        str = substr(str, RSTART + RLENGTH)
    }
    return res str
}

{
    $0 = replace_px($0)
    $0 = replace_rem($0)
    $0 = replace_em($0)
    gsub(/rgba\(0,0,0,0\.3\)/, "color-mix(in srgb, black 30%, transparent)")
    print $0
}
