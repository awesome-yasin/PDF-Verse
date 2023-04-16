let expect = require("chai").expect;
let fs     = require("fs");

let PDFImage = require("../").PDFImage;

describe("PDFImage", function () {
  let pdfPath = "/tmp/test.pdf";
  let pdfImage;
  let generatedFiles = [];
  this.timeout(7000);

  before(function(done){
    fs.createReadStream('tests/test.pdf').pipe(fs.createWriteStream(pdfPath));
    if (fs.existsSync(pdfPath)){
      done();
    } else {
      throw new Error({
        message: 'File missing at: '+ pdfPath + '. Copy task was not a success'
      });
    }
  });

  beforeEach(function() {
     pdfImage = new PDFImage(pdfPath)
  });

  it("should have correct basename", function () {
    expect(pdfImage.pdfFileBaseName).equal("test");
  });
  
  it("should set custom basename", function() {
    pdfImage.setPdfFileBaseName('custom-basename');
    expect(pdfImage.pdfFileBaseName).equal("custom-basename");
  });

  it("should return correct page path", function () {
    expect(pdfImage.getOutputImagePathForPage(1))
      .equal("/tmp/test-1.png");
    expect(pdfImage.getOutputImagePathForPage(2))
      .equal("/tmp/test-2.png");
    expect(pdfImage.getOutputImagePathForPage(1000))
      .equal("/tmp/test-1000.png");
    expect(pdfImage.getOutputImagePathForFile())
      .equal("/tmp/test.png");
  });

  it("should return correct convert command", function () {
    expect(pdfImage.constructConvertCommandForPage(1))
      .equal('convert "/tmp/test.pdf[1]" "/tmp/test-1.png"');
  });

  it("should return correct convert command to combine images", function () {
    expect(pdfImage.constructCombineCommandForFile(['/tmp/test-0.png', '/tmp/test-1.png']))
      .equal('convert -append /tmp/test-0.png /tmp/test-1.png "/tmp/test.png"');
  });

  it("should use gm when you ask it to", function () {
    pdfImage = new PDFImage(pdfPath, {graphicsMagick: true});
    expect(pdfImage.constructConvertCommandForPage(1))
      .equal('gm convert "/tmp/test.pdf[1]" "/tmp/test-1.png"');
  });

  // TODO: Do page updating test
  it("should convert PDF's page to a file with the default extension", function () {
    return new Promise(function(resolve, reject) {
      pdfImage.convertPage(1).then(function (imagePath) {
        expect(imagePath).equal("/tmp/test-1.png");
        expect(fs.existsSync(imagePath)).to.be.true;
        generatedFiles.push(imagePath);
        resolve();
      }).catch(function(err){
        reject(err);
      });
    });
  });

  it("should convert PDF's page 10 to a file with the default extension", function () {
    return new Promise(function(resolve, reject){
      pdfImage.convertPage(9).then(function (imagePath) {
        expect(imagePath).equal("/tmp/test-9.png");
        expect(fs.existsSync(imagePath)).to.be.true;
        generatedFiles.push(imagePath);
        resolve();
      }).catch(function(err){
        reject(err);
      });
    })
  });

  it("should convert PDF's page to file with a specified extension", function () {
    return new Promise(function(resolve, reject) {
      pdfImage.setConvertExtension("jpeg");
      pdfImage.convertPage(1).then(function (imagePath) {
        expect(imagePath).equal("/tmp/test-1.jpeg");
        expect(fs.existsSync(imagePath)).to.be.true;
        generatedFiles.push(imagePath);
        resolve();
      }).catch(function(err){
        reject(err);
      });
    });
  });

  it("should convert all PDF's pages to files", function () {
    return new Promise(function(resolve, reject) {
      pdfImage.convertFile().then(function (imagePaths) {
        imagePaths.forEach(function(imagePath){
          expect(fs.existsSync(imagePath)).to.be.true;
          generatedFiles.push(imagePath);
        });
        resolve();
      }).catch(function(err){
        reject(err);
      });
    });
  });

  it("should convert all PDF's pages to single image", function () {
    return new Promise(function(resolve, reject){
      let pdfImageCombined = new PDFImage(pdfPath, {
        combinedImage: true,
      });

      pdfImageCombined.convertFile().then(function (imagePath) {
        expect(imagePath).to.equal("/tmp/test.png");
        expect(fs.existsSync(imagePath)).to.be.true;
        generatedFiles.push(imagePath);
        resolve();
      }).catch(function (error) {
        reject(error);
      });
    })
  });

  it("should return # of pages", function () {
    return new Promise(function(resolve, reject) {
      pdfImage.numberOfPages().then(function (numberOfPages) {
        expect(parseInt(numberOfPages)).to.be.equal(10);
        resolve();
      }).catch(function(err){
        reject(err);
      });
    });
  });

  it("should construct convert options correctly", function () {
    pdfImage.setConvertOptions({
      "-density": 300,
      "-trim": null
    });
    expect(pdfImage.constructConvertOptions()).equal("-density 300 -trim");
  });

  afterEach(function(done){
    //cleanUp files generated during test
    let i = generatedFiles.length;
    if (i > 0 ){
      generatedFiles.forEach(function(filepath, index){
        fs.unlink(filepath, function(err) {
          i--;
          if (err) {
            done(err);
          } else if (i <= 0) {
            done();
          }
        });
      });
      generatedFiles = []; //clear after delete
    } else {
      done();
    }
  });

  after(function(done){
    //finaly - remove test.pdf from /tmp/
    fs.unlink(pdfPath, function(err) {
      if (err) {
        done(err);
      }
      done();
    });
  });
});
