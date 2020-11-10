#!/usr/bin/env node

const [,, ... args] = process.argv

console.log(args);

const watchingFile = args[0] 
const cmd = args[1]

const fs = require('fs');
const { exec } = require("child_process");

let lastBuildAt = new Date();
let building = false;

fs.watch(watchingFile, { recursive: true }, (event, filename) => {
  if (filename && filename !== '.DS_Store') {

    let now = new Date();

    if(now-lastBuildAt < 3000) { // ultimo build foi à mais de 3s
      console.log('Já buildei agora pouco, segura a onda aí, macho...');
      return false;
    }

    if(building) {
      console.log('Tou buildando, segura a onda aí, macho...');
      return false;
    }

    console.log(`${filename} alterado. Buildando...`);
    buildApp();
  }
});

function buildApp() {
  building = true;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      building = false;
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      building = false;
      console.log(`stderr: ${stderr}`);
      return;
    }
    
    console.log(`${stdout}`);

    lastBuildAt = new Date();
    building = false;
  });
}


