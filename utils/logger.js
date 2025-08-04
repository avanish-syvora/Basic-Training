const fs = require('fs');
const path = require('path');
const logFile =  path.join(__dirname, "../log.txt");

function log(operation,a,b,result){
    const line = `${new Date().toISOString()} | ${operation} ${a} ${b} = ${result}`;
    fs.appendFileSync(logFile,line); 
}

module.exports = log;