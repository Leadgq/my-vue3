import minimist from 'minimist';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from "esbuild";
import Module from "node:module";

// 实现node的require
const require = Module.createRequire(import.meta.url);
// 获取命令行参数
const args = minimist(process.argv.slice(2));
// 获取目标
const target = args._[0] || 'reactivity';

// 获取格式
const format = args.f || 'iife';



// 获取当前文件所在目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 获取入口文件
const entry = path.resolve(__dirname, `../packages/${target}/src/index.ts`);

// 如果是iife格式，则需要获取pkg
const pkg = require(`../packages/${target}/package.json`);


esbuild.context({
    entryPoints: [entry],
    outfile: path.resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    sourcemap: true,  // 是否可以调试
    bundle: true,  // 是否打包
    format,
    platform:'browser',  // 平台
    globalName: pkg.buildOptions?.name,
}).then(ctx => {
    console.log('finish and watch');
    return  ctx.watch();
}).catch(err => {
    console.log(err);
})
