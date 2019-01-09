const luwak = require('luwak');
const nightmareEngine = require('luwak-nightmare');
const ytdl = require('youtube-dl');
const fs = require('fs');
const archiver = require('archiver');

const { list } = require('./song');

const baseUrl = 'https://www.youtube.com';

const date = new Date().getTime();
const baseDir = __dirname+'/tmp/';
let directory = baseDir+date;

if(!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

fs.mkdirSync(directory);

let downloads = list.map(async(musicTitle) => {
  let musicTitles = musicTitle.replace(/ /g, '+');
  try {
    var scraper = new luwak.Scraper(`${baseUrl}/results?search_query=${musicTitles}`);
    let data = await scraper
      .engine(nightmareEngine({ waitTimeout: 80000, gotoTimeout: 80000 }))
      .select([{
        '$root': 'ytd-video-renderer',
        'title': 'a#video-title | trim',
        'link': 'a#video-title@href',
      }])
      .fetch();

    if(data[0]) {
      return new Promise((resolve, reject) => {
        ytdl.exec(`${baseUrl}${data[0].link}`, ['-x', '--audio-format', 'mp3'], { cwd: directory }, (err, output) => {
          if (err) {
            reject(err);
          };

          if(!output) {
            output = [];
          }

          console.log(output.join('\n'));
          resolve('success');
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
});

Promise.all(downloads)
  .then((v) => zipFolder(directory, directory+'.zip', (err) => console.log('success saved on >>', directory)))
  .catch((err) => console.error('zipp error', err));

function zipFolder(srcFolder, zipFilePath, callback) {
	var output = fs.createWriteStream(zipFilePath);
	var zipArchive = archiver('zip', { zlib: 9 });

	output.on('close', function() {
    fs.unlinkSync(srcFolder);
		callback();
	});

	zipArchive.pipe(output);
	zipArchive.directory(directory, 'list-song');
	zipArchive.finalize(function(err, bytes) {
		if(err) {
			callback(err);
		}
	});
}
