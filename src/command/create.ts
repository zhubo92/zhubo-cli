import {input, select} from "@inquirer/prompts";
import {clone} from "../utils/clone";
import path from "node:path";
import fs from "fs-extra";
import {name, version} from "../../package.json";
import axios, {AxiosResponse} from "axios";
import {gt} from "lodash";
import chalk from "chalk";

export interface ITemplateInfo {
    name: string; // 模板名称
    downloadUrl: string; // 模板下载地址
    description: string; // 模板描述
    branch: string; // 模板分支
}

export const templates: Map<string, ITemplateInfo> = new Map([
    ["vue3-template", {
        name: "vue3-template",
        downloadUrl: "git@github.com:zhubo92/vue3-template.git",
        description: "Vue 3 项目开发模板",
        branch: "master",
    }],
    ["react-admin", {
        name: "react-admin",
        downloadUrl: "git@github.com:zhubo92/react-admin.git",
        description: "React 19 项目开发模板",
        branch: "master",
    }]
]);

export async function isOverwrite(filename: string) {
    console.warn(`${filename}文件夹已存在`);
    return select({
        message: "是否覆盖？",
        choices: [
            {name: "覆盖", value: true},
            {name: "取消", value: false},
        ]
    })
}

// 获取远端最新版本号
async function getNpmLatestVersion(name: string) {
    const npmUrl = `https://registry.npmjs.org/${name}`;
    try {
        const res = (await axios.get(npmUrl))as AxiosResponse<{"dist-tags": { latest: string }}>;
        return res.data["dist-tags"].latest;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function checkVersion(name: string, version: string) {
    const latestVersion = await getNpmLatestVersion(name);
    if(!latestVersion) {
        console.error(chalk.redBright("检测不到远端最新版本，请检查本地连接"));
        return;
    }
    const isNeedUpdate = gt(latestVersion, version);
    if(isNeedUpdate) {
        console.warn(`检查到 zhubo-cli 最新版本为 ${chalk.blackBright(latestVersion)}，当前版本为 ${chalk.blackBright(version)}`);
        console.warn(`可使用 ${chalk.yellow("npm install zhubo-cli@latest")}，或者使用 ${chalk.yellow("zhubo update")} 更新`);
    }
}

export async function create(projectName?: string) {
    // 检查版本更新
    await checkVersion(name, version);

    if (!projectName) {
        projectName = await input({message: "请输入项目名称"});
    }

    // 如果文件夹存在，则提示是否覆盖
    const filePath = path.resolve(process.cwd(), projectName);
    if (fs.existsSync((filePath))) {
        const overwriteResult = await isOverwrite(projectName);
        // 不覆盖直接结束
        if (!overwriteResult) return;
        fs.removeSync(filePath);
    }

    // 初始化模板列表
    const templateList = Array.from(templates).map(([name, info]: [string, ITemplateInfo]) => ({
        name,
        value: name,
        description: info.description
    }));

    const selectedTemplateName = await select({
        message: "请选择模板",
        choices: templateList,
    });

    const selectedTemplateInfo = templates.get(selectedTemplateName);
    if (!selectedTemplateInfo) return;

    // 下载
    await clone(selectedTemplateInfo!.downloadUrl, projectName, ["-b", selectedTemplateInfo!.branch]);
}
