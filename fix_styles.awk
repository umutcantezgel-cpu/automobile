{
    gsub(/className="font-mono tabular-nums"/, "className={styles.fontMonoTabular}");
    gsub(/className="section-y bg-background"/, "className={cn(\"section-y\", styles.bgBackground)}");
    gsub(/className="section-y bg-card-elevated\/30"/, "className={cn(\"section-y\", styles.bgCardElevated30)}");
    gsub(/className="section-y bg-muted\/40"/, "className={cn(\"section-y\", styles.bgMuted40)}");
    gsub(/className="text-primary"/, "className={styles.textPrimary}");
    gsub(/className="text-foreground"/, "className={styles.textForeground}");
    gsub(/className="text-muted-foreground"/, "className={styles.textMutedForeground}");
    gsub(/className="input font-mono tabular-nums"/, "className={cn(\"input\", styles.fontMonoTabular)}");
    gsub(/className="text-h3 text-foreground"/, "className={cn(\"text-h3\", styles.textForeground)}");
    gsub(/className="text-h2 text-foreground"/, "className={cn(\"text-h2\", styles.textForeground)}");
    gsub(/className="text-h4 text-foreground"/, "className={cn(\"text-h4\", styles.textForeground)}");
    gsub(/className="section-y border-t border-border bg-card-elevated"/, "className={cn(\"section-y\", styles.sectionElevated)}");
    gsub(/className="section-y border-t border-b border-border bg-card-elevated"/, "className={cn(\"section-y\", styles.sectionElevatedBorderBoth)}");
    gsub(/className="container-x relative"/, "className={cn(\"container-x\", styles.relative)}");
    gsub(/className="flex flex-col gap-8"/, "className={styles.flexColGap8}");
    gsub(/className="overflow-hidden"/, "className={styles.overflowHidden}");
    
    # Complex ones:
    # line-strike font-mono text-[length:var(--t-xs)] tabular-nums text-muted-foreground
    gsub(/className="line-strike font-mono text-\[length:var\(--t-xs\)\] tabular-nums text-muted-foreground"/, "className={cn(\"line-strike\", styles.priceStrike)}");
    
    # font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground
    gsub(/className="font-\[family-name:var\(--font-display\)\] text-2xl font-bold tracking-tight text-foreground"/, "className={styles.priceDisplay}");
    
    # badge-top-listing
    gsub(/className="badge-top-listing"/, "className={styles.badgeTopListing}");

    print $0
}
