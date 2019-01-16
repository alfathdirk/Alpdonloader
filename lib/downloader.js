const luwak = require('luwak');
const ytdl = require('youtube-dl');
const fs = require('fs');
const archiver = require('archiver');
const puppeteer = require('puppeteer');

const spotify = require('./spotify');
const baseUrl = 'https://www.youtube.com';


const date = new Date().getTime();
const currentPath = process.cwd();

const baseDir = currentPath+'/download/';

let directory = baseDir+date;

if(!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

fs.mkdirSync(directory);

let allMusic = [];

module.exports = async function (musics, options = {}) {
  if(!Array.isArray(musics) && typeof musics !== 'object') {
    musics = [musics];
  }

  if(typeof musics === 'object' && musics.spotifyUri) {
    musics = await spotify(musics.spotifyUri);
  }

  const browser = await puppeteer.launch();
  const page = [];
  const response = [];
  const body = [];
  let musicData = musics.map(async (v, k) => {
    page[k] = await browser.newPage();
    response[k] = await page[k].goto(`${baseUrl}/results?search_query=${v}`, { timeout: musicData.length * 300000 });
    body[k] = await page[k].evaluate(() => {
      if(document.querySelector('.ytd-video-renderer > #video-title')) {
        let link = document.querySelector('.ytd-video-renderer > #video-title').getAttribute('href');
        let title = document.querySelector('.ytd-video-renderer > #video-title').innerText;
        return { link, title };
      }
      return false
    })
  })

  return Promise.all(musicData).then(async() => {
    await browser.close();
    return body.map((v) => {
      if(v) {
        ytdl.exec(`${baseUrl}${v.link}`, ['-x', '--audio-format', 'mp3'], { cwd: directory }, (err, output) => {
          if (err) {
            return console.log(err)
          };

          if(!output) {
            output = [];
          }
          return output.join('\n');
        });
      }
    });
  })

// zipFolder(directory, directory+'.zip', (err) => console.log('success saved on >>', directory))
// function zipFolder(srcFolder, zipFilePath, callback) {
// 	var output = fs.createWriteStream(zipFilePath);
// 	var zipArchive = archiver('zip', { zlib: 9 });

// 	output.on('close', function() {
//     fs.unlinkSync(srcFolder);
// 		callback();
// 	});

// 	zipArchive.pipe(output);
// 	zipArchive.directory(directory, 'list-song');
// 	zipArchive.finalize(function(err, bytes) {
// 		if(err) {
// 			callback(err);
// 		}
// 	});
}
