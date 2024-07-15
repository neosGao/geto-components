import Sha1 from "./sha1";
function getEtag(buffer) {
  // 以4M为单位分割
  const blockSize = 4 * 1024 * 1024;
  const sha1String = [];
  let prefix = 0x16;
  let blockCount = 0;

  const bufferSize = buffer.size || buffer.length || buffer.byteLength;
  blockCount = Math.ceil(bufferSize / blockSize);

  for (let i = 0; i < blockCount; i++) {
    sha1String.push(
      new Sha1(true)
        .update(buffer.slice(i * blockSize, (i + 1) * blockSize))
        .digest()
    );
  }
  function concatArr2Uint8(s) {
    //Array 2 Uint8Array
    let tmp = [];
    for (const i of s) tmp = tmp.concat(i);
    return new Uint8Array(tmp);
  }
  function Uint8ToBase64(u8Arr, urisafe) {
    //Uint8Array 2 Base64
    const CHUNK_SIZE = 0x8000; //arbitrary number
    let index = 0;
    const length = u8Arr.length;
    let result = "";
    let slice;
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return urisafe
      ? btoa(result).replace(/\//g, "_").replace(/\+/g, "-")
      : btoa(result);
  }
  function calcEtag() {
    if (!sha1String.length) return "Fto5o-5ea0sNMlW_75VgGJCv2AcJ";
    let sha1Buffer = concatArr2Uint8(sha1String);
    // 如果大于4M，则对各个块的sha1结果再次sha1
    if (blockCount > 1) {
      prefix = 0x96;
      sha1Buffer = new Sha1(true).update(sha1Buffer.buffer).digest();
    } else {
      sha1Buffer = Array.apply([], sha1Buffer);
    }
    sha1Buffer = concatArr2Uint8([[prefix], sha1Buffer]);
    return Uint8ToBase64(sha1Buffer, true);
  }
  return calcEtag();
}
export default getEtag;
