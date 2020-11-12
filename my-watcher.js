#!/usr/bin/env node

const [,, ... args] = process.argv

const fileOrFolder = args[0] 
const cmd = args[1]
let delay = args[2];

if(delay){
  delay = parseInt(delay)
} else {
  delay = 1000
}

console.log("Running with args:", [fileOrFolder, cmd, delay]);

const fs = require('fs');
const { exec } = require("child_process");

let lastRunAt = new Date();
let running = false;

fs.watch(fileOrFolder, { recursive: true }, (event, filename) => {
  if (filename && filename !== '.DS_Store') {

    let now = new Date();

    if(now-lastRunAt < delay) { // ultimo build foi à mais de :delay em ms
      console.log('Já rodei agora pouco, segura a onda aí, macho...');
      return false;
    }

    if(running) {
      console.log('Tou rodando, segura a onda aí, macho...');
      return false;
    }

    console.log(`${filename} alterado. Vou rodar...`);
    runCmd();
  }
});

function runCmd() {
  running = true;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      running = false;
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      running = false;
      console.log(`stderr: ${stderr}`);
      return;
    }
    
    console.log(`${stdout}`);

    lastRunAt = new Date();
    building = false;
  });
}


