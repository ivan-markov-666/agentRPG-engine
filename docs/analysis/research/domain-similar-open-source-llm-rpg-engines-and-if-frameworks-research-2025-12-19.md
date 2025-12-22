---
stepsCompleted: [1]
inputDocuments:
  - 'docs/analysis/brainstorming-session-2025-12-14T16-45-00+0200.md'
workflowType: 'research'
lastStep: 1
research_type: 'domain'
research_topic: 'Similar open-source LLM RPG/GM engines and interactive fiction frameworks (best practices to borrow)'
research_goals:
  - 'Identify existing open-source projects comparable to AgentRPG Engine (LLM-driven RPG/GM, text adventure/interactive fiction engines)'
  - 'Extract best practices for state modeling, save/load, modularity/extensibility, and structured contracts'
  - 'Collect verified sources with URLs for every factual claim'
user_name: 'Master'
date: '2025-12-19'
web_research_enabled: true
source_verification: true
---

# Research Report: domain

**Date:** 2025-12-19
**Author:** Master
**Research Type:** domain

---

## Research Overview

### Scope

This report focuses on:

- Open-source projects that implement LLM-driven RPG / AI Dungeon Master experiences
- Open-source interactive fiction / text adventure engines and tooling ecosystems
- Architectural patterns and practical design choices that we can borrow for AgentRPG Engine’s goals (capability-based, data-driven game packages, structured contracts, save/load + migrations)

### Method

- Web search + reading project documentation (README/docs)
- Only citing factual claims that are visible in source documents, with direct URLs

---

## Initial Candidate Projects (seed list)

### 1) GameMaster.AI (AI Dungeon Master web app)

- Project goal: “deliver a single-player tabletop role-playing game (TTRPG) experience, guided by an AI Dungeon Master” (README). Source: https://raw.githubusercontent.com/deckofdmthings/GameMasterAI/main/README.md
- Uses external services for persistence and LLM access (MongoDB Atlas for save data + OpenAI API key) as documented in setup instructions. Source: https://raw.githubusercontent.com/deckofdmthings/GameMasterAI/main/README.md

**Potential best practices to borrow (hypotheses, to validate deeper in code/docs):**

- Split between narrative generation (AI) and persistent game data layer
- “Operational” readiness patterns: explicit `.env` configuration and dependency declaration

### 2) LLM-RPG (NPC multi-process architecture + modular layout)

- README describes a modular project layout with separate packages for engine, world, characters, LLM integration, and UI. Source: https://raw.githubusercontent.com/gddickinson/llm_RPG/main/README.md
- README describes a multi-process architecture: main process handles game state/UI, NPCs run in separate processes with their own LLM instance and queues. Source: https://raw.githubusercontent.com/gddickinson/llm_RPG/main/README.md

**Potential best practices to borrow:**

- Clear module boundaries (engine vs world vs UI vs LLM integration)
- Concurrency isolation for “agents” (NPCs) so the game loop remains responsive

### 3) llm_games (prompt-first LLM RPG)

- README describes the project as “prompt based brand new role-playing game using LLM(large language model) like ChatGPT” and that players copy/paste a prompt into ChatGPT to play. Source: https://raw.githubusercontent.com/fladdict/llm_games/main/README.md

**Potential best practices to borrow:**

- Minimal viable “engine” defined as a well-structured prompt/spec
- Explicit game system parameters exposed to the player (progress/crisis/etc.)

### 4) vossenwout/llm-rpg (early-stage battle scene + local LLM option)

- README states the project is in early stages and currently has a battle scene implemented. Source: https://raw.githubusercontent.com/vossenwout/llm-rpg/main/README.md
- README documents running against local LLMs via ollama configuration. Source: https://raw.githubusercontent.com/vossenwout/llm-rpg/main/README.md

**Potential best practices to borrow:**

- Config-driven LLM provider switching (local vs hosted)

### 5) rpgGPT (LLM-powered text RPG proof-of-concept)

- README describes rpgGPT as an “experimental text based RPG powered by LLMs” released as open source (proof-of-concept). Source: https://raw.githubusercontent.com/yonder-gg/rpgGPT/main/README.md

 ---

 ## Single-GM + data-driven content/config (concrete examples)

 These are closer to your chosen model: **one central GM LLM agent** driving gameplay, while the “game package” is primarily a set of **data files** that define world/story/config.

 ### Example 1: `Winston-503/ai-rpg` (YAML config + generated world/story files)

 The README states that the game is configured through YAML files in `data/config`, including `ai-rpg-config.yaml` for world/story/inventory/difficulty/language settings, and `llm-config.yaml` for model settings. Source: https://raw.githubusercontent.com/Winston-503/ai-rpg/main/README.md

 The README also describes a workflow where generation scripts produce files under `data/generation` (example: `world_*.md`, `story_*.md`, `starting_inventory_*.yaml`) and then `ai-rpg-config.yaml` is updated to point to those filenames. Source: https://raw.githubusercontent.com/Winston-503/ai-rpg/main/README.md

 **What to borrow for AgentRPG Engine:**

 - Use a manifest/config pattern where the game points to canonical content files by path (world/story/inventory equivalents).
 - Keep LLM model configuration separate from game content (engine-level vs game-level settings).
 - Treat generated content as **first-class source artifacts** (still data-driven, not code).

 ### Example 2: `orwek/fife` (story as a JSON object + engine registers the story)

 `fife` describes itself as a JavaScript engine for interactive fiction and states: “Stories can then be written in JSON format using a predefined structure that the interpreter understands.” Source: https://raw.githubusercontent.com/orwek/fife/master/README.md

 The README describes a simple separation: `index.html` as UI, `fife.js` as core engine, and a “story file” where you write a JSON object inside a file, and you register it via `fife.register.push("your_story");`. Source: https://raw.githubusercontent.com/orwek/fife/master/README.md

 **What to borrow for AgentRPG Engine:**

 - Keep a clear separation between:
   - UI layer (FE)
   - engine runtime
   - game content file(s)
 - Define a strict “predefined structure” for content (in our case: JSON Schema) so the GM agent consumes predictable data.

 ### Example 3: `Laszlobeer/Dungeo_ai` (save/load commands + plain save file)

 The README lists gameplay commands, including `/save` and `/load`, and states `/save` saves to `adventure.txt` and `/load` loads from `adventure.txt`. Source: https://raw.githubusercontent.com/Laszlobeer/Dungeo_ai/main/README.md

 **What to borrow for AgentRPG Engine:**

 - Make save/load UX explicit and simple at first (even if the underlying format evolves).
 - Pair a human-readable save artifact with structured validation later (your plan already targets structured contracts + schemas).

---

## Rules/content data packs (JSON/YAML + schemas)

 This section targets the “data pack” style of content: **rules, tables, moves, assets, metadata** stored as structured data plus schemas — which is very close to your “game package = data” approach.

 ### Example 1: Dataforged (Ironsworn: Starforged rules/content as JSON + schema)

 Dataforged exists to provide Creative Commons-licensed rules content (moves, oracle tables, assets, etc.) as data, explicitly to avoid tool builders doing manual data entry. Source: https://raw.githubusercontent.com/rsek/dataforged/main/README.md

 It states that if you “just want the data as-is”, you can use the JSON files in `dist/starforged`, where `dataforged.json` contains all game data “in a single object” and `schema.json` describes its JSON schema. Source: https://raw.githubusercontent.com/rsek/dataforged/main/README.md

 **What to borrow for AgentRPG Engine:**

 - Treat your content packs as first-class datasets:
   - one “full pack” export (single-object JSON) can be useful for consumers
   - a schema alongside the pack gives strong validation guarantees
 - Keep a clear separation between:
   - “content/rules dataset” (static)
   - “runtime state” (dynamic)

 ### Example 2: Datasworn (schema-first, language-agnostic + licensing embedded)

 Datasworn’s README describes design goals including: “language-agnostic JSON schema as the "source of truth"” and improving interchange/homebrew/localization friendliness. Source: https://raw.githubusercontent.com/rsek/datasworn/main/README.md

 It also notes that the JSON files embed licensing information in a `source` property that appears on many objects. Source: https://raw.githubusercontent.com/rsek/datasworn/main/README.md

 **What to borrow for AgentRPG Engine:**

 - Make JSON Schema (or a schema family) the canonical “contract” for content packs.
 - Add provenance/licensing metadata per content item (useful for open-source packs and reuse).
 - Optimize the format for third-party/homebrew packs that can be imported into tools.

 ### Example 3: Foundry VTT ecosystem (manifest JSON schemas + compiled validators)

 The `@typhonjs-fvtt/validate-manifest` README documents providing JSON schema files for Foundry manifests (`module.json` / `system.json`) and describes IDE integration by pointing the IDE to the schema. Source: https://raw.githubusercontent.com/typhonjs-fvtt-lib/validate-manifest/main/README.md

 It also describes that validator functions are compiled by `ajv` and shipped (with a main entry point at `./dist/validators.js`). Source: https://raw.githubusercontent.com/typhonjs-fvtt-lib/validate-manifest/main/README.md

 **What to borrow for AgentRPG Engine:**

 - Provide official JSON Schemas for:
   - `manifest`
   - capability configs
   - UI/state contracts
 - Ship ready-made validators (not just schemas) so tool builders can validate consistently.
 - Make editor/IDE validation an explicit part of the workflow.

 ### Example 4: Open Legend core-rules (rules as YAML, used to drive a website)

 Open Legend states that rules published on their website are “included here in YAML format”, and warns that contributions must preserve valid YAML syntax because the website will break otherwise. Source: https://raw.githubusercontent.com/openlegend/core-rules/master/README.md

 **What to borrow for AgentRPG Engine:**

 - If you store rules as YAML/MD, enforce schema validation as part of load.
 - Treat content format correctness as “runtime-critical” (failing fast on invalid packs).

 ### Example 5: SRD 6.0 (community rules + buildable content)

 SRD 6.0 describes itself as an “open source, community driven set of rules” and states the repo includes copy (text), images, and game rules that “can be used by anyone to build content”. Source: https://raw.githubusercontent.com/system-reference-document/SRD6.0/main/README.md

 **What to borrow for AgentRPG Engine:**

 - Embrace “rules as content” so others can build on top of your engine.
 - Keep licenses explicit and compatible with remixing.

---

## Interactive Fiction / Text Adventure Ecosystem (seed references)

### Awesome Interactive Fiction (curated list)

- “A curated list of interactive fiction frameworks, tools, and resources.” Source: https://raw.githubusercontent.com/tajmone/awesome-interactive-fiction/master/README.adoc

**Potential best practices to borrow:**

- Landscape mapping: authoring tools, engines, interpreters, and specifications
- Common patterns in IF ecosystems: authoring format + runtime interpreter

---

## Data-driven game package patterns (best practices)

This section focuses on **how games are represented as data bundles**, how runtimes load them, and what that suggests for AgentRPG Engine’s **100% data-driven Game Package + Manifest** approach.

### Pattern 1: Compile-to-runtime-data format with explicit versioning (Ink)

Ink explicitly separates:

- **authoring format** (ink scripts)
- **runtime format** (compiled JSON) consumed by the engine

Ink’s JSON runtime docs state that when ink is compiled to JSON it is converted to “a low level format for use by the runtime” and made up of smaller building blocks. Source: https://raw.githubusercontent.com/inkle/ink/master/Documentation/ink_JSON_runtime_format.md

The top-level structure includes an explicit format version (`inkVersion`) plus the story root container (`root`). Source: https://raw.githubusercontent.com/inkle/ink/master/Documentation/ink_JSON_runtime_format.md

**What to borrow for AgentRPG Engine:**

- A `manifest` can point to one or more **compiled runtime artifacts** (e.g. JSON) rather than raw authoring docs.
- Include explicit `format_version` fields for every runtime artifact.
- Keep runtime data in **simple, engine-friendly building blocks**.

### Pattern 2: “Story format” as a packaging + compilation contract (Twine)

Twine defines **story formats** as JavaScript files used by Twine/compilers to convert story+passage data into a final HTML output; story data is stored internally by Twine 2 or in a Twee3 text file. Source: https://raw.githubusercontent.com/iftechfoundation/twine-specs/master/twine-2-storyformats-spec.md

In Twine 2, a story format is “a single JavaScript file, usually called `format.js`”. Source: https://raw.githubusercontent.com/iftechfoundation/twine-specs/master/twine-2-storyformats-spec.md

The `format.js` wrapper provides metadata including a required semantic-versioned `version` and a `source` string containing the full HTML output template with placeholders like `{{STORY_DATA}}`. Source: https://raw.githubusercontent.com/iftechfoundation/twine-specs/master/twine-2-storyformats-spec.md

**What to borrow for AgentRPG Engine:**

- Make the **packaging contract explicit**: game data + engine runtime collaborate via a well-defined “wrapper” (in our case: `manifest` + contracts).
- Treat “format versioning” as first-class: a semver `version` field for key artifacts is a proven pattern.
- Use templating/placeholder concepts for rendering layers (analogous to our UI contract), but keep canonical state separate.

### Pattern 3: Data types split into visible assets vs “intangible content” loaded into a DB (AnyRPG)

AnyRPG distinguishes:

- “Static 3D Models and Terrain” added via typical Unity workflows
- “Intangible Content” such as dialogs, quests, factions, metadata, etc.

It states that intangible content is stored using Unity Scriptable Objects and loaded into an in-memory database when the game launches. Source: https://docs.anyrpg.org/getting-started/adding-content-to-your-game

**What to borrow for AgentRPG Engine:**

- Split game package contents into:
  - **assets** (optional for us)
  - **intangible content** (quests/dialogs/rules/config)
- Have a deterministic **load step that builds an in-memory “content DB”** from the package.
- Keep the “content DB” and “runtime state” conceptually separate.

### Pattern 4: Import/export of game configuration as JSON (Text-adventure JS engine)

The `besnik/text-adventure-game-js-engine` README describes exporting/importing game configuration via `.to_json()` and `.from_json(data)` methods. Source: https://raw.githubusercontent.com/besnik/text-adventure-game-js-engine/master/README.md

**What to borrow for AgentRPG Engine:**

- Strongly support **round-trip serialization** for game packages:
  - “export game config” → produces a portable artifact
  - “import game config” → deterministic reconstruction
- This aligns well with your requirement for **structured contracts** + compatibility + migrations.

### Pattern 5: Human-readable story source format that maps cleanly to compiled artifacts (Twee3 / Twine)

Twee 3 is a text format for Twine story sources and is described as the equivalent of Twine HTML files containing story and passage data, but “in a more human-readable format”. Source: https://raw.githubusercontent.com/iftechfoundation/twine-specs/master/twee-3-specification.md

The spec recommends:

- file extensions `.tw` or `.twee`
- UTF-8 encoding
- passages with a clear header structure (`:: Passage Name [tags] {inline JSON metadata}`), where metadata is explicitly “an inline JSON chunk”. Source: https://raw.githubusercontent.com/iftechfoundation/twine-specs/master/twee-3-specification.md

The `StoryData` passage is explicitly a JSON chunk that encapsulates project metadata (including fields like `ifid`, `format`, `format-version`, `start`, etc.). Source: https://raw.githubusercontent.com/iftechfoundation/twine-specs/master/twee-3-specification.md

A concrete open-source compiler (`Rizean/twee3`) shows CLI-style build: compiling a Twee input into an output (Twine 2-style HTML) and selecting a target format (e.g. SugarCube). Source: https://raw.githubusercontent.com/Rizean/twee3/main/README.md

**What to borrow for AgentRPG Engine:**

- Treat “authoring source” vs “runtime package” as separate layers:
  - authoring docs may be human-friendly (MD/YAML/etc.)
  - runtime package may be more constrained/compiled
- Embed **small JSON metadata blocks** inside human-readable docs when it helps tooling (exactly like Twee passage metadata).
- Have a deterministic build step (even if optional) that transforms sources into runtime artifacts.

### Pattern 6: Compile multiple source files into a program + separate tables (Yarn Spinner)

Yarn Spinner’s console tool (`ysc`) supports compiling multiple `.yarn` files and produces multiple outputs. The README states that `ysc` “will compile all of the `.yarn` files you provide, and generates three files: `input.yarnc` compiled program, `input-Lines.csv` strings table, and `input-Metadata.csv` table of line metadata.” Source: https://raw.githubusercontent.com/YarnSpinnerTool/YarnSpinner-Console/main/README.md

It also describes a defined entry point (`Start` node by default, configurable with `--start-node`). Source: https://raw.githubusercontent.com/YarnSpinnerTool/YarnSpinner-Console/main/README.md

**What to borrow for AgentRPG Engine:**

- Split “runtime program” from “data tables”:
  - canonical compiled artifact (program)
  - separate assets for localisation/metadata (tables)
- Put entry point(s) explicitly in `manifest` (analogous to Yarn’s start node concept).
- Allow multi-file source composition inside a single game package, but compile/resolve into a single coherent runtime view.

---

## Synthesis: AgentRPG Game Package v0 (recommended shape)

Below is a concrete recommendation for a **100% data-driven** game package that matches your brainstorming decisions (engine-provided capabilities, static activation at load, JSON Schema validation, semver ranges, per-capability migrations) while borrowing proven packaging ideas from Ink/Twine/Twee3/Yarn/AnyRPG.

### Goals for the package format

- **Human-friendly authoring** (source docs can be MD/YAML/JSON)
- **Deterministic loading** into an in-memory “content DB” (like AnyRPG’s “intangible content” loaded at launch)
- **No formal build step**: engine loads directly from source `content/` (no compiled runtime artifacts required)
- **Versioned artifacts** and explicit entrypoints

### Proposed folder structure

```text
game-package/
  agentrpg.manifest.yaml
  content/
    rules/
      *.yaml
    quests/
      *.md
    dialogs/
      *.md
    tables/
      *.csv
    lore/
      *.md
  config/
    capabilities.yaml
    ui-exposure.yaml
  schemas/
    ui.contract.json
    state.contract.json
    content.schema.json
  localization/       # optional
    lines.csv
    metadata.csv
  migrations/         # optional, engine-provided per-capability migrators live in engine, but game can carry data migration hints
    *.yaml
```

### `agentrpg.manifest.yaml` (recommended fields)

- **identity**
  - `id` (stable)
  - `name`
  - `version` (semver)
- **engine compatibility**
  - `engine`:
    - `contracts`:
      - `ui_contract: ">=1.0 <2.0"`
      - `state_contract: ">=1.0 <2.0"`
    - `capabilities: ">=1.0 <2.0"` (range per capability may also be allowed)
- **capabilities (engine-provided only)**
  - `capabilities:` list of enabled modules
  - `capability_config:` per-capability config blob (since configuration surface is `full`)
- **ui exposure plan**
  - default minimal + per-capability override to full (static at load)
- **entrypoints**
  - `start_node` / `start_scene` / `start_quest` (single canonical entrypoint)
- **content sources**
  - list of directories/files to load into content DB
- **format versions**
  - `manifest_format_version`
  - `content_format_version`

### Load pipeline (package-time)

1. Read `agentrpg.manifest.yaml`
2. Validate manifest against a manifest JSON Schema
3. Resolve `capabilities` + validate configs
4. Build schema bundle (UI/state/content)
5. Load content sources → build in-memory content DB
6. Validate content DB against schemas
7. Initialize runtime state (created-on-load)
8. Start LLM agents (engine-orchestrated) using: content DB + current state + contracts

### Why this matches the “borrowed patterns”

- **Ink:** compiled runtime JSON + explicit format version fields
- **Twine/Twee3:** human-readable source with embedded JSON metadata and clear entrypoints/metadata
- **Yarn:** multi-file sources compiled into a single program plus separate tables/metadata
- **AnyRPG:** content loaded into an in-memory database at launch

### Decisions (Locked)

- **Build/compile step:** **No**. Engine loads directly from source `content/` (no compiled runtime artifacts).
- **Runtime control:** Games are controlled by a **single central GM LLM agent** (engine-orchestrated). FE is a separate layer (e.g. React or whatever the author decides).
- **Implication:** `manifest` and `content/` should be designed primarily as **GM-readable structured context** + schemas/validation, rather than executable code.
 - **Content packaging shape (B):** `content/` is composed of **many small YAML/MD/CSV files**, organized by domain folders, validated by schema at load time (no monolithic single-file dataset).

 ---

 ## What we adopt (AgentRPG) — concrete best practices

 This section turns the research findings into concrete defaults for AgentRPG Engine.

 ### 1) Game Package is a “data pack” (no code)

 - Game packages should be structured as **data packs** with many small files (YAML/MD/CSV) plus schemas.
 - The engine should treat invalid content as a hard error at load time (fail fast), similar in spirit to Open Legend’s warning that invalid YAML can break the consumer. Source: https://raw.githubusercontent.com/openlegend/core-rules/master/README.md

 ### 2) Schema-first validation and tooling support

 - Maintain authoritative JSON Schemas for:
   - manifest
   - content DB
   - per-capability configs
   - UI/state contracts
 - Provide validators (AJV-style) and IDE integration guidance, similar to the Foundry validator project describing IDE schema linking and compiled validators. Source: https://raw.githubusercontent.com/typhonjs-fvtt-lib/validate-manifest/main/README.md

 ### 3) Separation of concerns: content vs runtime state vs UI

 - Keep clear boundaries:
   - **content (static)**: quests/dialogs/rules/lore/tables
   - **runtime state (dynamic)**: player/npc stats, inventory, flags, time
   - **UI**: separate FE layer that renders scene/HUD via UI contract
 - This aligns with IF engines that separate UI/engine/story file (e.g. fife). Source: https://raw.githubusercontent.com/orwek/fife/master/README.md

 ### 4) Manifest points to canonical content and entrypoint

 - Use a manifest/config approach where the game points to canonical content files by path (similar to ai-rpg’s workflow of generated world/story/inventory files referenced by config). Source: https://raw.githubusercontent.com/Winston-503/ai-rpg/main/README.md
 - Include a single canonical entrypoint (start quest/scene/node) like Yarn’s `Start` node concept. Source: https://raw.githubusercontent.com/YarnSpinnerTool/YarnSpinner-Console/main/README.md

 ### 5) Single central GM agent consumes structured context

 - Since runtime is a single central GM agent, the content format should be optimized for:
   - low ambiguity
   - predictable keys
   - explicit IDs and references
 - The engine’s job is to assemble the “GM context bundle” (content DB + state + contracts), validate it, and then run the GM loop.

 ### 6) Optional: provide “full-pack export” for tooling (even if not canonical)

 - Even if canonical storage is many small files, consider a tooling command that exports a full-pack JSON for downstream consumers (Dataforged-style “single object” dataset + schema). Source: https://raw.githubusercontent.com/rsek/dataforged/main/README.md

---

## Next Steps (to be executed in this research workflow)

- Expand the candidate list with 10–20 more relevant repos/tools from the IF ecosystem and LLM-GM space.
- For each candidate:
  - Identify content model (data vs code), persistence approach, modding approach, and any schema/contract usage.
  - Extract “borrowable” best practices with direct citations.
- Produce a synthesized recommendation section tailored to AgentRPG Engine’s invariants:
  - data-driven game packages
  - capability registry (engine-provided)
  - JSON Schema validation
  - semver ranges + per-capability migrations
