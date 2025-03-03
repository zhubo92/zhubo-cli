import {Command} from "commander";
import {version} from "../package.json";
import {create} from "./command/create";
import {update} from "./command/upate";

const program = new Command("zhubo");

program.version(version, "-v, --version", "输出版本号");

program.command("update").description("更新脚手架 zhubo-cli").action(update);

program.command("create").description("创建一个新项目").argument("[name]", "项目名称").action(async (dirName) => {
    await create(dirName);
});

program.parse();
