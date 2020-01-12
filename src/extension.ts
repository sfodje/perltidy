'use strict';

import * as vscode from 'vscode';
import Formatter from './formatter';

export function activate(context: vscode.ExtensionContext) {

    let config = vscode.workspace.getConfiguration('perltidy');
    let formatter = new Formatter(config);
    let languageIdentifiers: string[] = config.get('languageIdentifiers');

    vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
        if (
            languageIdentifiers.indexOf( event.document.languageId ) == -1
        ) return;
        let stdFormatConfig = vscode.workspace.getConfiguration('editor');
        if (stdFormatConfig && stdFormatConfig['formatOnSave']) {
            event.waitUntil(vscode.commands.executeCommand('editor.action.formatDocument'));
        }
    });

    languageIdentifiers.forEach( languageIdentifier => {
        let provider = vscode.languages.registerDocumentRangeFormattingEditProvider(languageIdentifier, {
            provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): Promise<vscode.TextEdit[]> {
                return formatter.format(document, range);
            }
        });
    
        context.subscriptions.push(provider);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}
