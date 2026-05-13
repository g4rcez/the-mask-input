# Formatter Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate three unnecessary per-call allocations in the library's hot-path formatters without changing any exported API or observable behavior.

**Architecture:** Three independent edits — one per file. Each task adds a test first, implements the change, verifies all 14 existing unit tests still pass, then commits. Tasks are independent and safe to apply in any order, but apply them in sequence for a clean commit history.

**Tech Stack:** TypeScript, React 18, Vitest (unit tests — `pnpm test:unit`)

---

### Task 1: Extract NBSP regex constant in `replaceBlankSpace`

**Files:**
- Modify: `src/libs.ts`
- Test: `tests/libs.test.ts` (new file)

`replaceBlankSpace` calls `new RegExp(String.fromCharCode(160), "g")` on every invocation — a heap allocation for a fixed value. Extract to a module-level constant.

- [ ] **Step 1: Create the test file**

Create `tests/libs.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { replaceBlankSpace } from "../src/libs";

describe("replaceBlankSpace", () => {
    test("replaces a non-breaking space with a regular space", () => {
        expect(replaceBlankSpace("R 1.234,56")).toBe("R 1.234,56");
    });
    test("replaces multiple non-breaking spaces", () => {
        expect(replaceBlankSpace("  ")).toBe("  ");
    });
    test("leaves regular spaces unchanged", () => {
        expect(replaceBlankSpace("hello world")).toBe("hello world");
    });
    test("returns empty string unchanged", () => {
        expect(replaceBlankSpace("")).toBe("");
    });
});
```

- [ ] **Step 2: Run the new tests — expect them to pass already**

```bash
pnpm test:unit
```

Expected: `tests/libs.test.ts` passes (4 tests). These tests verify existing behavior before the change.

- [ ] **Step 3: Apply the change to `src/libs.ts`**

In `src/libs.ts`, replace:

```ts
export const replaceBlankSpace = (str: string) => str.replace(new RegExp(String.fromCharCode(160), "g"), " ");
```

With:

```ts
const NBSP_RE = /\u00a0/g;
export const replaceBlankSpace = (str: string) => str.replace(NBSP_RE, " ");
```

`NBSP_RE` is module-private. ` ` is Unicode for non-breaking space (decimal 160), identical to `String.fromCharCode(160)`.

- [ ] **Step 4: Run all unit tests**

```bash
pnpm test:unit
```

Expected: all tests pass (18 tests across 3 files now).

- [ ] **Step 5: Commit**

```bash
git add src/libs.ts tests/libs.test.ts
git commit -m "perf: extract NBSP regex constant in replaceBlankSpace"
```

---

### Task 2: Eliminate object allocation in `formatRegexMask`

**Files:**
- Modify: `src/components/the-mask.tsx`

`formatRegexMask` is the core masking function — called on every keystroke. When a mask entry is a bare `RegExp`, the current code allocates `{ regex: masker }` each iteration to unify the two masker shapes. Since bare `RegExp` maskers never have a `parse` function, the branches can be inlined directly. No new test: `formatRegexMask` is module-private and not exported; behavior is verified by the existing unit tests.

- [ ] **Step 1: Verify existing tests pass on HEAD**

```bash
pnpm test:unit
```

Expected: all tests pass.

- [ ] **Step 2: Apply the change to `src/components/the-mask.tsx`**

In `formatRegexMask`, locate these lines (inside the for loop, after the `if (masker === undefined)` branch):

```ts
        const token: Token = masker instanceof RegExp ? { regex: masker } : masker;
        if (token.regex.test(char)) output += token.parse?.(char) ?? char;
        i += 1;
        countMask += 1;
```

Replace with:

```ts
        if (masker instanceof RegExp) {
            if (masker.test(char)) output += char;
        } else {
            if (masker.regex.test(char)) output += masker.parse?.(char) ?? char;
        }
        i += 1;
        countMask += 1;
```

Also remove the now-unused `Token` type from the imports in this file. The current import line is:

```ts
import type { Mask, MaskInputProps, TheMasks, Token, Tokens } from "../types";
```

Change to:

```ts
import type { Mask, MaskInputProps, TheMasks, Tokens } from "../types";
```

- [ ] **Step 3: Run all unit tests**

```bash
pnpm test:unit
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/the-mask.tsx
git commit -m "perf: inline RegExp masker branch in formatRegexMask, remove per-iteration allocation"
```

---

### Task 3: Replace chained replaces with lookup in `stringPattern`

**Files:**
- Modify: `src/masks.ts`
- Test: `tests/pattern.test.ts` (extend existing file)

`stringPattern` processes each character of a mask string. For non-token characters it runs three chained `.replace()` calls (three regex executions, three string allocations) to escape `.`, `(`, and `)`. Since `char` is always a single character, a direct object lookup eliminates all three.

- [ ] **Step 1: Add tests to `tests/pattern.test.ts`**

Open `tests/pattern.test.ts`. After the existing `describe` block, append:

```ts
import { createPattern } from "../src/masks";

describe("stringPattern escaping via createPattern", () => {
    test("escapes dots in mask literal positions", () => {
        const pattern = createPattern("ddd.ddd", "", true);
        expect(pattern).toContain("\\.");
        expect(new RegExp(pattern).test("123.456")).toBe(true);
        expect(new RegExp(pattern).test("123X456")).toBe(false);
    });

    test("escapes opening parenthesis in mask literal positions", () => {
        const pattern = createPattern("(dd)", "", true);
        expect(pattern).toContain("\\(");
        expect(new RegExp(pattern).test("(12)")).toBe(true);
        expect(new RegExp(pattern).test("X12)")).toBe(false);
    });

    test("escapes closing parenthesis in mask literal positions", () => {
        const pattern = createPattern("(dd)", "", true);
        expect(pattern).toContain("\\)");
        expect(new RegExp(pattern).test("(12)")).toBe(true);
        expect(new RegExp(pattern).test("(12X")).toBe(false);
    });

    test("passes unescaped literal characters through unchanged", () => {
        const pattern = createPattern("dd-dd", "", true);
        expect(pattern).toContain("-");
        expect(new RegExp(pattern).test("12-34")).toBe(true);
    });
});
```

Note: `createPattern` is already exported from `src/masks.ts`. The existing `import { createPatternRegexMask } from "../src/masks"` at the top of the file needs `createPattern` added:

```ts
import { createPatternRegexMask, createPattern } from "../src/masks";
```

- [ ] **Step 2: Run the new tests — expect them to pass already**

```bash
pnpm test:unit
```

Expected: all tests pass. These tests document the existing escaping contract before the change.

- [ ] **Step 3: Apply the change to `src/masks.ts`**

Replace the `regex` object (currently at the top of the file):

```ts
const regex = {
    dots: /\./g,
    openParenthesis: /\(/g,
    closeParenthesis: /\)/g,
    leadingBars: /\\\\/g,
    escape: /[.*+?^${}()|[\]\\]/g
};
```

With:

```ts
const regex = {
    leadingBars: /\\\\/g,
    escape: /[.*+?^${}()|[\]\\]/g
};

const PATTERN_ESCAPE: Record<string, string> = { ".": "\\.", "(": "\\(", ")": "\\)" };
```

Then replace the `stringPattern` function:

```ts
const stringPattern = (result: string) => {
    const len = result.length;
    const mask = [];
    for (let i = 0; i < len; i++) {
        const char = result[i];
        const token = originalTokens[char];
        if (token === undefined)
            mask.push(char.replace(regex.dots, "\\.").replace(regex.openParenthesis, "\\(").replace(regex.closeParenthesis, "\\)"));
        else mask.push(token.regex?.source);
    }
    return mask.join("").replace(regex.leadingBars, "\\");
};
```

With:

```ts
const stringPattern = (result: string) => {
    const len = result.length;
    const mask = [];
    for (let i = 0; i < len; i++) {
        const char = result[i];
        const token = originalTokens[char];
        mask.push(token === undefined ? (PATTERN_ESCAPE[char] ?? char) : token.regex?.source);
    }
    return mask.join("").replace(regex.leadingBars, "\\");
};
```

- [ ] **Step 4: Run all unit tests**

```bash
pnpm test:unit
```

Expected: all tests pass (22 tests across 3 files).

- [ ] **Step 5: Commit**

```bash
git add src/masks.ts tests/pattern.test.ts
git commit -m "perf: replace chained replaces with lookup in stringPattern"
```
