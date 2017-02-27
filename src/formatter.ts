import * as which from 'which';
import * as child_process from 'child_process';

export default class Formatter {
    command: string;
    options: Array<string> = ['-st'];
    process: Object;

    /**
     * Initiates Formatter instance
     */
    constructor(config: any) {
        this.command = which.sync(config.get('executable', ''));
        this.options.concat(config.get('additionalArguments', []));

        let profile = config.get('profile', '');
        if (profile) {
            this.options.push('--profile=' + profile);
        }
    }

    format(text: string): Promise<string> {

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

                worker.stdout.on('end', () => {
                    resolve(formattedText);
                });
            }
            catch (error) {
                reject(error);
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
