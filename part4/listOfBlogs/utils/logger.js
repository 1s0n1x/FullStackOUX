let path = require("path")

class Logger {
    static info (data) {
        function printLn (line) {
            const now = new Date(); 
            
            const hours = String(now.getHours()).padStart(2, '0'); 
            const minutes = String(now.getMinutes()).padStart(2, '0'); 
            const seconds = String(now.getSeconds()).padStart(2, '0'); 
            
            const startWith = `[${hours}:${minutes}:${seconds}] | info:`;
            return console.log(`${startWith} ${line}`);
        }

        switch (typeof data) {
            case "string":
                for(let oneLine of data.split("\n")) {
                    return printLn(oneLine);
                }
                break;
            case "object":
                for(let oneLine of JSON.stringify(data, null, 4).split("\n")) {
                    return printLn(oneLine);
                }
                break;
        }
    }

    /**
     * 
     * @param {Error} data 
     */
    static error (data) {
        function printLn (line) {
            const now = new Date(); 
            
            const hours = String(now.getHours()).padStart(2, '0'); 
            const minutes = String(now.getMinutes()).padStart(2, '0'); 
            const seconds = String(now.getSeconds()).padStart(2, '0'); 
            
            const startWith = `[${hours}:${minutes}:${seconds}] | error:`;
            return console.error(`${startWith} ${line}`);
        }

        printLn(`${data.name} - ${data.message}`)
    }
}

module.exports = Logger