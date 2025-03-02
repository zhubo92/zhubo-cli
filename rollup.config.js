import {defineConfig} from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from 'rollup-plugin-typescript2';

export default defineConfig(async () => {
    const {nodeExternals} = await import("rollup-plugin-node-externals");

    return [
        {
            input: {
                index: 'src/index.ts', // 打包入口文件
            },
            output: [
                {
                    dir: 'dist', // 输出目标文件夹
                    format: 'cjs', // 输出 commonjs 文件
                }
            ],
            plugins: [
                nodeResolve(),
                nodeExternals({
                    devDeps: false, // 可以识别我们 package.json 中的依赖当作外部依赖处理 不会直接将其中引用的方法打包出来
                }),
                typescript(),
                json(),
                commonjs(),
                terser(),
            ],
        },
    ];
});
