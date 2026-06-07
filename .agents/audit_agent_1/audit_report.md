# Mobile UI Audit Report

## Page: `/`

### SiteHeader Overlap Check
❌ Found elements overlapping the SiteHeader:
- **.sr-only.focus:not-sr-only.focus:absolute.focus:z-50.focus:p-4.focus:bg-background** (Text/Alt: `Zum Hauptinhalt springen`) | Top: -1px, Header Bottom: 81px

### Horizontal Overflow Check
❌ Found horizontal overflows causing scroll:
- **.relative.px-5.py-2.5.rounded-full.text-[13px].font-semibold.whitespace-nowrap.transition-colors.outline-none.text-neutral-600.hover:bg-neutral-100** (Text: `Gebrauchtwagen`) | Right edge: 509px > Viewport: 375px
- **.relative.z-10** (Text: `Gebrauchtwagen`) | Right edge: 489px > Viewport: 375px

## Page: `/fahrzeuge`

### SiteHeader Overlap Check
❌ Found elements overlapping the SiteHeader:
- **.sr-only.focus:not-sr-only.focus:absolute.focus:z-50.focus:p-4.focus:bg-background** (Text/Alt: `Zum Hauptinhalt springen`) | Top: -1px, Header Bottom: 81px

### Horizontal Overflow Check
✅ No horizontal overflows detected (max width: 375px).

## Page: `/kontakt`

### SiteHeader Overlap Check
❌ Found elements overlapping the SiteHeader:
- **.sr-only.focus:not-sr-only.focus:absolute.focus:z-50.focus:p-4.focus:bg-background** (Text/Alt: `Zum Hauptinhalt springen`) | Top: -1px, Header Bottom: 81px

### Horizontal Overflow Check
✅ No horizontal overflows detected (max width: 375px).

## Page: `/preise`

### SiteHeader Overlap Check
❌ Found elements overlapping the SiteHeader:
- **.sr-only.focus:not-sr-only.focus:absolute.focus:z-50.focus:p-4.focus:bg-background** (Text/Alt: `Zum Hauptinhalt springen`) | Top: -1px, Header Bottom: 81px

### Horizontal Overflow Check
❌ Found horizontal overflows causing scroll:
- **.absolute.-top-1/2.-right-1/4.w-[150%].h-[150%].bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))].from-neutral-200/20.via-transparent.to-transparent.opacity-50.blur-3xl.pointer-events-none** (Text: ``) | Right edge: 469px > Viewport: 375px
- **.flex.items-center.justify-center.gap-1.5.text-red-600** (Text: `Local Dominance`) | Right edge: 600px > Viewport: 375px
- **.font-medium.text-neutral-900.text-sm.whitespace-nowrap** (Text: `3`) | Right edge: 520px > Viewport: 375px
- **.absolute.top-0.right-0.w-[600px].h-[600px].bg-red-600/30.rounded-full.blur-[100px].-translate-y-1/2.translate-x-1/3.pointer-events-none** (Text: ``) | Right edge: 559px > Viewport: 375px

