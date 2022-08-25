import fs from 'node:fs'

function gen100Thousand() {
  const file = fs.createWriteStream('./dist/file_100000.txt');

  for (let i = 0; i <= 100000; i++) {
    file.write(
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
    );
  }

  file.end();
}
function genOneMillion() {
  const file = fs.createWriteStream('./dist/big-file.txt');

  for (let i = 0; i <= 1e6; i++) {
    file.write(
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
    );
  }

  file.end();
}
function genFiveMillion() {
  const file = fs.createWriteStream('./dist/big-file-5m.txt');

  for (let i = 0; i <= 5e6; i++) {
    file.write(
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
    );
  }

  file.end();
}

function genThreeMillion() {
  const file = fs.createWriteStream('./dist/big-file-3m.txt');

  for (let i = 0; i <= 3e6; i++) {
    file.write(
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"
    );
  }

  file.end();
}

function gen1_5G(exceeds = 0) {
  const file = fs.createWriteStream('./dist/big-file-1_5g_plus_1.txt');

  for (let i = 1; i <= 1572864; i++) {
    file.write(
      'a'.repeat(1024)
    );
  }
  if (exceeds > 0) {
    file.write('a'.repeat(exceeds))
  }

  file.end();
}

// gen100Thousand()
// genFiveMillion()
// genOneMillion()
// genThreeMillion()
// gen1_5G()
gen1_5G(1)
