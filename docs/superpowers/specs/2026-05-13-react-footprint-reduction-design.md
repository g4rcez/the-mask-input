# React Footprint Reduction

## Motivation

The library ships with redundant state and unnecessary effect-as-event-handler patterns in its hottest render paths. These increase React's work per keystroke without any behavioural benefit.

## Scope

Three changes across three files, one file deletion. No new abstractions introduced. Public API and all observable behaviour unchanged.

## Changes

### 1. `src/components/the-mask.tsx` — remove redundant state

`TheMask` tracks the masked value in two parallel pieces of state: `stateValue` (used for rendering) and `input` (used only to compute the previous value via `usePrevious`). They are always set to the same masked string.

The only consumer of `previous` is the erasing check in `changeMask`:

```
if (value.length < previous.length) { erasing = true; }
```

`stateValue` holds the pre-change masked value at the time `changeMask` fires (it only updates after `setStateValue(masked)` resolves), so the comparison is equivalent.

Removals:
- `useState("")` (`input` state)
- `usePrevious` function definition
- `const previous = usePrevious(input)` declaration
- `setInput(masked)` call at the end of `changeMask`

`stateValue.length` replaces `previous.length` in the erasing check.

Net: -1 useState, -1 custom hook, -1 useEffect (inside usePrevious), -1 setter call.

### 2. `src/components/percent-input.tsx` — move cursor positioning out of effect

`PercentageInput` positions the cursor via:

```
useEffect(() => focusNumber(), [input])
```

This schedules a DOM `setSelectionRange` call after every paint triggered by a keystroke. The DOM node is already mutated by the time `onChange?.(e)` returns in the `change` handler, so `focusNumber()` can be called synchronously there instead.

Removal: `useEffect(() => focusNumber(), [input])`.
Addition: `focusNumber()` call at the end of the `change` handler body.

Net: -1 useEffect, -1 post-paint layout cycle per keystroke.

### 3. `src/input.tsx` deleted — routing inlined into `src/index.tsx`

`TheMaskInput` is a forwardRef component with three branches: currency → `CurrencyInput`, percent → `PercentageInput`, otherwise → `TheMask`. This is a thin router with no state or logic of its own.

The three-branch render moves directly into `index.tsx`'s `Input` forwardRef, replacing `<TheMaskInput {...allProps} ref={externalRef} />`.

The `TheMaskPropsMerge` type (re-exported from `input.tsx` as `TheMaskProps`) is defined inline in `index.tsx` instead.

The named component exports (`Cpf`, `Cep`, `CreditCard`, etc.) currently rendered via a `Component` helper that wraps `TheMaskInput`. Since those exports never receive a currency or percent mask, they route to `TheMask` directly instead.

Net: -1 file, -1 import chain, no new abstractions.

## Files touched

- `src/components/the-mask.tsx` — modified
- `src/components/percent-input.tsx` — modified
- `src/index.tsx` — modified
- `src/input.tsx` — deleted

## Out of scope

- `CurrencyInput` and `PercentageInput` `useImperativeHandle` patterns — both components need internal imperative DOM access AND must expose the same node to callers. The pattern is correct for this use case.
- `CurrencyInput` state model — no redundancy identified.
- Extracting logic into custom hooks — deferred. Clean up existing structure before adding abstractions.

## Risks

- The `previous.length` → `stateValue.length` substitution is equivalent only because `stateValue` is not updated until after the comparison runs in `changeMask`. This is true today; any future refactor that moves `setStateValue` earlier in the handler would need to account for it.
- Cursor positioning in `PercentageInput` moving from effect to handler fires synchronously during the event. If a consumer calls `e.preventDefault()` in their `onChange` before this, cursor position will still be updated. This matches user expectation for a masked input.
