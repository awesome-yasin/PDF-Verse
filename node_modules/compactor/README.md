# compactor

Compress pdf and img on browser.

`npm i compactor` or `yarn add compactor`

Demo page: [Demo Page](https://tt-p.github.io/compactor-demo/)

Example project with react: [Example Project](https://github.com/tt-p/compactor-demo)

## Usage

### compressFile args

`compressFile = (inputFile, callbackFunc, options) => {...}`
#### example inputFile
```js
const base64StringWithPrefix = "data:image/jpeg;base64,/9j/4AAQSkZ...";
const base64StringWithoutPrefix = "/9j/4AAQSkZ...";

const inputFile = {
    bytes: base64StringWithoutPrefix, // remove prefix before use
    fileName: "example_image.jpeg",
    fileSize: 102400,
    mimeType: "image/jpeg"
}
```
#### example callbackFunc
```js
const [compressedFile, setCompressedFile] = useState(null);

const callbackFunc = (file) => {
    setCompressedFile(file);
}
```
#### example options
```js
const options = {
    pageScale: 1.0,   // use between 0-2
    pageQuality: 0.75 // use between 0-1
}
```
#### function call
```js
import {compressFile} from "compactor";

await compressFile(inputFile, callbackFunc, options);
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details