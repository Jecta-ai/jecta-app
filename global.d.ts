export {};

declare global {
  interface Window {
    keplr?: {
      enable: (chainId: string) => Promise<void>;
      disable: (chainId: string) => Promise<void>;
      getOfflineSigner: (chainId: string) => any;
      signArbitrary:(chainId:string,address:string,msg:any)=>any;
    };
  }
}
