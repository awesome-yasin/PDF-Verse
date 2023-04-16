// node-pdf

var Promise = require("es6-promise").Promise;

var path = require("path");
var fs   = require("fs");
var util = require("util");
var exec = require("child_process").exec;

function PDFImage(pdfFilePath, options) {
  if (!options) options = {};

  this.pdfFilePath = pdfFilePath;

  this.setPdfFileBaseName(options.pdfFileBaseName);
  this.setConvertOptions(options.convertOptions);
  this.setConvertExtension(options.convertExtension);
  this.useGM = options.graphicsMagick || false;
  this.combinedImage = options.combinedImage || false;

  this.outputDirectory = options.outputDirectory || path.dirname(pdfFilePath);
}

PDFImage.prototype = {
  constructGetInfoCommand: function () {
    return util.format(
      "pdfinfo \"%s\"",
      this.pdfFilePath
    );
  },
  parseGetInfoCommandOutput: function (output) {
    var info = {};
    output.split("\n").forEach(function (line) {
      if (line.match(/^(.*?):[ \t]*(.*)$/)) {
        info[RegExp.$1] = RegExp.$2;
      }
    });
    return info;
  },
  getInfo: function () {
    var self = this;
    var getInfoCommand = this.constructGetInfoCommand();
    var promise = new Promise(function (resolve, reject) {
      exec(getInfoCommand, function (err, stdout, stderr) {
        if (err) {
          return reject({
            message: "Failed to get PDF'S information",
            error: err,
            stdout: stdout,
            stderr: stderr
          });
        }
        return resolve(self.parseGetInfoCommandOutput(stdout));
      });
    });
    return promise;
  },
  numberOfPages: function () {
    return this.getInfo().then(function (info) {
      return info["Pages"];
    });
  },
  getOutputImagePathForPage: function (pageNumber) {
    return path.join(
      this.outputDirectory,
      this.pdfFileBaseName + "-" + pageNumber + "." + this.convertExtension
    );
  },
  getOutputImagePathForFile: function () {
    return path.join(
      this.outputDirectory,
      this.pdfFileBaseName + "." + this.convertExtension
    );
  },
  setConvertOptions: function (convertOptions) {
    this.convertOptions = convertOptions || {};
  },
  setPdfFileBaseName: function(pdfFileBaseName) {
    this.pdfFileBaseName = pdfFileBaseName || path.basename(this.pdfFilePath, ".pdf");
  },
  setConvertExtension: function (convertExtension) {
    this.convertExtension = convertExtension || "png";
  },
  constructConvertCommandForPage: function (pageNumber) {
    var pdfFilePath = this.pdfFilePath;
    var outputImagePath = this.getOutputImagePathForPage(pageNumber);
    var convertOptionsString = this.constructConvertOptions();
    return util.format(
      "%s %s\"%s[%d]\" \"%s\"",
      this.useGM ? "gm convert" : "convert",
      convertOptionsString ? convertOptionsString + " " : "",
      pdfFilePath, pageNumber, outputImagePath
    );
  },
  constructCombineCommandForFile: function (imagePaths) {
    return util.format(
      "%s -append %s \"%s\"",
      this.useGM ? "gm convert" : "convert",
      imagePaths.join(' '),
      this.getOutputImagePathForFile()
    );
  },
  constructConvertOptions: function () {
    return Object.keys(this.convertOptions).sort().map(function (optionName) {
      if (this.convertOptions[optionName] !== null) {
        return optionName + " " + this.convertOptions[optionName];
      } else {
        return optionName;
      }
    }, this).join(" ");
  },
  combineImages: function(imagePaths) {
    var pdfImage = this;
    var combineCommand = pdfImage.constructCombineCommandForFile(imagePaths);
    return new Promise(function (resolve, reject) {
      exec(combineCommand, function (err, stdout, stderr) {
        if (err) {
          return reject({
            message: "Failed to combine images",
            error: err,
            stdout: stdout,
            stderr: stderr
          });
        }
        exec("rm "+imagePaths.join(' ')); //cleanUp
        return resolve(pdfImage.getOutputImagePathForFile());
      });
    });
  },
  convertFile: function () {
    var pdfImage = this;
    return new Promise(function (resolve, reject) {
      pdfImage.numberOfPages().then(function (totalPages) {
        var convertPromise = new Promise(function (resolve, reject){
          var imagePaths = [];
          for (var i = 0; i < totalPages; i++) {
            pdfImage.convertPage(i).then(function(imagePath){
              imagePaths.push(imagePath);
              if (imagePaths.length === parseInt(totalPages)){
                imagePaths.sort(); //because of asyc pages we have to reSort pages
                resolve(imagePaths);
              }
            }).catch(function(error){
              reject(error);
            });
          }
        });

        convertPromise.then(function(imagePaths){
          if (pdfImage.combinedImage){
            pdfImage.combineImages(imagePaths).then(function(imagePath){
              resolve(imagePath);
            });
          } else {
            resolve(imagePaths);
          }
        }).catch(function(error){
          reject(error);
        });
      });
    });
  },
  convertPage: function (pageNumber) {
    var pdfFilePath     = this.pdfFilePath;
    var outputImagePath = this.getOutputImagePathForPage(pageNumber);
    var convertCommand  = this.constructConvertCommandForPage(pageNumber);

    var promise = new Promise(function (resolve, reject) {
      function convertPageToImage() {
        exec(convertCommand, function (err, stdout, stderr) {
          if (err) {
            return reject({
              message: "Failed to convert page to image",
              error: err,
              stdout: stdout,
              stderr: stderr
            });
          }
          return resolve(outputImagePath);
        });
      }

      fs.stat(outputImagePath, function (err, imageFileStat) {
        var imageNotExists = err && err.code === "ENOENT";
        if (!imageNotExists && err) {
          return reject({
            message: "Failed to stat image file",
            error: err
          });
        }

        // convert when (1) image doesn't exits or (2) image exists
        // but its timestamp is older than pdf's one

        if (imageNotExists) {
          // (1)
          convertPageToImage();
          return;
        }

        // image exist. check timestamp.
        fs.stat(pdfFilePath, function (err, pdfFileStat) {
          if (err) {
            return reject({
              message: "Failed to stat PDF file",
              error: err
            });
          }

          if (imageFileStat.mtime < pdfFileStat.mtime) {
            // (2)
            convertPageToImage();
            return;
          }

          return resolve(outputImagePath);
        });
      });
    });
    return promise;
  }
};

exports.PDFImage = PDFImage;
