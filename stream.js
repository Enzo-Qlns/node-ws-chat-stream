const fs = require('fs');
const { Transform } = require('stream');

/**
 * Transform stream that converts text to uppercase
 * @extends Transform
 * @description This transform stream processes chunks of text and converts them to uppercase
 * before passing them to the next stream in the pipeline.
 */
const uppercaseTransform = new Transform({
    /**
     * Transforms the input chunk to uppercase
     * @param {Buffer} chunk - The data chunk to transform
     * @param {string} encoding - The encoding of the chunk
     * @param {Function} callback - Callback to signal completion
     */
    transform(chunk, encoding, callback) {
        // Convert the chunk to uppercase
        const uppercaseChunk = chunk.toString().toUpperCase();
        this.push(uppercaseChunk);
        callback();
    }
});

/**
 * Copies a file while transforming its content to uppercase
 * @param {string} sourcePath - Path to the source file
 * @param {string} destinationPath - Path where the transformed file will be saved
 * @throws {Error} If the source file doesn't exist or if there are read/write errors
 * @description This function creates a pipeline that reads the source file,
 * transforms its content to uppercase, and writes the result to the destination file.
 * It uses Node.js streams for efficient memory usage with large files.
 */
function copyAndTransformFile(sourcePath, destinationPath) {
    // Create read and write streams
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destinationPath);

    // Error handling
    readStream.on('error', (err) => {
        console.error('Error while reading:', err);
    });

    writeStream.on('error', (err) => {
        console.error('Error while writing:', err);
    });

    // Create the pipeline: read -> transform -> write
    readStream
        .pipe(uppercaseTransform)
        .pipe(writeStream)
        .on('finish', () => {
            console.log('Copy and transformation completed successfully!');
        });
}

// Example usage
const sourceFile = 'input.txt';
const destinationFile = 'output.txt';

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
    console.error(`The file ${sourceFile} does not exist.`);
    process.exit(1);
}

console.log('Starting copy and transformation...');
copyAndTransformFile(sourceFile, destinationFile); 