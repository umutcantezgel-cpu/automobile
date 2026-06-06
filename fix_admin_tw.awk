{
    gsub(/className="veh-img alt-3 shrink-0 w-\[var\(--space-20\)\] h-\[var\(--space-12\)\] rounded-\[var\(--radius-lg\)\] aspect-auto"/, "className={cn(\"veh-img\", \"alt-3\", styles.vehImgThumb)}");
    gsub(/className="veh-img alt-3 rounded-t-\[var\(--radius-xl\)\]"/, "className={cn(\"veh-img\", \"alt-3\", styles.vehImgTopRounded)}");
    gsub(/className="badge-top-listing text-\[length:var\(--t-2xs\)\]"/, "className={cn(\"badge-top-listing\", styles.text2xs)}");
    gsub(/className="text-\[length:var\(--t-sm\)\] font-medium"/, "className={cn(styles.textSm, styles.fontMedium)}");
    gsub(/className="text-\[length:var\(--t-sm\)\]"/, "className={styles.textSm}");
    gsub(/className="overflow-x-auto"/, "className={styles.overflowXAuto}");
    print $0
}
