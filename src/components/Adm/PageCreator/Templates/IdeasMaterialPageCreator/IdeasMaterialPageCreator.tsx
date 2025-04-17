// components/IdeasMaterialPageCreator.tsx

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/slices"; // Ajuste o path conforme sua pasta store
import { fetchRoutes } from "store/slices/route/routeSlice"; // Ajuste se necessário
import {
  clearIdeasData,
  IdeasSection,
  IdeasPageData,
} from "store/slices/ideas/ideasSlice";
import api from "config/axiosConfig"; // Ajuste se necessário
import { IdeasMaterialSectionDialog } from "./IdeasMaterialSectionDialog";


interface PageCreatorProps {
  fromTemplatePage?: boolean;
}

export function IdeasMaterialPageCreator({ fromTemplatePage }: PageCreatorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const ideasData = useSelector((state: RootState) => state.ideas.ideasData);

  // Campos básicos da página
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");

  // Seções
  const [sections, setSections] = useState<IdeasSection[]>([]);

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  // Diálogo de criação/edição de seção
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // Erros de formulário
  const [errors, setErrors] = useState({
    title: false,
    subtitle: false,
    description: false,
  });

  // Efeito: se vier de um template, limpa os dados; senão carrega os dados do redux
  useEffect(() => {
    if (fromTemplatePage) {
      dispatch(clearIdeasData());
      setPageTitle("");
      setPageSubtitle("");
      setPageDescription("");
      setSections([]);
    }
  }, [fromTemplatePage, dispatch]);

  useEffect(() => {
    if (!fromTemplatePage && ideasData) {
      setPageTitle(ideasData.title || "");
      setPageSubtitle(ideasData.subtitle || "");
      setPageDescription(ideasData.description || "");
      setSections(ideasData.sections || []);
    }
  }, [fromTemplatePage, ideasData]);

  // Excluir seção
  const handleDeleteSectionClick = (index: number) => {
    setSectionToDelete(index);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete !== null) {
      setSections((prev) => prev.filter((_, i) => i !== sectionToDelete));
      setSectionToDelete(null);
    }
    setOpenDeleteDialog(false);
  };

  // Abrir diálogo de criação de seção
  const handleOpenSectionDialog = (index: number | null = null) => {
    setEditingSectionIndex(index);
    setOpenSectionDialog(true);
  };

  // Fechar diálogo de seção
  const handleCloseSectionDialog = () => {
    setOpenSectionDialog(false);
    setEditingSectionIndex(null);
  };

  // Salvar dados da seção (novo ou edição)
  const handleSaveSection = (newSection: IdeasSection) => {
    if (editingSectionIndex !== null) {
      // Editando
      setSections((prev) =>
        prev.map((s, idx) => (idx === editingSectionIndex ? newSection : s))
      );
    } else {
      // Novo
      setSections((prev) => [...prev, newSection]);
    }
    handleCloseSectionDialog();
  };

  // Validar campos obrigatórios antes de salvar a página
  const handleSavePage = async () => {
    const hasError =
      !pageTitle || !pageSubtitle || !pageDescription || sections.length === 0;

    setErrors({
      title: !pageTitle,
      subtitle: !pageSubtitle,
      description: !pageDescription,
    });

    if (hasError) {
      setSnackbar({
        open: true,
        message:
          "Preencha todos os campos obrigatórios e adicione pelo menos uma seção.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Monta o payload
      const formData = new FormData();
      const payload: Partial<IdeasPageData> = {
        ...(fromTemplatePage ? {} : { id: ideasData?.id }),
        title: pageTitle,
        subtitle: pageSubtitle,
        description: pageDescription,
        sections,
      };

      formData.append("weekMaterialsPageData", JSON.stringify(payload));

      // Anexa arquivos de cada seção
      sections.forEach((section, sectionIndex) => {
        section.items.forEach((item, itemIndex) => {
          if (item.uploadType === "upload" && item.file) {
            const extension = item.file.name.split(".").pop() || "bin";
            const filename = `section_${sectionIndex}_item_${itemIndex}.${extension}`;
            formData.append(filename, item.file, filename);
          }
        });
      });

      // Se for criar nova página
      let res;
      if (fromTemplatePage) {
        res = await api.post("/ideas-pages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Se for edição
        res = await api.patch(`/ideas-pages/${ideasData?.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (!res?.data) {
        throw new Error("Erro ao salvar");
      }

      // Atualiza rotas se for necessário
      await dispatch(fetchRoutes());

      setSnackbar({
        open: true,
        message: "Página salva com sucesso!",
        severity: "success",
      });

      // Navega para a rota retornada pelo backend (se existir)
      if (res.data.route?.path) {
        navigate(`/${res.data.route.path}`);
      }
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setSnackbar({
        open: true,
        message: "Erro ao salvar a página.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        m: 0,
        mt: fromTemplatePage ? 0 : 10,
        width: "98%",
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      <Typography
        variant="h3"
        mb={3}
        fontWeight="bold"
        textAlign="center"
        sx={{
          mt: { xs: 0, md: 0 },
          mb: { xs: 1, md: 3 },
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        {fromTemplatePage ? "Adicionar página de ideias" : "Editar página de ideias"}
      </Typography>

      <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        <TextField
          label="Título da Página"
          fullWidth
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          error={errors.title}
          helperText={errors.title ? "Campo obrigatório" : ""}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Subtítulo da Página"
          fullWidth
          value={pageSubtitle}
          onChange={(e) => setPageSubtitle(e.target.value)}
          error={errors.subtitle}
          helperText={errors.subtitle ? "Campo obrigatório" : ""}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descrição da Página"
          fullWidth
          multiline
          rows={3}
          value={pageDescription}
          onChange={(e) => setPageDescription(e.target.value)}
          error={errors.description}
          helperText={errors.description ? "Campo obrigatório" : ""}
        />
      </Box>

      <Typography variant="h5" mb={2} fontWeight="bold" textAlign="center">
        Seções
      </Typography>

      {sections.map((section, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{ mb: 3, p: 2, position: "relative" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {section.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {section.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {section.items.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  padding: 1,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  minWidth: "120px",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  ({item.type})
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleOpenSectionDialog(index)}
            >
              Editar
            </Button>
            <IconButton
              color="error"
              onClick={() => handleDeleteSectionClick(index)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}

      <Box textAlign="center" mt={4}>
        <Button variant="outlined" onClick={() => handleOpenSectionDialog(null)}>
          Adicionar Seção
        </Button>
      </Box>

      <Box textAlign="center" mt={6}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSavePage}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
        >
          {loading ? "Salvando..." : "Salvar Página"}
        </Button>
      </Box>

      {/* Diálogo para confirmar exclusão da Seção */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta seção?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteSection} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Criação/Edição de Seção */}
      {openSectionDialog && (
        <IdeasMaterialSectionDialog
          open={openSectionDialog}
          onClose={handleCloseSectionDialog}
          section={
            editingSectionIndex !== null
              ? sections[editingSectionIndex]
              : {
                  title: "",
                  description: "",
                  items: [],
                }
          }
          onSave={handleSaveSection}
        />
      )}

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
