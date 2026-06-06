BEGIN {
    # Initialize replacements mapping
    tw["w-3 h-3"] = "size={12}"
    tw["h-3 w-3"] = "size={12}"
    tw["w-4 h-4"] = "size={16}"
    tw["h-4 w-4"] = "size={16}"
    tw["w-5 h-5"] = "size={20}"
    tw["h-5 w-5"] = "size={20}"
    tw["w-6 h-6"] = "size={24}"
    tw["h-6 w-6"] = "size={24}"
    tw["size-4"] = "size={16}"
}
{
    # We want to replace className="w-4 h-4" with size={16}
    # Wait, className="w-4 h-4" inside an element might be for Lucide icons.
    # We will just replace ` className="w-4 h-4"` with ` size={16}`
    for (k in tw) {
        gsub("className=\"" k "\"", tw[k], $0)
    }
    
    # Also if there's ml-1: className="w-4 h-4 ml-1" -> className={styles.iconSmMl}
    # Let's just do size={} replacements first for exact matches
    print $0
}
