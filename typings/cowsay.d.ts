declare module 'cowsay' {
  export const list: string[];

  export function think(options: Options): string;
  export function say(options: Options): string;

  interface Options {
    b?: boolean;
    d?: boolean;
    e?: string;
    f?: string;
    g?: boolean;
    n?: boolean;
    p?: boolean;
    r?: boolean;
    s?: boolean;
    t?: boolean;
    T?: string;
    text: string;
    w?: boolean;
    W?: number;
    y?: boolean;
  }
}