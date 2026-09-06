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
- No sign-in, subscription, or third-party account required

**About the author**

InDesignBrot is a free tool by Kris Coppieters of Rorohiko Ltd. 

Kris has 25+ years of experience building InDesign automation systems for enterprise publishing, legal, financial services, and marketing teams.

Get in touch if your InDesign, Illustrator, Photoshop, Acrobat workflows need serious automation, or if you are stuck migrating legacy ExtendScript to UXP:

- Web: https://rorohiko.com
- Blog: https://coppieters.nz
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

https://rorohiko.com/wordpress/indesignbrot-privacy-policy/

---

## Terms of Service URL

https://rorohiko.com/wordpress/indesignbrot-terms-of-service/


---

## Categories

- Tools & Automation
- Usability & Testing

---

## Tags / Keywords

UXP, scripting, benchmark, performance, developer tools, ExtendScript migration, InDesign automation, Mandelbrot

---

## Version Notes (for v1.0.0)

First Exchange release. Compares panel UXP vs UXPScript bridge execution time by rendering the Mandelbrot set in an InDesign document.

---

## Package To Upload

`uxp-panel/build/InDesignBrot-uxp-panel-1.0.0.5.ccx`

Built from repo root with:

`zsh ./uxp-panel/build.command`

Current tracked version state:

- `version=1.0.0`
- `build=5`

---

## Reviewer Notes

- The plugin is free.
- The plugin does not require any external account, license key, or companion app.
- The manifest declares network access only for `localhost.tgrg.net`, which resolves to local loopback and is used solely for the bundled CRDT_UXP UXPScript bridge.
- The plugin opens external links to `https://rorohiko.com`, `https://tur.nz`, LinkedIn, and the CRDT_UXP GitHub repo from the panel footer.

---

## Where To Find It

Do not submit this field with vague wording. Adobe specifically rejects unclear install/open instructions.

Use wording based on the final installed Creative Cloud build and confirm the exact menu breadcrumb in InDesign before submission.

Minimum accurate wording:

1. Install InDesignBrot from the Creative Cloud Desktop app.
2. Launch Adobe InDesign.
3. Open the `InDesignBrot` panel from Plugins - InDesignBrot UXP Panel - InDesignBrot

---

## Visual Assets Needed Before Submission

Adobe Exchange requires these assets to be uploaded via the submission form — they are **not** bundled in the .ccx:

| Asset | Spec | Notes |
|---|---|---|
| Plugin icon | 512 × 512 px PNG, square | `Developer/exchange-assets/icon-exchange-512.png` |
| Screenshot 1 | 1280 × 800 px PNG | `Developer/exchange-assets/exchange-screenshot-1-1280x800.png` |
| Screenshot 2 (optional) | 1280 × 800 px PNG | `Developer/exchange-assets/exchange-screenshot-2-1280x800.png` |
| Banner image (optional) | 1920 × 400 px PNG | `Developer/exchange-assets/exchange-banner-1920x400.png` |

---

## Submission Checklist

- [x] Privacy policy page live at https://rorohiko.com/privacy
- [x] Terms of service page live at https://rorohiko.com/terms
- [x] Blog post published (Exchange listing links to it) https://tur.nz/uxpspeed
- [x] Plugin icon created (`Developer/exchange-assets/icon-exchange-512.png`)
- [x] At least one 1280 × 800 screenshot ready (`Developer/exchange-assets/exchange-screenshot-1-1280x800.png`)
- [x] CCX rebuilt at version 1.0.0 build 5 (`zsh ./uxp-panel/build.command` from repo root)
- [x] Adobe Developer Distribution public profile complete with Rorohiko Ltd / rorohiko.com
- [x] If EU distribution matters: trader details completed in Adobe Developer Distribution
- [x] Confirm exact InDesign menu breadcrumb for opening the panel and paste that into the listing's "Where to find it" field
- [ ] Plugin submitted for review via https://developer.adobe.com/developer-distribution/
Plugin ID: ae4cbc17

---

## Remaining Submission Blockers

1. Publish live privacy and terms pages on `rorohiko.com`.
2. Complete the Adobe Developer Distribution public profile.
3. Confirm the exact installed-menu path for opening the panel in InDesign.


