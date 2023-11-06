import React, { ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { CurrencyInput, CurrencyInputProps, isCurrencyInput } from "./currency-input";
import { createPattern, createPatternRegexMask, originalTokens } from "./masks";
import { isPercentageInput, PercentageInput, PercentInputProps } from "./percent-input";
import { Mask, MaskInputProps, TheMasks, Token, Tokens } from "./types";

function formatRegexMask(v: string, mask: string | Mask[], transform: (x: string) => string, tokens: Tokens = originalTokens) {
  const value = transform(v);
  let output = "";
  for (let countMask = 0, i = 0; countMask < mask.length && i < value.length;) {
    const maskChar = mask[countMask];
    const masker = maskChar instanceof RegExp ? maskChar : tokens[maskChar];
    const char = value[i];
    if (masker === undefined) {
      output += maskChar;
      if (char === maskChar) i += 1;
      countMask += 1;
      continue;
    }
    const token: Token = masker instanceof RegExp ? { regex: masker } : masker;
    if (token.regex.test(char)) output += token.parse?.(char) ?? char;
    i += 1;
    countMask += 1;
  }
  return output;
}

const noop = (s: string) => s;

const valueWasMatch = (mask: TheMasks | undefined, strict: boolean, value: string | undefined) => {
  if (!mask || !value) return false;
  const regex = new RegExp(createPattern(mask, value, strict));
  return regex.test(value);
}

export const MaskInput = forwardRef<HTMLInputElement, MaskInputProps>(
  ({ onChange, infinity = false, strict = true, transform, pattern, tokens, mask, onChangeText, as, ...props }, ref) => {
    const Component = as ?? "input";
    const internalRef = useRef<HTMLInputElement>(null);
    const wasMatch = useRef(valueWasMatch(mask, strict, (props.value || props.defaultValue) as string));
    useImperativeHandle(ref, () => internalRef.current!);

    const formatMaskedValue = useCallback(
      (value?: string, defaultValue?: string) => {
        const v = value ?? defaultValue ?? "";
        if (mask === undefined) return v;
        const finalValue = v?.toString() ?? "";
        return formatRegexMask(finalValue, typeof mask === "function" ? mask(finalValue) : mask, transform ?? noop, tokens ?? originalTokens);
      },
      [transform, mask, tokens]
    );

    const [stateValue, setStateValue] = useState(() => formatMaskedValue(props.value as string, props.defaultValue as string));
    const formattedDefaultValue = useMemo(() => formatMaskedValue(undefined, props.defaultValue as string), [props.defaultValue]);

    useEffect(() => {
      if (props.value === undefined) return;
      const newValue = formatMaskedValue(props.value as string, props.defaultValue as string);
      setStateValue(newValue);
      if (internalRef.current !== null) internalRef.current.value = newValue as string;
    }, [props.value, mask, transform, props.defaultValue]);

    const patternMemo = useMemo(() => {
      if (pattern || mask === undefined) return pattern;
      if (typeof mask === "function") {
        const resultMask = mask(stateValue);
        return Array.isArray(resultMask) ? createPatternRegexMask(resultMask, strict) : createPattern(mask, stateValue, strict);
      }
      return typeof mask === "string" ? createPattern(mask, stateValue, strict) : createPatternRegexMask(mask, strict);
    }, [pattern, stateValue, strict, mask]);

    const changeMask = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (mask === undefined) {
        setStateValue(value);
        onChangeText?.(value);
        return onChange?.(event);
      }
      const regex = new RegExp(createPattern(mask, value, strict));
      const target = event.target;
      const cursor = target.selectionEnd ?? 0;
      if (infinity) {
        if (wasMatch.current && value.length >= stateValue.length) {
          event.target.value = stateValue;
          return target.setSelectionRange(cursor - 1, cursor - 1);
        }
      }
      let erasing = false;
      if (value.length < stateValue.length) {
        wasMatch.current = false;
        erasing = true;
      }
      if (regex.test(value)) wasMatch.current = true;
      let movement = cursor;
      const digit = value[movement - 1];
      const masked = formatRegexMask(value, typeof mask === "function" ? mask(value) : mask, transform ?? noop, tokens ?? originalTokens);
      target.value = masked;
      if (masked === stateValue) return;
      setStateValue(masked);
      onChangeText?.(masked);
      while (movement < masked.length && masked.charAt(movement - 1) !== digit) movement += 1;
      if (erasing) target.setSelectionRange(cursor, cursor);
      else target.setSelectionRange(movement, movement);
      event.target.value = masked;
      onChange?.(event);
    };

    return <Component {...props} defaultValue={formattedDefaultValue} pattern={patternMemo} onChange={changeMask} ref={internalRef} />;
  }
);

export type TheMaskPropsMerge = MaskInputProps | CurrencyInputProps | PercentInputProps;

export const TheMaskInput = forwardRef<HTMLInputElement, TheMaskPropsMerge>((props, externalRef) => {
  if (isCurrencyInput(props.mask)) {
    return <CurrencyInput {...(props as any)} mask={undefined} ref={externalRef} />;
  }
  if (isPercentageInput(props.mask)) {
    return <PercentageInput {...(props as any)} mask={undefined} ref={externalRef} />;
  }
  return <MaskInput {...props} ref={externalRef} />;
});
