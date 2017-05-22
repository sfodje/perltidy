'use strict';

import * as vscode from 'vscode';
import Formatter from './formatter';
import { Output } from './formatter';

export function activate(context: vscode.ExtensionContext) {

    let config = vscode.workspace.getConfiguration('perltidy');
    let formatter = new Formatter(config);

    /*vscode.workspace.on((document: vscode.TextDocument) => {
        if (document.languageId !== 'perl') return;
        let stdFormatConfig = vscode.workspace.getConfiguration('editor');
        if (stdFormatConfig && stdFormatConfig['formatOnSave']) {
            return vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });*/

    let provider = vscode.languages.registerDocumentRangeFormattingEditProvider('perl', {
        provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): Promise<vscode.TextEdit[]> {
            if (range === null) {
                let start = new vscode.Position(0, 0);
                let end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
                range = new vscode.Range(start, end);
            }
            let text = document.getText(range);

            if (!text || text.length === 0) {
                return;
            }

            return new Promise((resolve, reject) => {
                let promise = formatter.format(text);
                promise.catch((error) => {
                    console.error(error);
                    reject(error);
                });
                promise.then((output: Output) => {
                    if (output.error) {
                        vscode.window.showErrorMessage('Perltidy error: ' + output.error);
                        return;
                    }
                    resolve([new vscode.TextEdit(range, output.text)]);
                });
            });
        }
    });

    context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
