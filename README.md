# alpdonloader

Alpdonloader is music batch downloader crawled from youtube

## Requirement
you must install python version 2.6, 2.7, or 3.2+, because this library use `youtube-dl` as dependecies

## How to use
```bash
npm i alpdon --save
```

input your title song in `song.json` download and execute index.js

```bash
const download = require('alpdon');

(async () => {
  // spotify uri
  let result = await download({ spotifyUri: 'https://open.spotify.com/user/alfathdirk/playlist/3e5LWSI8UYdaNGtA4sBf0W?si=_KLN42CZRtyLolJPC1JoCA' });

  // download by tile
  let result = await download(["dewa 19 satu", "dewa aku milikmu", "peterpan mnghpus jjkmu"]);

  console.log(result);
})();

```

songs will downloaded and save on `download` folder where you executed that script.
