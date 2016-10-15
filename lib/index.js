var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var CONTAINERS_URL = 'containers/';
var fs = require('fs');
var path = require('path');

var ORIG = '';
var DEST = '';

var ANDROID_DIR = 'Android';
var IOS_DIR = 'iOS';

IMAGE_EXTENSIONS = ['.bmp', '.png', '.jpg'];

var ORIG_FACTOR = 4;
var ANDROID_FOLDER_PREFIX = 'drawable-';

var ANDROID_FACTOR = [
    { name: 'xxxhdpi', factor: 4 },
    { name: 'xxhdpi', factor: 3 },
    { name: 'xhdpi', factor: 2 },
    { name: 'hdpi', factor: 1.5 },
    { name: 'nodpi', factor: 4 },
    { name: 'mdpi', factor: 1 },
    { name: 'ldpi', factor: 0.75 },
];

var IOS_FACTOR = [
    { name: '3x', factor: 3 },
    { name: '2x', factor: 2 },
    { name: '1x', factor: 1 },
];

if (process.argv.length <= 3) {
    console.log("Usage: node " + path.basename(__filename) + " ./orig ./dest");
    process.exit(-1);
} else {
    ORIG = path.resolve(process.argv[2]);
    DEST = path.resolve(process.argv[3]);
}

var getSize = function (path = '') {
    var size = { x: 0, y: 0 };
    var cmd = 'identify -format \'%wx%h\' ' + path;

    try {
        var out = execSync(cmd);

        var reg = /(\d+)x(\d+)/g;
        var arr = reg.exec(out);

        size.x = arr[1];
        size.y = arr[2];
    } catch (error) {
        return -1;
    }

    return size;
}

var resize = function (image) {
    var basename = path.basename(image, path.extname(image));
    var extname = path.extname(image);

    var size = getSize(path.join(ORIG, image));

    if (size == -1) return 0;

    var origPath = path.join(ORIG, image);

    //for Android
    if (ANDROID_FACTOR.length) {
        var dirPath = path.join(DEST, ANDROID_DIR);

        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }
    }

    for(var i = 0; i < ANDROID_FACTOR.length; i++) {
        var factor = ANDROID_FACTOR[i].factor / ORIG_FACTOR;
        var newWidth = Math.floor(size.x * factor);
        var newHeight = Math.floor(size.y * factor);

        var dirPath = path.join(DEST, ANDROID_DIR, ANDROID_FOLDER_PREFIX + ANDROID_FACTOR[i].name);
        var destPath = path.join(dirPath, image);
        
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }

        if (newWidth < 1) newWidth = 1;
        if (newHeight < 1) newHeight = 1;

        var cmd = 'convert ' + origPath +
            ' -resize ' + newWidth + 'x' + newHeight + '^' +
            ' -gravity center -crop ' + newWidth + 'x' + newHeight + '+0+0 ' +
            destPath;

        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
        });
    }

    //for iOS
    if (IOS_FACTOR.length) {
        var dirPath = path.join(DEST, IOS_DIR);

        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }
    }

    for(var i = 0; i < IOS_FACTOR.length; i++) {
        var factor = IOS_FACTOR[i].factor / ORIG_FACTOR;
        var newWidth = Math.floor(size.x * factor);
        var newHeight = Math.floor(size.y * factor);
        var newImage = basename + "@" + IOS_FACTOR[i].name + extname;

        var dirPath = path.join(DEST, IOS_DIR);
        var destPath = path.join(dirPath, newImage);
        
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath);
        }

        if (newWidth < 1) newWidth = 1;
        if (newHeight < 1) newHeight = 1;

        var cmd = 'convert ' + origPath +
            ' -resize ' + newWidth + 'x' + newHeight + '^' +
            ' -gravity center -crop ' + newWidth + 'x' + newHeight + '+0+0 ' +
            destPath;

        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
        });
    }


}

var listImages = function() {
    fs.readdir(ORIG, function(err, items) {
        if (err) { console.log(err); }
        for(var i = 0; i < items.length; i++) {
            var extname = path.extname(items[i]).toLowerCase();

            if(IMAGE_EXTENSIONS.includes(extname)) {
                resize(items[i]);
            }
        }
    });
}

exports.listImages = listImages();