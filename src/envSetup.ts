import * as dotenv from 'dotenv'
const commandLineMode = process.argv[process.argv.length - 1]
export const envSetup = () => {
    let envPath = ''
    if (commandLineMode == "prod") {
        envPath = './src/env/prod.env'
    }
    else if (commandLineMode == "dev") {
        envPath = './src/env/dev.env'
    }
    else if (commandLineMode == "test") {
        envPath = './src/env/test.env'
    }
    else {
        console.error("you don't choose mode");
    }
    return envPath;
}
console.log(commandLineMode + ' mode ');

