# ArchSVG — Developer-First SVG Architecture Diagrams

Create clean, production-ready SVG flowcharts and architecture diagrams directly inside VS Code.

No bloated UI. No cloud services. No complex syntax.

Just structured diagrams rendered as beautiful standalone SVG.

---

## Why ArchSVG?

Most diagram tools are either:

- Heavy visual editors with too much friction
- Syntax-heavy (Mermaid-style)
- Or disconnected from real documentation workflows

ArchSVG is built specifically for developers who write documentation.

Generate → Preview → Export → Insert.

That’s it.

---

## ✨ Features

### 🧠 Professional Flowchart Engine

- Multiple layout modes (Vertical, Horizontal, Compact, Symmetric)
- Smart orthogonal edge routing
- Balanced node spacing
- Deterministic layout engine
- Clean arrow rendering

### 🎨 Professional Theme Presets

- GitHub Light
- GitHub Dark
- Minimal Mono
- Blueprint

All themes are optimized for documentation and READMEs.

### 📦 Export Controls

- Configurable canvas padding
- Width presets (600 / 800 / 1200 / 1600 / Auto)
- Background toggle
- SVG minification option

### 💬 Comment-to-Flowchart

Generate diagrams directly from comment arrow notation:

```
// @flowchart
// User -> API
// API -> Database
// API -> Cache
// Database -> Cache
```

Select → Run command → Done.

Supports:

- // line comments
- # hash comments
- /* block comments */
- Chained arrows (A -> B -> C)

### 🎨 SVG Icon Generator

- Keyword-based icon generation
- Smart fallback for unknown keywords
- Configurable primary & secondary colors
- Fully sanitized output

### 🔒 Secure & Local

- Client-side only
- No backend
- No external APIs
- No data leaves your machine
- SVG output sanitized for security

### 🚀 Commands

Access via Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

- ArchSVG: Generate SVG Icon
- ArchSVG: Generate Flowchart from JSON
- ArchSVG: Generate Flowchart from Selected Comment
- ArchSVG: Preview SVG
- ArchSVG: Insert SVG into Active File
- ArchSVG: Save SVG to /assets Folder

### 📊 Flowchart from JSON Example

```json
{
  "nodes": [
    {"id": "start", "label": "Start"},
    {"id": "process", "label": "Process Data"},
    {"id": "decision", "label": "Valid?"},
    {"id": "end", "label": "End"}
  ],
  "edges": [
    {"from": "start", "to": "process"},
    {"from": "process", "to": "decision"},
    {"from": "decision", "to": "end"}
  ]
}
```

Generate → Preview → Save or Insert.

### ⚙ Extension Settings

Configure in settings.json:

```json
{
  "svgGen.primaryColor": "#3498db",
  "svgGen.secondaryColor": "#2ecc71",
  "svgGen.layoutMode": "vertical",
  "svgGen.theme": "github-light",
  "svgGen.typography": "default",
  "svgGen.exportWidth": "800",
  "svgGen.includeBackground": true,
  "svgGen.minifyOutput": false
}
```

#### Available Settings

- svgGen.primaryColor
- svgGen.secondaryColor
- svgGen.layoutMode
- svgGen.theme
- svgGen.typography
- svgGen.exportWidth
- svgGen.includeBackground
- svgGen.minifyOutput

### 🏗 Architecture

Clean modular structure:

```
src/
├── layout/
├── routing/
├── themes/
├── renderer/
├── export/
├── parsers/
├── utils/
├── webview/
└── extension.ts
```

Design principles:

- Zero external dependencies
- Deterministic layout engine
- Single responsibility modules
- Clean TypeScript implementation
- Production-ready SVG output

### 🛠 Development

- npm install
- npm run compile
- npm run watch
- npm test

Press F5 to launch Extension Development Host.

### 🔐 Security

ArchSVG sanitizes all generated SVG content:

- Removes <script> tags
- Strips event handlers (onclick, onload, etc.)
- Blocks foreignObject
- Prevents unsafe protocols

### 🎯 Built For

- Developers writing documentation
- OSS maintainers
- System architects
- Technical bloggers
- Engineering teams

If you need clean architecture diagrams inside your workflow, ArchSVG is built for you.

### Roadmap

Future enhancements may include:

- Additional diagram types
- Template library
- Advanced layout improvements
- Premium features

ArchSVG — Clean diagrams. Built for developers.