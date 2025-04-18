/**
 * @description 객체의 모든 속성을 선택적(optional)으로 만드는 유틸 타입입니다.
 * 중첩된 객체의 경우에도 재귀적으로 모든 속성을 선택적으로 변환합니다.
 *
 * @template T - 변환할 객체 타입
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * }
 *
 * type PartialUser = DeepPartial<User>;
 * // {
 * //   name?: string;
 * //   age?: number;
 * //   address?: {
 * //     street?: string;
 * //     city?: string;
 * //   };
 * // }
 */
export type DeepPartial<T extends Record<PropertyKey, any>> = {
  [P in keyof T]?: T[P] extends Record<PropertyKey, any>
    ? DeepPartial<T[P]>
    : T[P];
};
