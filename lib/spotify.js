const luwak = require('luwak');
const puppeteer = require('luwak-puppeteer');

module.exports = async function(urlPlaylist) {
  try {
    var scraper = new luwak.Scraper(urlPlaylist);
    let data = await scraper
      .engine(puppeteer())
      .filter('getTitle', function(value) {
        return value.split('•')[0].trim();
      })
      .select([{
        '$root': '.tracklist-col.name',
        song: '.tracklist-name.ellipsis-one-line',
        artist: '.second-line | getTitle'
      }])
      .fetch();
      let list = data.map(v => {
        let lists = v.artist + ' ' + v.song;
        return lists;
      })
      return list;
  } catch (error) {
    console.error(error);
  }
}
