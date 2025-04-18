// store/routeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiAxios from "../../../config/axiosConfig";

export enum Type {
  Page = "page",
  Doc = "doc",
}

// Tipagem de cada rota vinda da API
export interface RouteData {
  id: string;  
  title: string;
  public: boolean;
  subtitle: string;
  path: string;
  idToFetch: string;
  entityType: string;
  description: string;
  entityId: string;
  type: Type;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// Estado global do slice
interface RouteState {
  routes: RouteData[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: RouteState = {
  routes: [],
  loading: false,
  error: null,
};

// Thunk para buscar as rotas dinamicamente da API
export const fetchRoutes = createAsyncThunk<RouteData[]>(
  "routes/fetchRoutes",
  async () => {
    const response = await apiAxios.get<RouteData[]>("/routes");
    return response.data;
  }
);

// Slice de rotas
const routeSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao buscar rotas.";
      });
  },
});

export default routeSlice.reducer;
