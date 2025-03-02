import {input, select} from "@inquirer/prompts";
import {clone} from "../utils/clone";
import path from "node:path";
import fs from "fs-extra";

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

export async function create(projectName?: string) {
    if(!projectName) {
        projectName = await input({message: "请输入项目名称"});
    }

    // 如果文件夹存在，则提示是否覆盖
    const filePath = path.resolve(process.cwd(), projectName);
    if(fs.existsSync((filePath))) {
        const overwriteResult = await isOverwrite(projectName);
        // 不覆盖直接结束
        if(!overwriteResult) return;
        fs.removeSync(filePath);
    }

    // 初始化模板列表
    const templateList = Array.from(templates).map(([name, info]: [string, ITemplateInfo]) => ({name, value: name, description: info.description}));

    const selectedTemplateName = await select({
        message: "请选择模板",
        choices: templateList,
    });

    const selectedTemplateInfo = templates.get(selectedTemplateName);
    if(!selectedTemplateInfo) return;

    // 下载
    await clone(selectedTemplateInfo!.downloadUrl, projectName, ["-b", selectedTemplateInfo!.branch]);
}
