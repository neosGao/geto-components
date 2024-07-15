class HuaweiCloud {
  constructor() {
    this.ETag = [];
  }
  handelToXml() {
    let array = [...this.ETag];
    array.sort((a, b) => a.partNumber - b.partNumber);
    return array.length > 0
      ? `<CompleteMultipartUpload>${array.map(
          ({ Etag, partNumber}) =>
            `<Part><PartNumber>${partNumber}</PartNumber><ETag>${Etag.replaceAll(
              '"',
              "&quot;"
            )}</ETag></Part>`
        )}</CompleteMultipartUpload>`.replaceAll(",", "")
      : "";
  }
  beforeMerge({ item }) {
    const { headers, url, method } = item;
    return {
      isSendRequst: true,
      axiosConfig: {
        url,
        method,
        headers: {
          "x-obs-date": headers["x-obs-date"],
          Authorization: headers["Authorization"],
          "Content-Type": "application/xml",
        },
        data: this.handelToXml(),
      },
    };
  }
  beforeUpload({ item, file }) {
    const { Etag, headers, url, method, size, partNumber, start } = item;
    if (Etag) {
      this.ETag.push({ partNumber, Etag });
    }
    return {
      isSendRequst: !Etag,
      isNextSetp: !!Etag,
      axiosConfig: {
        headers: {
          Authorization: headers.Authorization,
          "Content-Type": headers["Content-Type"],
          "x-obs-date": headers["x-obs-date"],
        },
        url,
        method,
        data: file.slice(start || 0, (start || 0) + size),
      },
    };
  }
  afterUpload({ response, item }) {
    const { partNumber } = item;
    const {
      headers: { etag },
    } = response;
    this.ETag.push({ partNumber, Etag: etag });
  }
  afterConfirm({ response }) {
    const {
      data: { fileInfo, finish },
    } = response;
    return {
      success: finish,
      fileInfo: finish ? fileInfo : null,
    };
  }
  restet() {
    this.ETag = [];
  }
}

export default HuaweiCloud;
