/**
 * Resize and scale an image file in the browser
 * @param image an object of type File
 * @param maxDimension a number for the maximum height and/or width of the new image file
 * @author John Edwards
 * @example
 * // Feed an uploaded file and max dimensions. Function returns a Promise
 * imageResize(file, 850).then((newFile: any) => {
 *   file = newFile;
 * })
 *
 * //async/await
 * const newFile = await resizeImage(file, 850);
 * @returns Promise<File>
 */
export const imageResize = (image: File, maxDimension: number) => new Promise<File>((resolve, reject) => {
    makeImg(image).then((img: any) => {
        const newD = downscaleDimension(img, maxDimension);
        const canvas = document.createElement("canvas");
        canvas.width = newD.width;
        canvas.height = newD.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            reject();
            return;
        }
        ctx.drawImage(img, 0, 0, newD.width, newD.height);
        ctx.canvas.toBlob(blob => {
            // Null check
            if (!blob) {
                reject();
                return;
            }
            resolve(
                new File([blob], renameToJpg(image.name), {
                    type: "image/jpeg"
                })
            );
        }, "image/jpeg");
    });
});

/**
 * Create an HtmlImageElement and set its src to the file object url
 * @param image an object of type File
 * @example
 * //helper function used in resizeImage
 * @returns Promise<File>
 */
const makeImg = (image: File) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(image);
});

/**
 * Check image height and width against limit and resize accordingly
 * @param {Object} dimensions - object containing height and width numbers
 * @param {number} dimensions.height - image height.
 * @param {number} dimensions.width - image width.
 * @param limit - max dimension number
 * @example
 * //helper function used in resizeImage
 * @returns dimensions object
 */
const downscaleDimension = ({ height, width }: any, limit: number) => {
    if (height > width && height > limit) {
        return { height: limit, width: width * (limit / height) };
    } else if (width > height && width > limit) {
        return { height: height * (limit / width), width: limit };
    } else {
        return { height, width };
    }
};

/**
 * Convert file name into .jpg string
 * @param fname - the file name string to be converted
 * @example
 * //helper function used in resizeImage
 * @returns dimensions object
 */
const renameToJpg = (fname: string) => {
    const pos = fname.lastIndexOf(".");
    return fname.substr(0, pos < 0 ? fname.length : pos) + ".jpg";
};
