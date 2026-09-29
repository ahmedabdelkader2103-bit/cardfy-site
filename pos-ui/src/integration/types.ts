export type Rpc=(name:string,args:Record<string,unknown>)=>Promise<any>;
export type PosServices={context:{token:string;client_id:string;id?:string;name?:string;role?:string};snapshot:any;branchId:string;rpc:Rpc;status:(message?:string,error?:boolean)=>void;customerHandoff:(order:any)=>string;onMenu:()=>void;onBell:()=>void};
