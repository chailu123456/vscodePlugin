
import * as vscode from 'vscode';
import { run } from './shell';

export async function activate(context: vscode.ExtensionContext) {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
    return;
  }
    // 获取当前 vscode 所打开的工作区目录地址
		const workspaceFilePath = vscode.workspace.getWorkspaceFolder(
			activeEditor.document.uri
		)!.uri.fsPath;
		// console.log(workspaceFilePath);
		
	let disposable = vscode.commands.registerCommand('quick-push-code.helloWorld', (url) => {
		run(workspaceFilePath);
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
