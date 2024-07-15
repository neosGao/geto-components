import * as htmlDocx from "html-docx-js-typescript";
import FileService from "@/geto-components/GetoUploadFile/components/fileService/index.js";
/**
 * 生成word
 */
export const generateWordFile = async (
  fileContent: string,
  title = "wordFile"
) => {
  const wordFile = await htmlDocx.asBlob(fileContent, {
    orientation: "portrait",
    margins: {
      top: 720,
      right: 720,
      bottom: 720,
      left: 720
    }
  });
  const file = new File([wordFile], `${title}.docx`, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });

  return file;

  // 导出
  // const url = window.URL.createObjectURL(file);
  // downloadFile(url, `${title}.docx`);
  // window.URL.revokeObjectURL(url);
};

export const uploadFile = async (file: File) => {
  const fileService = new FileService();
  const { success } = await fileService.startUploadSingleFile(file);
  if (!success) {
    return false;
  }
  const fileInfo = fileService.getFileInfo();
  return {
    fileID: fileInfo.fileID,
    fileName: fileInfo.name
  };
};

export const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
