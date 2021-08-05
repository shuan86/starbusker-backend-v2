"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSetup = void 0;
const commandLineMode = process.argv[process.argv.length - 1];
const envSetup = () => {
    let envPath = '';
    if (commandLineMode == "prod") {
        envPath = './src/env/prod.env';
    }
    else if (commandLineMode == "dev") {
        envPath = './src/env/dev.env';
    }
    else if (commandLineMode == "test") {
        envPath = './src/env/test.env';
    }
    else {
        console.error("you don't choose mode");
    }
    return envPath;
};
exports.envSetup = envSetup;
console.log(commandLineMode + ' mode ');
//# sourceMappingURL=envSetup.js.map