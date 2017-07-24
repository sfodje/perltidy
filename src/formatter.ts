import * as which from 'which';
import * as child_process from 'child_process';
import { TextDocument, Range, TextEdit, Position, window } from 'vscode';
import { dirname } from 'path';

export default class Formatter {
    command: string;
    args: Array<string> = ['-st'];
    process: Object;

    /**
     * Initiates Formatter instance
     */
    constructor(config: any) {
        this.command = which.sync(config.get('executable', ''));
        this.args = this.args.concat(config.get('additionalArguments', []));

        let profile = config.get('profile', '');
        if (profile) {
            this.args.push('-pro=' + profile);
        }
    }

    format(document: TextDocument, range?: Range): Promise<TextEdit[]> {
        if (range === null) {
            let start = new Position(0, 0);
            let end = new Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            range = new Range(start, end);
        }
        let text = document.getText(range);

        if (!text || text.length === 0) {
            return;
        }

        let options = {
            cwd: dirname(document.uri.fsPath)
        };

        return new Promise((resolve, reject) => {
            try {
                let spawn = child_process.spawn;
                let worker = spawn(this.command, this.args, options);

                worker.stdin.write(text);
                worker.stdin.end();

                let formattedText: string = '';
                worker.stdout.on('data', (chunk) => {
                    formattedText += chunk;
                });

                let errorText: string = '';
                worker.stderr.on('data', (chunk) => {
                    errorText += chunk;
                });

                worker.stdout.on('end', () => {
                    if (errorText) {
                        window.showErrorMessage(errorText);
                        return;
                    }
                    resolve([new TextEdit(range, formattedText)]);
                });
            }
            catch (error) {
                window.showErrorMessage(error);
                return;
            }
        });
    }
}

interface IFormatterConfig {
    executatble: string;
    profile?: string;
    additionalArguments?: Array<string>;
    get<T>(section: string, defaultValue?: T);
}
