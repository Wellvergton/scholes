export { buildText }

String.prototype.shuffle = function () {
  let a = this.split('');
  let n = this.length;

  for(let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  return a.join('');
}

String.prototype.addBlankSpace = function() {
  return this.concat(' ');
}

String.prototype.addCarriageReturn = function() {
  return this.concat('↵');
}

function build600CharScrambledWord(string) {
  let newString = '';

  while (newString.length < 600) {
    newString = newString.concat(string.shuffle());
  }

  return newString;
}

function splitWordWithBlankOrCarriage(string) {
  let newString = '';

  for (let i = 0; i < string.length; i++) {
    if (i > 0) {
      if (i % 5 == 0 && i % 60 != 0) {
        newString = newString.addBlankSpace();
      } else if (i % 60 == 0) {
        newString = newString.addCarriageReturn();
      }
    }

    newString = newString.concat(string[i]);
  }

  return newString;
}

let text = document.getElementById('text');
let span = document.createElement('span');
span.className = 'key';
let lineBreak = document.createElement('br');

function buildText(keySet) {
  let rawText = build600CharScrambledWord(keySet);
  let splitedText = splitWordWithBlankOrCarriage(rawText);

  for (let i = 0; i < splitedText.length; i++) {
    text.appendChild(span.cloneNode()).innerHTML = splitedText[i];

    if (splitedText[i] == '↵') {
      text.appendChild(lineBreak.cloneNode());
    }
  }
}
