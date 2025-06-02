import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FileDataType = {
    fileName: string;
    fileUrl: string;
};

interface FileStore {
    fileData: FileDataType[];
    isDataLoaded: boolean;
    setFileData: (data: FileDataType) => void;
    setMultipleFileData: (data: FileDataType[]) => void; // Add this
    resetFileData: () => void;
  }
export const useFileStore = create<FileStore>()(
    persist(
      (set) => ({
          fileData: [],
          isDataLoaded: false,
          setFileData: (data: FileDataType) => set((state) => ({
              fileData: [...state.fileData, data],
              isDataLoaded: true
          })),
          setMultipleFileData: (data: FileDataType[]) => set((state) => ({
              fileData: [...state.fileData, ...data],
              isDataLoaded: true
          })),
          resetFileData: () => set({ fileData: [], isDataLoaded: false }),
      }),
      {
        name: "file-storage",
      }
    )
  );