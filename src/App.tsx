import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";

import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PageRenderer from "./components/PageRenderer/PageRenderer";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Event from "./pages/Event/Event";
import Login from "./pages/Login/Login";
import TeacherArea from "./pages/TeacherArea/TeacherArea";
import PageGalleryView from "./pages/PageView/ImagePageView/ImagePageView";

import MeditationListPage from "./components/Adm/PageMeditadion/MeditationListPage";
import MeditationPageCreator from "./components/Adm/PageCreator/Templates/MeditationPageCreator/MeditationPageCreator";
import ImagePageCreator from "./components/Adm/PageCreator/Templates/ImagePageCreator/ImagePageCreator";
import VideoPageCreator from "./components/Adm/PageCreator/Templates/VideoPageCreator/VideoPageCreator";
import WeekMaterialPageCreator from "./components/Adm/PageCreator/Templates/WeekMaterialPageCreator/WeekMaterialPageCreator";
import SelecPageTemplate from "./components/Adm/PageCreator/SelectPageTemplate/SelecPageTemplate";

import AdminDashboardPage from "./components/Adm/AdminDashboardPage";
import AdminLayout from "./components/Adm/AdminLayout/AdminLayout";

import { fetchRoutes, RouteData as DynamicRouteType } from "./store/slices/route/routeSlice";
import { fetchCurrentUser } from "./store/slices/auth/authSlice";
import { RootState as RootStateType, AppDispatch as AppDispatchType } from "./store/slices";

import "./styles/Global.css";
import WeekMaterialListPage from "components/Adm/PageWeekMaterial/WeekMaterialListPage";
import ImagePageListPage from "components/Adm/PageImage/ImagePageListPage";
import VideoPageListPage from "components/Adm/PageVideos/VideoPageListPage";
import CommentsListPage from "components/Adm/PageComments/CommentsListPage";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const dynamicRoutes = useSelector((state: RootStateType) => state.routes.routes);
  const { loadingUser, accessToken } = useSelector((state: RootStateType) => state.auth);

  // Carrega rotas dinâmicas e verifica usuário ao iniciar
  useEffect(() => {
    dispatch(fetchRoutes());
    if (accessToken) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, accessToken]);

  // Exibe spinner durante o carregamento inicial do usuário
  if (loadingUser) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f0f0f0",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <div className="mainContainer">
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/eventos" element={<Event />} />
          <Route path="/feed-clubinho" element={<PageGalleryView />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />

          {/* Rotas protegidas (qualquer usuário logado) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/area-do-professor" element={<TeacherArea />} />
          </Route>

          {/* Rotas administrativas (apenas admin) */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/adm" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="meditacoes" element={<MeditationListPage />} />
              <Route path="comentarios" element={<CommentsListPage />} />

              <Route path="paginas-materiais-semanais" element={<WeekMaterialListPage />} />
              <Route path="paginas-fotos" element={<ImagePageListPage />} />              
              <Route path="paginas-videos" element={<VideoPageListPage />} />

              <Route path="criar-pagina" element={<SelecPageTemplate />} />
              <Route
                path="editar-meditacao"
                element={<MeditationPageCreator fromTemplatePage={false} />}
              />
              <Route
                path="editar-pagina-fotos"
                element={<ImagePageCreator fromTemplatePage={false} />}
              />
              <Route
                path="editar-pagina-videos"
                element={<VideoPageCreator fromTemplatePage={false} />}
              />
              <Route
                path="editar-pagina-semana"
                element={<WeekMaterialPageCreator fromTemplatePage={false} />}
              />
            </Route>
          </Route>

          {/* Rotas dinâmicas da API */}
          {dynamicRoutes.map((route: DynamicRouteType) => (
            <Route
              key={route.id}
              path={`/${route.path}`}
              element={<PageRenderer entityType={route.entityType} idToFetch={route.idToFetch} />}
            />
          ))}
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;

/* 
  Sugestão futura: centralizar rotas em um array para facilitar manutenção
  const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/sobre", element: <About /> },
    // ...
  ];
  const protectedRoutes = [
    { path: "/area-do-professor", element: <TeacherArea /> },
  ];
  const adminRoutes = [
    { path: "/adm", element: <AdminLayout />, children: [...] },
  ];
*/