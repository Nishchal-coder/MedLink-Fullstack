// Global type declarations to resolve missing module errors

declare module 'react' {
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useContext<T>(context: any): T;
  export function useReducer<R extends any>(reducer: R, initialState: any): any;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useImperativeHandle<T>(ref: any, createHandle: () => T, deps?: any[]): void;
  export function useDebugValue<T>(value: T, format?: (value: T) => any): void;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export function cloneElement(element: any, props?: any, ...children: any[]): any;
  export function createContext<T>(defaultValue: T): any;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): any;
  export function memo<P extends {}>(Component: any, propsAreEqual?: any): any;
  export function lazy<T extends any>(factory: () => Promise<{ default: T }>): T;
  
  export const Fragment: any;
  export const StrictMode: any;
  export const Suspense: any;
  
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type ReactElement = any;
  export class Component<P = {}, S = {}> {
    props: P;
    state: S;
    context: any;
    refs: any;
    constructor(props: P, context?: any) {
      this.props = props;
      this.state = {} as S;
      this.context = context;
      this.refs = {};
    }
    setState(partialState: Partial<S> | ((prevState: S, props: P) => Partial<S>), callback?: () => void): void {}
    forceUpdate(callback?: () => void): void {}
    render(): ReactNode { return null; }
    componentDidMount?(): void;
    componentWillUnmount?(): void;
    componentDidUpdate?(prevProps: P, prevState: S, snapshot?: any): void;
    shouldComponentUpdate?(nextProps: P, nextState: S, nextContext: any): boolean;
    getSnapshotBeforeUpdate?(prevProps: P, prevState: S): any;
    componentDidCatch?(error: Error, errorInfo: any): void;
    static getDerivedStateFromError?(error: Error): any;
    static getDerivedStateFromProps?(props: any, state: any): any;
  }
  export type FunctionComponent<P = {}> = (props: P) => any;
  export type MouseEvent<T = Element> = any;
  export type ChangeEvent<T = Element> = any;
  export type FormEvent<T = Element> = any;
  export type KeyboardEvent<T = Element> = any;
  export type TouchEvent<T = Element> = any;
  export type FocusEvent<T = Element> = any;
  export type UIEvent<T = Element> = any;
  export type WheelEvent<T = Element> = any;
  export type AnimationEvent<T = Element> = any;
  export type TransitionEvent<T = Element> = any;
  export type PointerEvent<T = Element> = any;
  export type ClipboardEvent<T = Element> = any;
  export type CompositionEvent<T = Element> = any;
  export type DragEvent<T = Element> = any;
  export type ErrorInfo = {
    componentStack: string;
    errorBoundary?: Component<any, any>;
    errorBoundaryName?: string;
    errorBoundaryStack?: string;
  };
  
  export interface Attributes {
    key?: string | number | null;
  }
  
  export interface ClassAttributes<T> extends Attributes {
    ref?: any;
  }
  
  namespace React {
    export type FC<P = {}> = (props: P) => any;
    export type ReactNode = any;
    export type ReactElement = any;
    export class Component<P = {}, S = {}> {
      props: P;
      state: S;
      context: any;
      refs: any;
      constructor(props: P, context?: any) {
        this.props = props;
        this.state = {} as S;
        this.context = context;
        this.refs = {};
      }
      setState(partialState: Partial<S> | ((prevState: S, props: P) => Partial<S>), callback?: () => void): void {}
      forceUpdate(callback?: () => void): void {}
      render(): ReactNode { return null; }
      componentDidMount?(): void;
      componentWillUnmount?(): void;
      componentDidUpdate?(prevProps: P, prevState: S, snapshot?: any): void;
      shouldComponentUpdate?(nextProps: P, nextState: S, nextContext: any): boolean;
      getSnapshotBeforeUpdate?(prevProps: P, prevState: S): any;
      componentDidCatch?(error: Error, errorInfo: any): void;
      static getDerivedStateFromError?(error: Error): any;
      static getDerivedStateFromProps?(props: any, state: any): any;
    }
    export type FunctionComponent<P = {}> = (props: P) => any;
    export type MouseEvent<T = Element> = any;
    export type ChangeEvent<T = Element> = any;
    export type FormEvent<T = Element> = any;
    export type KeyboardEvent<T = Element> = any;
    export type TouchEvent<T = Element> = any;
    export type FocusEvent<T = Element> = any;
    export type UIEvent<T = Element> = any;
    export type WheelEvent<T = Element> = any;
    export type AnimationEvent<T = Element> = any;
    export type TransitionEvent<T = Element> = any;
    export type PointerEvent<T = Element> = any;
    export type ClipboardEvent<T = Element> = any;
    export type CompositionEvent<T = Element> = any;
    export type DragEvent<T = Element> = any;
    export type Attributes = any;
    export type ClassAttributes<T> = any;
  }
  
  const React: typeof React;
  export default React;
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export const useAnimation: any;
  export const useInView: any;
  export const useScroll: any;
  export const useTransform: any;
  export const useSpring: any;
  export const useMotionValue: any;
  export const Variants: any;
}

declare module '@heroicons/react/24/outline' {
  export const EyeIcon: any;
  export const EyeSlashIcon: any;
  export const UserIcon: any;
  export const LockClosedIcon: any;
  export const EnvelopeIcon: any;
  export const PhoneIcon: any;
  export const CalendarIcon: any;
  export const MapPinIcon: any;
  export const HeartIcon: any;
  export const ShieldCheckIcon: any;
  export const ClipboardDocumentListIcon: any;
  export const ChartBarIcon: any;
  export const CogIcon: any;
  export const BellIcon: any;
  export const MagnifyingGlassIcon: any;
  export const Bars3Icon: any;
  export const XMarkIcon: any;
  export const SunIcon: any;
  export const MoonIcon: any;
  export const GlobeAltIcon: any;
  export const ChevronDownIcon: any;
  export const ArrowRightOnRectangleIcon: any;
}

declare module '@heroicons/react/24/solid' {
  export const HeartIcon: any;
  export const ShieldCheckIcon: any;
  export const ClipboardDocumentListIcon: any;
  export const ChartBarIcon: any;
}

// JSX namespace declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML Elements
      div: any;
      span: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      button: any;
      input: any;
      form: any;
      label: any;
      select: any;
      option: any;
      textarea: any;
      img: any;
      a: any;
      ul: any;
      ol: any;
      li: any;
      nav: any;
      header: any;
      footer: any;
      main: any;
      section: any;
      article: any;
      aside: any;
      table: any;
      thead: any;
      tbody: any;
      tr: any;
      td: any;
      th: any;
      iframe: any;
      video: any;
      audio: any;
      canvas: any;
      svg: any;
      path: any;
      circle: any;
      rect: any;
      line: any;
      polygon: any;
      polyline: any;
      ellipse: any;
      g: any;
      defs: any;
      use: any;
      symbol: any;
      marker: any;
      clipPath: any;
      mask: any;
      pattern: any;
      linearGradient: any;
      radialGradient: any;
      stop: any;
      animate: any;
      animateTransform: any;
      text: any;
      tspan: any;
      textPath: any;
      foreignObject: any;
      // Catch-all for any other elements
      [elemName: string]: any;
    }
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    interface IntrinsicAttributes extends React.Attributes { }
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }
  }
}

// React namespace declaration
declare namespace React {
  type FC<P = {}> = FunctionComponent<P>;
  type ReactNode = any;
  type ReactElement = any;
  type Component<P = {}, S = {}> = any;
  type FunctionComponent<P = {}> = (props: P) => ReactElement | null;
  type MouseEvent<T = Element> = any;
  type ChangeEvent<T = Element> = any;
  type FormEvent<T = Element> = any;
  type KeyboardEvent<T = Element> = any;
  type TouchEvent<T = Element> = any;
  type FocusEvent<T = Element> = any;
  type UIEvent<T = Element> = any;
  type WheelEvent<T = Element> = any;
  type AnimationEvent<T = Element> = any;
  type TransitionEvent<T = Element> = any;
  type PointerEvent<T = Element> = any;
  type ClipboardEvent<T = Element> = any;
  type CompositionEvent<T = Element> = any;
  type DragEvent<T = Element> = any;
  
  interface Attributes {
    key?: string | number | null;
  }
  
  interface ClassAttributes<T> extends Attributes {
    ref?: any;
  }
  
  function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  function useMemo<T>(factory: () => T, deps: any[]): T;
  function useRef<T>(initialValue: T): { current: T };
  function useContext<T>(context: any): T;
  function useReducer<R extends any>(reducer: R, initialState: any): any;
  function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  function useImperativeHandle<T>(ref: any, createHandle: () => T, deps?: any[]): void;
  function useDebugValue<T>(value: T, format?: (value: T) => any): void;
}

export {};
