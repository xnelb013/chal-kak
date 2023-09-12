import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  imageIdsState,
  imageInfoState,
  uploadedImageFilesState,
  uploadedImageUrlsState,
  deleteImageIdsState,
} from "../../utils/atoms";
import { useRouter } from "next/router";

const ImageUpload = () => {
  const [uploadedImageFiles, setUploadedImageFiles] = useRecoilState(uploadedImageFilesState);
  const [, setUploadedImageUrls] = useRecoilState(uploadedImageUrlsState);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageInfo] = useRecoilState(imageInfoState);
  const [, setImageIds] = useRecoilState(imageIdsState);
  const [, setDeleteImageIds] = useRecoilState(deleteImageIdsState);

  const userouter = useRouter();

  const handleDeleteClick = (index: number) => {
    // const urlToRevoke = previews[index];
    // URL.revokeObjectURL(urlToRevoke);

    let idToDelete: number | undefined = undefined;
    // 삭제할 이미지의 아이디 찾기
    if (userouter.query.id && imageInfo[index]) {
      idToDelete = imageInfo[index].id;
    }

    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setUploadedImageFiles((prevImages) => prevImages.filter((_, i) => i !== index));
    setUploadedImageUrls((prevImages) => prevImages.filter((_, i) => i !== index));
    if (idToDelete !== undefined) {
      setImageIds((prevImageIds) => prevImageIds.filter((id) => id !== idToDelete));
      setDeleteImageIds((prevDeleteImageId) => [...prevDeleteImageId, idToDelete as number]);
    }
  };

  const handleAddImageButtonClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (uploadedImageFiles.length > 6) {
      alert("최대 6개의 이미지만 등록 가능합니다!");
      e.preventDefault();
    }
  };

  useEffect(() => {
    const urls = imageInfo.map((info) => info.url);
    setPreviews(urls);
  }, [imageInfo]);

  const handleImageChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const files = e.target.files;

      if (files) {
        let fileArray = Array.from(files);

        //이미지 파일 형식확인
        for (let i = 0; i < fileArray.length; i++) {
          const fileType = fileArray[i].type;
          if (fileType !== "image/jpeg" && fileType !== "image/png") {
            alert("jpg, png파일만 업로드 가능합니다");
            return;
          }
        }

        // 이미지 개수확인
        if (fileArray.length + previews.length > 6) {
          alert("최대 6개의 이미지만 등록 가능합니다!");
          fileArray = fileArray.slice(0, Math.max(0, 6 - previews.length));
        }

        //blob url 생성
        const imageURLs = fileArray.map((file) => URL.createObjectURL(file));
        setPreviews((prevPreviews) => [...prevPreviews, ...imageURLs]);

        // Recoil 상태 업데이트
        setUploadedImageFiles((prevImages) => [...prevImages, ...fileArray]);
        // blob url
        setUploadedImageUrls((prevUrls) => [...prevUrls, ...imageURLs]);
      }

      e.target.value = "";
    },
    [uploadedImageFiles],
  );

  return (
    <div>
      <div className="flex overflow-auto mt-5">
        {previews.map((preview, index) => (
          <div key={index} className="h-[300px] w-[230px] mr-3 relative flex-shrink-0 ">
            <img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full mr-3 rounded-lg" />
            <button
              onClick={() => handleDeleteClick(index)}
              className="absolute top-3 right-3 text-sm text-slate-800 w-5 h-5 rounded-full bg-slate-100"
            >
              X
            </button>
          </div>
        ))}
        <input
          type="file"
          id="file-input"
          onChange={handleImageChange}
          accept=".jpg, .png"
          multiple
          className="hidden"
        />
        <label
          htmlFor="file-input"
          onClick={handleAddImageButtonClick}
          className="btn h-[300px] w-[230px] flex-shrink-0"
        >
          <p className=" text-5xl font-light">+</p>
        </label>
      </div>
      {previews.length === 0 && <p className="text-red-600 text-xs mt-1 ml-1">한 장 이상 업로드 해주세요.</p>}
      <p className=" text-gray-600 text-xs mt-1 ml-1">최대 6장까지 업로드 가능합니다.</p>
    </div>
  );
};

export default ImageUpload;
