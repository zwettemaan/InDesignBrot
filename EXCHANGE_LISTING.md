# Adobe Exchange Listing — InDesignBrot

Use this file as the source of truth when filling in the Exchange submission form.

---

## Plugin ID

`indesignbrot-uxp-panel`

---

## Title

InDesignBrot. InDesign UXP vs UXPScript Scripting Speed Benchmark

---

## Summary / Tagline (≤ 160 characters)

Free benchmark that renders the Mandelbrot set in InDesign and compares panel UXP vs UXPScript execution speed. 

Developer tool. InDesignBrot has no practical purpose; it is purely a benchmarking tool.

---

## Full Description

InDesignBrot is a free developer benchmark tool. It renders a Mandelbrot set inside an InDesign document, purely to measure and compare InDesign scripting performance across InDesign versions in two different runtime environments.

**What it does**

Press one button to run the Mandelbrot calculation directly in the UXP panel runtime. 

Press the other to run the same calculation via the UXPScript bridge. 

Both render the result as a grid of coloured frames in your active InDesign document and report elapsed time. 

You can see the real-world speed difference at a glance.

**Why it matters**

InDesignBrot gives you a reproducible benchmark you can run on your own hardware and your own InDesign version.

The UXPScript bridge used here is built on **CRDT_UXP** (Creative Developer Tools for UXP), an open-source library by Kris Coppieters which also features a bridge between UXP panels and the InDesign UXPScript environment:

https://github.com/zwettemaan/CRDT_UXP

A full write-up of the findings and what they mean for real-world InDesign automation projects is published in the CRDT_UXP repo.

**Requirements**

- Adobe InDesign 2024 (version 19.0) or later

**About the author**

InDesignBrot is a free tool by Kris Coppieters of Rorohiko Ltd. 

Kris has 25+ years of experience building InDesign automation systems for enterprise publishing, legal, financial services, and marketing teams.

Get in touch if your InDesign, Illustrator, Photoshop, Acrobat workflows need serious automation, or if you are stuck migrating legacy ExtendScript to UXP:

- Web: https://rorohiko.com
- Email: kris@rorohiko.com
- LinkedIn: https://www.linkedin.com/in/kristiaan/
- CRDT_UXP (the bridge library): https://github.com/zwettemaan/CRDT_UXP

**License**

Free to use and distribute in unmodified form.

---

## Support URL

https://rorohiko.com

---

## Privacy Policy URL

https://rorohiko.com/privacy

*(Create a minimal privacy policy page at this URL before submission. The plugin collects no personal data and makes no network requests, so the policy can be a simple one-liner.)*

---

## Category

Developer Tools

---

## Tags / Keywords

UXP, scripting, benchmark, performance, developer tools, ExtendScript migration, InDesign automation, Mandelbrot

---

## Version Notes (for v1.0.0)

First Exchange release. Compares panel UXP vs UXPScript bridge execution time by rendering the Mandelbrot set in an InDesign document.

---

## Visual Assets Needed Before Submission

Adobe Exchange requires these assets to be uploaded via the submission form — they are **not** bundled in the .ccx:

| Asset | Spec | Notes |
|---|---|---|
| Plugin icon | 512 × 512 px PNG, square, transparent background | Shown in InDesign panel list and Exchange search results |
| Screenshot 1 | 1280 × 800 px PNG | Panel visible alongside an InDesign document showing rendered Mandelbrot |
| Screenshot 2 (optional) | 1280 × 800 px PNG | Close-up of the timing result text on the document page |
| Banner image (optional) | 1920 × 400 px PNG | Exchange listing header graphic |

---

## Submission Checklist

- [ ] Privacy policy page live at https://rorohiko.com/privacy
- [ ] Blog post published at coppieters.nz (Exchange listing links to it)
- [ ] Plugin icon created (512 × 512 PNG)
- [ ] At least one 1280 × 800 screenshot ready
- [ ] CCX rebuilt at version 1.0.0 (`zsh ./uxp-panel/build.command` from repo root)
- [ ] Adobe Developer Console: publisher profile complete with Rorohiko Ltd / rorohiko.com
- [ ] Plugin submitted for review via https://developer.adobe.com/developer-distribution/
