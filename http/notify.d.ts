export declare interface HOptions{
    status?: (status: number) => boolean;
    code?: (code: number) => boolean;
    error?: (message: string, duration: number) => void;
    maps?: Record<string, string>,
}
export declare class HNotify {
    static init(opts?: HOptions);
 }
