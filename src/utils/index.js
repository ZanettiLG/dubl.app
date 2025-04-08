export function toArray(arrayBuffer) {
    if (!arrayBuffer) throw new Error("arrayBuffer is empty");
    const i8array = new Int8Array(arrayBuffer);
    return Array.from(i8array);
}

export function toBuffer(array) {
    if (!array) throw new Error("array is empty");
    const i8array = new Int8Array(array);
    return i8array.buffer;
}

export function toBuffers(arrays) {
    if (!arrays) throw new Error("arrays is empty");
    return arrays.map(array => toBuffer(array));
}

export function fixAudio(audioBuffer) {
    if (!audioBuffer) throw new Error("audioBuffer is empty");
    const length = Object.keys(audioBuffer).length;
    var newBuffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        newBuffer[i] = audioBuffer[i];
    }
    return newBuffer.buffer.slice(newBuffer.byteOffset, newBuffer.byteLength + newBuffer.byteOffset);
}

export function bufferToUrl(arrayBuffers, mimetype) {
    const buffers = arrayBuffers.map(buffer => fixAudio(buffer));
    const videoBlob = new Blob(buffers, { type: mimetype });
    return URL.createObjectURL(videoBlob);
}

export async function waitTime(time = 1000) {
    return await new Promise((resolve) => setTimeout(resolve, time))
}