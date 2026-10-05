import {createRoot,type Root} from "react-dom/client";
import {App} from "./App";
import {hydrateCatalog} from "./lib/pos-data";
import type {PosServices} from "./integration/types";
import "./styles.css";
let root:Root|null=null;
export function mount(host:HTMLElement,services:PosServices){hydrateCatalog(services.snapshot.catalog,services.branchId);root?.unmount();root=createRoot(host);root.render(<App services={services}/>);}
export function unmount(){root?.unmount();root=null;}
