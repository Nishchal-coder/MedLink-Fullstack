// React module type definitions

declare module 'react' {
  // Core React types
  export type ReactNode = any;
  export type ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> = any;
  export type JSXElementConstructor<P> = any;
  export type ComponentType<P = {}> = any;
  export type FC<P = {}> = FunctionComponent<P>;
  export type FunctionComponent<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;
  export type Component<P = {}, S = {}> = any;
  export type PureComponent<P = {}, S = {}> = any;
  export type ComponentClass<P = {}, S = {}> = any;
  export type ClassType<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>> = any;
  export type ComponentState = any;
  export type Key = string | number;
  export type Ref<T> = any;
  export type LegacyRef<T> = any;
  export type ComponentRef<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = any;
  export type RefObject<T> = { readonly current: T | null };
  export type MutableRefObject<T> = { current: T };

  // Event types
  export type SyntheticEvent<T = Element, E = Event> = any;
  export type ClipboardEvent<T = Element> = SyntheticEvent<T, ClipboardEvent>;
  export type CompositionEvent<T = Element> = SyntheticEvent<T, CompositionEvent>;
  export type DragEvent<T = Element> = SyntheticEvent<T, DragEvent>;
  export type FocusEvent<T = Element> = SyntheticEvent<T, FocusEvent>;
  export type FormEvent<T = Element> = SyntheticEvent<T, Event>;
  export type ChangeEvent<T = Element> = SyntheticEvent<T, Event>;
  export type KeyboardEvent<T = Element> = SyntheticEvent<T, KeyboardEvent>;
  export type MouseEvent<T = Element, E = NativeMouseEvent> = SyntheticEvent<T, E>;
  export type TouchEvent<T = Element> = SyntheticEvent<T, TouchEvent>;
  export type PointerEvent<T = Element> = SyntheticEvent<T, PointerEvent>;
  export type UIEvent<T = Element, E = NativeUIEvent> = SyntheticEvent<T, E>;
  export type WheelEvent<T = Element> = SyntheticEvent<T, WheelEvent>;
  export type AnimationEvent<T = Element> = SyntheticEvent<T, AnimationEvent>;
  export type TransitionEvent<T = Element> = SyntheticEvent<T, TransitionEvent>;

  // Hook types
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export type Reducer<S, A> = (prevState: S, action: A) => S;
  export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  export type DependencyList = ReadonlyArray<any>;
  export type EffectCallback = () => (void | (() => void | undefined));

  // Context types
  export interface Context<T> {
    Provider: any;
    Consumer: any;
    displayName?: string;
  }

  // Attributes
  export interface Attributes {
    key?: Key | null | undefined;
  }

  export interface RefAttributes<T> extends Attributes {
    ref?: Ref<T> | undefined;
  }

  export interface ClassAttributes<T> extends Attributes {
    ref?: LegacyRef<T> | undefined;
  }

  // Props
  export interface HTMLProps<T> extends AllHTMLAttributes<T>, ClassAttributes<T> {}
  export interface AllHTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [key: string]: any;
  }
  export interface AriaAttributes {
    [key: string]: any;
  }
  export interface DOMAttributes<T> {
    children?: ReactNode | undefined;
    dangerouslySetInnerHTML?: {
      __html: string;
    } | undefined;
    [key: string]: any;
  }

  // Hooks
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  
  export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  
  export function useContext<T>(context: Context<T>): T;
  
  export function useReducer<R extends Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I,
    initializer: (arg: I) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
  export function useReducer<R extends Reducer<any, any>>(
    reducer: R,
    initialState: ReducerState<R>,
    initializer?: undefined
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
  
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
  
  export function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
  
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): RefObject<T>;
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>;
  
  export function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;
  
  export function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
  
  export function useDebugValue<T>(value: T, format?: (value: T) => any): void;

  // Component functions
  export function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: Attributes & P | null,
    ...children: ReactNode[]
  ): ReactElement<P>;

  export function cloneElement<P extends {}>(
    element: ReactElement<P>,
    props?: Partial<P> & Attributes | null,
    ...children: ReactNode[]
  ): ReactElement<P>;

  export function createContext<T>(defaultValue: T): Context<T>;

  export function forwardRef<T, P = {}>(render: (props: P, ref: Ref<T>) => ReactElement | null): FunctionComponent<P & RefAttributes<T>>;

  export function memo<P extends {}>(Component: FunctionComponent<P>, propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean): FunctionComponent<P>;

  export function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): T;

  export const Fragment: any;
  export const StrictMode: any;
  export const Suspense: any;

  // Default export
  const React: {
    FC: typeof FC;
    Component: typeof Component;
    PureComponent: typeof PureComponent;
    useState: typeof useState;
    useEffect: typeof useEffect;
    useContext: typeof useContext;
    useReducer: typeof useReducer;
    useCallback: typeof useCallback;
    useMemo: typeof useMemo;
    useRef: typeof useRef;
    useImperativeHandle: typeof useImperativeHandle;
    useLayoutEffect: typeof useLayoutEffect;
    useDebugValue: typeof useDebugValue;
    createElement: typeof createElement;
    cloneElement: typeof cloneElement;
    createContext: typeof createContext;
    forwardRef: typeof forwardRef;
    memo: typeof memo;
    lazy: typeof lazy;
    Fragment: typeof Fragment;
    StrictMode: typeof StrictMode;
    Suspense: typeof Suspense;
  };

  export default React;
}

// React namespace for global access
declare global {
  namespace React {
    export type FC<P = {}> = import('react').FC<P>;
    export type ReactNode = import('react').ReactNode;
    export type ReactElement = import('react').ReactElement;
    export type Component<P = {}, S = {}> = import('react').Component<P, S>;
    export type FunctionComponent<P = {}> = import('react').FunctionComponent<P>;
    export type MouseEvent<T = Element> = import('react').MouseEvent<T>;
    export type ChangeEvent<T = Element> = import('react').ChangeEvent<T>;
    export type FormEvent<T = Element> = import('react').FormEvent<T>;
    export type KeyboardEvent<T = Element> = import('react').KeyboardEvent<T>;
    export type TouchEvent<T = Element> = import('react').TouchEvent<T>;
    export type FocusEvent<T = Element> = import('react').FocusEvent<T>;
    export type UIEvent<T = Element> = import('react').UIEvent<T>;
    export type WheelEvent<T = Element> = import('react').WheelEvent<T>;
    export type AnimationEvent<T = Element> = import('react').AnimationEvent<T>;
    export type TransitionEvent<T = Element> = import('react').TransitionEvent<T>;
    export type PointerEvent<T = Element> = import('react').PointerEvent<T>;
    export type ClipboardEvent<T = Element> = import('react').ClipboardEvent<T>;
    export type CompositionEvent<T = Element> = import('react').CompositionEvent<T>;
    export type DragEvent<T = Element> = import('react').DragEvent<T>;
    export type Attributes = import('react').Attributes;
    export type ClassAttributes<T> = import('react').ClassAttributes<T>;
  }
}
