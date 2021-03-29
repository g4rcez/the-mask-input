import { useEffect, useLayoutEffect } from "react";

export const useIsoEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect
