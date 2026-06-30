This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.claude/
  settings.local.json
docs/
  CodeVaultStarterPrompt.md.html
  IMPLEMENTATION_PLAN.md
  PROJECT_TIMELINE_TEMPLATE.md
  SPEC.md
packaging/
  codevault.desktop
public/
  tauri.svg
  vite.svg
src/
  assets/
    react.svg
  components/
    CodeEditor.tsx
    CommandPalette.tsx
    DeleteModal.tsx
    LanguageBadge.tsx
    Layout.tsx
    Settings.tsx
    Shortcuts.tsx
    Sidebar.tsx
    SnippetDetail.tsx
    SnippetList.tsx
    Toaster.tsx
  lib/
    api.ts
    editorTheme.ts
    languages.ts
    mockData.ts
    settings.ts
    store.ts
    toast.ts
    types.ts
  App.css
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
src-tauri/
  capabilities/
    default.json
  icons/
    128x128.png
    128x128@2x.png
    32x32.png
    icon.icns
    icon.ico
    icon.png
    Square107x107Logo.png
    Square142x142Logo.png
    Square150x150Logo.png
    Square284x284Logo.png
    Square30x30Logo.png
    Square310x310Logo.png
    Square44x44Logo.png
    Square71x71Logo.png
    Square89x89Logo.png
    StoreLogo.png
  src/
    commands.rs
    db.rs
    lib.rs
    main.rs
  .gitignore
  build.rs
  Cargo.toml
  tauri.conf.json
.gitignore
CLAUDE.md
index.html
LICENSE
package.json
pnpm-workspace.yaml
postcss.config.js
README.md
sample-snippets.md
tailwind.config.js
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: .claude/settings.local.json
````json
 1: {
 2:   "enabledMcpjsonServers": [
 3:     "python-sdk",
 4:     "docker",
 5:     "memory-bank",
 6:     "sequential-thinking",
 7:     "brave-search"
 8:   ],
 9:   "disabledMcpjsonServers": [
10:     "jupyter",
11:     "postgresql",
12:     "opik",
13:     "google-maps",
14:     "deep-graph"
15:   ]
16: }
````

## File: docs/CodeVaultStarterPrompt.md.html
````html
1: <html><head><meta content="text/html; charset=UTF-8" http-equiv="content-type"><style type="text/css">@import url(https://themes.googleusercontent.com/fonts/css?kit=XGMkxXUZTA64h2imyzu79g);ul.lst-kix_b9ic5bv32skt-6{list-style-type:none}ul.lst-kix_b9ic5bv32skt-7{list-style-type:none}ul.lst-kix_b9ic5bv32skt-4{list-style-type:none}ul.lst-kix_b9ic5bv32skt-5{list-style-type:none}ol.lst-kix_6p07b94gty1-8.start{counter-reset:lst-ctn-kix_6p07b94gty1-8 0}ul.lst-kix_b9ic5bv32skt-8{list-style-type:none}ul.lst-kix_b9ic5bv32skt-2{list-style-type:none}ul.lst-kix_b9ic5bv32skt-3{list-style-type:none}ul.lst-kix_b9ic5bv32skt-0{list-style-type:none}ul.lst-kix_b9ic5bv32skt-1{list-style-type:none}ul.lst-kix_jdwzlk6iopat-8{list-style-type:none}ul.lst-kix_jdwzlk6iopat-7{list-style-type:none}ul.lst-kix_jdwzlk6iopat-6{list-style-type:none}ul.lst-kix_jdwzlk6iopat-1{list-style-type:none}ul.lst-kix_jdwzlk6iopat-0{list-style-type:none}ul.lst-kix_jdwzlk6iopat-5{list-style-type:none}ul.lst-kix_jdwzlk6iopat-4{list-style-type:none}ul.lst-kix_jdwzlk6iopat-3{list-style-type:none}ol.lst-kix_6p07b94gty1-5.start{counter-reset:lst-ctn-kix_6p07b94gty1-5 0}ul.lst-kix_jdwzlk6iopat-2{list-style-type:none}ol.lst-kix_6p07b94gty1-2.start{counter-reset:lst-ctn-kix_6p07b94gty1-2 0}.lst-kix_b9ic5bv32skt-1>li:before{content:"\0025cb   "}.lst-kix_b9ic5bv32skt-0>li:before{content:"\0025cf   "}ul.lst-kix_6p07b94gty1-1{list-style-type:none}.lst-kix_jdwzlk6iopat-0>li:before{content:"\0025cf   "}.lst-kix_jdwzlk6iopat-2>li:before{content:"\0025a0   "}.lst-kix_jdwzlk6iopat-3>li:before{content:"\0025cf   "}.lst-kix_jdwzlk6iopat-1>li:before{content:"\0025cb   "}ul.lst-kix_160ndqkn5uwh-1{list-style-type:none}ul.lst-kix_160ndqkn5uwh-2{list-style-type:none}ul.lst-kix_160ndqkn5uwh-3{list-style-type:none}ul.lst-kix_160ndqkn5uwh-4{list-style-type:none}ul.lst-kix_160ndqkn5uwh-0{list-style-type:none}ol.lst-kix_6p07b94gty1-0.start{counter-reset:lst-ctn-kix_6p07b94gty1-0 0}ul.lst-kix_160ndqkn5uwh-5{list-style-type:none}ul.lst-kix_160ndqkn5uwh-6{list-style-type:none}ul.lst-kix_160ndqkn5uwh-7{list-style-type:none}ul.lst-kix_160ndqkn5uwh-8{list-style-type:none}ol.lst-kix_6p07b94gty1-7.start{counter-reset:lst-ctn-kix_6p07b94gty1-7 0}.lst-kix_jdwzlk6iopat-6>li:before{content:"\0025cf   "}.lst-kix_jdwzlk6iopat-7>li:before{content:"\0025cb   "}.lst-kix_jdwzlk6iopat-4>li:before{content:"\0025cb   "}.lst-kix_jdwzlk6iopat-8>li:before{content:"\0025a0   "}.lst-kix_6p07b94gty1-6>li{counter-increment:lst-ctn-kix_6p07b94gty1-6}.lst-kix_6p07b94gty1-3>li{counter-increment:lst-ctn-kix_6p07b94gty1-3}.lst-kix_jdwzlk6iopat-5>li:before{content:"\0025a0   "}.lst-kix_6p07b94gty1-0>li{counter-increment:lst-ctn-kix_6p07b94gty1-0}.lst-kix_6p07b94gty1-4>li{counter-increment:lst-ctn-kix_6p07b94gty1-4}.lst-kix_6p07b94gty1-5>li{counter-increment:lst-ctn-kix_6p07b94gty1-5}.lst-kix_6p07b94gty1-2>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-2,lower-roman) ". "}.lst-kix_g8wok839c4n6-1>li:before{content:"\0025cb   "}ul.lst-kix_610beb7hhbt4-8{list-style-type:none}.lst-kix_g8wok839c4n6-3>li:before{content:"\0025cf   "}ul.lst-kix_610beb7hhbt4-7{list-style-type:none}ul.lst-kix_610beb7hhbt4-6{list-style-type:none}.lst-kix_6p07b94gty1-1>li:before{content:"\0025cb   "}.lst-kix_6p07b94gty1-5>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-5,lower-roman) ". "}.lst-kix_g8wok839c4n6-0>li:before{content:"\0025cf   "}.lst-kix_g8wok839c4n6-4>li:before{content:"\0025cb   "}.lst-kix_d3q5p818bhp4-8>li:before{content:"\0025a0   "}ul.lst-kix_610beb7hhbt4-5{list-style-type:none}ul.lst-kix_610beb7hhbt4-4{list-style-type:none}.lst-kix_6p07b94gty1-6>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-6,decimal) ". "}ul.lst-kix_610beb7hhbt4-3{list-style-type:none}ul.lst-kix_610beb7hhbt4-2{list-style-type:none}ul.lst-kix_610beb7hhbt4-1{list-style-type:none}ul.lst-kix_610beb7hhbt4-0{list-style-type:none}.lst-kix_6p07b94gty1-8>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-8,lower-roman) ". "}.lst-kix_6p07b94gty1-0>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-0,decimal) ". "}.lst-kix_6p07b94gty1-7>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-7,lower-latin) ". "}.lst-kix_g8wok839c4n6-2>li:before{content:"\0025a0   "}.lst-kix_g8wok839c4n6-7>li:before{content:"\0025cb   "}.lst-kix_g8wok839c4n6-8>li:before{content:"\0025a0   "}ol.lst-kix_6p07b94gty1-6.start{counter-reset:lst-ctn-kix_6p07b94gty1-6 0}.lst-kix_g8wok839c4n6-5>li:before{content:"\0025a0   "}.lst-kix_6p07b94gty1-4>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-4,lower-latin) ". "}.lst-kix_6p07b94gty1-3>li:before{content:"" counter(lst-ctn-kix_6p07b94gty1-3,decimal) ". "}.lst-kix_g8wok839c4n6-6>li:before{content:"\0025cf   "}.lst-kix_6p07b94gty1-7>li{counter-increment:lst-ctn-kix_6p07b94gty1-7}.lst-kix_8h63i9bptlzy-8>li:before{content:"\0025a0   "}ol.lst-kix_6p07b94gty1-3.start{counter-reset:lst-ctn-kix_6p07b94gty1-3 0}.lst-kix_8h63i9bptlzy-6>li:before{content:"\0025cf   "}.lst-kix_b9ic5bv32skt-7>li:before{content:"\0025cb   "}.lst-kix_b9ic5bv32skt-8>li:before{content:"\0025a0   "}.lst-kix_8h63i9bptlzy-7>li:before{content:"\0025cb   "}.lst-kix_8h63i9bptlzy-1>li:before{content:"\0025cb   "}.lst-kix_6p07b94gty1-2>li{counter-increment:lst-ctn-kix_6p07b94gty1-2}ul.lst-kix_g8wok839c4n6-8{list-style-type:none}.lst-kix_b9ic5bv32skt-5>li:before{content:"\0025a0   "}.lst-kix_8h63i9bptlzy-0>li:before{content:"\0025cf   "}.lst-kix_8h63i9bptlzy-2>li:before{content:"\0025a0   "}.lst-kix_jykduisz0ucq-0>li:before{content:"\0025cf   "}.lst-kix_jykduisz0ucq-2>li:before{content:"\0025a0   "}ul.lst-kix_g8wok839c4n6-4{list-style-type:none}ul.lst-kix_jykduisz0ucq-2{list-style-type:none}ul.lst-kix_g8wok839c4n6-5{list-style-type:none}ul.lst-kix_jykduisz0ucq-1{list-style-type:none}ul.lst-kix_g8wok839c4n6-6{list-style-type:none}.lst-kix_d3q5p818bhp4-4>li:before{content:"\0025cb   "}.lst-kix_b9ic5bv32skt-2>li:before{content:"\0025a0   "}.lst-kix_b9ic5bv32skt-6>li:before{content:"\0025cf   "}ul.lst-kix_jykduisz0ucq-0{list-style-type:none}ul.lst-kix_g8wok839c4n6-7{list-style-type:none}.lst-kix_jykduisz0ucq-3>li:before{content:"\0025cf   "}.lst-kix_8h63i9bptlzy-5>li:before{content:"\0025a0   "}ul.lst-kix_g8wok839c4n6-0{list-style-type:none}.lst-kix_d3q5p818bhp4-5>li:before{content:"\0025a0   "}.lst-kix_610beb7hhbt4-0>li:before{content:"\0025cf   "}ul.lst-kix_jykduisz0ucq-6{list-style-type:none}ul.lst-kix_g8wok839c4n6-1{list-style-type:none}ul.lst-kix_jykduisz0ucq-5{list-style-type:none}.lst-kix_8h63i9bptlzy-4>li:before{content:"\0025cb   "}ul.lst-kix_g8wok839c4n6-2{list-style-type:none}ul.lst-kix_jykduisz0ucq-4{list-style-type:none}ul.lst-kix_g8wok839c4n6-3{list-style-type:none}ul.lst-kix_jykduisz0ucq-3{list-style-type:none}.lst-kix_8h63i9bptlzy-3>li:before{content:"\0025cf   "}.lst-kix_d3q5p818bhp4-7>li:before{content:"\0025cb   "}.lst-kix_b9ic5bv32skt-3>li:before{content:"\0025cf   "}.lst-kix_d3q5p818bhp4-6>li:before{content:"\0025cf   "}.lst-kix_b9ic5bv32skt-4>li:before{content:"\0025cb   "}ul.lst-kix_jykduisz0ucq-8{list-style-type:none}.lst-kix_6p07b94gty1-8>li{counter-increment:lst-ctn-kix_6p07b94gty1-8}.lst-kix_jykduisz0ucq-1>li:before{content:"\0025cb   "}ul.lst-kix_jykduisz0ucq-7{list-style-type:none}.lst-kix_610beb7hhbt4-4>li:before{content:"\0025cb   "}.lst-kix_160ndqkn5uwh-7>li:before{content:"\0025cb   "}.lst-kix_160ndqkn5uwh-8>li:before{content:"\0025a0   "}ol.lst-kix_6p07b94gty1-0{list-style-type:none}.lst-kix_jykduisz0ucq-8>li:before{content:"\0025a0   "}.lst-kix_610beb7hhbt4-2>li:before{content:"\0025a0   "}.lst-kix_610beb7hhbt4-6>li:before{content:"\0025cf   "}ul.lst-kix_8h63i9bptlzy-7{list-style-type:none}.lst-kix_610beb7hhbt4-1>li:before{content:"\0025cb   "}.lst-kix_610beb7hhbt4-5>li:before{content:"\0025a0   "}ul.lst-kix_8h63i9bptlzy-8{list-style-type:none}.lst-kix_jykduisz0ucq-7>li:before{content:"\0025cb   "}ul.lst-kix_8h63i9bptlzy-5{list-style-type:none}ul.lst-kix_d3q5p818bhp4-5{list-style-type:none}.lst-kix_160ndqkn5uwh-4>li:before{content:"\0025cb   "}ul.lst-kix_8h63i9bptlzy-6{list-style-type:none}ul.lst-kix_d3q5p818bhp4-6{list-style-type:none}ul.lst-kix_8h63i9bptlzy-3{list-style-type:none}ul.lst-kix_d3q5p818bhp4-7{list-style-type:none}.lst-kix_160ndqkn5uwh-5>li:before{content:"\0025a0   "}ul.lst-kix_8h63i9bptlzy-4{list-style-type:none}ul.lst-kix_d3q5p818bhp4-8{list-style-type:none}.lst-kix_jykduisz0ucq-4>li:before{content:"\0025cb   "}.lst-kix_jykduisz0ucq-6>li:before{content:"\0025cf   "}ul.lst-kix_8h63i9bptlzy-1{list-style-type:none}.lst-kix_d3q5p818bhp4-3>li:before{content:"\0025cf   "}.lst-kix_160ndqkn5uwh-6>li:before{content:"\0025cf   "}ul.lst-kix_8h63i9bptlzy-2{list-style-type:none}li.li-bullet-0:before{margin-left:-18pt;white-space:nowrap;display:inline-block;min-width:18pt}.lst-kix_d3q5p818bhp4-2>li:before{content:"\0025a0   "}.lst-kix_610beb7hhbt4-3>li:before{content:"\0025cf   "}ul.lst-kix_8h63i9bptlzy-0{list-style-type:none}.lst-kix_jykduisz0ucq-5>li:before{content:"\0025a0   "}.lst-kix_d3q5p818bhp4-1>li:before{content:"\0025cb   "}.lst-kix_160ndqkn5uwh-0>li:before{content:"\0025cf   "}.lst-kix_160ndqkn5uwh-1>li:before{content:"\0025cb   "}ul.lst-kix_d3q5p818bhp4-0{list-style-type:none}ul.lst-kix_d3q5p818bhp4-1{list-style-type:none}ol.lst-kix_6p07b94gty1-4.start{counter-reset:lst-ctn-kix_6p07b94gty1-4 0}ul.lst-kix_d3q5p818bhp4-2{list-style-type:none}.lst-kix_d3q5p818bhp4-0>li:before{content:"\0025cf   "}ul.lst-kix_d3q5p818bhp4-3{list-style-type:none}ul.lst-kix_d3q5p818bhp4-4{list-style-type:none}ol.lst-kix_6p07b94gty1-6{list-style-type:none}.lst-kix_610beb7hhbt4-8>li:before{content:"\0025a0   "}ol.lst-kix_6p07b94gty1-7{list-style-type:none}ol.lst-kix_6p07b94gty1-8{list-style-type:none}.lst-kix_160ndqkn5uwh-3>li:before{content:"\0025cf   "}ol.lst-kix_6p07b94gty1-2{list-style-type:none}.lst-kix_160ndqkn5uwh-2>li:before{content:"\0025a0   "}ol.lst-kix_6p07b94gty1-3{list-style-type:none}ol.lst-kix_6p07b94gty1-4{list-style-type:none}.lst-kix_610beb7hhbt4-7>li:before{content:"\0025cb   "}ol.lst-kix_6p07b94gty1-5{list-style-type:none}ol{margin:0;padding:0}table td,table th{padding:0}.c14{border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:0pt;border-right-width:0pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:0pt;border-top-style:solid;border-left-style:solid;border-bottom-width:0pt;width:121.8pt;border-top-color:#000000;border-bottom-style:solid}.c7{border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:0pt;border-right-width:0pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:0pt;border-top-style:solid;border-left-style:solid;border-bottom-width:0pt;width:300.2pt;border-top-color:#000000;border-bottom-style:solid}.c4{margin-left:36pt;padding-top:12pt;padding-left:0pt;padding-bottom:12pt;line-height:1.15;orphans:2;widows:2;text-align:left}.c0{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:11pt;font-family:"Arial";font-style:normal}.c21{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:20pt;font-family:"Arial";font-style:normal}.c19{color:#188038;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:11pt;font-family:"Roboto Mono";font-style:normal}.c8{padding-top:12pt;padding-bottom:12pt;line-height:1.15;orphans:2;widows:2;text-align:left}.c6{padding-top:18pt;padding-bottom:4pt;line-height:1.15;orphans:2;widows:2;text-align:left}.c20{padding-top:0pt;padding-bottom:0pt;line-height:1.15;orphans:2;widows:2;text-align:center}.c10{padding-top:24pt;padding-bottom:6pt;line-height:1.15;orphans:2;widows:2;text-align:left}.c15{color:#000000;text-decoration:none;vertical-align:baseline;font-size:23pt;font-family:"Arial";font-style:normal}.c5{color:#000000;text-decoration:none;vertical-align:baseline;font-size:17pt;font-family:"Arial";font-style:normal}.c9{color:#000000;text-decoration:none;vertical-align:baseline;font-size:11pt;font-family:"Arial";font-style:normal}.c1{padding-top:0pt;padding-bottom:0pt;line-height:1.15;orphans:2;widows:2;text-align:left}.c17{border-spacing:0;border-collapse:collapse;margin-right:auto}.c22{background-color:#ffffff;max-width:468pt;padding:72pt 72pt 72pt 72pt}.c2{padding:0;margin:0}.c11{margin-left:72pt;padding-left:0pt}.c16{page-break-after:avoid}.c18{margin-left:36pt}.c13{height:25pt}.c3{font-weight:700}.c12{height:11pt}.title{padding-top:0pt;color:#000000;font-size:26pt;padding-bottom:3pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}.subtitle{padding-top:0pt;color:#666666;font-size:15pt;padding-bottom:16pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}li{color:#000000;font-size:11pt;font-family:"Arial"}p{margin:0;color:#000000;font-size:11pt;font-family:"Arial"}h1{padding-top:20pt;color:#000000;font-size:20pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h2{padding-top:18pt;color:#000000;font-size:16pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h3{padding-top:16pt;color:#434343;font-size:14pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h4{padding-top:14pt;color:#666666;font-size:12pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h5{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h6{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;font-style:italic;orphans:2;widows:2;text-align:left}</style></head><body class="c22 doc-content"><h1 class="c10" id="h.dda0wjphr95h"><span class="c15 c3">Why Tauri is a great fit for CodeVault </span></h1><p class="c8"><span class="c0">For a personal snippet manager, Tauri gives you:</span></p><table class="c17"><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c20"><span class="c3">Need</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c20"><span class="c3">Why Tauri fits</span></p></td></tr><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c1"><span class="c0">Desktop app feel</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c1"><span class="c0">Launch from Ubuntu dock, no browser tab needed</span></p></td></tr><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c1"><span class="c0">Local data</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c1"><span class="c0">Store snippets in SQLite right on your machine</span></p></td></tr><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c1"><span class="c0">Fast startup</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c1"><span class="c0">Much lighter than Electron</span></p></td></tr><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c1"><span class="c0">Cross-platform</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c1"><span class="c0">Linux now, Windows later if you want</span></p></td></tr><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c1"><span class="c0">File system access</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c1"><span class="c0">Import/export Markdown, JSON, code files</span></p></td></tr><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c1"><span class="c0">Nice UI</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c1"><span class="c0">Use React/Svelte/Vue frontend</span></p></td></tr><tr class="c13"><td class="c14" colspan="1" rowspan="1"><p class="c1"><span class="c0">Native-ish utility vibes</span></p></td><td class="c7" colspan="1" rowspan="1"><p class="c1"><span class="c0">Feels like a real tool, not a website wearing a fake mustache</span></p></td></tr></table><p class="c8"><span>For personal utility, I&rsquo;d bias toward </span><span class="c3">local-first</span><span class="c0">&nbsp;instead of accounts, teams, cloud sync, and other product-manager confetti.</span></p><hr><p class="c1 c12"><span class="c0"></span></p><h1 class="c10" id="h.ld3ac3lub0w8"><span class="c15 c3">Recommended stack</span></h1><h1 class="c8 c16" id="h.siis4zu2plpg"><span class="c3">Name: </span><span class="c3">CodeVault</span></h1><h2 class="c6" id="h.e8igjapodwbz"><span class="c5 c3">Frontend</span></h2><ul class="c2 lst-kix_g8wok839c4n6-0 start"><li class="c4 li-bullet-0"><span class="c9 c3">React + TypeScript</span></li><li class="c4 li-bullet-0"><span class="c9 c3">Vite</span></li><li class="c4 li-bullet-0"><span class="c9 c3">Tailwind CSS</span></li><li class="c4 li-bullet-0"><span class="c3">Monaco Editor</span><span>&nbsp;or </span><span class="c9 c3">CodeMirror</span></li><li class="c4 li-bullet-0"><span class="c0">Optional: shadcn/ui for polished components</span></li></ul><h2 class="c6" id="h.y8gm4fcuc90a"><span class="c5 c3">Desktop shell</span></h2><ul class="c2 lst-kix_d3q5p818bhp4-0 start"><li class="c4 li-bullet-0"><span class="c9 c3">Tauri</span></li></ul><h2 class="c6" id="h.vehcca1z1pd8"><span class="c5 c3">Backend/native side</span></h2><ul class="c2 lst-kix_610beb7hhbt4-0 start"><li class="c4 li-bullet-0"><span class="c9 c3">Rust via Tauri commands</span></li><li class="c4 li-bullet-0"><span class="c0">SQLite access through Rust</span></li></ul><h2 class="c6" id="h.af8ni1ixswdq"><span class="c5 c3">Database</span></h2><ul class="c2 lst-kix_jdwzlk6iopat-0 start"><li class="c4 li-bullet-0"><span class="c9 c3">SQLite</span></li><li class="c4 li-bullet-0"><span class="c0">Store the DB at an app data path, not inside the project folder</span></li></ul><h2 class="c6" id="h.ip0gw71tzn77"><span class="c5 c3">Search</span></h2><p class="c8"><span class="c0">Start with basic SQL search.</span></p><p class="c8"><span class="c0">Later upgrade to:</span></p><ul class="c2 lst-kix_160ndqkn5uwh-0 start"><li class="c4 li-bullet-0"><span class="c0">SQLite FTS5 full-text search</span></li><li class="c4 li-bullet-0"><span class="c0">fuzzy search</span></li><li class="c4 li-bullet-0"><span class="c0">command palette search</span></li></ul><hr><p class="c1 c12"><span class="c0"></span></p><h1 class="c10" id="h.brao3slp4apr"><span class="c15 c3">Recommended Build Order</span></h1><h2 class="c6" id="h.3xqo96jw3a5k"><span class="c5 c3">MVP: CodeVault Desktop</span></h2><p class="c8"><span class="c0">Core features:</span></p><ol class="c2 lst-kix_6p07b94gty1-0 start" start="1"><li class="c4 li-bullet-0"><span class="c9 c3">Create snippets</span></li></ol><ul class="c2 lst-kix_6p07b94gty1-1 start"><li class="c8 c11 li-bullet-0"><span class="c0">title</span></li><li class="c8 c11 li-bullet-0"><span class="c0">language</span></li><li class="c8 c11 li-bullet-0"><span class="c0">tags</span></li><li class="c8 c11 li-bullet-0"><span class="c0">code/content</span></li><li class="c8 c11 li-bullet-0"><span class="c0">notes</span></li></ul><ol class="c2 lst-kix_6p07b94gty1-0" start="2"><li class="c4 li-bullet-0"><span class="c9 c3">Browse snippets</span></li></ol><ul class="c2 lst-kix_6p07b94gty1-1 start"><li class="c8 c11 li-bullet-0"><span class="c0">sidebar list</span></li><li class="c8 c11 li-bullet-0"><span class="c0">search bar</span></li><li class="c8 c11 li-bullet-0"><span class="c0">filter by tag/language</span></li></ul><ol class="c2 lst-kix_6p07b94gty1-0" start="3"><li class="c4 li-bullet-0"><span class="c9 c3">Edit snippets</span></li></ol><ul class="c2 lst-kix_6p07b94gty1-1 start"><li class="c8 c11 li-bullet-0"><span class="c0">Monaco/CodeMirror editor</span></li><li class="c8 c11 li-bullet-0"><span class="c0">autosave or manual save</span></li></ul><ol class="c2 lst-kix_6p07b94gty1-0" start="4"><li class="c4 li-bullet-0"><span class="c9 c3">Copy button</span></li></ol><ul class="c2 lst-kix_6p07b94gty1-1 start"><li class="c8 c11 li-bullet-0"><span class="c0">copy code to clipboard instantly</span></li></ul><ol class="c2 lst-kix_6p07b94gty1-0" start="5"><li class="c4 li-bullet-0"><span class="c9 c3">Local SQLite storage</span></li></ol><ul class="c2 lst-kix_6p07b94gty1-1 start"><li class="c8 c11 li-bullet-0"><span class="c0">no login</span></li><li class="c8 c11 li-bullet-0"><span class="c0">no server</span></li><li class="c8 c11 li-bullet-0"><span class="c0">no internet requirement</span></li></ul><p class="c8"><span class="c0">That alone would be genuinely useful.</span></p><hr><p class="c1 c12"><span class="c0"></span></p><h1 class="c10" id="h.q478zgjo5a5u"><span class="c15 c3">Ideal app layout</span></h1><p class="c8"><span class="c0">Something like:</span></p><p class="c1"><span class="c0">&#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9516;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;</span></p><p class="c1"><span class="c0">&#9474; Search &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474; Snippet Title &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474;</span></p><p class="c1"><span class="c0">&#9474; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&#9474; Tags: docker, caddy, https &nbsp; &nbsp;&#9474;</span></p><p class="c1"><span class="c0">&#9474; Collections &nbsp; &nbsp; &nbsp; &nbsp;&#9474; Language: Caddyfile &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474;</span></p><p class="c1"><span class="c0">&#9474; - Linux &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&#9474; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474;</span></p><p class="c1"><span class="c0">&#9474; - Docker &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474; &#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488; &#9474;</span></p><p class="c1"><span class="c0">&#9474; - Java &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474; &#9474; code editor &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474; &#9474;</span></p><p class="c1"><span class="c0">&#9474; - Tailscale &nbsp; &nbsp; &nbsp; &nbsp;&#9474; &#9474; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &#9474; &#9474;</span></p><p class="c1"><span class="c0">&#9474; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&#9474; &#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496; &#9474;</span></p><p class="c1"><span class="c0">&#9474; Snippet List &nbsp; &nbsp; &nbsp; &#9474; Notes / Markdown &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&#9474;</span></p><p class="c1"><span class="c0">&#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;</span></p><p class="c1 c12"><span class="c0"></span></p><p class="c8"><span>I would make it feel like a </span><span class="c3">terminal-adjacent knowledge vault</span><span class="c0">, not a corporate note app wearing beige shoes.</span></p><hr><p class="c1 c12"><span class="c0"></span></p><h1 class="c10" id="h.vicm5jcr1h9n"><span class="c15 c3">Database design</span></h1><p class="c8"><span class="c0">Start simple:</span></p><p class="c1"><span class="c0">snippets</span></p><p class="c1"><span class="c0">- id</span></p><p class="c1"><span class="c0">- title</span></p><p class="c1"><span class="c0">- description</span></p><p class="c1"><span class="c0">- language</span></p><p class="c1"><span class="c0">- code</span></p><p class="c1"><span class="c0">- notes</span></p><p class="c1"><span class="c0">- favorite</span></p><p class="c1"><span class="c0">- created_at</span></p><p class="c1"><span class="c0">- updated_at</span></p><p class="c1 c12"><span class="c0"></span></p><p class="c1"><span class="c0">tags</span></p><p class="c1"><span class="c0">- id</span></p><p class="c1"><span class="c0">- name</span></p><p class="c1 c12"><span class="c0"></span></p><p class="c1"><span class="c0">snippet_tags</span></p><p class="c1"><span class="c0">- snippet_id</span></p><p class="c1"><span class="c0">- tag_id</span></p><p class="c1 c12"><span class="c0"></span></p><p class="c8"><span class="c0">Later:</span></p><p class="c1"><span class="c0">collections</span></p><p class="c1"><span class="c0">- id</span></p><p class="c1"><span class="c0">- name</span></p><p class="c1 c12"><span class="c0"></span></p><p class="c1"><span class="c0">snippet_versions</span></p><p class="c1"><span class="c0">- id</span></p><p class="c1"><span class="c0">- snippet_id</span></p><p class="c1"><span class="c0">- code</span></p><p class="c1"><span class="c0">- notes</span></p><p class="c1"><span class="c0">- created_at</span></p><h1 class="c10" id="h.p94y1nfuh3o5"><span class="c3 c15">Also, make it command-friendly</span></h1><p class="c8"><span class="c0">Since I use Linux a lot, I&rsquo;d like to add a companion CLI:</span></p><p class="c1"><span class="c0">codevault add --title &quot;Restart Pi-hole&quot; --lang bash</span></p><p class="c1 c12"><span class="c0"></span></p><p class="c8"><span class="c0">Or pipe into it:</span></p><p class="c1"><span class="c0">history | tail -20 | codevault import</span></p><p class="c1 c12"><span class="c0"></span></p><p class="c8"><span>Now it becomes more than a snippet app. It becomes your personal </span><span class="c3">terminal memory trap</span><span class="c0">. </span></p><p class="c8"><span class="c0">Future ideas:</span></p><ul class="c2 lst-kix_8h63i9bptlzy-0 start"><li class="c4 li-bullet-0"><span class="c0">global hotkey to open quick add</span></li><li class="c4 li-bullet-0"><span>command palette with </span><span class="c19">Ctrl+K</span></li><li class="c4 li-bullet-0"><span class="c0">import from Markdown files</span></li><li class="c4 li-bullet-0"><span class="c0">export vault to Git repo</span></li><li class="c4 li-bullet-0"><span class="c0">backup to your Raspberry Pi or desktop</span></li><li class="c4 li-bullet-0"><span class="c0">optional Tailscale sync later</span></li><li class="c4 li-bullet-0"><span class="c0">AI tag suggestions using local Ollama</span></li></ul><hr><p class="c1 c12"><span class="c0"></span></p><h1 class="c10" id="h.r2qgh3we1jky"><span class="c15 c3">Suggested build order:</span></h1><h2 class="c6" id="h.amnft7qcsn3f"><span class="c5 c3">Phase 1: Tauri skeleton</span></h2><p class="c8"><span class="c0">Create the app, get React running, confirm it launches.</span></p><h2 class="c6" id="h.tud1lgiwujy8"><span class="c5 c3">Phase 2: Static UI mockup</span></h2><p class="c8"><span class="c0">Build the layout with fake snippets first.</span></p><h2 class="c6" id="h.gw18u5oy4kgp"><span class="c5 c3">Phase 3: SQLite storage</span></h2><p class="c8"><span class="c0">Add create/read/update/delete snippets.</span></p><h2 class="c6" id="h.eut858xizy44"><span class="c5 c3">Phase 4: Editor</span></h2><p class="c8"><span class="c0">Add CodeMirror or Monaco.</span></p><h2 class="c6" id="h.4zqj1hm52bxd"><span class="c5 c3">Phase 5: Search and tags</span></h2><p class="c8"><span class="c0">Basic search first, full-text search later.</span></p><h2 class="c6" id="h.6h2ewdp7kxlu"><span class="c3 c5">Phase 6: Polish</span></h2><p class="c8"><span class="c0">Keyboard shortcuts, dark theme, import/export, launcher icon.</span></p><p class="c8 c12 c18"><span class="c3 c9"></span></p><p class="c8 c12"><span class="c0"></span></p><p class="c1 c12"><span class="c0"></span></p></body></html>
````

## File: docs/IMPLEMENTATION_PLAN.md
````markdown
  1: # CodeVault — Implementation Plan
  2: 
  3: A phased, incremental build plan. Each phase ends with a runnable, demoable state.
  4: 
  5: ## Prerequisites
  6: 
  7: - Rust toolchain (`rustup`, stable) + `cargo`.
  8: - Node.js LTS + `pnpm` (or `npm`).
  9: - Tauri prerequisites for Linux: `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libxdo-dev`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`.
 10: - Verify: `cargo --version`, `node --version`, `pnpm --version`.
 11: 
 12: ---
 13: 
 14: ## Phase 1 — Tauri Skeleton
 15: 
 16: **Goal:** App launches, shows "Hello CodeVault".
 17: 
 18: 1. Scaffold: `pnpm create tauri-app` → choose React + TypeScript + Vite + pnpm.
 19: 2. Rename app to `codevault`; set bundle identifier `dev.codevault.app`.
 20: 3. Add Tailwind:
 21:    - `pnpm add -D tailwindcss postcss autoprefixer`
 22:    - `npx tailwindcss init -p`
 23:    - Configure `tailwind.config.js` content globs; import directives in `src/index.css`.
 24: 4. Run `pnpm tauri dev`; confirm window opens.
 25: 5. Commit: `chore: scaffold tauri + react + tailwind`.
 26: 
 27: **Exit criteria:** `pnpm tauri dev` opens a window rendering a Tailwind-styled component.
 28: 
 29: ---
 30: 
 31: ## Phase 2 — Static UI Mockup
 32: 
 33: **Goal:** Full three-pane layout rendered with hardcoded snippets.
 34: 
 35: 1. Create components:
 36:    - `src/components/Sidebar.tsx` — search input, collection list, snippet list.
 37:    - `src/components/SnippetList.tsx` — list rows.
 38:    - `src/components/SnippetDetail.tsx` — header + code area + notes.
 39:    - `src/components/Layout.tsx` — three-pane CSS grid.
 40: 2. Seed `src/lib/mockData.ts` with 8–10 fake snippets.
 41: 3. Wire client-side state with `zustand` (or React context) for selected snippet.
 42: 4. Apply dark theme; set monospace accents (`font-mono` on code, headings).
 43: 5. Add language badge + tag chips (visual only).
 44: 
 45: **Exit criteria:** Clicking a snippet in the list updates the detail pane. No persistence yet.
 46: 
 47: ---
 48: 
 49: ## Phase 3 — SQLite Storage
 50: 
 51: **Goal:** CRUD against a real local DB.
 52: 
 53: 1. Rust dependencies (`src-tauri/Cargo.toml`):
 54:    - `rusqlite = { version = "0.31", features = ["bundled"] }`
 55:    - `serde`, `serde_json`, `anyhow`, `thiserror`, `directories` (for data dir).
 56: 2. Create `src-tauri/src/db.rs`:
 57:    - `init_db()` — opens DB at app data dir, runs migrations.
 58:    - Migrations: versioned SQL strings; track in a `schema_version` table.
 59:    - Apply schema from SPEC §6 (snippets, tags, snippet_tags).
 60: 3. Implement repository functions: `list_snippets`, `get_snippet`, `create_snippet`, `update_snippet`, `delete_snippet`, `list_tags`, `set_snippet_tags`.
 61: 4. Expose Tauri commands in `src-tauri/src/main.rs` via `#[tauri::command]` and register with `.invoke_handler`.
 62: 5. Frontend: `src/lib/api.ts` wrapping `@tauri-apps/api/core` `invoke()` calls; typed Snippet interfaces matching Rust structs.
 63: 6. Replace mock data with real API calls; add a "New Snippet" button.
 64: 7. Add delete confirmation modal.
 65: 
 66: **Exit criteria:** Create, edit, delete snippets; data persists across app restarts.
 67: 
 68: ---
 69: 
 70: ## Phase 4 — Code Editor
 71: 
 72: **Goal:** Real syntax-highlighted editing.
 73: 
 74: 1. Install CodeMirror:
 75:    - `pnpm add @uiw/react-codemirror @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-rust @codemirror/lang-html @codemirror/lang-css @codemirror/lang-markdown @codemirror/lang-sql @codemirror/lang-yaml`
 76:    - `pnpm add @codemirror/theme-one-dark` (or pick a theme).
 77: 2. Build `src/components/CodeEditor.tsx`:
 78:    - Props: `value`, `onChange`, `language`.
 79:    - Language map: string → CodeMirror extension.
 80:    - Dark theme matching app.
 81: 3. Wire to detail pane; debounced autosave (500 ms) calling `update_snippet`.
 82: 4. Add language selector dropdown that switches highlighter.
 83: 5. Add "Copy code" button using `@tauri-apps/plugin-clipboard-manager` (`pnpm add @tauri-apps/plugin-clipboard-manager`; register plugin in Rust).
 84: 6. Notes pane: second CodeMirror instance with `markdown` mode (or `react-markdown` for preview toggle).
 85: 
 86: **Exit criteria:** Editing feels like a real editor; copy button puts code in clipboard.
 87: 
 88: ---
 89: 
 90: ## Phase 5 — Search & Tags
 91: 
 92: **Goal:** Find snippets fast.
 93: 
 94: 1. Basic search: backend SQL `LIKE` over title, code, notes; bind tag join for tag filter.
 95: 2. Frontend search input with 150 ms debounce → calls `search(query)`.
 96: 3. Tag management UI in detail header: chip input that calls `set_snippet_tags`.
 97: 4. Tag filter list in sidebar (click a tag → filter list).
 98: 5. Language filter dropdown in sidebar.
 99: 6. **FTS5 upgrade** (optional within Phase 5):
100:    - Add `snippets_fts` virtual table + triggers to keep in sync.
101:    - Switch `search()` to FTS5 `MATCH` query with rank ordering.
102: 7. Add `Ctrl+F` to focus search input.
103: 
104: **Exit criteria:** Sub-100 ms search on a few hundred snippets; tag and language filters work.
105: 
106: ---
107: 
108: ## Phase 6 — Polish
109: 
110: **Goal:** Feels like a real product.
111: 
112: 1. **Keyboard shortcuts** via `react-hotkeys-hook` or custom listener:
113:    - `Ctrl+N` new, `Ctrl+K` palette, `Ctrl+S` save, `Ctrl+/` toggle notes, `Ctrl+D` favorite.
114: 2. **Command palette** (`cmdk` library): search + jump-to + actions.
115: 3. **Import/export**:
116:    - JSON full-vault export (Tauri `dialog::save`).
117:    - JSON import with conflict resolution (skip / overwrite / rename).
118:    - Markdown import: parse front-matter for title/tags/language.
119: 4. **Settings page**: theme toggle, default language, DB location display, "Open data folder" button.
120: 5. **Backups**: on each launch, copy `vault.db` to `vault.db.bak-<date>`; keep last 7.
121: 6. **Linux launcher**: provide `.desktop` file; bundle icon. Tauri bundles `.deb` and `.AppImage` via `pnpm tauri build`.
122: 7. **CLI companion**:
123:    - New crate `codevault-cli` in workspace; shares `db` module with `src-tauri` (refactor `db.rs` into a `codevault-core` library crate).
124:    - Commands: `add`, `list`, `search`, `copy`, `import`, `export`.
125:    - File-lock or WAL coordination so CLI and GUI can both touch the DB.
126: 8. **Empty states, loading states, error toasts.**
127: 
128: **Exit criteria:** Installable `.deb` / `.AppImage`; CLI works; shortcuts feel snappy.
129: 
130: ---
131: 
132: ## Phase 7 — Future / Optional
133: 
134: - Global hotkey (system-wide) for quick-add (Tauri `global-shortcut` plugin).
135: - Snippet version history (`snippet_versions` table + diff viewer).
136: - Collections UI.
137: - Git-backed vault: `codevault sync` that commits + pushes a Markdown export to a configured repo.
138: - Tailscale sync of `vault.db` between machines (file-level sync; document conflict caveats).
139: - AI tag suggestions via local Ollama (`reqwest` to `http://localhost:11434`).
140: 
141: ---
142: 
143: ## Repo Layout (Target)
144: 
145: ```
146: Code-Vault/
147: ├── SPEC.md
148: ├── IMPLEMENTATION_PLAN.md
149: ├── README.md
150: ├── package.json
151: ├── pnpm-lock.yaml
152: ├── vite.config.ts
153: ├── tailwind.config.js
154: ├── index.html
155: ├── src/                       # React frontend
156: │   ├── main.tsx
157: │   ├── App.tsx
158: │   ├── components/
159: │   ├── lib/
160: │   │   ├── api.ts
161: │   │   └── types.ts
162: │   └── styles/
163: ├── src-tauri/                 # Tauri shell
164: │   ├── Cargo.toml
165: │   ├── tauri.conf.json
166: │   └── src/
167: │       ├── main.rs
168: │       └── commands.rs
169: ├── crates/                    # Phase 6
170: │   ├── codevault-core/        # shared DB + models
171: │   └── codevault-cli/
172: └── tests/
173: ```
174: 
175: ## Testing Strategy
176: 
177: - **Rust unit tests**: per-repository function, in-memory SQLite (`:memory:`).
178: - **Rust integration tests**: full migration + CRUD path against a temp file DB.
179: - **Frontend**: Vitest for `lib/`; React Testing Library for components.
180: - **E2E** (Phase 6+): Tauri's WebDriver via `tauri-driver` for smoke tests.
181: 
182: ## Definition of Done (MVP = end of Phase 5)
183: 
184: - Create, edit, delete, search, tag, and copy snippets.
185: - Data persists at the platform-appropriate location.
186: - Dark theme, three-pane layout, syntax highlighting.
187: - Builds to a runnable `.AppImage` on Linux.
````

## File: docs/PROJECT_TIMELINE_TEMPLATE.md
````markdown
  1: # Project Timeline Template
  2: 
  3: Use this file as a living roadmap for a project. Keep the entries short, dated, and outcome-focused so the diagram stays useful as the project grows.
  4: 
  5: ## How To Use
  6: 
  7: - Copy this file into a new project as `docs/PROJECT_TIMELINE.md`.
  8: - Replace the example project name, phases, and dates.
  9: - Update the timeline when a major decision, feature, release, or blocker happens.
 10: - Keep detailed implementation notes in separate docs, then link them from the entries below.
 11: 
 12: ## Project Snapshot
 13: 
 14: | Field | Example |
 15: | --- | --- |
 16: | Project | CodeVault |
 17: | Purpose | Local-first desktop snippet manager |
 18: | Current phase | Polish and packaging |
 19: | Next milestone | CLI companion |
 20: | Last updated | 2026-06-05 |
 21: 
 22: ## Timeline
 23: 
 24: ```mermaid
 25: timeline
 26:     title CodeVault Project Timeline
 27: 
 28:     2026-05-01 : Phase 1
 29:                : Tauri skeleton created
 30:                : App launches locally
 31: 
 32:     2026-05-08 : Phase 2
 33:                : Static three-pane UI
 34:                : Mock snippets added
 35: 
 36:     2026-05-15 : Phase 3
 37:                : SQLite storage wired in
 38:                : CRUD commands connected
 39: 
 40:     2026-05-22 : Phase 4
 41:                : CodeMirror editor added
 42:                : Syntax highlighting enabled
 43: 
 44:     2026-05-29 : Phase 5
 45:                : Search and tags implemented
 46:                : Filtering workflow improved
 47: 
 48:     2026-06-05 : Phase 6
 49:                : Shortcuts, settings, toasts
 50:                : Import/export and backups in progress
 51: ```
 52: 
 53: ## Roadmap
 54: 
 55: ```mermaid
 56: flowchart LR
 57:     idea["Idea"]
 58:     skeleton["App Skeleton"]
 59:     ui["Core UI"]
 60:     data["Local Storage"]
 61:     editor["Editor Experience"]
 62:     search["Search + Tags"]
 63:     polish["Polish + Packaging"]
 64:     cli["CLI Companion"]
 65:     release["Release"]
 66: 
 67:     idea --> skeleton --> ui --> data --> editor --> search --> polish --> cli --> release
 68: 
 69:     skeleton:::done
 70:     ui:::done
 71:     data:::done
 72:     editor:::done
 73:     search:::done
 74:     polish:::active
 75:     cli:::next
 76:     release:::future
 77: 
 78:     classDef done fill:#d9f99d,stroke:#3f6212,color:#1a2e05
 79:     classDef active fill:#bfdbfe,stroke:#1d4ed8,color:#172554
 80:     classDef next fill:#fde68a,stroke:#b45309,color:#451a03
 81:     classDef future fill:#e5e7eb,stroke:#6b7280,color:#111827
 82: ```
 83: 
 84: ## Decision Log
 85: 
 86: | Date | Decision | Reason | Follow-up |
 87: | --- | --- | --- | --- |
 88: | 2026-05-01 | Use Tauri + React | Native desktop feel with web UI speed | Keep Rust commands small and typed |
 89: | 2026-05-15 | Store data in SQLite | Local-first persistence without a server | Add backup and import/export paths |
 90: | 2026-05-22 | Use CodeMirror 6 | Strong editor behavior and language support | Add themes and keyboard polish |
 91: 
 92: ## Milestone Status
 93: 
 94: ```mermaid
 95: journey
 96:     title Project Build Journey
 97:     section Foundation
 98:       Define project purpose: 5: You
 99:       Create desktop shell: 5: You
100:       Add mock UI: 5: You
101:     section Core Product
102:       Connect database: 5: You
103:       Build snippet editor: 4: You
104:       Add search and tags: 4: You
105:     section Ship Readiness
106:       Add shortcuts and settings: 4: You
107:       Add import/export: 4: You
108:       Build CLI companion: 2: You
109:       Package release: 2: You
110: ```
111: 
112: ## Weekly Build Notes
113: 
114: ### 2026-06-05
115: 
116: **Shipped:** Shortcuts, command palette, toasts, import/export, settings, and launch backups.
117: 
118: **Learned:** Project history is easier to understand when each phase has a short outcome, not a long implementation diary.
119: 
120: **Next:** Finish the CLI companion and verify packaged builds.
121: 
122: ## Template Prompts
123: 
124: Use these prompts when updating the file:
125: 
126: - What changed this week?
127: - What decision did I make, and why?
128: - What is now finished enough to mark as done?
129: - What is blocked?
130: - What is the next visible milestone?
````

## File: docs/SPEC.md
````markdown
  1: # CodeVault — Spec Sheet
  2: 
  3: ## 1. Overview
  4: 
  5: **CodeVault** is a local-first desktop snippet manager. It stores code snippets, notes, and tags in a local SQLite database and runs as a native Tauri app with a React/TypeScript frontend. No accounts, no cloud, no server — a personal "terminal memory trap" for reusable code, configs, and commands.
  6: 
  7: ## 2. Goals & Non-Goals
  8: 
  9: ### Goals
 10: - Native-feeling desktop app on Linux (Ubuntu primary), portable to Windows/macOS.
 11: - Local-first: all data stored on disk, works fully offline.
 12: - Fast launch, fast search, fast copy-to-clipboard.
 13: - Rich code editing with syntax highlighting.
 14: - Companion CLI for terminal-driven capture.
 15: 
 16: ### Non-Goals (MVP)
 17: - Multi-user accounts, teams, sharing.
 18: - Cloud sync (deferred — optional Tailscale sync later).
 19: - Mobile clients.
 20: - Real-time collaboration.
 21: 
 22: ## 3. Target User
 23: 
 24: A single developer (Linux power user) who wants a personal vault for code snippets, shell one-liners, configs, and notes — accessible without a browser tab or cloud login.
 25: 
 26: ## 4. Tech Stack
 27: 
 28: | Layer | Choice |
 29: |---|---|
 30: | Desktop shell | Tauri (Rust) |
 31: | Frontend | React + TypeScript + Vite |
 32: | Styling | Tailwind CSS (+ optional shadcn/ui) |
 33: | Editor | CodeMirror 6 (preferred) or Monaco |
 34: | Native/Backend | Rust (Tauri commands) |
 35: | Database | SQLite (via `rusqlite` or `sqlx`) |
 36: | Search (MVP) | SQL `LIKE` queries |
 37: | Search (later) | SQLite FTS5 + fuzzy ranking |
 38: | CLI companion | Rust binary sharing the same DB |
 39: 
 40: ## 5. Functional Requirements
 41: 
 42: ### 5.1 Snippets (MVP)
 43: - Create snippet with: title, description, language, code, notes (markdown), tags, favorite flag.
 44: - View snippet in a detail pane with syntax-highlighted code + rendered notes.
 45: - Edit snippet inline; autosave on blur (or explicit Save).
 46: - Delete snippet (with confirmation).
 47: - Copy code to clipboard via a single button or keyboard shortcut.
 48: - Toggle favorite.
 49: 
 50: ### 5.2 Browsing & Search
 51: - Sidebar list of snippets (title + language badge + tags).
 52: - Search bar filters by title, code body, and tags.
 53: - Filter by tag and by language.
 54: - Sort by recently updated (default), created, alphabetical.
 55: 
 56: ### 5.3 Tags & Collections
 57: - Tags are free-form, many-to-many with snippets.
 58: - Tag chips in the detail view; click to filter.
 59: - Collections (Phase 6+): user-defined groupings (e.g., "Linux", "Docker").
 60: 
 61: ### 5.4 Import / Export
 62: - Import: Markdown files, JSON dump.
 63: - Export: full vault to JSON; per-snippet to `.md` or raw code file.
 64: - Export vault as a Git repo (Phase 6).
 65: 
 66: ### 5.5 CLI Companion (Phase 6)
 67: - `codevault add --title "..." --lang bash` — opens `$EDITOR` for body.
 68: - `codevault add --title "..." --lang bash --file path.sh`
 69: - `history | tail -20 | codevault import` — pipe stdin.
 70: - `codevault list`, `codevault search <query>`, `codevault copy <id>`.
 71: - Reads/writes the same SQLite DB as the desktop app.
 72: 
 73: ### 5.6 Keyboard / Power-User
 74: - `Ctrl+K` command palette (search + actions).
 75: - `Ctrl+N` new snippet.
 76: - `Ctrl+C` (in detail view) copy code.
 77: - Global hotkey to open quick-add (Phase 6).
 78: 
 79: ## 6. Data Model
 80: 
 81: ### Tables (MVP)
 82: 
 83: ```
 84: snippets
 85: - id           INTEGER PRIMARY KEY
 86: - title        TEXT NOT NULL
 87: - description  TEXT
 88: - language     TEXT
 89: - code         TEXT NOT NULL
 90: - notes        TEXT          -- markdown
 91: - favorite     INTEGER DEFAULT 0
 92: - created_at   INTEGER       -- unix epoch
 93: - updated_at   INTEGER
 94: 
 95: tags
 96: - id           INTEGER PRIMARY KEY
 97: - name         TEXT UNIQUE NOT NULL
 98: 
 99: snippet_tags
100: - snippet_id   INTEGER REFERENCES snippets(id) ON DELETE CASCADE
101: - tag_id       INTEGER REFERENCES tags(id) ON DELETE CASCADE
102: - PRIMARY KEY (snippet_id, tag_id)
103: ```
104: 
105: ### Tables (Later)
106: 
107: ```
108: collections
109: - id, name, created_at
110: 
111: snippet_collections
112: - snippet_id, collection_id
113: 
114: snippet_versions          -- history / undo
115: - id, snippet_id, code, notes, created_at
116: 
117: snippets_fts              -- FTS5 virtual table mirroring title/code/notes
118: ```
119: 
120: ### Storage Location
121: - Linux: `$XDG_DATA_HOME/codevault/vault.db` (fallback `~/.local/share/codevault/vault.db`)
122: - Windows: `%APPDATA%\codevault\vault.db`
123: - macOS: `~/Library/Application Support/codevault/vault.db`
124: 
125: ## 7. UI Layout
126: 
127: Three-pane layout:
128: 
129: ```
130: ┌──────────────┬──────────────────────────────────────────┐
131: │ Search       │ Snippet Title                            │
132: │              │ Tags: docker, caddy, https               │
133: │ Collections  │ Language: Caddyfile                      │
134: │  - Linux     │                                          │
135: │  - Docker    │ ┌──────────────────────────────────────┐ │
136: │  - Java      │ │ code editor (CodeMirror)             │ │
137: │  - Tailscale │ │                                      │ │
138: │              │ └──────────────────────────────────────┘ │
139: │ Snippet List │ Notes / Markdown                         │
140: └──────────────┴──────────────────────────────────────────┘
141: ```
142: 
143: - **Left rail**: search input, collection/tag filters, snippet list.
144: - **Right pane**: snippet metadata header, code editor, notes panel.
145: - Dark theme default; "terminal-adjacent" aesthetic (monospace accents, muted palette).
146: 
147: ## 8. Tauri Command Surface
148: 
149: Rust commands exposed to the frontend:
150: 
151: - `list_snippets(filter: Filter) -> Vec<SnippetSummary>`
152: - `get_snippet(id: i64) -> Snippet`
153: - `create_snippet(input: NewSnippet) -> Snippet`
154: - `update_snippet(id: i64, patch: SnippetPatch) -> Snippet`
155: - `delete_snippet(id: i64) -> ()`
156: - `toggle_favorite(id: i64) -> bool`
157: - `list_tags() -> Vec<Tag>`
158: - `set_snippet_tags(id: i64, tag_names: Vec<String>) -> ()`
159: - `search(query: String) -> Vec<SnippetSummary>`
160: - `copy_to_clipboard(text: String) -> ()` (or use `@tauri-apps/plugin-clipboard-manager`)
161: - `export_vault(path: String, format: ExportFormat) -> ()`
162: - `import_vault(path: String, format: ImportFormat) -> ImportReport`
163: 
164: ## 9. Non-Functional Requirements
165: 
166: - **Startup time**: cold launch < 500 ms on modern hardware.
167: - **Search latency**: < 50 ms over 10k snippets (FTS5 phase).
168: - **Bundle size**: < 15 MB installer (Tauri target).
169: - **Data integrity**: SQLite WAL mode; transactional writes; daily auto-backup file (Phase 6).
170: - **Accessibility**: full keyboard navigation; screen-reader labels on actions.
171: 
172: ## 10. Risks & Open Questions
173: 
174: - CodeMirror vs Monaco: CodeMirror is lighter and fits Tauri's minimalist ethos; Monaco gives VS Code parity but is heavier. **Recommendation: CodeMirror 6.**
175: - SQLite migrations strategy: use `refinery` or hand-rolled versioned scripts in Rust.
176: - Clipboard plugin permission scope in Tauri v2.
177: - AI tag suggestions (Ollama): out of MVP; revisit after Phase 6.
178: 
179: ---
````

## File: packaging/codevault.desktop
````
 1: [Desktop Entry]
 2: Type=Application
 3: Name=CodeVault
 4: GenericName=Snippet Manager
 5: Comment=Local-first desktop snippet manager
 6: Exec=codevault %U
 7: Icon=codevault
 8: Terminal=false
 9: Categories=Development;Utility;
10: Keywords=snippets;code;developer;vault;
11: 
12: # The .deb produced by `pnpm tauri build` already installs a desktop entry and
13: # icon. This standalone file is for AppImage / manual installs: adjust `Exec`
14: # to the absolute path of your binary (or place the AppImage on your PATH as
15: # `codevault`), copy this file to ~/.local/share/applications/, and install the
16: # icon with e.g.
17: #   cp src-tauri/icons/128x128.png ~/.local/share/icons/codevault.png
````

## File: public/tauri.svg
````xml
1: <svg width="206" height="231" viewBox="0 0 206 231" fill="none" xmlns="http://www.w3.org/2000/svg">
2: <path d="M143.143 84C143.143 96.1503 133.293 106 121.143 106C108.992 106 99.1426 96.1503 99.1426 84C99.1426 71.8497 108.992 62 121.143 62C133.293 62 143.143 71.8497 143.143 84Z" fill="#FFC131"/>
3: <ellipse cx="84.1426" cy="147" rx="22" ry="22" transform="rotate(180 84.1426 147)" fill="#24C8DB"/>
4: <path fill-rule="evenodd" clip-rule="evenodd" d="M166.738 154.548C157.86 160.286 148.023 164.269 137.757 166.341C139.858 160.282 141 153.774 141 147C141 144.543 140.85 142.121 140.558 139.743C144.975 138.204 149.215 136.139 153.183 133.575C162.73 127.404 170.292 118.608 174.961 108.244C179.63 97.8797 181.207 86.3876 179.502 75.1487C177.798 63.9098 172.884 53.4021 165.352 44.8883C157.82 36.3744 147.99 30.2165 137.042 27.1546C126.095 24.0926 114.496 24.2568 103.64 27.6274C92.7839 30.998 83.1319 37.4317 75.8437 46.1553C74.9102 47.2727 74.0206 48.4216 73.176 49.5993C61.9292 50.8488 51.0363 54.0318 40.9629 58.9556C44.2417 48.4586 49.5653 38.6591 56.679 30.1442C67.0505 17.7298 80.7861 8.57426 96.2354 3.77762C111.685 -1.01901 128.19 -1.25267 143.769 3.10474C159.348 7.46215 173.337 16.2252 184.056 28.3411C194.775 40.457 201.767 55.4101 204.193 71.404C206.619 87.3978 204.374 103.752 197.73 118.501C191.086 133.25 180.324 145.767 166.738 154.548ZM41.9631 74.275L62.5557 76.8042C63.0459 72.813 63.9401 68.9018 65.2138 65.1274C57.0465 67.0016 49.2088 70.087 41.9631 74.275Z" fill="#FFC131"/>
5: <path fill-rule="evenodd" clip-rule="evenodd" d="M38.4045 76.4519C47.3493 70.6709 57.2677 66.6712 67.6171 64.6132C65.2774 70.9669 64 77.8343 64 85.0001C64 87.1434 64.1143 89.26 64.3371 91.3442C60.0093 92.8732 55.8533 94.9092 51.9599 97.4256C42.4128 103.596 34.8505 112.392 30.1816 122.756C25.5126 133.12 23.9357 144.612 25.6403 155.851C27.3449 167.09 32.2584 177.598 39.7906 186.112C47.3227 194.626 57.153 200.784 68.1003 203.846C79.0476 206.907 90.6462 206.743 101.502 203.373C112.359 200.002 122.011 193.568 129.299 184.845C130.237 183.722 131.131 182.567 131.979 181.383C143.235 180.114 154.132 176.91 164.205 171.962C160.929 182.49 155.596 192.319 148.464 200.856C138.092 213.27 124.357 222.426 108.907 227.222C93.458 232.019 76.9524 232.253 61.3736 227.895C45.7948 223.538 31.8055 214.775 21.0867 202.659C10.3679 190.543 3.37557 175.59 0.949823 159.596C-1.47592 143.602 0.768139 127.248 7.41237 112.499C14.0566 97.7497 24.8183 85.2327 38.4045 76.4519ZM163.062 156.711L163.062 156.711C162.954 156.773 162.846 156.835 162.738 156.897C162.846 156.835 162.954 156.773 163.062 156.711Z" fill="#24C8DB"/>
6: </svg>
````

## File: public/vite.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
````

## File: src/assets/react.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: src/components/CommandPalette.tsx
````typescript
  1: import { useEffect, useState } from "react";
  2: import { Command } from "cmdk";
  3: import { writeText } from "@tauri-apps/plugin-clipboard-manager";
  4: import { useVaultStore } from "../lib/store";
  5: import { toast } from "../lib/toast";
  6: import LanguageBadge from "./LanguageBadge";
  7: 
  8: export default function CommandPalette() {
  9:   const paletteOpen = useVaultStore((s) => s.paletteOpen);
 10:   const setPaletteOpen = useVaultStore((s) => s.setPaletteOpen);
 11:   const snippets = useVaultStore((s) => s.snippets);
 12:   const selected = useVaultStore((s) => s.selectedSnippet());
 13:   const {
 14:     createSnippet,
 15:     toggleFavorite,
 16:     confirmDelete,
 17:     selectSnippet,
 18:     toggleNotes,
 19:     setSettingsOpen,
 20:   } = useVaultStore();
 21: 
 22:   const [search, setSearch] = useState("");
 23: 
 24:   // Reset the query each time the palette opens
 25:   useEffect(() => {
 26:     if (paletteOpen) setSearch("");
 27:   }, [paletteOpen]);
 28: 
 29:   if (!paletteOpen) return null;
 30: 
 31:   const close = () => setPaletteOpen(false);
 32: 
 33:   // Wrap an action so every command closes the palette afterwards
 34:   const run = (fn: () => void) => () => {
 35:     close();
 36:     fn();
 37:   };
 38: 
 39:   const copySelected = run(() => {
 40:     if (!selected) return;
 41:     writeText(selected.code)
 42:       .then(() => toast.success("Code copied to clipboard"))
 43:       .catch(() => toast.error("Failed to copy"));
 44:   });
 45: 
 46:   return (
 47:     <div
 48:       className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[12vh]"
 49:       onClick={close}
 50:     >
 51:       <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl mx-4">
 52:         <Command
 53:           label="Command palette"
 54:           className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden font-mono"
 55:           // cmdk filters items by their `value`; keep it simple and case-insensitive
 56:         >
 57:           <Command.Input
 58:             autoFocus
 59:             value={search}
 60:             onValueChange={setSearch}
 61:             placeholder="Type a command or search snippets…"
 62:             className="w-full bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none border-b border-zinc-800"
 63:           />
 64:           <Command.List className="max-h-[50vh] overflow-y-auto p-2">
 65:             <Command.Empty className="px-3 py-6 text-center text-xs text-zinc-600">
 66:               No results.
 67:             </Command.Empty>
 68: 
 69:             <Command.Group
 70:               heading="Actions"
 71:               className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-zinc-600"
 72:             >
 73:               <PaletteItem value="new snippet create" onSelect={run(createSnippet)}>
 74:                 ＋ New snippet
 75:                 <Shortcut keys="Ctrl+N" />
 76:               </PaletteItem>
 77:               <PaletteItem
 78:                 value="settings import export preferences"
 79:                 onSelect={run(() => setSettingsOpen(true))}
 80:               >
 81:                 ⚙ Open settings
 82:                 <Shortcut keys="Ctrl+," />
 83:               </PaletteItem>
 84:               {selected && (
 85:                 <>
 86:                   <PaletteItem
 87:                     value={`favourite favorite star ${selected.title}`}
 88:                     onSelect={run(() => toggleFavorite(selected.id))}
 89:                   >
 90:                     ★ {selected.favorite ? "Unfavourite" : "Favourite"} current snippet
 91:                     <Shortcut keys="Ctrl+D" />
 92:                   </PaletteItem>
 93:                   <PaletteItem value={`copy code ${selected.title}`} onSelect={copySelected}>
 94:                     ⧉ Copy current snippet code
 95:                   </PaletteItem>
 96:                   <PaletteItem value="toggle notes" onSelect={run(toggleNotes)}>
 97:                     ▭ Toggle notes pane
 98:                     <Shortcut keys="Ctrl+/" />
 99:                   </PaletteItem>
100:                   <PaletteItem
101:                     value={`delete remove ${selected.title}`}
102:                     onSelect={run(() => confirmDelete(selected.id))}
103:                   >
104:                     🗑 Delete current snippet
105:                   </PaletteItem>
106:                 </>
107:               )}
108:             </Command.Group>
109: 
110:             <Command.Group
111:               heading="Snippets"
112:               className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-zinc-600"
113:             >
114:               {snippets.map((s) => (
115:                 <PaletteItem
116:                   key={s.id}
117:                   value={`${s.title} ${s.language} ${s.tags.join(" ")}`}
118:                   onSelect={run(() => selectSnippet(s.id))}
119:                 >
120:                   <span className="flex-1 min-w-0 truncate text-zinc-200">{s.title}</span>
121:                   <LanguageBadge language={s.language} />
122:                 </PaletteItem>
123:               ))}
124:             </Command.Group>
125:           </Command.List>
126:         </Command>
127:       </div>
128:     </div>
129:   );
130: }
131: 
132: function PaletteItem({
133:   value,
134:   onSelect,
135:   children,
136: }: {
137:   value: string;
138:   onSelect: () => void;
139:   children: React.ReactNode;
140: }) {
141:   return (
142:     <Command.Item
143:       value={value}
144:       onSelect={onSelect}
145:       className="flex items-center gap-2 px-3 py-2 rounded text-sm text-zinc-300 cursor-pointer data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100 transition-colors"
146:     >
147:       {children}
148:     </Command.Item>
149:   );
150: }
151: 
152: function Shortcut({ keys }: { keys: string }) {
153:   return (
154:     <span className="ml-auto text-xs text-zinc-600 tracking-wide flex-shrink-0">{keys}</span>
155:   );
156: }
````

## File: src/components/DeleteModal.tsx
````typescript
 1: import { useVaultStore } from "../lib/store";
 2: 
 3: export default function DeleteModal() {
 4:   const { deleteConfirmId, confirmDelete, deleteSnippet, snippets } = useVaultStore();
 5: 
 6:   if (deleteConfirmId === null) return null;
 7: 
 8:   const snippet = snippets.find((s) => s.id === deleteConfirmId);
 9: 
10:   return (
11:     <div
12:       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
13:       onClick={() => confirmDelete(null)}
14:     >
15:       <div
16:         className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-sm mx-4 shadow-2xl"
17:         onClick={(e) => e.stopPropagation()}
18:       >
19:         <h3 className="text-zinc-100 font-mono font-semibold text-sm mb-2">
20:           Delete snippet?
21:         </h3>
22:         <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-6">
23:           <span className="text-zinc-200">"{snippet?.title ?? "this snippet"}"</span> will be
24:           permanently removed. This cannot be undone.
25:         </p>
26:         <div className="flex items-center justify-end gap-3">
27:           <button
28:             onClick={() => confirmDelete(null)}
29:             className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
30:           >
31:             cancel
32:           </button>
33:           <button
34:             onClick={() => deleteSnippet(deleteConfirmId)}
35:             className="px-4 py-2 text-xs font-mono bg-red-900 border border-red-700 text-red-200 rounded hover:bg-red-800 transition-colors"
36:           >
37:             delete
38:           </button>
39:         </div>
40:       </div>
41:     </div>
42:   );
43: }
````

## File: src/components/LanguageBadge.tsx
````typescript
 1: const LANG_COLORS: Record<string, string> = {
 2:   typescript: "bg-blue-900 text-blue-300",
 3:   javascript: "bg-yellow-900 text-yellow-300",
 4:   python: "bg-sky-900 text-sky-300",
 5:   rust: "bg-orange-900 text-orange-300",
 6:   bash: "bg-zinc-700 text-zinc-300",
 7:   sql: "bg-purple-900 text-purple-300",
 8:   yaml: "bg-cyan-900 text-cyan-300",
 9:   nginx: "bg-green-900 text-green-300",
10:   html: "bg-red-900 text-red-300",
11:   css: "bg-pink-900 text-pink-300",
12:   markdown: "bg-zinc-700 text-zinc-400",
13:   json: "bg-amber-900 text-amber-300",
14: };
15: 
16: interface Props {
17:   language: string;
18: }
19: 
20: export default function LanguageBadge({ language }: Props) {
21:   const cls = LANG_COLORS[language.toLowerCase()] ?? "bg-zinc-700 text-zinc-400";
22:   return (
23:     <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wide ${cls}`}>
24:       {language}
25:     </span>
26:   );
27: }
````

## File: src/components/Shortcuts.tsx
````typescript
 1: import { useEffect } from "react";
 2: import { useVaultStore } from "../lib/store";
 3: 
 4: /**
 5:  * Global keyboard shortcuts. Renders nothing; just registers a window listener.
 6:  *
 7:  *   Ctrl/Cmd+N  new snippet
 8:  *   Ctrl/Cmd+K  toggle command palette
 9:  *   Ctrl/Cmd+D  toggle favourite of the selected snippet
10:  *   Ctrl/Cmd+/  toggle the notes pane
11:  *   Ctrl/Cmd+,  toggle settings
12:  *   Escape      close the command palette / settings
13:  *
14:  * Ctrl+F (focus search) lives in Sidebar; Ctrl+S (flush save) lives in
15:  * SnippetDetail, since those act on component-local refs/state.
16:  */
17: export default function Shortcuts() {
18:   useEffect(() => {
19:     const onKeyDown = (e: KeyboardEvent) => {
20:       const mod = e.ctrlKey || e.metaKey;
21:       const store = useVaultStore.getState();
22: 
23:       if (e.key === "Escape") {
24:         if (store.paletteOpen) {
25:           e.preventDefault();
26:           store.setPaletteOpen(false);
27:           return;
28:         }
29:         if (store.settingsOpen) {
30:           e.preventDefault();
31:           store.setSettingsOpen(false);
32:           return;
33:         }
34:       }
35: 
36:       if (!mod) return;
37: 
38:       // Ctrl/Cmd+, opens settings (",": e.key is "," with no shift)
39:       if (e.key === ",") {
40:         e.preventDefault();
41:         store.setSettingsOpen(!store.settingsOpen);
42:         return;
43:       }
44: 
45:       switch (e.key.toLowerCase()) {
46:         case "n":
47:           e.preventDefault();
48:           store.createSnippet();
49:           break;
50:         case "k":
51:           e.preventDefault();
52:           store.togglePalette();
53:           break;
54:         case "d":
55:           if (store.selectedId !== null) {
56:             e.preventDefault();
57:             store.toggleFavorite(store.selectedId);
58:           }
59:           break;
60:         case "/":
61:           e.preventDefault();
62:           store.toggleNotes();
63:           break;
64:       }
65:     };
66: 
67:     window.addEventListener("keydown", onKeyDown);
68:     return () => window.removeEventListener("keydown", onKeyDown);
69:   }, []);
70: 
71:   return null;
72: }
````

## File: src/components/SnippetList.tsx
````typescript
 1: import type { Snippet } from "../lib/types";
 2: import { useVaultStore } from "../lib/store";
 3: import LanguageBadge from "./LanguageBadge";
 4: 
 5: function StarIcon({ filled }: { filled: boolean }) {
 6:   return (
 7:     <svg
 8:       className={`w-3.5 h-3.5 flex-shrink-0 ${filled ? "text-emerald-400" : "text-zinc-600"}`}
 9:       fill={filled ? "currentColor" : "none"}
10:       stroke="currentColor"
11:       strokeWidth={2}
12:       viewBox="0 0 24 24"
13:     >
14:       <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
15:     </svg>
16:   );
17: }
18: 
19: interface RowProps {
20:   snippet: Snippet;
21:   selected: boolean;
22:   onClick: () => void;
23: }
24: 
25: function SnippetRow({ snippet, selected, onClick }: RowProps) {
26:   return (
27:     <button
28:       onClick={onClick}
29:       className={`w-full text-left px-3 py-3 border-b border-zinc-800 transition-colors group ${
30:         selected
31:           ? "bg-zinc-800 border-l-2 border-l-emerald-500"
32:           : "hover:bg-zinc-800/50 border-l-2 border-l-transparent"
33:       }`}
34:     >
35:       <div className="flex items-start justify-between gap-2 mb-1">
36:         <span className={`text-sm font-mono leading-snug flex-1 min-w-0 truncate ${selected ? "text-zinc-100" : "text-zinc-200 group-hover:text-zinc-100"}`}>
37:           {snippet.title}
38:         </span>
39:         <StarIcon filled={snippet.favorite} />
40:       </div>
41:       <div className="flex items-center gap-2 flex-wrap">
42:         <LanguageBadge language={snippet.language} />
43:         {snippet.tags.slice(0, 2).map((tag) => (
44:           <span key={tag} className="text-xs text-zinc-500 font-mono">
45:             #{tag}
46:           </span>
47:         ))}
48:         {snippet.tags.length > 2 && (
49:           <span className="text-xs text-zinc-600 font-mono">+{snippet.tags.length - 2}</span>
50:         )}
51:       </div>
52:     </button>
53:   );
54: }
55: 
56: export default function SnippetList() {
57:   const { selectedId, selectSnippet, filteredSnippets } = useVaultStore();
58:   const snippets = filteredSnippets();
59: 
60:   if (snippets.length === 0) {
61:     return (
62:       <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center">
63:         <span className="text-2xl mb-2">◌</span>
64:         no snippets found
65:       </div>
66:     );
67:   }
68: 
69:   return (
70:     <div className="overflow-y-auto h-full">
71:       {snippets.map((s) => (
72:         <SnippetRow
73:           key={s.id}
74:           snippet={s}
75:           selected={s.id === selectedId}
76:           onClick={() => selectSnippet(s.id)}
77:         />
78:       ))}
79:     </div>
80:   );
81: }
````

## File: src/components/Toaster.tsx
````typescript
 1: import { useToastStore } from "../lib/toast";
 2: import type { ToastKind } from "../lib/toast";
 3: 
 4: const KIND_STYLES: Record<ToastKind, string> = {
 5:   info: "border-zinc-600 text-zinc-200",
 6:   success: "border-emerald-700 text-emerald-200",
 7:   error: "border-red-700 text-red-200",
 8: };
 9: 
10: const KIND_GLYPH: Record<ToastKind, string> = {
11:   info: "›",
12:   success: "✓",
13:   error: "✕",
14: };
15: 
16: export default function Toaster() {
17:   const { toasts, dismiss } = useToastStore();
18: 
19:   if (toasts.length === 0) return null;
20: 
21:   return (
22:     <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
23:       {toasts.map((t) => (
24:         <button
25:           key={t.id}
26:           onClick={() => dismiss(t.id)}
27:           className={`text-left bg-zinc-900 border rounded-lg px-3 py-2.5 shadow-2xl font-mono text-xs flex items-start gap-2 hover:bg-zinc-800 transition-colors ${KIND_STYLES[t.kind]}`}
28:           title="dismiss"
29:         >
30:           <span className="flex-shrink-0 font-bold">{KIND_GLYPH[t.kind]}</span>
31:           <span className="flex-1 leading-relaxed break-words">{t.message}</span>
32:         </button>
33:       ))}
34:     </div>
35:   );
36: }
````

## File: src/lib/editorTheme.ts
````typescript
 1: import { createTheme } from "@uiw/codemirror-themes";
 2: import { tags as t } from "@lezer/highlight";
 3: import type { Extension } from "@codemirror/state";
 4: 
 5: // Bespoke CodeVault editor themes — a tuned alternative to the ubiquitous
 6: // `oneDark`. The palette echoes the app's emerald accent: emerald keywords,
 7: // warm amber strings, cyan calls, violet literals, with a soft "phosphor"
 8: // glow on the active line. Two variants share one hue language so switching
 9: // light/dark feels like the same theme at different brightness.
10: 
11: const DARK = {
12:   bg: "#09090b", // zinc-950
13:   fg: "#e4e4e7", // zinc-200
14:   caret: "#34d399", // emerald-400
15:   selection: "rgba(16,185,129,0.20)",
16:   selectionMatch: "rgba(16,185,129,0.12)",
17:   lineHighlight: "rgba(16,185,129,0.055)",
18:   gutterFg: "#3f3f46", // zinc-700
19:   gutterActive: "#34d399",
20:   comment: "#52525b", // zinc-600
21:   keyword: "#34d399", // emerald-400
22:   string: "#fcd34d", // amber-300
23:   func: "#67e8f9", // cyan-300
24:   literal: "#c4b5fd", // violet-300
25:   type: "#5eead4", // teal-300
26:   prop: "#a5b4fc", // indigo-300
27:   heading: "#34d399",
28:   invalid: "#f87171", // red-400
29: };
30: 
31: const LIGHT = {
32:   bg: "#fafaf9", // warm off-white
33:   fg: "#27272a", // zinc-800
34:   caret: "#059669", // emerald-600
35:   selection: "rgba(5,150,105,0.16)",
36:   selectionMatch: "rgba(5,150,105,0.10)",
37:   lineHighlight: "rgba(5,150,105,0.06)",
38:   gutterFg: "#a8a29e", // stone-400
39:   gutterActive: "#059669",
40:   comment: "#a1a1aa", // zinc-400
41:   keyword: "#047857", // emerald-700
42:   string: "#b45309", // amber-700
43:   func: "#0e7490", // cyan-700
44:   literal: "#7c3aed", // violet-600
45:   type: "#0f766e", // teal-700
46:   prop: "#4338ca", // indigo-700
47:   heading: "#047857",
48:   invalid: "#dc2626", // red-600
49: };
50: 
51: type Palette = typeof DARK;
52: 
53: function build(theme: "dark" | "light", c: Palette): Extension {
54:   return createTheme({
55:     theme,
56:     settings: {
57:       background: c.bg,
58:       foreground: c.fg,
59:       caret: c.caret,
60:       selection: c.selection,
61:       selectionMatch: c.selectionMatch,
62:       lineHighlight: c.lineHighlight,
63:       gutterBackground: c.bg,
64:       gutterForeground: c.gutterFg,
65:       gutterActiveForeground: c.gutterActive,
66:       fontFamily: "var(--font-mono)",
67:     },
68:     styles: [
69:       { tag: [t.comment, t.lineComment, t.blockComment], color: c.comment, fontStyle: "italic" },
70:       { tag: [t.keyword, t.modifier, t.operatorKeyword, t.controlKeyword], color: c.keyword },
71:       { tag: [t.string, t.special(t.string), t.regexp], color: c.string },
72:       { tag: [t.function(t.variableName), t.function(t.propertyName), t.macroName], color: c.func },
73:       { tag: [t.number, t.bool, t.null, t.atom], color: c.literal },
74:       { tag: [t.typeName, t.className, t.namespace, t.definition(t.typeName)], color: c.type },
75:       { tag: [t.propertyName, t.attributeName], color: c.prop },
76:       { tag: [t.tagName], color: c.keyword },
77:       { tag: [t.variableName, t.definition(t.variableName)], color: c.fg },
78:       { tag: [t.operator, t.punctuation, t.separator, t.bracket], color: c.fg },
79:       { tag: [t.heading, t.heading1, t.heading2, t.heading3], color: c.heading, fontWeight: "700" },
80:       { tag: [t.link, t.url], color: c.string, textDecoration: "underline" },
81:       { tag: [t.emphasis], fontStyle: "italic" },
82:       { tag: [t.strong], fontWeight: "700" },
83:       { tag: [t.meta, t.processingInstruction], color: c.comment },
84:       { tag: [t.invalid], color: c.invalid },
85:     ],
86:   });
87: }
88: 
89: export const darkEditorTheme = build("dark", DARK);
90: export const lightEditorTheme = build("light", LIGHT);
````

## File: src/lib/languages.ts
````typescript
1: // Languages CodeVault knows about. CodeEditor's LANG_MAP decides which of
2: // these get real syntax highlighting; the rest render as plain text.
3: export const LANGUAGES = [
4:   "bash", "css", "html", "javascript", "json", "markdown",
5:   "nginx", "python", "rust", "sql", "toml", "typescript", "yaml",
6: ] as const;
7: 
8: export type Language = (typeof LANGUAGES)[number];
````

## File: src/lib/mockData.ts
````typescript
  1: import type { Snippet } from "./types";
  2: 
  3: export const mockSnippets: Snippet[] = [
  4:   {
  5:     id: 1,
  6:     title: "Find large files on disk",
  7:     description: "List top 20 files by size, sorted descending",
  8:     language: "bash",
  9:     code: `find / -type f -printf '%s\\t%p\\n' 2>/dev/null \\
 10:   | sort -rn \\
 11:   | head -20 \\
 12:   | awk '{printf "%s\\t%s\\n", $1/1024/1024 "MB", $2}'`,
 13:     notes: "Run as root for full coverage. Skips permission errors via stderr redirect.",
 14:     favorite: true,
 15:     tags: ["linux", "disk", "sysadmin"],
 16:     created_at: 1700000000,
 17:     updated_at: 1700100000,
 18:   },
 19:   {
 20:     id: 2,
 21:     title: "Retry with exponential backoff",
 22:     description: "Decorator that retries a function on exception",
 23:     language: "python",
 24:     code: `import time, functools
 25: 
 26: def retry(max_attempts=3, base_delay=1.0, exceptions=(Exception,)):
 27:     def decorator(fn):
 28:         @functools.wraps(fn)
 29:         def wrapper(*args, **kwargs):
 30:             for attempt in range(max_attempts):
 31:                 try:
 32:                     return fn(*args, **kwargs)
 33:                 except exceptions as e:
 34:                     if attempt == max_attempts - 1:
 35:                         raise
 36:                     time.sleep(base_delay * 2**attempt)
 37:         return wrapper
 38:     return decorator
 39: 
 40: @retry(max_attempts=5, base_delay=0.5)
 41: def fetch_data(url: str) -> dict:
 42:     ...`,
 43:     notes: "Works well for network calls. Pass specific exception types to avoid swallowing bugs.",
 44:     favorite: false,
 45:     tags: ["python", "utils", "networking"],
 46:     created_at: 1700200000,
 47:     updated_at: 1700200000,
 48:   },
 49:   {
 50:     id: 3,
 51:     title: "Docker Compose — Postgres + Redis",
 52:     description: "Local dev stack with Postgres 16 and Redis 7",
 53:     language: "yaml",
 54:     code: `services:
 55:   db:
 56:     image: postgres:16-alpine
 57:     restart: unless-stopped
 58:     environment:
 59:       POSTGRES_USER: dev
 60:       POSTGRES_PASSWORD: dev
 61:       POSTGRES_DB: appdb
 62:     ports:
 63:       - "5432:5432"
 64:     volumes:
 65:       - pgdata:/var/lib/postgresql/data
 66: 
 67:   cache:
 68:     image: redis:7-alpine
 69:     restart: unless-stopped
 70:     ports:
 71:       - "6379:6379"
 72: 
 73: volumes:
 74:   pgdata:`,
 75:     notes: "Swap alpine for the full image if you need locale support. Add `healthcheck` blocks before dependent services.",
 76:     favorite: true,
 77:     tags: ["docker", "postgres", "redis", "devops"],
 78:     created_at: 1700300000,
 79:     updated_at: 1700400000,
 80:   },
 81:   {
 82:     id: 4,
 83:     title: "Rust — anyhow error context chain",
 84:     description: "Pattern for adding context to errors without losing the source",
 85:     language: "rust",
 86:     code: `use anyhow::{Context, Result};
 87: 
 88: fn read_config(path: &str) -> Result<Config> {
 89:     let contents = std::fs::read_to_string(path)
 90:         .with_context(|| format!("failed to read config at {path}"))?;
 91: 
 92:     let config: Config = toml::from_str(&contents)
 93:         .context("config file is not valid TOML")?;
 94: 
 95:     Ok(config)
 96: }`,
 97:     notes: "Use `context()` for static messages, `with_context(|| ...)` when building the message is expensive or needs runtime data.",
 98:     favorite: false,
 99:     tags: ["rust", "error-handling"],
100:     created_at: 1700500000,
101:     updated_at: 1700500000,
102:   },
103:   {
104:     id: 5,
105:     title: "TypeScript — deep readonly utility",
106:     description: "Recursively marks every property as readonly",
107:     language: "typescript",
108:     code: `type DeepReadonly<T> = T extends (infer U)[]
109:   ? ReadonlyArray<DeepReadonly<U>>
110:   : T extends object
111:   ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
112:   : T;
113: 
114: // Usage
115: type Config = DeepReadonly<{
116:   db: { host: string; port: number };
117:   flags: string[];
118: }>;`,
119:     notes: "Useful for config objects you want to freeze at the type level. Combine with `Object.freeze` for runtime safety.",
120:     favorite: false,
121:     tags: ["typescript", "types", "utils"],
122:     created_at: 1700600000,
123:     updated_at: 1700600000,
124:   },
125:   {
126:     id: 6,
127:     title: "SQL — top N per group (window)",
128:     description: "Rank rows within groups and take the top N",
129:     language: "sql",
130:     code: `WITH ranked AS (
131:   SELECT
132:     *,
133:     ROW_NUMBER() OVER (
134:       PARTITION BY category
135:       ORDER BY score DESC
136:     ) AS rn
137:   FROM products
138: )
139: SELECT *
140: FROM ranked
141: WHERE rn <= 3
142: ORDER BY category, rn;`,
143:     notes: "ROW_NUMBER skips ties. Use RANK() to include ties or DENSE_RANK() for consecutive ranks without gaps.",
144:     favorite: true,
145:     tags: ["sql", "window-functions", "postgres"],
146:     created_at: 1700700000,
147:     updated_at: 1700700000,
148:   },
149:   {
150:     id: 7,
151:     title: "Caddy — reverse proxy with HTTPS",
152:     description: "Minimal Caddyfile for proxying a local service",
153:     language: "nginx",
154:     code: `app.example.com {
155:     reverse_proxy localhost:3000
156: 
157:     encode gzip
158: 
159:     header {
160:         Strict-Transport-Security "max-age=31536000; includeSubDomains"
161:         X-Content-Type-Options "nosniff"
162:         X-Frame-Options "DENY"
163:         -Server
164:     }
165: }`,
166:     notes: "Caddy auto-provisions TLS via Let's Encrypt. Port 80/443 must be open. Replace localhost:3000 with your upstream.",
167:     favorite: false,
168:     tags: ["caddy", "https", "devops", "networking"],
169:     created_at: 1700800000,
170:     updated_at: 1700900000,
171:   },
172:   {
173:     id: 8,
174:     title: "Git — useful aliases",
175:     description: "Quality-of-life git config aliases",
176:     language: "bash",
177:     code: `git config --global alias.lg \\
178:   "log --oneline --graph --decorate --all"
179: 
180: git config --global alias.st "status -sb"
181: git config --global alias.co "checkout"
182: git config --global alias.br "branch -vv"
183: git config --global alias.undo "reset HEAD~1 --mixed"
184: git config --global alias.aliases "config --get-regexp alias"`,
185:     notes: "`git undo` is non-destructive — keeps changes in working tree. Run `git aliases` to list all configured aliases.",
186:     favorite: false,
187:     tags: ["git", "linux", "workflow"],
188:     created_at: 1700950000,
189:     updated_at: 1700950000,
190:   },
191:   {
192:     id: 9,
193:     title: "Python — dataclass with validation",
194:     description: "Pydantic v2 model with field validators",
195:     language: "python",
196:     code: `from pydantic import BaseModel, field_validator, model_validator
197: from typing import Optional
198: 
199: class UserCreate(BaseModel):
200:     username: str
201:     email: str
202:     age: Optional[int] = None
203: 
204:     @field_validator("username")
205:     @classmethod
206:     def username_alphanumeric(cls, v: str) -> str:
207:         if not v.replace("_", "").isalnum():
208:             raise ValueError("username must be alphanumeric")
209:         return v.lower()
210: 
211:     @model_validator(mode="after")
212:     def check_age(self) -> "UserCreate":
213:         if self.age is not None and self.age < 13:
214:             raise ValueError("age must be 13 or older")
215:         return self`,
216:     notes: "field_validator runs before model_validator. Use mode='before' on field validators to transform raw input first.",
217:     favorite: false,
218:     tags: ["python", "pydantic", "validation"],
219:     created_at: 1701000000,
220:     updated_at: 1701000000,
221:   },
222:   {
223:     id: 10,
224:     title: "JavaScript — debounce",
225:     description: "Delay a function call until input settles",
226:     language: "javascript",
227:     code: `function debounce(fn, delay) {
228:   let timer;
229:   return function (...args) {
230:     clearTimeout(timer);
231:     timer = setTimeout(() => fn.apply(this, args), delay);
232:   };
233: }
234: 
235: // Usage
236: const handleSearch = debounce((query) => {
237:   console.log("searching:", query);
238: }, 300);`,
239:     notes: "For leading-edge fire (execute immediately, then suppress), flip the logic: call fn on first invocation and block subsequent ones within the window.",
240:     favorite: false,
241:     tags: ["javascript", "utils", "performance"],
242:     created_at: 1701100000,
243:     updated_at: 1701100000,
244:   },
245: ];
````

## File: src/lib/toast.ts
````typescript
 1: import { create } from "zustand";
 2: 
 3: export type ToastKind = "info" | "success" | "error";
 4: 
 5: export interface Toast {
 6:   id: number;
 7:   kind: ToastKind;
 8:   message: string;
 9: }
10: 
11: interface ToastState {
12:   toasts: Toast[];
13:   push: (kind: ToastKind, message: string) => void;
14:   dismiss: (id: number) => void;
15: }
16: 
17: let nextId = 1;
18: const TIMEOUT_MS = 4000;
19: 
20: export const useToastStore = create<ToastState>((set) => ({
21:   toasts: [],
22:   push: (kind, message) => {
23:     const id = nextId++;
24:     set((s) => ({ toasts: [...s.toasts, { id, kind, message }] }));
25:     setTimeout(() => {
26:       set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
27:     }, TIMEOUT_MS);
28:   },
29:   dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
30: }));
31: 
32: // Imperative helper so non-component code (e.g. the store) can raise toasts.
33: export const toast = {
34:   info: (message: string) => useToastStore.getState().push("info", message),
35:   success: (message: string) => useToastStore.getState().push("success", message),
36:   error: (message: string) => useToastStore.getState().push("error", message),
37: };
````

## File: src/App.css
````css
1: @tailwind base;
2: @tailwind components;
3: @tailwind utilities;
````

## File: src/index.css
````css
  1: @tailwind base;
  2: @tailwind components;
  3: @tailwind utilities;
  4: 
  5: /* ------------------------------------------------------------------------- */
  6: /* Type system                                                               */
  7: /*   Monaspace Neon  — code + UI mono (ligatures + texture healing)          */
  8: /*   Fraunces        — editorial serif for titles / display                  */
  9: /*   Font @font-face declarations are pulled in via main.tsx (Fontsource).   */
 10: /* ------------------------------------------------------------------------- */
 11: 
 12: :root {
 13:   --font-mono: "Monaspace Neon", ui-monospace, "SFMono-Regular", Menlo, monospace;
 14:   --font-display: "Fraunces Variable", "Fraunces", Georgia, "Times New Roman", serif;
 15: 
 16:   /* Surface / neutral ramp — Tailwind's `zinc-*` classes resolve to these.
 17:      Dark is the default; `.light` (below) flips the ramp so every existing
 18:      component recolours with no markup changes. Values are R G B channels so
 19:      Tailwind opacity modifiers (e.g. zinc-800/5) keep working. */
 20:   --zinc-50:  250 250 250;
 21:   --zinc-100: 244 244 245;
 22:   --zinc-200: 228 228 231;
 23:   --zinc-300: 212 212 216;
 24:   --zinc-400: 161 161 170;
 25:   --zinc-500: 113 113 122;
 26:   --zinc-600: 82 82 91;
 27:   --zinc-700: 63 63 70;
 28:   --zinc-800: 39 39 42;
 29:   --zinc-900: 24 24 27;
 30:   --zinc-950: 9 9 11;
 31: 
 32:   /* Emerald accent ramp */
 33:   --emerald-200: 167 243 208;
 34:   --emerald-300: 110 231 183;
 35:   --emerald-400: 52 211 153;
 36:   --emerald-500: 16 185 129;
 37:   --emerald-600: 5 150 105;
 38:   --emerald-700: 4 120 87;
 39:   --emerald-800: 6 95 70;
 40:   --emerald-900: 6 78 59;
 41: 
 42:   /* Red (destructive) ramp */
 43:   --red-200: 254 202 202;
 44:   --red-300: 252 165 165;
 45:   --red-400: 248 113 113;
 46:   --red-700: 185 28 28;
 47:   --red-800: 153 27 27;
 48:   --red-900: 127 29 29;
 49: }
 50: 
 51: /* Light theme — invert the neutral ramp so dark-mode backgrounds become light
 52:    and dark-mode text becomes dark, preserving each component's contrast
 53:    relationship. Accents shift darker so they stay legible on light surfaces. */
 54: :root.light {
 55:   --zinc-950: 250 250 249; /* warm off-white page */
 56:   --zinc-900: 245 245 244;
 57:   --zinc-800: 231 229 228; /* panels / borders */
 58:   --zinc-700: 214 211 209;
 59:   --zinc-600: 168 162 158;
 60:   --zinc-500: 120 113 108;
 61:   --zinc-400: 87 83 78;
 62:   --zinc-300: 68 64 60;
 63:   --zinc-200: 41 37 36;
 64:   --zinc-100: 28 25 23;  /* primary text */
 65:   --zinc-50:  23 23 23;
 66: 
 67:   --emerald-200: 6 95 70;
 68:   --emerald-300: 4 120 87;
 69:   --emerald-400: 5 150 105;
 70:   --emerald-500: 16 185 129;
 71:   --emerald-600: 5 150 105;
 72:   --emerald-700: 16 185 129; /* focus borders stay visible */
 73:   --emerald-800: 110 231 183;
 74:   --emerald-900: 167 243 208;
 75: 
 76:   --red-200: 153 27 27;
 77:   --red-300: 185 28 28;
 78:   --red-400: 220 38 38;
 79:   --red-700: 248 113 113;
 80:   --red-800: 254 202 202;
 81:   --red-900: 254 226 226;
 82: }
 83: 
 84: html, body, #root {
 85:   height: 100%;
 86: }
 87: 
 88: body {
 89:   font-family: var(--font-mono);
 90:   /* Monaspace ligatures + contextual texture healing; Fraunces ligatures. */
 91:   font-feature-settings: "liga" 1, "calt" 1, "ss01" 1, "ss02" 1, "ss03" 1;
 92:   -webkit-font-smoothing: antialiased;
 93:   -moz-osx-font-smoothing: grayscale;
 94:   text-rendering: optimizeLegibility;
 95: }
 96: 
 97: /* Editorial display utility — applied to titles / headings. Fraunces shines
 98:    with a touch of optical-size and a softer, characterful axis setting. */
 99: .font-display {
100:   font-family: var(--font-display);
101:   font-optical-sizing: auto;
102:   font-variation-settings: "SOFT" 30, "WONK" 1, "opsz" 40;
103:   letter-spacing: -0.01em;
104: }
105: 
106: /* CodeMirror: let the editor breathe — line-height and padding aren't part of
107:    the colour theme, so they live here and apply to both light and dark. */
108: .cm-editor .cm-content {
109:   font-family: var(--font-mono);
110:   line-height: 1.7;
111:   padding: 10px 0;
112: }
113: .cm-editor .cm-gutters {
114:   font-family: var(--font-mono);
115:   border-right: 1px solid rgb(var(--zinc-800));
116: }
117: .cm-editor .cm-lineNumbers .cm-gutterElement {
118:   padding: 0 12px 0 16px;
119: }
120: /* Smooth the active-line "phosphor" transition. */
121: .cm-editor .cm-activeLine,
122: .cm-editor .cm-activeLineGutter {
123:   transition: background-color 120ms ease;
124: }
````

## File: src/vite-env.d.ts
````typescript
1: /// <reference types="vite/client" />
````

## File: src-tauri/src/main.rs
````rust
1: // Prevents additional console window on Windows in release, DO NOT REMOVE!!
2: #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
3: 
4: fn main() {
5:     codevault_lib::run()
6: }
````

## File: src-tauri/.gitignore
````
1: # Generated by Cargo
2: # will have compiled files and executables
3: /target/
4: 
5: # Generated by Tauri
6: # will have schema files for capabilities auto-completion
7: /gen/schemas
````

## File: src-tauri/build.rs
````rust
1: fn main() {
2:     tauri_build::build()
3: }
````

## File: CLAUDE.md
````markdown
 1: # CLAUDE.md
 2: 
 3: This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
 4: 
 5: > Note: there is an unrelated generic-Python `CLAUDE.md` in the home directory (`~/CLAUDE.md`). It does **not** apply here. CodeVault is a Tauri + React + TypeScript desktop app with a Rust/SQLite backend. Ignore the Python toolchain instructions.
 6: 
 7: ## Project Overview
 8: 
 9: CodeVault is a local-first desktop snippet manager — a native app for storing reusable code, shell one-liners, configs, and commands with syntax highlighting, tags, and markdown notes. No accounts, no cloud; everything lives in a local SQLite database. The build is phased; see `docs/IMPLEMENTATION_PLAN.md` and the roadmap in `README.md` for status.
10: 
11: ## Commands
12: 
13: All frontend commands use `pnpm` (a `pnpm-lock.yaml` is committed — do not introduce `npm`/`yarn`).
14: 
15: - `pnpm install` — install frontend deps
16: - `pnpm tauri dev` — run the full desktop app in dev (starts Vite on port 1420, then the Tauri shell). This is the primary way to run the app — `pnpm dev` alone only serves the frontend, which will fail on any `invoke()` call since the Rust backend isn't running.
17: - `pnpm tauri build` — production build; produces `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`
18: - `pnpm build` — type-check (`tsc`) + Vite build of the frontend only
19: - Rust backend: `cargo build` / `cargo check` / `cargo clippy` from inside `src-tauri/`
20: 
21: There is no test suite or linter configured yet (no vitest/eslint/jest). `pnpm build` (which runs `tsc`) is the closest thing to a frontend check; use `cargo check`/`cargo clippy` for the Rust side.
22: 
23: ### Linux system dependencies
24: 
25: Tauri needs system libraries to build (`pnpm install` alone is not enough):
26: 
27: ```bash
28: sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
29:   libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
30: ```
31: 
32: ## Architecture
33: 
34: The app is two halves bridged by Tauri's IPC. Understanding this boundary is the key to working here.
35: 
36: **Frontend (`src/`)** — React 19 + TypeScript + Vite, styled with Tailwind, editor via CodeMirror 6.
37: **Backend (`src-tauri/src/`)** — Rust, SQLite via `rusqlite` (bundled).
38: 
39: ### The data flow (single source of truth → UI)
40: 
41: ```
42: SQLite (vault.db)
43:   └─ src-tauri/src/db.rs        repository fns + schema/migrations; owns the Snippet struct
44:   └─ src-tauri/src/commands.rs  thin #[tauri::command] wrappers; lock the Mutex, map errors to String
45:   └─ src-tauri/src/lib.rs       registers DbState + invoke_handler (every new command must be listed here)
46:         ↕ Tauri IPC (invoke)
47:   └─ src/lib/api.ts             typed invoke() wrappers — one fn per Rust command, the ONLY IPC layer
48:   └─ src/lib/store.ts           Zustand store — app state, calls api.*, holds snippets[] in memory
49:   └─ src/components/*           render from the store; mutations go back through the store
50: ```
51: 
52: Key conventions and gotchas when extending:
53: 
54: - **Adding a backend command requires four coordinated edits**: implement in `db.rs`, wrap in `commands.rs`, register in the `invoke_handler!` macro in `lib.rs`, and add a typed wrapper in `src/lib/api.ts`. Missing the `lib.rs` registration is the most common mistake — the command will fail at runtime, not compile time.
55: - **Argument name casing across the IPC boundary**: Tauri auto-converts. JS passes camelCase keys (e.g. `tagNames`) and the Rust command receives snake_case params (`tag_names`). The invoke object keys in `api.ts` must match what Tauri expects — see `setSnippetTags` for the pattern.
56: - **The DB connection is a single `Mutex<Connection>`** held in `DbState` (`commands.rs`) and managed by Tauri. Every command locks it. There is no connection pool; keep handlers short.
57: - **`Snippet` is denormalized on read**: tags live in `tags`/`snippet_tags` join tables but are flattened into a `Vec<String>` via `GROUP_CONCAT` in the shared `SNIPPET_SELECT` constant (`db.rs`). Reuse `SNIPPET_SELECT` for any query returning snippets so the shape stays consistent with `row_to_snippet`.
58: - **Schema changes go through `migrate()` in `db.rs`**: append a `(version, sql)` tuple to the `migrations` array; never edit an existing migration. Version is tracked in the `schema_version` table.
59: - **Two filtering paths exist**: `store.ts`'s `filteredSnippets()` filters the in-memory list client-side (used by the live UI), while `db.rs`'s `search_snippets` does a SQL `LIKE` search. The UI currently relies on client-side filtering; keep them behaviorally aligned if you touch either.
60: - **Timestamps are Unix seconds (`i64`)**, set server-side via `now()` in `db.rs`. The frontend treats them as numbers.
61: 
62: ### CodeMirror language support
63: 
64: `src/components/CodeEditor.tsx` maps a snippet's `language` string to a CodeMirror extension via `LANG_MAP`. To support a new language: install its `@codemirror/lang-*` package and add an entry. Languages with no grammar (`bash`, `nginx`, `toml`) map to `() => []` (plain text, no highlighting) — that's intentional, not a bug.
65: 
66: ## Data location
67: 
68: The SQLite DB is created at the OS app-data dir (resolved by `init_db` in `db.rs`):
69: - Linux: `~/.local/share/codevault/vault.db` (actual path derives from the `dev.codevault.app` identifier in `tauri.conf.json`)
70: - macOS: `~/Library/Application Support/codevault/vault.db`
71: - Windows: `%APPDATA%\codevault\vault.db`
72: 
73: When debugging storage, that file is the ground truth; deleting it resets the app to an empty vault (migrations re-run on next launch).
````

## File: LICENSE
````
 1: MIT License
 2: 
 3: Copyright (c) 2026 Jamie Scott
 4: 
 5: Permission is hereby granted, free of charge, to any person obtaining a copy
 6: of this software and associated documentation files (the "Software"), to deal
 7: in the Software without restriction, including without limitation the rights
 8: to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 9: copies of the Software, and to permit persons to whom the Software is
10: furnished to do so, subject to the following conditions:
11: 
12: The above copyright notice and this permission notice shall be included in all
13: copies or substantial portions of the Software.
14: 
15: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
16: IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
17: FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
18: AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
19: LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
20: OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
21: SOFTWARE.
````

## File: pnpm-workspace.yaml
````yaml
1: allowBuilds:
2:   esbuild: true
````

## File: postcss.config.js
````javascript
1: export default {
2:   plugins: {
3:     tailwindcss: {},
4:     autoprefixer: {},
5:   },
6: }
````

## File: sample-snippets.md
````markdown
  1: # CodeVault Sample Snippets
  2: 
  3: This file contains 15 useful code snippets and bash scripts ready to import into CodeVault using the **Import Markdown** feature.
  4: 
  5: ---
  6: 
  7: ---
  8: title: Docker Cleanup and Prune
  9: language: bash
 10: tags: docker, cleanup, system
 11: ---
 12: ```bash
 13: # Remove stopped containers
 14: docker container prune -f
 15: 
 16: # Remove dangling images
 17: docker image prune -f
 18: 
 19: # Remove unused volumes
 20: docker volume prune -f
 21: 
 22: # Full cleanup (images, containers, volumes, networks)
 23: docker system prune -a --volumes
 24: ```
 25: 
 26: ---
 27: 
 28: ---
 29: title: Find Large Files in Directory
 30: language: bash
 31: tags: linux, disk-usage, files
 32: ---
 33: ```bash
 34: # Find top 10 largest files recursively
 35: find . -type f -exec ls -lh {} + | sort -k5 -hr | head -10
 36: 
 37: # Alternative using du
 38: du -ah . | sort -rh | head -20
 39: 
 40: # Find files larger than 100MB
 41: find . -type f -size +100M
 42: ```
 43: 
 44: ---
 45: 
 46: ---
 47: title: Backup Directory with Timestamp
 48: language: bash
 49: tags: backup, administration, tar
 50: ---
 51: ```bash
 52: #!/bin/bash
 53: # Backup a directory with date-based naming
 54: DIR_TO_BACKUP="$1"
 55: BACKUP_DIR="${HOME}/backups"
 56: TIMESTAMP=$(date +%Y%m%d_%H%M%S)
 57: 
 58: mkdir -p "$BACKUP_DIR"
 59: tar -czf "$BACKUP_DIR/${DIR_TO_BACKUP##*/}_${TIMESTAMP}.tar.gz" "$DIR_TO_BACKUP"
 60: echo "Backup complete: $BACKUP_DIR/${DIR_TO_BACKUP##*/}_${TIMESTAMP}.tar.gz"
 61: ```
 62: 
 63: ---
 64: 
 65: ---
 66: title: Check Open Ports
 67: language: bash
 68: tags: networking, ports, linux
 69: ---
 70: ```bash
 71: # List all listening ports
 72: sudo netstat -tulpn | grep LISTEN
 73: 
 74: # Alternative using ss (faster)
 75: sudo ss -tulpn | grep LISTEN
 76: 
 77: # Find process listening on specific port
 78: sudo lsof -i :8080
 79: 
 80: # Check if port is open without root
 81: nc -zv localhost 3000
 82: ```
 83: 
 84: ---
 85: 
 86: ---
 87: title: Git Force Pull (Discard Local)
 88: language: bash
 89: tags: git, version-control
 90: ---
 91: ```bash
 92: # Discard all local changes and pull latest
 93: git fetch origin
 94: git reset --hard origin/main
 95: 
 96: # Or for current branch
 97: git fetch origin
 98: git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)
 99: ```
100: 
101: ---
102: 
103: ---
104: title: Extract and Convert Media Files
105: language: bash
106: tags: ffmpeg, media, conversion
107: ---
108: ```bash
109: # Convert MP4 to WebM
110: ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 output.webm
111: 
112: # Extract audio as MP3
113: ffmpeg -i video.mp4 -q:a 0 -map a audio.mp3
114: 
115: # Resize video to 720p
116: ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4
117: 
118: # Create GIF from video (first 5 seconds)
119: ffmpeg -i input.mp4 -t 5 -vf "fps=10,scale=320:-1:flags=lanczos" output.gif
120: ```
121: 
122: ---
123: 
124: ---
125: title: Monitor System Resources
126: language: bash
127: tags: monitoring, system, performance
128: ---
129: ```bash
130: #!/bin/bash
131: # Continuous system resource monitor
132: watch -n 1 'echo "=== CPU ==="; top -bn1 | head -12; echo "=== Memory ==="; free -h; echo "=== Disk ==="; df -h /'
133: ```
134: 
135: ---
136: 
137: ---
138: title: Generate Random Password
139: language: bash
140: tags: security, password, random
141: ---
142: ```bash
143: # Generate 32-character random password
144: openssl rand -base64 32
145: 
146: # Generate alphanumeric only (no special chars)
147: tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32; echo
148: 
149: # Using /dev/urandom (portable)
150: cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*' | fold -w 32 | head -1
151: ```
152: 
153: ---
154: 
155: ---
156: title: Batch Rename Files
157: language: bash
158: tags: bash, file-operations, rename
159: ---
160: ```bash
161: # Rename all .txt files to .md
162: for file in *.txt; do mv "$file" "${file%.txt}.md"; done
163: 
164: # Add prefix to all PNG files
165: for file in *.png; do mv "$file" "thumb_${file}"; done
166: 
167: # Change extension (e.g., .jpeg to .jpg)
168: for file in *.jpeg; do mv "$file" "${file%.jpeg}.jpg"; done
169: 
170: # Using rename tool (if available)
171: rename 's/\.txt$/.md/' *.txt
172: ```
173: 
174: ---
175: 
176: ---
177: title: Search and Replace in Files
178: language: bash
179: tags: grep, sed, text-processing
180: ---
181: ```bash
182: # Simple grep search
183: grep -r "search_term" ./src
184: 
185: # Grep with context lines (before and after)
186: grep -B2 -A2 "pattern" file.txt
187: 
188: # Case-insensitive search
189: grep -ri "pattern" ./src
190: 
191: # Replace in all files (sed)
192: find . -name "*.js" -type f -exec sed -i 's/oldText/newText/g' {} +
193: 
194: # Safer backup version
195: find . -name "*.js" -type f -exec sed -i.bak 's/oldText/newText/g' {} +
196: ```
197: 
198: ---
199: 
200: ---
201: title: Kill Process by Name
202: language: bash
203: tags: process, kill, system
204: ---
205: ```bash
206: # Kill process by name
207: killall node
208: 
209: # Kill with signal (graceful)
210: killall -SIGTERM node
211: 
212: # Kill by port number
213: lsof -i :8080 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
214: 
215: # Kill all processes matching pattern
216: pkill -f "python.*script.py"
217: ```
218: 
219: ---
220: 
221: ---
222: title: Simple HTTP Server
223: language: bash
224: tags: http, server, testing
225: ---
226: ```bash
227: # Python 3 (port 8000)
228: python3 -m http.server
229: 
230: # Python 3 (custom port)
231: python3 -m http.server 8080
232: 
233: # Python 2 (legacy)
234: python -m SimpleHTTPServer 8000
235: 
236: # Node.js (requires http-server)
237: npx http-server -p 8080
238: 
239: # Node.js one-liner with Express
240: node -e "require('http').createServer((req, res) => { res.writeHead(200); res.end('Hello'); }).listen(8080)"
241: ```
242: 
243: ---
244: 
245: ---
246: title: Create Nginx Virtual Host
247: language: nginx
248: tags: nginx, web-server, config
249: ---
250: ```nginx
251: server {
252:     listen 80;
253:     server_name example.com www.example.com;
254: 
255:     root /var/www/example.com;
256:     index index.html index.htm;
257: 
258:     location / {
259:         try_files $uri $uri/ =404;
260:     }
261: 
262:     location ~ \.php$ {
263:         include snippets/fastcgi-php.conf;
264:         fastcgi_pass unix:/var/run/php/php-fpm.sock;
265:     }
266: 
267:     # Redirect HTTP to HTTPS
268:     # return 301 https://$server_name$request_uri;
269: }
270: ```
271: 
272: ---
273: 
274: ---
275: title: TypeScript React Component Template
276: language: typescript
277: tags: react, typescript, template
278: ---
279: ```typescript
280: import React, { useState, useCallback } from 'react';
281: 
282: interface Props {
283:   title: string;
284:   onClose?: () => void;
285: }
286: 
287: export const MyComponent: React.FC<Props> = ({ title, onClose }) => {
288:   const [count, setCount] = useState(0);
289: 
290:   const handleClick = useCallback(() => {
291:     setCount(prev => prev + 1);
292:   }, []);
293: 
294:   return (
295:     <div className="p-4">
296:       <h2 className="text-2xl font-bold">{title}</h2>
297:       <button
298:         onClick={handleClick}
299:         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
300:       >
301:         Count: {count}
302:       </button>
303:     </div>
304:   );
305: };
306: ```
307: 
308: ---
309: 
310: ---
311: title: Docker Compose Database Stack
312: language: yaml
313: tags: docker, docker-compose, database
314: ---
315: ```yaml
316: version: '3.8'
317: 
318: services:
319:   postgres:
320:     image: postgres:15-alpine
321:     container_name: my_postgres
322:     environment:
323:       POSTGRES_USER: myuser
324:       POSTGRES_PASSWORD: mypassword
325:       POSTGRES_DB: mydb
326:     ports:
327:       - "5432:5432"
328:     volumes:
329:       - postgres_data:/var/lib/postgresql/data
330:     networks:
331:       - mynetwork
332: 
333:   redis:
334:     image: redis:7-alpine
335:     container_name: my_redis
336:     ports:
337:       - "6379:6379"
338:     networks:
339:       - mynetwork
340: 
341: volumes:
342:   postgres_data:
343: 
344: networks:
345:   mynetwork:
346:     driver: bridge
347: ```
348: 
349: ---
350: 
351: ---
352: title: Cron Job Examples
353: language: bash
354: tags: cron, scheduling, automation
355: ---
356: ```bash
357: # Edit current user's crontab
358: crontab -e
359: 
360: # Examples:
361: # Run every day at 2:30 AM
362: 30 2 * * * /home/user/backup.sh
363: 
364: # Every 15 minutes
365: */15 * * * * /usr/local/bin/check_status.sh
366: 
367: # Every Monday at 9 AM
368: 0 9 * * 1 /usr/local/bin/weekly_report.sh
369: 
370: # Every 1st of month at midnight
371: 0 0 1 * * /usr/local/bin/monthly_cleanup.sh
372: 
373: # Reboot at 3 AM daily
374: 0 3 * * * /sbin/reboot
375: 
376: # View active crontab
377: crontab -l
378: 
379: # Remove all cron jobs
380: crontab -r
381: ```
382: 
383: ---
````

## File: tsconfig.json
````json
 1: {
 2:   "compilerOptions": {
 3:     "target": "ES2020",
 4:     "useDefineForClassFields": true,
 5:     "lib": ["ES2020", "DOM", "DOM.Iterable"],
 6:     "module": "ESNext",
 7:     "skipLibCheck": true,
 8: 
 9:     /* Bundler mode */
10:     "moduleResolution": "bundler",
11:     "allowImportingTsExtensions": true,
12:     "resolveJsonModule": true,
13:     "isolatedModules": true,
14:     "noEmit": true,
15:     "jsx": "react-jsx",
16: 
17:     /* Linting */
18:     "strict": true,
19:     "noUnusedLocals": true,
20:     "noUnusedParameters": true,
21:     "noFallthroughCasesInSwitch": true
22:   },
23:   "include": ["src"],
24:   "references": [{ "path": "./tsconfig.node.json" }]
25: }
````

## File: tsconfig.node.json
````json
 1: {
 2:   "compilerOptions": {
 3:     "composite": true,
 4:     "skipLibCheck": true,
 5:     "module": "ESNext",
 6:     "moduleResolution": "bundler",
 7:     "allowSyntheticDefaultImports": true
 8:   },
 9:   "include": ["vite.config.ts"]
10: }
````

## File: vite.config.ts
````typescript
 1: import { defineConfig } from "vite";
 2: import react from "@vitejs/plugin-react";
 3: 
 4: // @ts-expect-error process is a nodejs global
 5: const host = process.env.TAURI_DEV_HOST;
 6: 
 7: // https://vite.dev/config/
 8: export default defineConfig(async () => ({
 9:   plugins: [react()],
10: 
11:   // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
12:   //
13:   // 1. prevent Vite from obscuring rust errors
14:   clearScreen: false,
15:   // 2. tauri expects a fixed port, fail if that port is not available
16:   server: {
17:     port: 1420,
18:     strictPort: true,
19:     host: host || false,
20:     hmr: host
21:       ? {
22:           protocol: "ws",
23:           host,
24:           port: 1421,
25:         }
26:       : undefined,
27:     watch: {
28:       // 3. tell Vite to ignore watching `src-tauri`
29:       ignored: ["**/src-tauri/**"],
30:     },
31:   },
32: }));
````

## File: src/components/CodeEditor.tsx
````typescript
 1: import CodeMirror from "@uiw/react-codemirror";
 2: import { css } from "@codemirror/lang-css";
 3: import { html } from "@codemirror/lang-html";
 4: import { javascript } from "@codemirror/lang-javascript";
 5: import { markdown } from "@codemirror/lang-markdown";
 6: import { python } from "@codemirror/lang-python";
 7: import { rust } from "@codemirror/lang-rust";
 8: import { sql } from "@codemirror/lang-sql";
 9: import { yaml } from "@codemirror/lang-yaml";
10: import type { Extension } from "@codemirror/state";
11: import { useSettingsStore } from "../lib/settings";
12: import { darkEditorTheme, lightEditorTheme } from "../lib/editorTheme";
13: 
14: const LANG_MAP: Record<string, () => Extension> = {
15:   bash:       () => [],
16:   css:        () => css(),
17:   html:       () => html(),
18:   javascript: () => javascript(),
19:   json:       () => javascript(),
20:   markdown:   () => markdown(),
21:   nginx:      () => [],
22:   python:     () => python(),
23:   rust:       () => rust(),
24:   sql:        () => sql(),
25:   toml:       () => [],
26:   typescript: () => javascript({ typescript: true }),
27:   yaml:       () => yaml(),
28: };
29: 
30: interface Props {
31:   value: string;
32:   onChange: (value: string) => void;
33:   language: string;
34:   placeholder?: string;
35:   minHeight?: string;
36:   maxHeight?: string;
37: }
38: 
39: export default function CodeEditor({
40:   value,
41:   onChange,
42:   language,
43:   placeholder,
44:   minHeight = "100%",
45:   maxHeight,
46: }: Props) {
47:   const theme = useSettingsStore((s) => s.theme);
48:   const langExt = (LANG_MAP[language] ?? (() => []))();
49:   const extensions: Extension[] = Array.isArray(langExt) ? langExt : [langExt];
50: 
51:   return (
52:     <CodeMirror
53:       value={value}
54:       onChange={onChange}
55:       theme={theme === "light" ? lightEditorTheme : darkEditorTheme}
56:       extensions={extensions}
57:       placeholder={placeholder}
58:       style={{ minHeight, maxHeight, overflow: "auto" }}
59:       basicSetup={{
60:         lineNumbers: true,
61:         foldGutter: true,
62:         highlightActiveLine: true,
63:         highlightSelectionMatches: true,
64:         autocompletion: true,
65:       }}
66:     />
67:   );
68: }
````

## File: src/components/Settings.tsx
````typescript
  1: import { useEffect, useState } from "react";
  2: import { open, save } from "@tauri-apps/plugin-dialog";
  3: import { openPath } from "@tauri-apps/plugin-opener";
  4: import { api } from "../lib/api";
  5: import { LANGUAGES } from "../lib/languages";
  6: import { useSettingsStore } from "../lib/settings";
  7: import { useVaultStore } from "../lib/store";
  8: import { toast } from "../lib/toast";
  9: import type { ImportStrategy } from "../lib/types";
 10: 
 11: export default function Settings() {
 12:   const settingsOpen = useVaultStore((s) => s.settingsOpen);
 13:   const setSettingsOpen = useVaultStore((s) => s.setSettingsOpen);
 14:   const loadSnippets = useVaultStore((s) => s.loadSnippets);
 15: 
 16:   const defaultLanguage = useSettingsStore((s) => s.defaultLanguage);
 17:   const setDefaultLanguage = useSettingsStore((s) => s.setDefaultLanguage);
 18: 
 19:   const [dataDir, setDataDir] = useState<string>("");
 20:   const [strategy, setStrategy] = useState<ImportStrategy>("rename");
 21:   const [busy, setBusy] = useState(false);
 22: 
 23:   useEffect(() => {
 24:     if (settingsOpen) {
 25:       api.getDataDir().then(setDataDir).catch(() => setDataDir("(unknown)"));
 26:     }
 27:   }, [settingsOpen]);
 28: 
 29:   if (!settingsOpen) return null;
 30: 
 31:   const close = () => setSettingsOpen(false);
 32: 
 33:   const handleExport = async () => {
 34:     try {
 35:       const path = await save({
 36:         title: "Export vault",
 37:         defaultPath: "codevault-export.json",
 38:         filters: [{ name: "JSON", extensions: ["json"] }],
 39:       });
 40:       if (!path) return;
 41:       setBusy(true);
 42:       await api.exportVault(path);
 43:       toast.success("Vault exported");
 44:     } catch (err) {
 45:       toast.error(`Export failed: ${err}`);
 46:     } finally {
 47:       setBusy(false);
 48:     }
 49:   };
 50: 
 51:   const handleImportJson = async () => {
 52:     try {
 53:       const path = await open({
 54:         title: "Import vault (JSON)",
 55:         multiple: false,
 56:         filters: [{ name: "JSON", extensions: ["json"] }],
 57:       });
 58:       if (typeof path !== "string") return;
 59:       setBusy(true);
 60:       const r = await api.importVault(path, strategy);
 61:       await loadSnippets();
 62:       toast.success(
 63:         `Imported ${r.imported}, overwrote ${r.overwritten}, renamed ${r.renamed}, skipped ${r.skipped}`,
 64:       );
 65:     } catch (err) {
 66:       toast.error(`Import failed: ${err}`);
 67:     } finally {
 68:       setBusy(false);
 69:     }
 70:   };
 71: 
 72:   const handleImportMarkdown = async () => {
 73:     try {
 74:       const path = await open({
 75:         title: "Import Markdown",
 76:         multiple: false,
 77:         filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
 78:       });
 79:       if (typeof path !== "string") return;
 80:       setBusy(true);
 81:       await api.importMarkdown(path);
 82:       await loadSnippets();
 83:       toast.success("Markdown imported");
 84:     } catch (err) {
 85:       toast.error(`Import failed: ${err}`);
 86:     } finally {
 87:       setBusy(false);
 88:     }
 89:   };
 90: 
 91:   const handleImportMarkdownDir = async () => {
 92:     try {
 93:       const path = await open({
 94:         title: "Import Markdown folder",
 95:         directory: true,
 96:         multiple: false,
 97:       });
 98:       if (typeof path !== "string") return;
 99:       setBusy(true);
100:       const r = await api.importMarkdownDir(path);
101:       await loadSnippets();
102:       if (r.imported === 0 && r.failed === 0) {
103:         toast.error("No .md files found in that folder");
104:       } else {
105:         toast.success(
106:           `Imported ${r.imported} Markdown file${r.imported === 1 ? "" : "s"}` +
107:             (r.failed ? `, ${r.failed} failed` : ""),
108:         );
109:       }
110:     } catch (err) {
111:       toast.error(`Import failed: ${err}`);
112:     } finally {
113:       setBusy(false);
114:     }
115:   };
116: 
117:   return (
118:     <div
119:       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
120:       onClick={close}
121:     >
122:       <div
123:         className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-lg mx-4 shadow-2xl font-mono max-h-[85vh] overflow-y-auto"
124:         onClick={(e) => e.stopPropagation()}
125:       >
126:         {/* Header */}
127:         <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
128:           <h2 className="text-zinc-100 font-semibold text-sm">Settings</h2>
129:           <button
130:             onClick={close}
131:             className="text-zinc-500 hover:text-zinc-200 transition-colors text-sm"
132:             title="Close (Esc)"
133:           >
134:             ✕
135:           </button>
136:         </div>
137: 
138:         <div className="px-5 py-4 space-y-6">
139:           {/* Default language */}
140:           <Section title="Default language" hint="Used when creating a new snippet.">
141:             <select
142:               value={defaultLanguage}
143:               onChange={(e) => setDefaultLanguage(e.target.value)}
144:               className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-1.5 outline-none focus:border-emerald-700 cursor-pointer"
145:             >
146:               {LANGUAGES.map((l) => (
147:                 <option key={l} value={l}>{l}</option>
148:               ))}
149:             </select>
150:           </Section>
151: 
152:           {/* Import / export */}
153:           <Section title="Import / export" hint="Full-vault JSON, a single Markdown file, or a whole folder of Markdown files (front-matter sets title/language/tags).">
154:             <div className="space-y-3">
155:               <div className="flex items-center gap-2 flex-wrap">
156:                 <Btn onClick={handleExport} disabled={busy}>Export vault (JSON)</Btn>
157:                 <Btn onClick={handleImportMarkdown} disabled={busy}>Import Markdown</Btn>
158:                 <Btn onClick={handleImportMarkdownDir} disabled={busy}>Import Markdown folder</Btn>
159:               </div>
160:               <div className="flex items-center gap-2 flex-wrap">
161:                 <Btn onClick={handleImportJson} disabled={busy}>Import vault (JSON)</Btn>
162:                 <label className="text-xs text-zinc-500 flex items-center gap-1.5">
163:                   on conflict
164:                   <select
165:                     value={strategy}
166:                     onChange={(e) => setStrategy(e.target.value as ImportStrategy)}
167:                     className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-1.5 py-1 outline-none focus:border-emerald-700 cursor-pointer"
168:                   >
169:                     <option value="rename">rename</option>
170:                     <option value="skip">skip</option>
171:                     <option value="overwrite">overwrite</option>
172:                   </select>
173:                 </label>
174:               </div>
175:             </div>
176:           </Section>
177: 
178:           {/* Data location */}
179:           <Section title="Data location" hint="Your vault.db lives here.">
180:             <div className="space-y-2">
181:               <code className="block bg-zinc-950 border border-zinc-800 rounded px-2.5 py-2 text-xs text-zinc-400 break-all">
182:                 {dataDir || "…"}
183:               </code>
184:               <Btn
185:                 onClick={() => openPath(dataDir).catch((err) => toast.error(`${err}`))}
186:                 disabled={!dataDir}
187:               >
188:                 Open data folder
189:               </Btn>
190:             </div>
191:           </Section>
192:         </div>
193:       </div>
194:     </div>
195:   );
196: }
197: 
198: function Section({
199:   title,
200:   hint,
201:   children,
202: }: {
203:   title: string;
204:   hint?: string;
205:   children: React.ReactNode;
206: }) {
207:   return (
208:     <div>
209:       <h3 className="text-zinc-300 text-xs uppercase tracking-widest mb-1">{title}</h3>
210:       {hint && <p className="text-zinc-600 text-xs mb-2.5">{hint}</p>}
211:       {children}
212:     </div>
213:   );
214: }
215: 
216: function Btn({
217:   onClick,
218:   disabled,
219:   children,
220: }: {
221:   onClick: () => void;
222:   disabled?: boolean;
223:   children: React.ReactNode;
224: }) {
225:   return (
226:     <button
227:       onClick={onClick}
228:       disabled={disabled}
229:       className="text-xs px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-emerald-700 hover:text-emerald-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
230:     >
231:       {children}
232:     </button>
233:   );
234: }
````

## File: src/lib/settings.ts
````typescript
 1: import { create } from "zustand";
 2: 
 3: // Lightweight, frontend-only settings persisted to localStorage. These are
 4: // UI preferences (not vault data), so they don't belong in the SQLite store.
 5: 
 6: const STORAGE_KEY = "codevault.settings";
 7: 
 8: export type Theme = "dark" | "light";
 9: 
10: interface Settings {
11:   defaultLanguage: string;
12:   theme: Theme;
13: }
14: 
15: const DEFAULTS: Settings = {
16:   defaultLanguage: "bash",
17:   theme: "dark",
18: };
19: 
20: function load(): Settings {
21:   try {
22:     const raw = localStorage.getItem(STORAGE_KEY);
23:     return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
24:   } catch {
25:     return DEFAULTS;
26:   }
27: }
28: 
29: // Toggle the root `.light` class so the CSS-variable ramp (index.css) flips the
30: // whole app, and `darkMode: "class"` Tailwind variants resolve correctly.
31: export function applyTheme(theme: Theme) {
32:   const root = document.documentElement;
33:   root.classList.toggle("light", theme === "light");
34:   root.classList.toggle("dark", theme === "dark");
35: }
36: 
37: interface SettingsState extends Settings {
38:   setDefaultLanguage: (lang: string) => void;
39:   setTheme: (theme: Theme) => void;
40: }
41: 
42: const initial = load();
43: applyTheme(initial.theme); // apply persisted theme before first paint
44: 
45: export const useSettingsStore = create<SettingsState>((set, get) => ({
46:   ...initial,
47:   setDefaultLanguage: (defaultLanguage) => {
48:     set({ defaultLanguage });
49:     persist(get());
50:   },
51:   setTheme: (theme) => {
52:     applyTheme(theme);
53:     set({ theme });
54:     persist(get());
55:   },
56: }));
57: 
58: function persist(state: Settings) {
59:   try {
60:     localStorage.setItem(
61:       STORAGE_KEY,
62:       JSON.stringify({ defaultLanguage: state.defaultLanguage, theme: state.theme }),
63:     );
64:   } catch {
65:     // ignore quota / availability errors — settings are best-effort
66:   }
67: }
````

## File: src/main.tsx
````typescript
 1: import React from "react";
 2: import ReactDOM from "react-dom/client";
 3: // Bundled fonts (offline-first) — Monaspace Neon for code/UI, Fraunces for
 4: // display titles. Loaded locally via Fontsource so the app needs no network.
 5: import "@fontsource/monaspace-neon/400.css";
 6: import "@fontsource/monaspace-neon/700.css";
 7: import "@fontsource-variable/fraunces";
 8: import "./index.css";
 9: import App from "./App";
10: 
11: ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
12:   <React.StrictMode>
13:     <App />
14:   </React.StrictMode>,
15: );
````

## File: .gitignore
````
 1: # Logs
 2: logs
 3: *.log
 4: npm-debug.log*
 5: yarn-debug.log*
 6: yarn-error.log*
 7: pnpm-debug.log*
 8: lerna-debug.log*
 9: 
10: node_modules
11: dist
12: dist-ssr
13: *.local
14: 
15: # Editor directories and files
16: .vscode/*
17: !.vscode/extensions.json
18: .idea
19: .DS_Store
20: *.suo
21: *.ntvs*
22: *.njsproj
23: *.sln
24: *.sw?
25: 
26: # Generated by Cargo
27: # will have compiled files and executables
28: debug
29: target
30: 
31: # These are backup files generated by rustfmt
32: **/*.rs.bk
33: 
34: # MSVC Windows builds of rustc generate these, which store debugging information
35: *.pdb
36: 
37: # Generated by cargo mutants
38: # Contains mutation testing data
39: **/mutants.out*/
40: 
41: # RustRover
42: #  JetBrains specific template is maintained in a separate JetBrains.gitignore that can
43: #  be found at https://github.com/github/gitignore/blob/main/Global/JetBrains.gitignore
44: #  and can be added to the global gitignore or merged into this file.  For a more nuclear
45: #  option (not recommended) you can uncomment the following to ignore the entire idea folder.
46: #.idea/
````

## File: index.html
````html
 1: <!doctype html>
 2: <html lang="en">
 3:   <head>
 4:     <meta charset="UTF-8" />
 5:     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
 6:     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 7:     <title>CodeVault</title>
 8:     <style>html, body { margin: 0; padding: 0; overflow: hidden; }</style>
 9:   </head>
10: 
11:   <body>
12:     <div id="root"></div>
13:     <script type="module" src="/src/main.tsx"></script>
14:   </body>
15: </html>
````

## File: tailwind.config.js
````javascript
 1: /** @type {import('tailwindcss').Config} */
 2: 
 3: // Map a CSS-variable ramp to Tailwind colour shades. Each var holds "R G B"
 4: // channels so opacity modifiers (e.g. `bg-zinc-800/5`) keep working. Flipping
 5: // the variables under `.light` (see index.css) recolours the whole app with no
 6: // markup changes.
 7: const ramp = (name, shades) =>
 8:   Object.fromEntries(
 9:     shades.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`]),
10:   );
11: 
12: export default {
13:   darkMode: "class",
14:   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
15:   theme: {
16:     extend: {
17:       colors: {
18:         zinc: ramp("zinc", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
19:         emerald: ramp("emerald", [200, 300, 400, 500, 600, 700, 800, 900]),
20:         red: ramp("red", [200, 300, 400, 700, 800, 900]),
21:       },
22:       fontFamily: {
23:         mono: ["Monaspace Neon", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
24:         display: ["Fraunces Variable", "Fraunces", "Georgia", "serif"],
25:       },
26:     },
27:   },
28:   plugins: [],
29: }
````

## File: src/components/Layout.tsx
````typescript
 1: import CommandPalette from "./CommandPalette";
 2: import DeleteModal from "./DeleteModal";
 3: import Settings from "./Settings";
 4: import Shortcuts from "./Shortcuts";
 5: import Sidebar from "./Sidebar";
 6: import SnippetDetail from "./SnippetDetail";
 7: import Toaster from "./Toaster";
 8: 
 9: export default function Layout() {
10:   return (
11:     <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
12:       {/* Left rail: search + filters + snippet list */}
13:       <div className="w-72 flex-shrink-0 flex flex-col h-full overflow-hidden">
14:         <Sidebar />
15:       </div>
16: 
17:       {/* Detail pane */}
18:       <div className="flex-1 min-w-0 h-full overflow-hidden">
19:         <SnippetDetail />
20:       </div>
21: 
22:       {/* Global overlays + handlers */}
23:       <DeleteModal />
24:       <CommandPalette />
25:       <Settings />
26:       <Toaster />
27:       <Shortcuts />
28:     </div>
29:   );
30: }
````

## File: src/components/Sidebar.tsx
````typescript
  1: import { useEffect, useRef } from "react";
  2: import { useVaultStore } from "../lib/store";
  3: import SnippetList from "./SnippetList";
  4: 
  5: function SearchIcon() {
  6:   return (
  7:     <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
  8:       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  9:     </svg>
 10:   );
 11: }
 12: 
 13: function PlusIcon() {
 14:   return (
 15:     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
 16:       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
 17:     </svg>
 18:   );
 19: }
 20: 
 21: function GearIcon() {
 22:   return (
 23:     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
 24:       <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
 25:       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 26:     </svg>
 27:   );
 28: }
 29: 
 30: export default function Sidebar() {
 31:   const {
 32:     searchQuery, setSearchQuery,
 33:     activeTag, setActiveTag,
 34:     activeLanguage, setActiveLanguage,
 35:     allTags, snippets, createSnippet,
 36:     setSettingsOpen,
 37:   } = useVaultStore();
 38: 
 39:   const tags = allTags();
 40:   const languages = Array.from(new Set(snippets.map((s) => s.language))).sort();
 41: 
 42:   // Ctrl+F (Cmd+F on macOS) focuses the search input
 43:   const searchRef = useRef<HTMLInputElement>(null);
 44:   useEffect(() => {
 45:     const onKeyDown = (e: KeyboardEvent) => {
 46:       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
 47:         e.preventDefault();
 48:         searchRef.current?.focus();
 49:         searchRef.current?.select();
 50:       }
 51:     };
 52:     window.addEventListener("keydown", onKeyDown);
 53:     return () => window.removeEventListener("keydown", onKeyDown);
 54:   }, []);
 55: 
 56:   return (
 57:     <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
 58:       {/* App header + new button */}
 59:       <div className="px-4 py-4 border-b border-zinc-800 flex-shrink-0 flex items-center justify-between">
 60:         <div>
 61:           <h1 className="text-emerald-400 font-mono font-bold text-lg tracking-tight">CodeVault</h1>
 62:           <p className="text-zinc-600 font-mono text-xs mt-0.5">terminal memory trap</p>
 63:         </div>
 64:         <div className="flex items-center gap-1.5">
 65:           <button
 66:             onClick={() => setSettingsOpen(true)}
 67:             className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors"
 68:             title="Settings"
 69:           >
 70:             <GearIcon />
 71:           </button>
 72:           <button
 73:             onClick={createSnippet}
 74:             className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono bg-emerald-900 border border-emerald-700 text-emerald-300 rounded hover:bg-emerald-800 transition-colors"
 75:             title="New snippet (Ctrl+N)"
 76:           >
 77:             <PlusIcon />
 78:             new
 79:           </button>
 80:         </div>
 81:       </div>
 82: 
 83:       {/* Search */}
 84:       <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0">
 85:         <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus-within:border-emerald-700 transition-colors">
 86:           <SearchIcon />
 87:           <input
 88:             ref={searchRef}
 89:             type="text"
 90:             placeholder="search snippets… (Ctrl+F)"
 91:             value={searchQuery}
 92:             onChange={(e) => setSearchQuery(e.target.value)}
 93:             className="flex-1 bg-transparent text-sm font-mono text-zinc-200 placeholder-zinc-600 outline-none"
 94:           />
 95:           {searchQuery && (
 96:             <button onClick={() => setSearchQuery("")} className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-mono">
 97:               ✕
 98:             </button>
 99:           )}
100:         </div>
101:       </div>
102: 
103:       {/* Language filter */}
104:       {languages.length > 0 && (
105:         <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0">
106:           <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-2">Language</p>
107:           <div className="flex flex-wrap gap-1.5">
108:             {languages.map((lang) => (
109:               <button
110:                 key={lang}
111:                 onClick={() => setActiveLanguage(activeLanguage === lang ? null : lang)}
112:                 className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
113:                   activeLanguage === lang
114:                     ? "bg-emerald-800 text-emerald-200 border border-emerald-600"
115:                     : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
116:                 }`}
117:               >
118:                 {lang}
119:               </button>
120:             ))}
121:           </div>
122:         </div>
123:       )}
124: 
125:       {/* Tag filter */}
126:       {tags.length > 0 && (
127:         <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0">
128:           <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-2">Tags</p>
129:           <div className="flex flex-wrap gap-1.5">
130:             {tags.map((tag) => (
131:               <button
132:                 key={tag}
133:                 onClick={() => setActiveTag(activeTag === tag ? null : tag)}
134:                 className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
135:                   activeTag === tag
136:                     ? "bg-emerald-800 text-emerald-200 border border-emerald-600"
137:                     : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
138:                 }`}
139:               >
140:                 #{tag}
141:               </button>
142:             ))}
143:           </div>
144:         </div>
145:       )}
146: 
147:       {/* Snippet count */}
148:       <div className="px-4 py-2 border-b border-zinc-800 flex-shrink-0">
149:         <span className="text-zinc-600 font-mono text-xs">
150:           {snippets.length} snippet{snippets.length !== 1 ? "s" : ""}
151:         </span>
152:       </div>
153: 
154:       {/* Snippet list — takes remaining height */}
155:       <div className="flex-1 min-h-0">
156:         <SnippetList />
157:       </div>
158:     </div>
159:   );
160: }
````

## File: src/lib/api.ts
````typescript
 1: import { invoke } from "@tauri-apps/api/core";
 2: import type { ImportResult, ImportStrategy, MarkdownDirResult, NewSnippet, Snippet, SnippetPatch } from "./types";
 3: 
 4: export const api = {
 5:   listSnippets: () =>
 6:     invoke<Snippet[]>("list_snippets"),
 7: 
 8:   getSnippet: (id: number) =>
 9:     invoke<Snippet>("get_snippet", { id }),
10: 
11:   createSnippet: (input: NewSnippet) =>
12:     invoke<Snippet>("create_snippet", { input }),
13: 
14:   updateSnippet: (id: number, patch: SnippetPatch) =>
15:     invoke<Snippet>("update_snippet", { id, patch }),
16: 
17:   deleteSnippet: (id: number) =>
18:     invoke<void>("delete_snippet", { id }),
19: 
20:   toggleFavorite: (id: number) =>
21:     invoke<boolean>("toggle_favorite", { id }),
22: 
23:   listTags: () =>
24:     invoke<string[]>("list_tags"),
25: 
26:   setSnippetTags: (id: number, tagNames: string[]) =>
27:     invoke<void>("set_snippet_tags", { id, tagNames }),
28: 
29:   searchSnippets: (query: string) =>
30:     invoke<Snippet[]>("search_snippets", { query }),
31: 
32:   getDataDir: () =>
33:     invoke<string>("get_data_dir"),
34: 
35:   exportVault: (path: string) =>
36:     invoke<void>("export_vault", { path }),
37: 
38:   importVault: (path: string, strategy: ImportStrategy) =>
39:     invoke<ImportResult>("import_vault", { path, strategy }),
40: 
41:   importMarkdown: (path: string) =>
42:     invoke<Snippet>("import_markdown", { path }),
43: 
44:   importMarkdownDir: (path: string) =>
45:     invoke<MarkdownDirResult>("import_markdown_dir", { path }),
46: };
````

## File: src/lib/store.ts
````typescript
  1: import { create } from "zustand";
  2: import { api } from "./api";
  3: import { toast } from "./toast";
  4: import { useSettingsStore } from "./settings";
  5: import type { Snippet, SnippetPatch } from "./types";
  6: 
  7: interface VaultState {
  8:   snippets: Snippet[];
  9:   selectedId: number | null;
 10:   searchQuery: string;
 11:   activeTag: string | null;
 12:   activeLanguage: string | null;
 13:   isLoading: boolean;
 14:   deleteConfirmId: number | null;
 15: 
 16:   // UI state
 17:   paletteOpen: boolean;
 18:   notesVisible: boolean;
 19:   settingsOpen: boolean;
 20: 
 21:   // lifecycle
 22:   loadSnippets: () => Promise<void>;
 23: 
 24:   // selection & filter
 25:   selectSnippet: (id: number) => void;
 26:   setSearchQuery: (q: string) => void;
 27:   setActiveTag: (tag: string | null) => void;
 28:   setActiveLanguage: (lang: string | null) => void;
 29: 
 30:   // UI toggles
 31:   setPaletteOpen: (open: boolean) => void;
 32:   togglePalette: () => void;
 33:   toggleNotes: () => void;
 34:   setSettingsOpen: (open: boolean) => void;
 35: 
 36:   // CRUD
 37:   createSnippet: () => Promise<void>;
 38:   updateSnippet: (id: number, patch: SnippetPatch) => Promise<void>;
 39:   updateTags: (id: number, tags: string[]) => Promise<void>;
 40:   toggleFavorite: (id: number) => Promise<void>;
 41:   confirmDelete: (id: number | null) => void;
 42:   deleteSnippet: (id: number) => Promise<void>;
 43: 
 44:   // computed
 45:   filteredSnippets: () => Snippet[];
 46:   selectedSnippet: () => Snippet | null;
 47:   allTags: () => string[];
 48: }
 49: 
 50: export const useVaultStore = create<VaultState>((set, get) => ({
 51:   snippets: [],
 52:   selectedId: null,
 53:   searchQuery: "",
 54:   activeTag: null,
 55:   activeLanguage: null,
 56:   isLoading: false,
 57:   deleteConfirmId: null,
 58:   paletteOpen: false,
 59:   notesVisible: true,
 60:   settingsOpen: false,
 61: 
 62:   loadSnippets: async () => {
 63:     set({ isLoading: true });
 64:     try {
 65:       const snippets = await api.listSnippets();
 66:       set({ snippets, selectedId: snippets[0]?.id ?? null, isLoading: false });
 67:     } catch (err) {
 68:       console.error("loadSnippets:", err);
 69:       toast.error(`Failed to load snippets: ${err}`);
 70:       set({ isLoading: false });
 71:     }
 72:   },
 73: 
 74:   selectSnippet: (id) => set({ selectedId: id }),
 75:   setSearchQuery: (q) => set({ searchQuery: q }),
 76:   setActiveTag: (tag) => set({ activeTag: tag }),
 77:   setActiveLanguage: (lang) => set({ activeLanguage: lang }),
 78: 
 79:   setPaletteOpen: (open) => set({ paletteOpen: open }),
 80:   togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
 81:   toggleNotes: () => set((s) => ({ notesVisible: !s.notesVisible })),
 82:   setSettingsOpen: (open) => set({ settingsOpen: open }),
 83: 
 84:   createSnippet: async () => {
 85:     try {
 86:       const snippet = await api.createSnippet({
 87:         title: "Untitled Snippet",
 88:         description: "",
 89:         language: useSettingsStore.getState().defaultLanguage,
 90:         code: "",
 91:         notes: "",
 92:         favorite: false,
 93:         tags: [],
 94:       });
 95:       set((s) => ({ snippets: [snippet, ...s.snippets], selectedId: snippet.id }));
 96:     } catch (err) {
 97:       console.error("createSnippet:", err);
 98:       toast.error(`Failed to create snippet: ${err}`);
 99:     }
100:   },
101: 
102:   updateSnippet: async (id, patch) => {
103:     try {
104:       const updated = await api.updateSnippet(id, patch);
105:       set((s) => ({
106:         snippets: s.snippets.map((sn) => (sn.id === id ? updated : sn)),
107:       }));
108:     } catch (err) {
109:       console.error("updateSnippet:", err);
110:       toast.error(`Failed to save snippet: ${err}`);
111:     }
112:   },
113: 
114:   updateTags: async (id, tags) => {
115:     try {
116:       await api.setSnippetTags(id, tags);
117:       // Re-fetch only the affected snippet to get updated tag list
118:       const updated = await api.getSnippet(id);
119:       set((s) => ({
120:         snippets: s.snippets.map((sn) => (sn.id === id ? updated : sn)),
121:       }));
122:     } catch (err) {
123:       console.error("updateTags:", err);
124:       toast.error(`Failed to update tags: ${err}`);
125:     }
126:   },
127: 
128:   toggleFavorite: async (id) => {
129:     try {
130:       const favorite = await api.toggleFavorite(id);
131:       set((s) => ({
132:         snippets: s.snippets.map((sn) =>
133:           sn.id === id ? { ...sn, favorite } : sn
134:         ),
135:       }));
136:     } catch (err) {
137:       console.error("toggleFavorite:", err);
138:       toast.error(`Failed to toggle favourite: ${err}`);
139:     }
140:   },
141: 
142:   confirmDelete: (id) => set({ deleteConfirmId: id }),
143: 
144:   deleteSnippet: async (id) => {
145:     try {
146:       await api.deleteSnippet(id);
147:       set((s) => {
148:         const snippets = s.snippets.filter((sn) => sn.id !== id);
149:         const selectedId =
150:           s.selectedId === id ? (snippets[0]?.id ?? null) : s.selectedId;
151:         return { snippets, selectedId, deleteConfirmId: null };
152:       });
153:       toast.success("Snippet deleted");
154:     } catch (err) {
155:       console.error("deleteSnippet:", err);
156:       toast.error(`Failed to delete snippet: ${err}`);
157:     }
158:   },
159: 
160:   filteredSnippets: () => {
161:     const { snippets, searchQuery, activeTag, activeLanguage } = get();
162:     const q = searchQuery.toLowerCase();
163:     return snippets.filter((s) => {
164:       if (
165:         q &&
166:         !s.title.toLowerCase().includes(q) &&
167:         !s.code.toLowerCase().includes(q) &&
168:         !s.tags.some((t) => t.includes(q))
169:       )
170:         return false;
171:       if (activeTag && !s.tags.includes(activeTag)) return false;
172:       if (activeLanguage && s.language !== activeLanguage) return false;
173:       return true;
174:     });
175:   },
176: 
177:   selectedSnippet: () => {
178:     const { snippets, selectedId } = get();
179:     return snippets.find((s) => s.id === selectedId) ?? null;
180:   },
181: 
182:   allTags: () => {
183:     const { snippets } = get();
184:     const tagSet = new Set<string>();
185:     snippets.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
186:     return Array.from(tagSet).sort();
187:   },
188: }));
````

## File: src/App.tsx
````typescript
 1: import { useEffect } from "react";
 2: import "./App.css";
 3: import Layout from "./components/Layout";
 4: import { useVaultStore } from "./lib/store";
 5: 
 6: export default function App() {
 7:   const loadSnippets = useVaultStore((s) => s.loadSnippets);
 8: 
 9:   useEffect(() => {
10:     loadSnippets();
11:   }, [loadSnippets]);
12: 
13:   return <Layout />;
14: }
````

## File: src-tauri/capabilities/default.json
````json
 1: {
 2:   "$schema": "../gen/schemas/desktop-schema.json",
 3:   "identifier": "default",
 4:   "description": "Capability for the main window",
 5:   "windows": ["main"],
 6:   "permissions": [
 7:     "core:default",
 8:     "opener:default",
 9:     "opener:allow-open-path",
10:     "clipboard-manager:default",
11:     "dialog:default"
12:   ]
13: }
````

## File: src-tauri/src/commands.rs
````rust
  1: use std::sync::Mutex;
  2: 
  3: use crate::db::{self, ImportResult, MarkdownDirResult, NewSnippet, Snippet, SnippetPatch};
  4: use tauri::{AppHandle, Manager, State};
  5: 
  6: pub struct DbState(pub Mutex<rusqlite::Connection>);
  7: 
  8: type CmdResult<T> = Result<T, String>;
  9: 
 10: fn e(err: impl std::fmt::Display) -> String {
 11:     err.to_string()
 12: }
 13: 
 14: #[tauri::command]
 15: pub fn list_snippets(state: State<'_, DbState>) -> CmdResult<Vec<Snippet>> {
 16:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 17:     db::list_snippets(&conn).map_err(e)
 18: }
 19: 
 20: #[tauri::command]
 21: pub fn get_snippet(state: State<'_, DbState>, id: i64) -> CmdResult<Snippet> {
 22:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 23:     db::get_snippet(&conn, id).map_err(e)
 24: }
 25: 
 26: #[tauri::command]
 27: pub fn create_snippet(state: State<'_, DbState>, input: NewSnippet) -> CmdResult<Snippet> {
 28:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 29:     db::create_snippet(&conn, input).map_err(e)
 30: }
 31: 
 32: #[tauri::command]
 33: pub fn update_snippet(
 34:     state: State<'_, DbState>,
 35:     id: i64,
 36:     patch: SnippetPatch,
 37: ) -> CmdResult<Snippet> {
 38:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 39:     db::update_snippet(&conn, id, patch).map_err(e)
 40: }
 41: 
 42: #[tauri::command]
 43: pub fn delete_snippet(state: State<'_, DbState>, id: i64) -> CmdResult<()> {
 44:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 45:     db::delete_snippet(&conn, id).map_err(e)
 46: }
 47: 
 48: #[tauri::command]
 49: pub fn toggle_favorite(state: State<'_, DbState>, id: i64) -> CmdResult<bool> {
 50:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 51:     db::toggle_favorite(&conn, id).map_err(e)
 52: }
 53: 
 54: #[tauri::command]
 55: pub fn list_tags(state: State<'_, DbState>) -> CmdResult<Vec<String>> {
 56:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 57:     db::list_tags(&conn).map_err(e)
 58: }
 59: 
 60: #[tauri::command]
 61: pub fn set_snippet_tags(
 62:     state: State<'_, DbState>,
 63:     id: i64,
 64:     tag_names: Vec<String>,
 65: ) -> CmdResult<()> {
 66:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 67:     db::set_snippet_tags(&conn, id, &tag_names).map_err(e)
 68: }
 69: 
 70: #[tauri::command]
 71: pub fn search_snippets(state: State<'_, DbState>, query: String) -> CmdResult<Vec<Snippet>> {
 72:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 73:     db::search_snippets(&conn, &query).map_err(e)
 74: }
 75: 
 76: #[tauri::command]
 77: pub fn get_data_dir(app: AppHandle) -> CmdResult<String> {
 78:     let dir = app.path().app_data_dir().map_err(e)?;
 79:     Ok(dir.to_string_lossy().into_owned())
 80: }
 81: 
 82: #[tauri::command]
 83: pub fn export_vault(state: State<'_, DbState>, path: String) -> CmdResult<()> {
 84:     let json = {
 85:         let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 86:         db::export_json(&conn).map_err(e)?
 87:     };
 88:     std::fs::write(&path, json).map_err(e)
 89: }
 90: 
 91: #[tauri::command]
 92: pub fn import_vault(
 93:     state: State<'_, DbState>,
 94:     path: String,
 95:     strategy: String,
 96: ) -> CmdResult<ImportResult> {
 97:     let json = std::fs::read_to_string(&path).map_err(e)?;
 98:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
 99:     db::import_vault_json(&conn, &json, &strategy).map_err(e)
100: }
101: 
102: #[tauri::command]
103: pub fn import_markdown(state: State<'_, DbState>, path: String) -> CmdResult<Snippet> {
104:     let content = std::fs::read_to_string(&path).map_err(e)?;
105:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
106:     db::import_markdown(&conn, &content).map_err(e)
107: }
108: 
109: /// Import every `.md` / `.markdown` file in a directory (non-recursive).
110: /// Files that can't be read or parsed are counted as failures rather than
111: /// aborting the whole batch.
112: #[tauri::command]
113: pub fn import_markdown_dir(state: State<'_, DbState>, path: String) -> CmdResult<MarkdownDirResult> {
114:     let entries = std::fs::read_dir(&path).map_err(e)?;
115:     let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
116:     let mut result = MarkdownDirResult::default();
117:     for entry in entries.flatten() {
118:         let p = entry.path();
119:         let is_md = p
120:             .extension()
121:             .and_then(|x| x.to_str())
122:             .map(|x| x.eq_ignore_ascii_case("md") || x.eq_ignore_ascii_case("markdown"))
123:             .unwrap_or(false);
124:         if !is_md || !p.is_file() {
125:             continue;
126:         }
127:         match std::fs::read_to_string(&p) {
128:             Ok(content) => match db::import_markdown(&conn, &content) {
129:                 Ok(_) => result.imported += 1,
130:                 Err(_) => result.failed += 1,
131:             },
132:             Err(_) => result.failed += 1,
133:         }
134:     }
135:     Ok(result)
136: }
````

## File: src-tauri/src/db.rs
````rust
  1: use anyhow::{Context, Result};
  2: use rusqlite::{params, Connection};
  3: use serde::{Deserialize, Serialize};
  4: use std::path::Path;
  5: use std::time::{SystemTime, UNIX_EPOCH};
  6: use tauri::{AppHandle, Manager};
  7: 
  8: // ---------------------------------------------------------------------------
  9: // Data types
 10: // ---------------------------------------------------------------------------
 11: 
 12: #[derive(Debug, Serialize, Deserialize, Clone)]
 13: pub struct Snippet {
 14:     pub id: i64,
 15:     pub title: String,
 16:     pub description: String,
 17:     pub language: String,
 18:     pub code: String,
 19:     pub notes: String,
 20:     pub favorite: bool,
 21:     pub tags: Vec<String>,
 22:     pub created_at: i64,
 23:     pub updated_at: i64,
 24: }
 25: 
 26: #[derive(Debug, Deserialize)]
 27: pub struct NewSnippet {
 28:     pub title: String,
 29:     pub description: String,
 30:     pub language: String,
 31:     pub code: String,
 32:     pub notes: String,
 33:     pub favorite: bool,
 34:     pub tags: Vec<String>,
 35: }
 36: 
 37: #[derive(Debug, Deserialize)]
 38: pub struct SnippetPatch {
 39:     pub title: Option<String>,
 40:     pub description: Option<String>,
 41:     pub language: Option<String>,
 42:     pub code: Option<String>,
 43:     pub notes: Option<String>,
 44:     pub favorite: Option<bool>,
 45: }
 46: 
 47: // ---------------------------------------------------------------------------
 48: // Helpers
 49: // ---------------------------------------------------------------------------
 50: 
 51: fn now() -> i64 {
 52:     SystemTime::now()
 53:         .duration_since(UNIX_EPOCH)
 54:         .unwrap_or_default()
 55:         .as_secs() as i64
 56: }
 57: 
 58: fn parse_tags(raw: &str) -> Vec<String> {
 59:     if raw.is_empty() {
 60:         vec![]
 61:     } else {
 62:         raw.split(',').map(|s| s.to_string()).collect()
 63:     }
 64: }
 65: 
 66: fn row_to_snippet(row: &rusqlite::Row<'_>) -> rusqlite::Result<Snippet> {
 67:     let favorite: i64 = row.get(6)?;
 68:     let tag_names: String = row.get(7)?;
 69:     Ok(Snippet {
 70:         id: row.get(0)?,
 71:         title: row.get(1)?,
 72:         description: row.get(2)?,
 73:         language: row.get(3)?,
 74:         code: row.get(4)?,
 75:         notes: row.get(5)?,
 76:         favorite: favorite != 0,
 77:         tags: parse_tags(&tag_names),
 78:         created_at: row.get(8)?,
 79:         updated_at: row.get(9)?,
 80:     })
 81: }
 82: 
 83: const SNIPPET_SELECT: &str = "
 84:     SELECT
 85:         s.id, s.title, s.description, s.language, s.code, s.notes,
 86:         s.favorite,
 87:         COALESCE(GROUP_CONCAT(t.name, ','), '') AS tag_names,
 88:         s.created_at, s.updated_at
 89:     FROM snippets s
 90:     LEFT JOIN snippet_tags st ON s.id = st.snippet_id
 91:     LEFT JOIN tags t ON t.id = st.tag_id
 92: ";
 93: 
 94: // ---------------------------------------------------------------------------
 95: // DB init + migrations
 96: // ---------------------------------------------------------------------------
 97: 
 98: pub fn init_db(app: &AppHandle) -> Result<Connection> {
 99:     let data_dir = app
100:         .path()
101:         .app_data_dir()
102:         .context("failed to resolve app data directory")?;
103:     std::fs::create_dir_all(&data_dir).context("failed to create app data directory")?;
104: 
105:     let db_path = data_dir.join("vault.db");
106:     let conn = Connection::open(&db_path)
107:         .with_context(|| format!("failed to open database at {}", db_path.display()))?;
108: 
109:     conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")
110:         .context("failed to set PRAGMA options")?;
111: 
112:     migrate(&conn)?;
113: 
114:     // Launch-time backup: checkpoint the WAL so the main file is current,
115:     // then snapshot it. Failures here must never block startup.
116:     let _ = conn.execute_batch("PRAGMA wal_checkpoint(TRUNCATE);");
117:     if let Err(err) = backup_db(&data_dir, &db_path) {
118:         eprintln!("backup skipped: {err}");
119:     }
120: 
121:     Ok(conn)
122: }
123: 
124: const BACKUP_PREFIX: &str = "vault.db.bak-";
125: const BACKUPS_TO_KEEP: usize = 7;
126: 
127: /// Copy `vault.db` to `vault.db.bak-YYYY-MM-DD` (once per day), then prune to
128: /// the most recent `BACKUPS_TO_KEEP` backups.
129: fn backup_db(data_dir: &Path, db_path: &Path) -> Result<()> {
130:     if !db_path.exists() || std::fs::metadata(db_path)?.len() == 0 {
131:         return Ok(()); // nothing to back up yet
132:     }
133: 
134:     let (y, m, d) = ymd_from_unix(now());
135:     let name = format!("{BACKUP_PREFIX}{y:04}-{m:02}-{d:02}");
136:     let dest = data_dir.join(&name);
137:     if !dest.exists() {
138:         std::fs::copy(db_path, &dest)
139:             .with_context(|| format!("failed to write backup {name}"))?;
140:     }
141: 
142:     // Prune: collect backups, sort by name (dates sort chronologically), drop oldest.
143:     let mut backups: Vec<_> = std::fs::read_dir(data_dir)?
144:         .filter_map(|e| e.ok())
145:         .map(|e| e.file_name().to_string_lossy().into_owned())
146:         .filter(|n| n.starts_with(BACKUP_PREFIX))
147:         .collect();
148:     backups.sort();
149:     if backups.len() > BACKUPS_TO_KEEP {
150:         for old in &backups[..backups.len() - BACKUPS_TO_KEEP] {
151:             let _ = std::fs::remove_file(data_dir.join(old));
152:         }
153:     }
154:     Ok(())
155: }
156: 
157: /// Civil date (year, month, day) from a Unix timestamp, UTC.
158: /// Based on Howard Hinnant's days-from-civil algorithm.
159: fn ymd_from_unix(secs: i64) -> (i64, u32, u32) {
160:     let days = secs.div_euclid(86_400);
161:     let z = days + 719_468;
162:     let era = z.div_euclid(146_097);
163:     let doe = z - era * 146_097;
164:     let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
165:     let y = yoe + era * 400;
166:     let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
167:     let mp = (5 * doy + 2) / 153;
168:     let d = (doy - (153 * mp + 2) / 5 + 1) as u32;
169:     let m = if mp < 10 { mp + 3 } else { mp - 9 } as u32;
170:     let y = if m <= 2 { y + 1 } else { y };
171:     (y, m, d)
172: }
173: 
174: fn migrate(conn: &Connection) -> Result<()> {
175:     conn.execute_batch(
176:         "CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY);",
177:     )?;
178: 
179:     let version: i64 = conn
180:         .query_row(
181:             "SELECT COALESCE(MAX(version), 0) FROM schema_version",
182:             [],
183:             |row| row.get(0),
184:         )
185:         .unwrap_or(0);
186: 
187:     let migrations: &[(i64, &str)] = &[(
188:         1,
189:         "CREATE TABLE IF NOT EXISTS snippets (
190:              id          INTEGER PRIMARY KEY AUTOINCREMENT,
191:              title       TEXT    NOT NULL,
192:              description TEXT    NOT NULL DEFAULT '',
193:              language    TEXT    NOT NULL DEFAULT '',
194:              code        TEXT    NOT NULL DEFAULT '',
195:              notes       TEXT    NOT NULL DEFAULT '',
196:              favorite    INTEGER NOT NULL DEFAULT 0,
197:              created_at  INTEGER NOT NULL,
198:              updated_at  INTEGER NOT NULL
199:          );
200:          CREATE TABLE IF NOT EXISTS tags (
201:              id   INTEGER PRIMARY KEY AUTOINCREMENT,
202:              name TEXT UNIQUE NOT NULL
203:          );
204:          CREATE TABLE IF NOT EXISTS snippet_tags (
205:              snippet_id INTEGER NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
206:              tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
207:              PRIMARY KEY (snippet_id, tag_id)
208:          );",
209:     )];
210: 
211:     for (v, sql) in migrations {
212:         if *v > version {
213:             conn.execute_batch(sql)
214:                 .with_context(|| format!("migration v{v} failed"))?;
215:             conn.execute(
216:                 "INSERT OR REPLACE INTO schema_version VALUES (?1)",
217:                 params![v],
218:             )?;
219:         }
220:     }
221: 
222:     Ok(())
223: }
224: 
225: // ---------------------------------------------------------------------------
226: // Repository functions
227: // ---------------------------------------------------------------------------
228: 
229: pub fn list_snippets(conn: &Connection) -> Result<Vec<Snippet>> {
230:     let sql = format!("{SNIPPET_SELECT} GROUP BY s.id ORDER BY s.updated_at DESC");
231:     let mut stmt = conn.prepare(&sql)?;
232:     let rows = stmt.query_map([], row_to_snippet)?;
233:     rows.map(|r| r.map_err(anyhow::Error::from)).collect()
234: }
235: 
236: pub fn get_snippet(conn: &Connection, id: i64) -> Result<Snippet> {
237:     let sql = format!("{SNIPPET_SELECT} WHERE s.id = ?1 GROUP BY s.id");
238:     conn.query_row(&sql, params![id], row_to_snippet)
239:         .with_context(|| format!("snippet {id} not found"))
240: }
241: 
242: pub fn create_snippet(conn: &Connection, input: NewSnippet) -> Result<Snippet> {
243:     let ts = now();
244:     conn.execute(
245:         "INSERT INTO snippets (title, description, language, code, notes, favorite, created_at, updated_at)
246:          VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
247:         params![
248:             input.title,
249:             input.description,
250:             input.language,
251:             input.code,
252:             input.notes,
253:             input.favorite as i64,
254:             ts,
255:             ts
256:         ],
257:     )?;
258:     let id = conn.last_insert_rowid();
259:     set_snippet_tags(conn, id, &input.tags)?;
260:     get_snippet(conn, id)
261: }
262: 
263: pub fn update_snippet(conn: &Connection, id: i64, patch: SnippetPatch) -> Result<Snippet> {
264:     conn.execute(
265:         "UPDATE snippets SET
266:              title       = COALESCE(?1, title),
267:              description = COALESCE(?2, description),
268:              language    = COALESCE(?3, language),
269:              code        = COALESCE(?4, code),
270:              notes       = COALESCE(?5, notes),
271:              favorite    = COALESCE(?6, favorite),
272:              updated_at  = ?7
273:          WHERE id = ?8",
274:         params![
275:             patch.title,
276:             patch.description,
277:             patch.language,
278:             patch.code,
279:             patch.notes,
280:             patch.favorite.map(|b| b as i64),
281:             now(),
282:             id
283:         ],
284:     )?;
285:     get_snippet(conn, id)
286: }
287: 
288: pub fn delete_snippet(conn: &Connection, id: i64) -> Result<()> {
289:     conn.execute("DELETE FROM snippets WHERE id = ?1", params![id])?;
290:     Ok(())
291: }
292: 
293: pub fn toggle_favorite(conn: &Connection, id: i64) -> Result<bool> {
294:     conn.execute(
295:         "UPDATE snippets SET favorite = NOT favorite, updated_at = ?1 WHERE id = ?2",
296:         params![now(), id],
297:     )?;
298:     let fav: i64 =
299:         conn.query_row("SELECT favorite FROM snippets WHERE id = ?1", params![id], |r| {
300:             r.get(0)
301:         })?;
302:     Ok(fav != 0)
303: }
304: 
305: pub fn list_tags(conn: &Connection) -> Result<Vec<String>> {
306:     let mut stmt = conn.prepare("SELECT name FROM tags ORDER BY name")?;
307:     let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
308:     rows.map(|r| r.map_err(anyhow::Error::from)).collect()
309: }
310: 
311: pub fn set_snippet_tags(conn: &Connection, snippet_id: i64, tag_names: &[String]) -> Result<()> {
312:     conn.execute(
313:         "DELETE FROM snippet_tags WHERE snippet_id = ?1",
314:         params![snippet_id],
315:     )?;
316:     for name in tag_names {
317:         let name = name.trim();
318:         if name.is_empty() {
319:             continue;
320:         }
321:         conn.execute(
322:             "INSERT OR IGNORE INTO tags (name) VALUES (?1)",
323:             params![name],
324:         )?;
325:         let tag_id: i64 =
326:             conn.query_row("SELECT id FROM tags WHERE name = ?1", params![name], |r| {
327:                 r.get(0)
328:             })?;
329:         conn.execute(
330:             "INSERT OR IGNORE INTO snippet_tags (snippet_id, tag_id) VALUES (?1, ?2)",
331:             params![snippet_id, tag_id],
332:         )?;
333:     }
334:     Ok(())
335: }
336: 
337: pub fn search_snippets(conn: &Connection, query: &str) -> Result<Vec<Snippet>> {
338:     let pattern = format!("%{query}%");
339:     let sql = format!(
340:         "{SNIPPET_SELECT}
341:          WHERE s.title LIKE ?1 OR s.code LIKE ?1 OR s.notes LIKE ?1
342:             OR EXISTS (
343:                 SELECT 1 FROM snippet_tags st2
344:                 JOIN tags t2 ON t2.id = st2.tag_id
345:                 WHERE st2.snippet_id = s.id AND t2.name LIKE ?1
346:             )
347:          GROUP BY s.id
348:          ORDER BY s.updated_at DESC"
349:     );
350:     let mut stmt = conn.prepare(&sql)?;
351:     let rows = stmt.query_map(params![pattern], row_to_snippet)?;
352:     rows.map(|r| r.map_err(anyhow::Error::from)).collect()
353: }
354: 
355: // ---------------------------------------------------------------------------
356: // Import / export
357: // ---------------------------------------------------------------------------
358: 
359: #[derive(Debug, Serialize)]
360: pub struct VaultExport {
361:     pub version: i64,
362:     pub exported_at: i64,
363:     pub snippets: Vec<Snippet>,
364: }
365: 
366: #[derive(Debug, Serialize, Default)]
367: pub struct ImportResult {
368:     pub imported: usize,
369:     pub overwritten: usize,
370:     pub skipped: usize,
371:     pub renamed: usize,
372: }
373: 
374: /// Result of importing every Markdown file in a directory.
375: #[derive(Debug, Serialize, Default)]
376: pub struct MarkdownDirResult {
377:     pub imported: usize,
378:     pub failed: usize,
379: }
380: 
381: /// A snippet as it arrives from an import file — every field but the title is
382: /// optional so partial / hand-written JSON still loads.
383: #[derive(Debug, Deserialize)]
384: struct ImportSnippet {
385:     title: String,
386:     #[serde(default)]
387:     description: String,
388:     #[serde(default)]
389:     language: String,
390:     #[serde(default)]
391:     code: String,
392:     #[serde(default)]
393:     notes: String,
394:     #[serde(default)]
395:     favorite: bool,
396:     #[serde(default)]
397:     tags: Vec<String>,
398:     #[serde(default)]
399:     created_at: Option<i64>,
400:     #[serde(default)]
401:     updated_at: Option<i64>,
402: }
403: 
404: #[derive(Debug, Deserialize)]
405: struct VaultImport {
406:     #[serde(default)]
407:     snippets: Vec<ImportSnippet>,
408: }
409: 
410: pub fn export_json(conn: &Connection) -> Result<String> {
411:     let export = VaultExport {
412:         version: 1,
413:         exported_at: now(),
414:         snippets: list_snippets(conn)?,
415:     };
416:     serde_json::to_string_pretty(&export).context("failed to serialise vault")
417: }
418: 
419: /// Import a JSON export. `strategy` is one of `skip` | `overwrite` | `rename`
420: /// and decides what happens when an incoming title already exists.
421: pub fn import_vault_json(conn: &Connection, json: &str, strategy: &str) -> Result<ImportResult> {
422:     // Accept either the wrapped `{ "snippets": [...] }` form or a bare array.
423:     let incoming: Vec<ImportSnippet> = match serde_json::from_str::<VaultImport>(json) {
424:         Ok(v) if !v.snippets.is_empty() => v.snippets,
425:         _ => serde_json::from_str(json).context("file is not a valid CodeVault export")?,
426:     };
427: 
428:     let mut result = ImportResult::default();
429:     for snip in incoming {
430:         let existing: Option<i64> = conn
431:             .query_row(
432:                 "SELECT id FROM snippets WHERE title = ?1",
433:                 params![snip.title],
434:                 |r| r.get(0),
435:             )
436:             .ok();
437: 
438:         match (existing, strategy) {
439:             (Some(_), "skip") => result.skipped += 1,
440:             (Some(id), "overwrite") => {
441:                 overwrite_snippet(conn, id, &snip)?;
442:                 result.overwritten += 1;
443:             }
444:             (Some(_), _) => {
445:                 // "rename" (and any unknown strategy): insert under a unique title
446:                 let title = unique_title(conn, &snip.title)?;
447:                 insert_full(conn, &snip, &title)?;
448:                 result.renamed += 1;
449:             }
450:             (None, _) => {
451:                 insert_full(conn, &snip, &snip.title)?;
452:                 result.imported += 1;
453:             }
454:         }
455:     }
456:     Ok(result)
457: }
458: 
459: fn insert_full(conn: &Connection, s: &ImportSnippet, title: &str) -> Result<i64> {
460:     let created = s.created_at.unwrap_or_else(now);
461:     let updated = s.updated_at.unwrap_or_else(now);
462:     conn.execute(
463:         "INSERT INTO snippets (title, description, language, code, notes, favorite, created_at, updated_at)
464:          VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
465:         params![
466:             title,
467:             s.description,
468:             s.language,
469:             s.code,
470:             s.notes,
471:             s.favorite as i64,
472:             created,
473:             updated
474:         ],
475:     )?;
476:     let id = conn.last_insert_rowid();
477:     set_snippet_tags(conn, id, &s.tags)?;
478:     Ok(id)
479: }
480: 
481: fn overwrite_snippet(conn: &Connection, id: i64, s: &ImportSnippet) -> Result<()> {
482:     conn.execute(
483:         "UPDATE snippets SET description = ?1, language = ?2, code = ?3,
484:              notes = ?4, favorite = ?5, updated_at = ?6 WHERE id = ?7",
485:         params![
486:             s.description,
487:             s.language,
488:             s.code,
489:             s.notes,
490:             s.favorite as i64,
491:             s.updated_at.unwrap_or_else(now),
492:             id
493:         ],
494:     )?;
495:     set_snippet_tags(conn, id, &s.tags)?;
496:     Ok(())
497: }
498: 
499: fn unique_title(conn: &Connection, base: &str) -> Result<String> {
500:     let mut n = 2;
501:     loop {
502:         let candidate = format!("{base} ({n})");
503:         let exists: bool = conn
504:             .query_row(
505:                 "SELECT 1 FROM snippets WHERE title = ?1",
506:                 params![candidate],
507:                 |_| Ok(true),
508:             )
509:             .unwrap_or(false);
510:         if !exists {
511:             return Ok(candidate);
512:         }
513:         n += 1;
514:     }
515: }
516: 
517: /// Import a single Markdown file. A leading `---` front-matter block supplies
518: /// `title`, `language`, and comma-separated `tags`; the remaining body becomes
519: /// the snippet's code. Missing front-matter falls back to sensible defaults.
520: pub fn import_markdown(conn: &Connection, content: &str) -> Result<Snippet> {
521:     let (front, body) = split_front_matter(content);
522: 
523:     let mut title = String::new();
524:     let mut language = String::new();
525:     let mut tags: Vec<String> = vec![];
526: 
527:     for line in front.lines() {
528:         let Some((key, value)) = line.split_once(':') else {
529:             continue;
530:         };
531:         let value = value.trim().trim_matches(|c| c == '"' || c == '\'');
532:         match key.trim().to_lowercase().as_str() {
533:             "title" => title = value.to_string(),
534:             "language" | "lang" => language = value.to_string(),
535:             "tags" => {
536:                 tags = value
537:                     .trim_matches(|c| c == '[' || c == ']')
538:                     .split(',')
539:                     .map(|t| t.trim().to_string())
540:                     .filter(|t| !t.is_empty())
541:                     .collect()
542:             }
543:             _ => {}
544:         }
545:     }
546: 
547:     if title.is_empty() {
548:         title = "Imported snippet".to_string();
549:     }
550: 
551:     let input = NewSnippet {
552:         title,
553:         description: String::new(),
554:         language,
555:         code: body.trim().to_string(),
556:         notes: String::new(),
557:         favorite: false,
558:         tags,
559:     };
560:     create_snippet(conn, input)
561: }
562: 
563: /// Split a `---`-delimited YAML front-matter header from the body.
564: /// Returns `(front_matter, body)`; front is empty when there is no header.
565: fn split_front_matter(content: &str) -> (&str, &str) {
566:     let trimmed = content.trim_start();
567:     let Some(rest) = trimmed.strip_prefix("---") else {
568:         return ("", content);
569:     };
570:     // Find the closing `---` on its own line.
571:     if let Some(end) = rest.find("\n---") {
572:         let front = &rest[..end];
573:         let after = &rest[end + 4..]; // skip "\n---"
574:         let body = after.strip_prefix('\n').unwrap_or(after);
575:         (front, body)
576:     } else {
577:         ("", content)
578:     }
579: }
580: 
581: // ---------------------------------------------------------------------------
582: // Tests
583: // ---------------------------------------------------------------------------
584: 
585: #[cfg(test)]
586: mod tests {
587:     use super::*;
588: 
589:     fn test_conn() -> Connection {
590:         let conn = Connection::open_in_memory().unwrap();
591:         conn.execute_batch("PRAGMA foreign_keys=ON;").unwrap();
592:         migrate(&conn).unwrap();
593:         conn
594:     }
595: 
596:     fn sample(title: &str) -> NewSnippet {
597:         NewSnippet {
598:             title: title.to_string(),
599:             description: String::new(),
600:             language: "bash".to_string(),
601:             code: "echo hi".to_string(),
602:             notes: String::new(),
603:             favorite: false,
604:             tags: vec!["shell".to_string()],
605:         }
606:     }
607: 
608:     #[test]
609:     fn import_inserts_new_snippets() {
610:         let conn = test_conn();
611:         let json = r#"{"snippets":[{"title":"A","code":"a"},{"title":"B","code":"b"}]}"#;
612:         let r = import_vault_json(&conn, json, "rename").unwrap();
613:         assert_eq!(r.imported, 2);
614:         assert_eq!(list_snippets(&conn).unwrap().len(), 2);
615:     }
616: 
617:     #[test]
618:     fn import_accepts_bare_array() {
619:         let conn = test_conn();
620:         let json = r#"[{"title":"A","code":"a"}]"#;
621:         let r = import_vault_json(&conn, json, "skip").unwrap();
622:         assert_eq!(r.imported, 1);
623:     }
624: 
625:     #[test]
626:     fn import_skip_leaves_existing_untouched() {
627:         let conn = test_conn();
628:         create_snippet(&conn, sample("Dup")).unwrap();
629:         let json = r#"{"snippets":[{"title":"Dup","code":"changed"}]}"#;
630:         let r = import_vault_json(&conn, json, "skip").unwrap();
631:         assert_eq!(r.skipped, 1);
632:         let all = list_snippets(&conn).unwrap();
633:         assert_eq!(all.len(), 1);
634:         assert_eq!(all[0].code, "echo hi"); // unchanged
635:     }
636: 
637:     #[test]
638:     fn import_overwrite_replaces_body() {
639:         let conn = test_conn();
640:         create_snippet(&conn, sample("Dup")).unwrap();
641:         let json = r#"{"snippets":[{"title":"Dup","code":"changed"}]}"#;
642:         let r = import_vault_json(&conn, json, "overwrite").unwrap();
643:         assert_eq!(r.overwritten, 1);
644:         let all = list_snippets(&conn).unwrap();
645:         assert_eq!(all.len(), 1);
646:         assert_eq!(all[0].code, "changed");
647:     }
648: 
649:     #[test]
650:     fn import_rename_adds_suffixed_copy() {
651:         let conn = test_conn();
652:         create_snippet(&conn, sample("Dup")).unwrap();
653:         let json = r#"{"snippets":[{"title":"Dup","code":"copy"}]}"#;
654:         let r = import_vault_json(&conn, json, "rename").unwrap();
655:         assert_eq!(r.renamed, 1);
656:         let titles: Vec<_> = list_snippets(&conn).unwrap().into_iter().map(|s| s.title).collect();
657:         assert!(titles.contains(&"Dup".to_string()));
658:         assert!(titles.contains(&"Dup (2)".to_string()));
659:     }
660: 
661:     #[test]
662:     fn markdown_front_matter_is_parsed() {
663:         let conn = test_conn();
664:         let md = "---\ntitle: Restart Pi-hole\nlanguage: bash\ntags: linux, pihole\n---\npihole restartdns\n";
665:         let snip = import_markdown(&conn, md).unwrap();
666:         assert_eq!(snip.title, "Restart Pi-hole");
667:         assert_eq!(snip.language, "bash");
668:         assert_eq!(snip.code, "pihole restartdns");
669:         assert_eq!(snip.tags, vec!["linux".to_string(), "pihole".to_string()]);
670:     }
671: 
672:     #[test]
673:     fn markdown_without_front_matter_falls_back() {
674:         let conn = test_conn();
675:         let snip = import_markdown(&conn, "just some code").unwrap();
676:         assert_eq!(snip.title, "Imported snippet");
677:         assert_eq!(snip.code, "just some code");
678:     }
679: 
680:     #[test]
681:     fn export_roundtrips_through_import() {
682:         let conn = test_conn();
683:         create_snippet(&conn, sample("One")).unwrap();
684:         create_snippet(&conn, sample("Two")).unwrap();
685:         let json = export_json(&conn).unwrap();
686: 
687:         let conn2 = test_conn();
688:         let r = import_vault_json(&conn2, &json, "rename").unwrap();
689:         assert_eq!(r.imported, 2);
690:         assert_eq!(list_snippets(&conn2).unwrap().len(), 2);
691:     }
692: 
693:     #[test]
694:     fn ymd_conversion_is_correct() {
695:         // 2021-01-01 00:00:00 UTC = 1609459200
696:         assert_eq!(ymd_from_unix(1_609_459_200), (2021, 1, 1));
697:         // 1970-01-01
698:         assert_eq!(ymd_from_unix(0), (1970, 1, 1));
699:     }
700: }
````

## File: src-tauri/tauri.conf.json
````json
 1: {
 2:   "$schema": "https://schema.tauri.app/config/2",
 3:   "productName": "CodeVault",
 4:   "version": "0.1.0",
 5:   "identifier": "dev.codevault.app",
 6:   "build": {
 7:     "beforeDevCommand": "pnpm dev",
 8:     "devUrl": "http://localhost:1420",
 9:     "beforeBuildCommand": "pnpm build",
10:     "frontendDist": "../dist"
11:   },
12:   "app": {
13:     "windows": [
14:       {
15:         "title": "CodeVault",
16:         "width": 1200,
17:         "minWidth": 900,
18:         "height": 780,
19:         "minHeight": 500
20:       }
21:     ],
22:     "security": {
23:       "csp": null
24:     }
25:   },
26:   "bundle": {
27:     "active": true,
28:     "targets": "all",
29:     "category": "DeveloperTool",
30:     "shortDescription": "Local-first desktop snippet manager",
31:     "longDescription": "CodeVault stores reusable code, shell one-liners, configs, and commands with syntax highlighting, tags, and markdown notes in a local SQLite database. No accounts, no cloud.",
32:     "icon": [
33:       "icons/32x32.png",
34:       "icons/128x128.png",
35:       "icons/128x128@2x.png",
36:       "icons/icon.icns",
37:       "icons/icon.ico"
38:     ]
39:   }
40: }
````

## File: src/components/SnippetDetail.tsx
````typescript
  1: import { useCallback, useEffect, useRef, useState } from "react";
  2: import { writeText } from "@tauri-apps/plugin-clipboard-manager";
  3: import { LANGUAGES } from "../lib/languages";
  4: import { useVaultStore } from "../lib/store";
  5: import { toast } from "../lib/toast";
  6: import type { Snippet } from "../lib/types";
  7: import CodeEditor from "./CodeEditor";
  8: import LanguageBadge from "./LanguageBadge";
  9: 
 10: // ---------------------------------------------------------------------------
 11: // Inline icons
 12: // ---------------------------------------------------------------------------
 13: 
 14: function CopyIcon() {
 15:   return (
 16:     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
 17:       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
 18:     </svg>
 19:   );
 20: }
 21: 
 22: function TrashIcon() {
 23:   return (
 24:     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
 25:       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
 26:     </svg>
 27:   );
 28: }
 29: 
 30: function StarIcon({ filled }: { filled: boolean }) {
 31:   return (
 32:     <svg
 33:       className={`w-4 h-4 ${filled ? "text-emerald-400" : "text-zinc-500"}`}
 34:       fill={filled ? "currentColor" : "none"}
 35:       stroke="currentColor"
 36:       strokeWidth={2}
 37:       viewBox="0 0 24 24"
 38:     >
 39:       <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
 40:     </svg>
 41:   );
 42: }
 43: 
 44: // ---------------------------------------------------------------------------
 45: // Form state helpers
 46: // ---------------------------------------------------------------------------
 47: 
 48: interface FormState {
 49:   title: string;
 50:   description: string;
 51:   language: string;
 52:   code: string;
 53:   notes: string;
 54:   tagInput: string;
 55: }
 56: 
 57: function snippetToForm(s: Snippet): FormState {
 58:   return {
 59:     title: s.title,
 60:     description: s.description,
 61:     language: s.language,
 62:     code: s.code,
 63:     notes: s.notes,
 64:     tagInput: s.tags.join(", "),
 65:   };
 66: }
 67: 
 68: // ---------------------------------------------------------------------------
 69: // Main component
 70: // ---------------------------------------------------------------------------
 71: 
 72: export default function SnippetDetail() {
 73:   const snippet = useVaultStore((s) => s.selectedSnippet());
 74:   const notesVisible = useVaultStore((s) => s.notesVisible);
 75:   const { updateSnippet, updateTags, toggleFavorite, confirmDelete } = useVaultStore();
 76: 
 77:   const [form, setForm] = useState<FormState | null>(null);
 78:   const [isDirty, setIsDirty] = useState(false);
 79:   const snippetIdRef = useRef<number | null>(null);
 80:   const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 81: 
 82:   // Reinitialise local form whenever the selected snippet changes
 83:   useEffect(() => {
 84:     if (!snippet) { setForm(null); return; }
 85:     if (snippet.id !== snippetIdRef.current) {
 86:       snippetIdRef.current = snippet.id;
 87:       setForm(snippetToForm(snippet));
 88:       setIsDirty(false);
 89:       if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
 90:     }
 91:   }, [snippet]);
 92: 
 93:   // Debounced autosave (500 ms after last keypress)
 94:   useEffect(() => {
 95:     if (!isDirty || !snippet || !form) return;
 96:     if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
 97:     saveTimerRef.current = setTimeout(() => {
 98:       updateSnippet(snippet.id, {
 99:         title: form.title,
100:         description: form.description,
101:         language: form.language,
102:         code: form.code,
103:         notes: form.notes,
104:       });
105:       setIsDirty(false);
106:     }, 500);
107:     return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
108:   // eslint-disable-next-line react-hooks/exhaustive-deps
109:   }, [form, isDirty]);
110: 
111:   // Immediate save (Ctrl+S) — flush the pending debounce and persist now
112:   const saveNow = useCallback(() => {
113:     if (!snippet || !form) return;
114:     if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
115:     updateSnippet(snippet.id, {
116:       title: form.title,
117:       description: form.description,
118:       language: form.language,
119:       code: form.code,
120:       notes: form.notes,
121:     });
122:     setIsDirty(false);
123:     toast.success("Saved");
124:   }, [snippet, form, updateSnippet]);
125: 
126:   useEffect(() => {
127:     const onKeyDown = (e: KeyboardEvent) => {
128:       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
129:         e.preventDefault();
130:         saveNow();
131:       }
132:     };
133:     window.addEventListener("keydown", onKeyDown);
134:     return () => window.removeEventListener("keydown", onKeyDown);
135:   }, [saveNow]);
136: 
137:   const handleChange = (field: keyof FormState, value: string) => {
138:     setForm((prev) => prev ? { ...prev, [field]: value } : prev);
139:     setIsDirty(true);
140:   };
141: 
142:   // Commit tags on blur of the tag input
143:   const handleTagBlur = () => {
144:     if (!snippet || !form) return;
145:     const tags = form.tagInput
146:       .split(",")
147:       .map((t) => t.trim())
148:       .filter(Boolean);
149:     updateTags(snippet.id, tags);
150:   };
151: 
152:   const handleCopy = () => {
153:     if (!form) return;
154:     writeText(form.code)
155:       .then(() => toast.success("Code copied to clipboard"))
156:       .catch(() => toast.error("Failed to copy"));
157:   };
158: 
159:   if (!snippet || !form) {
160:     return (
161:       <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm">
162:         <span className="text-3xl mb-3">◌</span>
163:         select a snippet
164:       </div>
165:     );
166:   }
167: 
168:   const updatedDate = new Date(snippet.updated_at * 1000).toLocaleDateString("en-GB", {
169:     day: "2-digit", month: "short", year: "numeric",
170:   });
171: 
172:   return (
173:     <div className="flex flex-col h-full bg-zinc-950">
174:       {/* Header */}
175:       <div className="px-5 py-4 border-b border-zinc-800 flex-shrink-0 space-y-3">
176:         {/* Title row */}
177:         <div className="flex items-center gap-2">
178:           <input
179:             className="flex-1 min-w-0 bg-transparent text-zinc-100 font-mono font-semibold text-base outline-none border-b border-transparent focus:border-zinc-600 transition-colors placeholder-zinc-600"
180:             value={form.title}
181:             onChange={(e) => handleChange("title", e.target.value)}
182:             placeholder="Untitled Snippet"
183:           />
184:           <button
185:             onClick={() => toggleFavorite(snippet.id)}
186:             className="flex-shrink-0 hover:text-emerald-400 transition-colors"
187:             title="Toggle favourite"
188:           >
189:             <StarIcon filled={snippet.favorite} />
190:           </button>
191:           <button
192:             onClick={() => confirmDelete(snippet.id)}
193:             className="flex-shrink-0 text-zinc-500 hover:text-red-400 transition-colors"
194:             title="Delete snippet"
195:           >
196:             <TrashIcon />
197:           </button>
198:         </div>
199: 
200:         {/* Description */}
201:         <input
202:           className="w-full bg-transparent text-zinc-500 font-mono text-xs outline-none border-b border-transparent focus:border-zinc-700 transition-colors placeholder-zinc-700"
203:           value={form.description}
204:           onChange={(e) => handleChange("description", e.target.value)}
205:           placeholder="Short description…"
206:         />
207: 
208:         {/* Language + tags + date */}
209:         <div className="flex items-center gap-3 flex-wrap">
210:           <select
211:             className="bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs rounded px-2 py-1 outline-none focus:border-emerald-700 transition-colors cursor-pointer"
212:             value={form.language}
213:             onChange={(e) => handleChange("language", e.target.value)}
214:           >
215:             {LANGUAGES.map((l) => (
216:               <option key={l} value={l}>{l}</option>
217:             ))}
218:           </select>
219: 
220:           <LanguageBadge language={form.language} />
221: 
222:           <input
223:             className="flex-1 min-w-0 bg-transparent text-zinc-500 font-mono text-xs outline-none border-b border-transparent focus:border-zinc-700 transition-colors placeholder-zinc-700"
224:             value={form.tagInput}
225:             onChange={(e) => handleChange("tagInput", e.target.value)}
226:             onBlur={handleTagBlur}
227:             placeholder="tags, comma, separated"
228:           />
229: 
230:           <span className="ml-auto text-xs font-mono text-zinc-600 flex-shrink-0">{updatedDate}</span>
231:         </div>
232:       </div>
233: 
234:       {/* Code section */}
235:       <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
236:         <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
237:           <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">code</span>
238:           <div className="flex items-center gap-2">
239:             {isDirty && (
240:               <span className="text-xs font-mono text-zinc-600">saving…</span>
241:             )}
242:             <button
243:               onClick={handleCopy}
244:               className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
245:             >
246:               <CopyIcon />
247:               copy
248:             </button>
249:           </div>
250:         </div>
251:         <div className="flex-1 overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto">
252:           <CodeEditor
253:             value={form.code}
254:             onChange={(v) => handleChange("code", v)}
255:             language={form.language}
256:             placeholder="// paste or type your snippet here"
257:           />
258:         </div>
259:       </div>
260: 
261:       {/* Notes section — toggle with Ctrl+/ */}
262:       {notesVisible && (
263:         <div className="flex-shrink-0 border-t border-zinc-800 h-40 flex flex-col">
264:           <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
265:             <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">notes</span>
266:           </div>
267:           <div className="flex-1 overflow-auto">
268:             <CodeEditor
269:               value={form.notes}
270:               onChange={(v) => handleChange("notes", v)}
271:               language="markdown"
272:               placeholder="markdown notes…"
273:             />
274:           </div>
275:         </div>
276:       )}
277:     </div>
278:   );
279: }
````

## File: src/lib/types.ts
````typescript
 1: export interface Tag {
 2:   id: number;
 3:   name: string;
 4: }
 5: 
 6: export interface Snippet {
 7:   id: number;
 8:   title: string;
 9:   description: string;
10:   language: string;
11:   code: string;
12:   notes: string;
13:   favorite: boolean;
14:   tags: string[];
15:   created_at: number;
16:   updated_at: number;
17: }
18: 
19: export interface NewSnippet {
20:   title: string;
21:   description: string;
22:   language: string;
23:   code: string;
24:   notes: string;
25:   favorite: boolean;
26:   tags: string[];
27: }
28: 
29: export interface SnippetPatch {
30:   title?: string;
31:   description?: string;
32:   language?: string;
33:   code?: string;
34:   notes?: string;
35:   favorite?: boolean;
36: }
37: 
38: export type ImportStrategy = "skip" | "overwrite" | "rename";
39: 
40: export interface ImportResult {
41:   imported: number;
42:   overwritten: number;
43:   skipped: number;
44:   renamed: number;
45: }
46: 
47: export interface MarkdownDirResult {
48:   imported: number;
49:   failed: number;
50: }
````

## File: src-tauri/Cargo.toml
````toml
 1: [package]
 2: name = "codevault"
 3: version = "0.1.0"
 4: description = "A local-first desktop snippet manager"
 5: authors = ["Jamie Scott"]
 6: edition = "2021"
 7: 
 8: # See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
 9: 
10: [lib]
11: # The `_lib` suffix may seem redundant but it is necessary
12: # to make the lib name unique and wouldn't conflict with the bin name.
13: # This seems to be only an issue on Windows, see https://github.com/rust-lang/cargo/issues/8519
14: name = "codevault_lib"
15: crate-type = ["staticlib", "cdylib", "rlib"]
16: 
17: [build-dependencies]
18: tauri-build = { version = "2", features = [] }
19: 
20: [dependencies]
21: tauri = { version = "2", features = [] }
22: tauri-plugin-opener = "2"
23: tauri-plugin-clipboard-manager = "2"
24: tauri-plugin-dialog = "2"
25: serde = { version = "1", features = ["derive"] }
26: serde_json = "1"
27: rusqlite = { version = "0.31", features = ["bundled"] }
28: anyhow = "1"
````

## File: README.md
````markdown
  1: # CodeVault
  2: 
  3: A local-first desktop snippet manager — your personal terminal memory trap for reusable code, shell one-liners, configs, and commands.
  4: 
  5: No accounts. No cloud. No browser tab. Just a fast native app backed by SQLite.
  6: 
  7: ## What it is
  8: 
  9: CodeVault stores code snippets with syntax highlighting, tags, and markdown notes in a local SQLite database. It runs as a native desktop app (Tauri + React) with a companion CLI for terminal-driven capture.
 10: 
 11: ```text
 12: ┌──────────────────────┬──────────────────────────────────────────┐
 13: │ Search               │ Snippet Title                            │
 14: │                      │ Tags: docker, caddy, https               │
 15: │ Collections          │ Language: Caddyfile                      │
 16: │  - Linux             │                                          │
 17: │  - Docker            │ ┌──────────────────────────────────────┐ │
 18: │  - Java              │ │ code editor (CodeMirror)             │ │
 19: │  - Tailscale         │ │                                      │ │
 20: │                      │ └──────────────────────────────────────┘ │
 21: │ Snippet List         │ Notes / Markdown                         │
 22: └──────────────────────┴──────────────────────────────────────────┘
 23: ```
 24: 
 25: ## Stack
 26: 
 27: | Layer | Choice |
 28: | --- | --- |
 29: | Desktop shell | Tauri (Rust) |
 30: | Frontend | React + TypeScript + Vite |
 31: | Styling | Tailwind CSS |
 32: | Editor | CodeMirror 6 |
 33: | Database | SQLite (via `rusqlite`) |
 34: | CLI | Rust binary, shared DB |
 35: 
 36: ## Getting started
 37: 
 38: ### Prerequisites
 39: 
 40: - Rust toolchain: `rustup` + stable channel
 41: - Node.js LTS + `pnpm`
 42: - Linux system deps:
 43: 
 44: ```bash
 45: sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
 46:   libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
 47: ```
 48: 
 49: ### Run in development
 50: 
 51: ```bash
 52: pnpm install
 53: pnpm tauri dev
 54: ```
 55: 
 56: ### Build
 57: 
 58: ```bash
 59: pnpm tauri build
 60: ```
 61: 
 62: Produces a `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`.
 63: 
 64: ## Keyboard shortcuts
 65: 
 66: | Shortcut | Action |
 67: | --- | --- |
 68: | `Ctrl/Cmd+N` | New snippet |
 69: | `Ctrl/Cmd+K` | Command palette |
 70: | `Ctrl/Cmd+F` | Focus search |
 71: | `Ctrl/Cmd+S` | Save now (flush autosave) |
 72: | `Ctrl/Cmd+D` | Toggle favourite |
 73: | `Ctrl/Cmd+/` | Toggle notes pane |
 74: | `Ctrl/Cmd+,` | Open settings |
 75: | `Esc` | Close palette / settings |
 76: 
 77: ## Import / export
 78: 
 79: Open **Settings** (gear icon, top-left, or `Ctrl+,`):
 80: 
 81: - **Export vault (JSON)** — writes the whole vault to a JSON file.
 82: - **Import vault (JSON)** — merges a JSON export; on a title conflict choose *rename*, *skip*, or *overwrite*.
 83: - **Import Markdown** — creates a snippet from a `.md` file; a `---` front-matter block supplies `title`, `language`, and comma-separated `tags`, and the body becomes the snippet code.
 84: 
 85: A dated backup of `vault.db` is taken on each launch (last 7 kept) in the data directory.
 86: 
 87: ## Data location
 88: 
 89: - Linux: `~/.local/share/codevault/vault.db`
 90: - Windows: `%APPDATA%\codevault\vault.db`
 91: - macOS: `~/Library/Application Support/codevault/vault.db`
 92: 
 93: ## CLI companion (Phase 6)
 94: 
 95: ```bash
 96: codevault add --title "Restart Pi-hole" --lang bash
 97: history | tail -20 | codevault import
 98: codevault search nginx
 99: codevault copy <id>
100: ```
101: 
102: ## Roadmap
103: 
104: | Phase | Goal | Status |
105: | --- | --- | --- |
106: | 1 | Tauri skeleton — app launches | done |
107: | 2 | Static UI — three-pane layout with mock data | done |
108: | 3 | SQLite storage — real CRUD | done |
109: | 4 | CodeMirror editor — syntax highlighting | done |
110: | 5 | Search & tags — filter and find fast | done |
111: | 6 | Polish — shortcuts, CLI, import/export, `.deb` | in progress |
112: 
113: For a reusable visual roadmap format, see [`docs/PROJECT_TIMELINE_TEMPLATE.md`](docs/PROJECT_TIMELINE_TEMPLATE.md).
114: 
115: ## License
116: 
117: MIT
````

## File: src-tauri/src/lib.rs
````rust
 1: mod commands;
 2: mod db;
 3: 
 4: use commands::DbState;
 5: use std::sync::Mutex;
 6: use tauri::Manager;
 7: 
 8: #[cfg_attr(mobile, tauri::mobile_entry_point)]
 9: pub fn run() {
10:     tauri::Builder::default()
11:         .plugin(tauri_plugin_opener::init())
12:         .plugin(tauri_plugin_clipboard_manager::init())
13:         .plugin(tauri_plugin_dialog::init())
14:         .setup(|app| {
15:             let conn = db::init_db(app.handle()).expect("failed to initialise database");
16:             app.manage(DbState(Mutex::new(conn)));
17:             Ok(())
18:         })
19:         .invoke_handler(tauri::generate_handler![
20:             commands::list_snippets,
21:             commands::get_snippet,
22:             commands::create_snippet,
23:             commands::update_snippet,
24:             commands::delete_snippet,
25:             commands::toggle_favorite,
26:             commands::list_tags,
27:             commands::set_snippet_tags,
28:             commands::search_snippets,
29:             commands::get_data_dir,
30:             commands::export_vault,
31:             commands::import_vault,
32:             commands::import_markdown,
33:             commands::import_markdown_dir,
34:         ])
35:         .run(tauri::generate_context!())
36:         .expect("error while running tauri application");
37: }
````

## File: package.json
````json
 1: {
 2:   "name": "codevault",
 3:   "private": true,
 4:   "version": "0.1.0",
 5:   "type": "module",
 6:   "scripts": {
 7:     "dev": "vite",
 8:     "build": "tsc && vite build",
 9:     "preview": "vite preview",
10:     "tauri": "tauri"
11:   },
12:   "dependencies": {
13:     "@codemirror/lang-css": "^6.3.1",
14:     "@codemirror/lang-html": "^6.4.11",
15:     "@codemirror/lang-javascript": "^6.2.5",
16:     "@codemirror/lang-markdown": "^6.5.0",
17:     "@codemirror/lang-python": "^6.2.1",
18:     "@codemirror/lang-rust": "^6.0.2",
19:     "@codemirror/lang-sql": "^6.10.0",
20:     "@codemirror/lang-yaml": "^6.1.3",
21:     "@codemirror/state": "^6.6.0",
22:     "@codemirror/theme-one-dark": "^6.1.3",
23:     "@fontsource-variable/fraunces": "^5.2.9",
24:     "@fontsource/monaspace-neon": "^5.2.5",
25:     "@lezer/highlight": "^1.2.3",
26:     "@tauri-apps/api": "^2.11.0",
27:     "@tauri-apps/plugin-clipboard-manager": "^2.3.2",
28:     "@tauri-apps/plugin-dialog": "^2.7.1",
29:     "@tauri-apps/plugin-opener": "^2.5.4",
30:     "@uiw/codemirror-themes": "^4.25.10",
31:     "@uiw/react-codemirror": "^4.25.10",
32:     "cmdk": "^1.1.1",
33:     "react": "^19.2.7",
34:     "react-dom": "^19.2.7",
35:     "zustand": "^5.0.14"
36:   },
37:   "devDependencies": {
38:     "@tauri-apps/cli": "^2.11.2",
39:     "@types/react": "^19.2.16",
40:     "@types/react-dom": "^19.2.3",
41:     "@vitejs/plugin-react": "^4.7.0",
42:     "autoprefixer": "^10.5.0",
43:     "postcss": "^8.5.15",
44:     "tailwindcss": "^3.4.19",
45:     "typescript": "~5.8.3",
46:     "vite": "^7.3.5"
47:   }
48: }
````
