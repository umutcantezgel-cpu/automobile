# Frontend Performance Baseline Audit

**Target URL:** `http://localhost:3000` (Production Build)  
**Date:** 2026-06-04  

## 1. Core Web Vitals & Loading Metrics

| Metric | Value | Status | Notes |
|--------|-------|--------|-------|
| **LCP (Largest Contentful Paint)** | 1.67 s | 🟢 Good | The LCP element is a text node. Breakdown: TTFB (2ms) + Render Delay (1,674ms). The render delay points to React hydration or client-side rendering deferring the text display. |
| **FCP (First Contentful Paint)** | 96 ms | 🟢 Good | Highly optimized initial paint. |
| **TTFB (Time to First Byte)** | 2 ms | 🟢 Good | Fast server response (local Next.js server). |
| **CLS (Cumulative Layout Shift)** | 0.00 | 🟢 Good | No layout shifts detected during load. |
| **INP / FID** | < 16 ms | 🟢 Good | Interaction delay is negligible. |

## 2. Critical Rendering Path

The critical rendering path is highly optimized and remarkably short:
- **Maximum Latency:** ~88 ms
- **Depth:** 1 level
- **Render-Blocking Resources:** 1 stylesheet (`_next/static/chunks/[root]...css`). No blocking JavaScript in the head.
- **Preload/Preconnect:** No origins were preconnected, but none were strictly necessary for the initial render.

## 3. Bundle Sizes & Resource Utilization

*(Values represent uncompressed/decoded sizes over the network)*

- **Total JavaScript:** ~1.18 MB (spread across 15 chunks)
- **Total CSS:** ~146 KB (spread across 2 files)
- **Unused JavaScript:** Given the ~1.18 MB payload, typical for Next.js, Framer Motion, and React DOM, there is significant baseline framework overhead. However, the presence of 15 separate chunks indicates effective code-splitting via Turbopack, meaning unused JS is mitigated per-route.

## 4. Memory Usage

Heap snapshot analysis indicates a highly efficient memory footprint on load:
- **Total JS Heap Size:** ~3.00 MB
- **Used JS Heap Size:** ~1.45 MB
- **Heap Size Limit:** ~4.00 GB

There are no signs of initial memory bloat or early memory leaks.

## 5. CSS Specificity

- **Total CSS Rules:** 167
- **Analysis:** The project utilizes Tailwind CSS (confirmed via utility classes and `tailwind-merge`). This results in an incredibly flat specificity graph, typically `0, 1, 0` for almost all rules. This avoids specificity wars and keeps the CSS object model (CSSOM) construction very fast.

---

**Summary:** The baseline performance of the application is excellent. The only area for potential optimization is the **LCP Render Delay (1.67s)**, which suggests that the main content is dependent on client-side React hydration or a `useEffect` fetch rather than being fully statically generated or server-side rendered.
