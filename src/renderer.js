const $ = require('jquery');
const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main');
const { runRuby } = mainProcess;

const $rubyOutput = $('.ruby-output');

$('.run-ruby').on('click', () => {
  console.log('running ruby');
  runRuby($('.ruby-input').val());
});

ipcRenderer.on('ran-ruby', (event, output) => {
  console.log(output);
  $rubyOutput.html(output);
});
