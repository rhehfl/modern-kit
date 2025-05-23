import { hasProperty } from '@modern-kit/utils';
import { RefObject } from 'react';

/**
 * @description 이벤트 리스너를 연결할 수 있는 요소를 나타냅니다.
 */
export type EventListenerAvailableElement =
  | Window
  | Document
  | HTMLElement
  | SVGElement
  | MediaQueryList;

/**
 * @description `특정 유형`, `RefObject`가 될 수 있는 대상 요소입니다.
 */
export type TargetElement<T extends EventListenerAvailableElement> =
  | T
  | RefObject<T | null | undefined>;

/**
 * @description 주어진 요소가 `RefObject`인지 확인합니다.
 */
export const isRefObject = <T extends EventListenerAvailableElement>(
  element: TargetElement<T> | null
): element is RefObject<T | null | undefined> => {
  if (!element) return false;
  return hasProperty(element, 'current');
};
