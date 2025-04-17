// store/slices/ideas/ideasSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// Ajuste a importação abaixo se o seu RouteData estiver em outro lugar:
import { RouteData } from "../route/routeSlice";

export interface IdeasMediaItem {
  id?: string;
  title: string;
  description: string;
  type: "video" | "document" | "image"; // Tipo do item
  uploadType: "upload" | "link";        // Como o item será obtido
  platform?: "youtube" | "googledrive" | "onedrive" | "dropbox";
  url: string;                          // Pode ser uma URL ou um blob local (URL.createObjectURL)
  file?: File;                          // Presente se for upload
  isLocalFile?: boolean;
  originalName?: string;
  size?: number;
}

export interface IdeasSection {
  id?: string;
  title: string;
  description: string;
  items: IdeasMediaItem[]; // Lista de itens (vídeos, documentos ou imagens)
}

export interface IdeasPageData {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  sections: IdeasSection[]; // Lista de seções
  route?: RouteData;        // Rota associada, se existir
}

interface IdeasState {
  ideasData: IdeasPageData | null;
}

const initialState: IdeasState = {
  ideasData: null,
};

const ideasSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {
    setIdeasData: (state, action: PayloadAction<IdeasPageData>) => {
      state.ideasData = action.payload;
    },
    clearIdeasData: (state) => {
      state.ideasData = null;
    },
  },
});

export const { setIdeasData, clearIdeasData } = ideasSlice.actions;
export default ideasSlice.reducer;
