import fs from 'node:fs';
import path from 'node:path';

export interface logOptions {
	logFilePath: string;
	logLevel: number;
	fileLogThreshold: number;
	logFolderPath: string;
}

export class log {
	constructor(options: logOptions) {
		this.logFilePath = options.logFilePath;
		this.logLevel = options.logLevel;
		this.fileLogThreshold = options.fileLogThreshold;
		this.logFolderPath = options.logFolderPath;
	}

	logFilePath: string;
	logFolderPath: string;
	logLevel: number; // 0: debug, 1: info, 2: warning, 3: error
	fileLogThreshold: number;

	init = (): void => {
		if (!fs.existsSync(path.dirname(this.logFolderPath))) {
			fs.mkdirSync(path.dirname(this.logFolderPath));
		}
		if (!fs.existsSync(this.logFilePath)) {
			fs.writeFileSync(this.logFilePath, '');
		} else {
			const data = fs.readFileSync(this.logFilePath, 'utf8');
			const lines = data.split('\n');
			const firstLine = lines[0];

			fs.writeFileSync(
				this.logFolderPath + '/' + sanitizeFileName(firstLine) + '.log',
				data
			);
		}

		fs.writeFileSync(
			this.logFilePath,
			sanitizeFileName(new Date().toISOString()) + '\n'
		);
	};

	writeToFile = (message: string): void => {
		fs.appendFile(this.logFilePath, message + '\n', (err) => {
			if (err) {
				this.log(err.message, 3);
			}
		});
	};

	log = (message: string, level: number): void => {
		let msg: string;
		let colored: string;

		switch (level) {
			case 0:
				msg = `[ DBG ]: ${message} [${new Date().toISOString()}]`;
				colored = `\u001b[34m[ DBG ]\u001b[0m: ${message} [${new Date().toISOString()}]`;
				break;
			case 1:
				msg = `[ INF ]: ${message} [${new Date().toISOString()}]`;
				colored = `\u001b[34m[ INF ]\u001b[0m: ${message} [${new Date().toISOString()}]`;
				break;
			case 2:
				msg = `[ WRN ]: ${message} [${new Date().toISOString()}]`;
				colored = `\u001b[31m[ WRN ]\u001b[0m: ${message} [${new Date().toISOString()}]`;
				break;
			case 3:
				msg = `[ ERR ]: ${message} [${new Date().toISOString()}]`;
				colored = `\u001b[33m[ ERR ]\u001b[0m: ${message} [${new Date().toISOString()}]`;
				break;
			default:
				msg = 'Null';
				colored = 'Null';
		}

		console.log(colored);
		this.writeToFile(msg);
		return;
	};

	clear = (): void => {
		console.clear();
	};
}

export function sanitizeFileName(filename: string): string {
	return filename.replace(/:/g, '-');
}
