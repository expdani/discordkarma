import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import {terser} from "rollup-plugin-terser";

export default {
    name: "DiscordBot",
    input: "src/index.ts",
    output: {
        file: "dist/bundle.js",
        format: "umd",
        name: "bundle",
    },
    sourcemap: true,
    plugins: [
        typescript(),
        resolve({ jsnext: true }),
        commonjs(),
        terser()
    ]
};