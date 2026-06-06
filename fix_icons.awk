{
    gsub(/className="size-4 text-primary"/, "size={16} className={styles.textPrimary}");
    gsub(/className="size-5 text-primary"/, "size={20} className={styles.textPrimary}");
    gsub(/className="size-6"/, "size={24}");
    gsub(/className="size-24"/, "size={96}");
    gsub(/className="w-3 h-3 text-premium"/, "size={12} className={styles.textPremium}");
    gsub(/className="w-4 h-4 ml-1"/, "size={16} className={styles.ml1}");
    gsub(/className="w-5 h-5 ml-1"/, "size={20} className={styles.ml1}");
    gsub(/className="size-3.5 mt-0.5 shrink-0"/, "size={14} className={styles.iconOffset}");
    gsub(/className="size-3.5"/, "size={14}");
    print $0
}
