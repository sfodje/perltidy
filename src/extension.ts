'use strict';

import * as vscode from 'vscode';
import Formatter from './formatter';

export function activate(context: vscode.ExtensionContext) {

    let config = vscode.workspace.getConfiguration('perltidy');
    let formatter = new Formatter(config);
    let provider = vscode.languages.registerDocumentFormattingEditProvider('perl', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
            let text = document.getText();
            if (!text || text.length === 0) {
                return;
            }
            const range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);


            return new Promise((resolve, reject) => {
                let promisedText = formatter.format(text);
                promisedText.catch((error) => {
                    console.error(error);
                    reject(error);
                });
                promisedText.then((formattedText: string) => {
                    resolve([new vscode.TextEdit(range, formattedText)]);
                });
            });
        }
    });

    context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}