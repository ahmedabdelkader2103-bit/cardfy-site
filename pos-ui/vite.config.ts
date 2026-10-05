import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
export default defineConfig({define:{"process.env.NODE_ENV":JSON.stringify("production")},plugins:[react(),tailwindcss()],resolve:{alias:{"@":path.resolve(__dirname,"src")}},build:{outDir:"../restaurant/pos-ui",emptyOutDir:true,cssCodeSplit:false,minify:"esbuild",lib:{entry:path.resolve(__dirname,"src/main.tsx"),formats:["es"],fileName:()=>"entry.js"},rollupOptions:{output:{assetFileNames:a=>a.name?.endsWith(".css")?"main.css":"assets/[name][extname]"}}}});
