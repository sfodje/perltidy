import * as which from 'which';
import * as child_process from 'child_process';

export class Output {
    error: string;
    text: string;

    constructor(text: string, error: string) {
        this.text = text.trim();
        this.error = error.trim();
    }
}

export default class Formatter {
    command: string;
    options: Array<string> = ['-st'];
    process: Object;

    /**
     * Initiates Formatter instance
     */
    constructor(config: any) {
        this.command = which.sync(config.get('executable', ''));
        this.options = this.options.concat(config.get('additionalArguments', []));

        let profile = config.get('profile', '');
        if (profile) {
            this.options.push('-pro=' + profile);
        }
    }

    format(text: string): Promise<Output> {

        return new Promise((resolve, reject) => {
            try {
                let spawn = child_process.spawn;
                let worker = spawn(this.command, this.options);

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
                    resolve(new Output(formattedText, errorText));

                });
            }
            catch (error) {
                resolve(new Output('', error));
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
