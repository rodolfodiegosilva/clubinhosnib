// components/IdeasMaterialSectionDialog.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { IdeasSection, IdeasMediaItem } from "store/slices/ideas/ideasSlice";
import { IdeasMaterialDocuments } from "./IdeasMaterialDocuments";
import { IdeasMaterialImages } from "./IdeasMaterialImages";
import { IdeasVideos } from "./IdeasMaterialVideos";

interface IdeasMaterialSectionDialogProps {
  open: boolean;
  onClose: () => void;
  section: IdeasSection;            // Se já existe, passamos para edição
  onSave: (section: IdeasSection) => void;
}

export function IdeasMaterialSectionDialog({
  open,
  onClose,
  section: initialSection,
  onSave,
}: IdeasMaterialSectionDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<IdeasMediaItem[]>([]);

  const [tabIndex, setTabIndex] = useState(0);

  // Carrega dados quando o diálogo abre
  useEffect(() => {
    if (open) {
      setTitle(initialSection.title || "");
      setDescription(initialSection.description || "");
      setItems(initialSection.items || []);
      setTabIndex(0);
    }
  }, [open, initialSection]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Ao clicar em salvar
  const handleSaveSection = () => {
    if (!title || !description) {
      return;
    }

    // Monta a seção atualizada
    const updatedSection: IdeasSection = {
      ...initialSection,
      title,
      description,
      items,
    };

    onSave(updatedSection);
  };

  // Helpers para adicionar itens específicos
  // Podemos reutilizar a mesma lista de items e filtrar nos subcomponentes
  const handleDocumentsChange = (docs: IdeasMediaItem[]) => {
    // Remove itens que não sejam documentos e concatena
    const otherItems = items.filter((i) => i.type !== "document");
    setItems([...otherItems, ...docs]);
  };

  const handleImagesChange = (imgs: IdeasMediaItem[]) => {
    const otherItems = items.filter((i) => i.type !== "image");
    setItems([...otherItems, ...imgs]);
  };

  const handleVideosChange = (vids: IdeasMediaItem[]) => {
    const otherItems = items.filter((i) => i.type !== "video");
    setItems([...otherItems, ...vids]);
  };

  // Filtra os itens por tipo
  const documents = items.filter((i) => i.type === "document");
  const images = items.filter((i) => i.type === "image");
  const videos = items.filter((i) => i.type === "video");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {initialSection?.id ? "Editar Seção" : "Adicionar Seção"}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Título da Seção"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descrição da Seção"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Itens de Mídia
        </Typography>

        <Tabs value={tabIndex} onChange={handleChangeTab} sx={{ mb: 2 }}>
          <Tab label="Documentos" />
          <Tab label="Imagens" />
          <Tab label="Vídeos" />
        </Tabs>

        {/* Conteúdos de cada aba */}
        {tabIndex === 0 && (
          <IdeasMaterialDocuments
            documents={documents}
            setDocuments={handleDocumentsChange}
          />
        )}
        {tabIndex === 1 && (
          <IdeasMaterialImages
            images={images}
            setImages={handleImagesChange}
          />
        )}
        {tabIndex === 2 && (
          <IdeasVideos
            videos={videos}
            setVideos={handleVideosChange}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSaveSection}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
