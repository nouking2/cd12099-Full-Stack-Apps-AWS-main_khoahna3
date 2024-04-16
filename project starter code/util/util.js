import axios from 'axios';
import fs from 'fs';
import Jimp from 'jimp';

const TMP_DIR = "/tmp/";
const BASE_FILENAME = "filtered.";
const IMAGE_WIDTH = 256;
const IMAGE_HEIGHT = 256;
const IMAGE_QUALITY = 60;

// helper function to download, filter, and save the filtered image locally
export async function filterImageFromURL(inputURL) {
    try {
        const { data: imageBuffer } = await axios.get(inputURL, { responseType: 'arraybuffer' });
        const photo = await Jimp.read(imageBuffer);
        const outPath = `${TMP_DIR}${BASE_FILENAME}${Math.floor(Math.random() * 2000)}.jpg`;

        await photo
            .resize(IMAGE_WIDTH, IMAGE_HEIGHT)
            .quality(IMAGE_QUALITY)
            .greyscale()
            .writeAsync(outPath);

        return outPath;
    } catch (error) {
        console.error("Failed to process image:", error);
        throw new Error('Failed to process image');
    }
}

// helper function to delete files on the local disk
export async function deleteLocalFiles(files) {
    for (const file of files) {
        try {
            await fs.promises.unlink(file);
        } catch (error) {
            console.error(`Failed to delete file ${file}:`, error);
        }
    }
}