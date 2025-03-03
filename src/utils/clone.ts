import simpleGit, {SimpleGitOptions} from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";
import log from "./log";

const figlet = require("figlet");

// 初始化进度条
const logger = createLogger({
    spinner: {
        interval: 300,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item => chalk.green(item))
    }
});

async function goodPrinter() {
    const data = await figlet("zhubo-cli");
    console.log(chalk.rgb(40, 156, 193).visible(data));
}

const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(), // 当前工作目录
    binary: 'git', // 指定 git 二进制文件路径
    maxConcurrentProcesses: 6, // 最大并发进程数
};

export async function clone(url: string, projectName: string, options: string[]) {
    const git = simpleGit(gitOptions);
    try {
        await logger(git.clone(url, projectName, options), "代码下载中...", {
            estimate: 7 * 1000, // 预计下载时间
        });
        console.log();
        console.log(chalk.blueBright("==================================================="));
        console.log(chalk.blueBright("============= 欢迎使用 zhubo-cli 脚手架 ============="));
        console.log(chalk.blueBright("==================================================="));
        console.log();
        log.success(chalk.green(` ${chalk.blueBright(projectName)} 项目创建成功`));
        log.success("执行以下命令启动项目：")
        log.info(`cd ${chalk.blueBright(projectName)}`);
        log.info(`${chalk.yellow('pnpm')} install`);
        log.info(`${chalk.yellow('pnpm')} run dev`);

        await goodPrinter();
    } catch (e) {
        log.error(chalk.red("代码下载失败！"));
    }
}
