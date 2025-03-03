import ora from "ora";
import chalk from "chalk";
import process from "child_process";

const spinner = ora({
    text: "zhubo-cli 正在更新...",
    spinner: {
        interval: 300,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item => chalk.blue(item))
    }
})
export function update() {
    spinner.start();
    process.exec("npm install zhubo-cli@latest -g", (err) => {
        spinner.stop();
        if(!err) {
            console.log(chalk.green("更新成功"));
        } else {
            console.log(chalk.red(err));
        }
    });

}