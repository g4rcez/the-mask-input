# React Footprint Reduction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove redundant state, eliminate an effect-as-event-handler, and delete an unnecessary routing file — reducing React hook count in the critical render path without changing any observable behaviour.

**Architecture:** Three independent edits applied in order. Task 1 and Task 2 are pure simplifications within their files. Task 3 inlines the `input.tsx` router into `index.tsx` and deletes the now-empty file. Each task ends with a passing test run and a commit.

**Tech Stack:** React 18, TypeScript, Vitest (unit), Cypress (integration via `pnpm test`)

---

### Task 1: Remove redundant state from `TheMask`

**Files:**
- Modify: `src/components/the-mask.tsx`

`TheMask` tracks the masked value in both `stateValue` (used for rendering) and `input` (fed into `usePrevious`). The only consumer of `previous` is the erasing check: `value.length < previous.length`. Since `stateValue` holds the pre-change value at the time `changeMask` fires (it only updates after `setStateValue` resolves in the next render), the comparison is equivalent. Remove `input`, `usePrevious`, and `previous`.

- [ ] **Step 1: Delete the `usePrevious` function**

In `src/components/the-mask.tsx`, remove lines 35–41:

```tsx
function usePrevious<T>(value: T): T {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

- [ ] **Step 2: Remove `input` state and `previous` declaration**

Inside the `TheMask` forwardRef body, remove these two lines (currently lines 52–53):

```tsx
const [input, setInput] = useState("");
const previous = usePrevious(input);
```

- [ ] **Step 3: Replace `previous.length` with `stateValue.length` in the erasing check**

In `changeMask`, change:

```tsx
if (value.length < previous.length) {
```

to:

```tsx
if (value.length < stateValue.length) {
```

- [ ] **Step 4: Remove `setInput(masked)` at the end of `changeMask`**

Near the bottom of `changeMask`, remove the line:

```tsx
setInput(masked);
```

The surrounding lines (`onChangeTextRef.current?.(masked)` and `onChangeRef.current?.(event)`) stay.

- [ ] **Step 5: Run unit tests**

```bash
pnpm test:unit
```

Expected: all tests pass. The unit tests cover `masks.ts` pattern logic, which is untouched, but a passing run confirms the build is clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/the-mask.tsx
git commit -m "refactor: remove redundant input state and usePrevious from TheMask"
```

---

### Task 2: Move cursor positioning out of effect in `PercentageInput`

**Files:**
- Modify: `src/components/percent-input.tsx`

`useEffect(() => focusNumber(), [input])` fires after every paint triggered by a keystroke. The cursor must land before the `%` suffix, at position `percent.length - info.percentSign.length - CHAR_BETWEEN_VALUE_AND_SYMBOL`. `focusNumber()` computes this from `valueLength`, which is derived from `input` state — but in the `change` handler `input` is still the *old* value (React batches the `setInput` update to the next render). Calling `focusNumber()` directly from the handler would therefore place the cursor at the wrong position whenever the string length changes.

The correct fix: remove the effect and inline `setSelectionRange` in `change` using the fresh `percent` string, bypassing `valueLength` entirely. `focusNumber` is preserved for `onFocus` and `keyUp`, where `valueLength` is current because those fire after a render.

- [ ] **Step 1: Replace the `change` handler**

In `src/components/percent-input.tsx`, the current `change` function (lines 74–81):

```tsx
const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = toPercent(e.target.value, info);
    const realValue = valueToFloat(percent);
    setInput(percent);
    e.target.value = percent;
    e.target.setAttribute("data-number", realValue.toString());
    onChange?.(e);
};
```

Replace with:

```tsx
const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = toPercent(e.target.value, info);
    const realValue = valueToFloat(percent);
    setInput(percent);
    e.target.value = percent;
    e.target.setAttribute("data-number", realValue.toString());
    onChange?.(e);
    if (ref.current) {
        const pos = percent.length - info.percentSign.length - CHAR_BETWEEN_VALUE_AND_SYMBOL;
        ref.current.setSelectionRange(pos, pos);
    }
};
```

- [ ] **Step 2: Remove the effect that called `focusNumber`**

Remove line 96:

```tsx
useEffect(() => focusNumber(), [input]);
```

`useEffect` remains in the import — it is still used by the two other effects in this file (the `props.value` watcher and the mount-only formatter).

- [ ] **Step 3: Run unit tests**

```bash
pnpm test:unit
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/percent-input.tsx
git commit -m "refactor: move cursor positioning from effect to change handler in PercentageInput"
```

---

### Task 3: Inline `TheMaskInput` routing into `index.tsx` and delete `input.tsx`

**Files:**
- Modify: `src/index.tsx`
- Delete: `src/input.tsx`

`TheMaskInput` is a three-branch router with no state. The branches (`isCurrencyInput` → `CurrencyInput`, `isPercentageInput` → `PercentageInput`, else → `TheMask`) move directly into the `Input` forwardRef in `index.tsx`. The named component exports (`Cpf`, `Cep`, etc.) never receive a currency or percent mask, so the `Component` helper switches from `TheMaskInput` to `TheMask` directly. `TheMaskPropsMerge` is defined locally in `index.tsx` and exported as `TheMaskProps`.

- [ ] **Step 1: Rewrite `src/index.tsx`**

Replace the entire file with:

```tsx
import React, { useMemo } from "react";
import type { CurrencyInputProps, CurrencyMaskTypes } from "./components/currency-input";
import { CurrencyInput, isCurrencyInput } from "./components/currency-input";
import type { PercentInputMask, PercentInputProps } from "./components/percent-input";
import { isPercentageInput, PercentageInput } from "./components/percent-input";
import { TheMask } from "./components/the-mask";
import { has } from "./libs";
import { inputMaskedProps, type MaskConfig, type Masks } from "./masks";
import type { HtmlInputProps, MaskInputProps } from "./types";

export type { CurrencyInputProps, CurrencyMaskTypes } from "./components/currency-input";
export type { PercentInputProps, PercentInputMask } from "./components/percent-input";
export type { TheMask, TheMask as MaskInput } from "./components/the-mask";
export type { HtmlInputProps, Locales, CurrencyCode, CurrencyDisplay, AutoCapitalize, InputMode, InputTypes } from "./types";
export { CurrencyInput, CurrencyInput as MoneyInput } from "./components/currency-input";
export { PercentageInput } from "./components/percent-input";
export { masks, inputMaskedProps } from "./masks";

type TheMaskPropsMerge = MaskInputProps | CurrencyInputProps | PercentInputProps;

export type TheMaskProps = TheMaskPropsMerge;

const Component = (mask: MaskConfig) => (props: TheMaskPropsMerge) => <TheMask {...mask} {...(props as any)} />;

type LooseString<T extends string> = T | Omit<string, T>;

export type AllMasks = LooseString<Masks>;

type ArrayMask = Array<string | RegExp> | ((p: string) => Array<string | RegExp> | AllMasks);

export const CellTelephone = Component(inputMaskedProps.cellTelephone);
export const Cellphone = Component(inputMaskedProps.cellphone);
export const Cep = Component(inputMaskedProps.cep);
export const Cnpj = Component(inputMaskedProps.cnpj);
export const Color = Component(inputMaskedProps.color);
export const Cpf = Component(inputMaskedProps.cpf);
export const CpfCnpj = Component(inputMaskedProps.cpfCnpj);
export const CreditCard = Component(inputMaskedProps.creditCard);
export const Date = Component(inputMaskedProps.date);
export const Int = Component(inputMaskedProps.int);
export const IsoDate = Component(inputMaskedProps.isoDate);
export const Telephone = Component(inputMaskedProps.telephone);
export const Time = Component(inputMaskedProps.time);
export const Uuid = Component(inputMaskedProps.uuid);

export type TheMaskInputProps = HtmlInputProps &
    (
        | ({ mask: PercentInputMask } & PercentInputProps)
        | ({ mask: CurrencyMaskTypes } & CurrencyInputProps)
        | ({ mask: AllMasks } & Omit<MaskInputProps, "mask">)
        | ({ mask: ArrayMask } & Omit<MaskInputProps, "mask">)
        | ({ mask?: AllMasks } & Omit<MaskInputProps, "mask">)
    );

export const Input: (props: TheMaskInputProps) => React.ReactElement = React.forwardRef<HTMLInputElement, TheMaskInputProps>(
    function InternalMaskInput(props, externalRef) {
        const maskConfig = useMemo(() => {
            if (!props.mask) return undefined;
            if (typeof props.mask === "string" && has(inputMaskedProps, props.mask)) {
                return inputMaskedProps[props.mask];
            }
            return { mask: props.mask };
        }, [props.mask]);
        const allProps = { ...props, ...maskConfig };
        if (isCurrencyInput(allProps.mask)) {
            return <CurrencyInput {...(allProps as CurrencyInputProps)} mask={undefined} ref={externalRef} />;
        }
        if (isPercentageInput(allProps.mask)) {
            return <PercentageInput {...(allProps as PercentInputProps)} mask={undefined} ref={externalRef} />;
        }
        return <TheMask {...(allProps as MaskInputProps)} ref={externalRef} />;
    }
) as never;

export default Input;
```

- [ ] **Step 2: Delete `src/input.tsx`**

```bash
rm src/input.tsx
```

- [ ] **Step 3: Run unit tests**

```bash
pnpm test:unit
```

Expected: all tests pass. The `regex.test.ts` imports from `../src` (i.e. `index.tsx`) — a passing run confirms the public API surface is intact.

- [ ] **Step 4: Verify the build compiles cleanly**

```bash
pnpm build
```

Expected: exits 0, `dist/` produced without TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/index.tsx
git rm src/input.tsx
git commit -m "refactor: inline TheMaskInput routing into index.tsx, delete input.tsx"
```
