
import * as vscode from 'vscode';
import * as colors from "colors";
import * as shell from "shelljs";
let nodePath = (shell.which('node').toString());
shell.config.execPath = nodePath;
shell.exec('git');

export const run = async (url:any) => {
  // shell.config.execPath = url;
  let commit: string | undefined = await vscode.window.showInputBox({placeHolder: "请输入commit："});
  
  // 取消推送
  if(typeof(commit) === "undefined") {return;}
  vscode.window.showInformationMessage('推送!!!',...['打包后推送','直接推送']).then(res=> {
  shell.cd(url);
  let currentBranch = '';
  let buildParmas = null;
  if(!commit) {commit = 'update';}
  
  // 去除空格
  commit = commit.replace(/\s*/g,"");
  // 获取当前分支
  const { stdout } = shell.exec('git symbolic-ref --short -q HEAD');
  currentBranch = stdout;
  console.log(colors.green(`当前分支为 ${currentBranch}`));
  
  // if(commit.includes('build') ||  commit.includes('打包')) {
    if(res === "打包后推送") {
    console.log(colors.green('项目打包中，请稍等片刻~~~'));
    buildParmas = new Promise((resolve,reject) => {
      const {code} = shell.exec(`npm run build`); // 打包失败不走catch
      // code = 0 成功
      if(code) {
        reject('打包失败');
      } else {
        resolve('打包成功');
      }
    });
  }

  // 代码推送
  const pushCode = async () => {
    shell.exec('git add .');
    shell.exec(`git commit -m ${commit}`);

    try {
      console.log(colors.green(`尝试推送分支 ${currentBranch} 至远程仓库`));
      // code = 0 成功
      const { code } = shell.exec(`git push origin ${currentBranch}`);
      if(!code) {
        console.log(colors.green(`${currentBranch} 分支推送成功`));
        vscode.window.showInformationMessage('推送成功!!!');
        return;
      } else {
        throw "";
      }
    } catch(error) {
      console.log(colors.red(`推送分支失败: ${error}`));
      vscode.window.showInformationMessage('推送失败,请重新推送');
      return;
    }
  };
  if (buildParmas) {
    buildParmas.then(res => {
      console.log(colors.green('打包成功'));
      pushCode();
    }).catch(err => {
      return vscode.window.showInformationMessage('打包失败,请重新打包失败');
    });
  } else {
    pushCode();
  }
});
};


