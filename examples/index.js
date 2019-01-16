const download = require('../index');

(async () => {
  let result = await download({ spotifyUri: 'https://open.spotify.com/user/alfathdirk/playlist/3e5LWSI8UYdaNGtA4sBf0W?si=_KLN42CZRtyLolJPC1JoCA' });
  let result = await download(["dewa 19 satu", "dewa aku milikmu", "peterpan mnghpus jjkmu"]);
  console.log(result);
})();
