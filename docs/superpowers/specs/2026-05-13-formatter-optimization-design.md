# Formatter Optimization

## Motivation

Three hot-path allocation sources exist across the library's formatting functions. All fire on every keystroke. The fixes are purely internal — no exported API, type, or behavioral contract changes.

## Constraints

- All exported function signatures unchanged
- All exported types unchanged
- All observable behavior identical to pre-change
- Private module internals (regex constants, helper functions) are fair game

## Scope

Three files, three changes. Each change is independent.

---

## Change 1: `src/libs.ts` — `replaceBlankSpace`

### Problem

```ts
export const replaceBlankSpace = (str: string) => str.replace(new RegExp(String.fromCharCode(160), "g"), " ");
```

`new RegExp(...)` allocates a new regex object on every call. `String.fromCharCode(160)` is the fixed value ` ` (non-breaking space).

### Fix

```ts
const NBSP_RE = /\u00a0/g;
export const replaceBlankSpace = (str: string) => str.replace(NBSP_RE, " ");
```

`NBSP_RE` is a module-level constant, compiled once at module load. No behavior change.

---

## Change 2: `src/components/the-mask.tsx` — `formatRegexMask` inner loop

### Problem

```ts
const token: Token = masker instanceof RegExp ? { regex: masker } : masker;
if (token.regex.test(char)) output += token.parse?.(char) ?? char;
```

When `masker` is a `RegExp`, a new `{ regex: masker }` object is allocated on every loop iteration. `RegExp` maskers never have a `parse` function — that field only exists on `Token` objects — so the unified `token` abstraction buys nothing.

### Fix

Branch the two cases directly:

```ts
if (masker instanceof RegExp) {
    if (masker.test(char)) output += char;
} else {
    if (masker.regex.test(char)) output += masker.parse?.(char) ?? char;
}
i += 1;
countMask += 1;
```

No object allocated per iteration. Behavior identical for all mask/token/RegExp combinations.

---

## Change 3: `src/masks.ts` — `stringPattern` escape logic

### Problem

```ts
mask.push(
    char.replace(regex.dots, "\\.").replace(regex.openParenthesis, "\\(").replace(regex.closeParenthesis, "\\)")
);
```

Three chained `.replace()` calls per non-token character: three regex executions and three intermediate string allocations. `char` is always a single character — no regex needed.

### Fix

Module-level lookup object:

```ts
const PATTERN_ESCAPE: Record<string, string> = { ".": "\\.", "(": "\\(", ")": "\\)" };
```

Inside the loop:

```ts
mask.push(PATTERN_ESCAPE[char] ?? char);
```

One property lookup replaces three regex operations. The trailing `.replace(regex.leadingBars, "\\")` on the joined result is preserved unchanged (handles user-defined masks with literal backslashes).

The now-unused entries `regex.dots`, `regex.openParenthesis`, `regex.closeParenthesis` are removed from the module-internal `regex` object. `regex.leadingBars` and `regex.escape` stay.

---

## Files touched

- `src/libs.ts` — modified (1 constant extracted, 1 line changed)
- `src/components/the-mask.tsx` — modified (inner loop of `formatRegexMask` refactored)
- `src/masks.ts` — modified (lookup constant added, 3 regex entries removed, loop branch simplified)

## Out of scope

- `valueToFloat` — 3-pass string normalization. Input strings are short (~15 chars), operates only on currency/percent inputs. Risk/reward doesn't justify touching it.
- `addDecimals` — regex literal in `split()` is compiled once at parse time by the JS engine. No allocation issue.
- `createPattern` / `createPatternRegexMask` — called inside `useMemo`, not on every keystroke. Not a hot path.
