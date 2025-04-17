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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { IdeasSection, IdeasMediaItem } from "store/slices/ideas/ideasSlice";

// Componente IdeasMaterialSection
interface SectionProps {
  section: IdeasSection;
  setSection: (section: IdeasSection) => void;
  addSection: () => void;
}

export function IdeasMaterialSection({ section, setSection, addSection }: SectionProps) {
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [deleteMediaIndex, setDeleteMediaIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    sectionTitle: false,
    sectionDescription: false,
  });

  const handleAddMedia = () => {
    setShowMediaForm(true);
    // Media form will be implemented in a future iteration
  };

  const handleDeleteMedia = (index: number) => {
    setDeleteMediaIndex(index);
  };

  const confirmDeleteMedia = () => {
    if (deleteMediaIndex !== null) {
      const updatedItems = section.items.filter((_, i) => i !== deleteMediaIndex);
      setSection({ ...section, items: updatedItems });
      setDeleteMediaIndex(null);
    }
  };

  const validateSection = () => {
    const hasError = !section.title || !section.description;
    setErrors({
      sectionTitle: !section.title,
      sectionDescription: !section.description,
    });
    return !hasError;
  };

  const handleAddSection = () => {
    if (validateSection()) {
      addSection();
    }
  };

  return (
    <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto", border: "1px solid #ddd", p: 2, borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>
        Nova Seção
      </Typography>
      <TextField
        label="Título da Seção"
        fullWidth
        value={section.title}
        onChange={(e) => setSection({ ...section, title: e.target.value })}
        error={errors.sectionTitle}
        helperText={errors.sectionTitle ? "Campo obrigatório" : ""}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Descrição da Seção"
        fullWidth
        multiline
        rows={3}
        value={section.description}
        onChange={(e) => setSection({ ...section, description: e.target.value })}
        error={errors.sectionDescription}
        helperText={errors.sectionDescription ? "Campo obrigatório" : ""}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle1" mt={2} mb={1}>
        Itens de Mídia
      </Typography>
      {section.items.map((item, index) => (
        <Box
          key={index}
          sx={{ display: "flex", alignItems: "center", p: 1, border: "1px solid #eee", borderRadius: 1, mb: 1 }}
        >
          <Typography flexGrow={1}>
            {item.title} ({item.type})
          </Typography>
          <IconButton onClick={() => handleDeleteMedia(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button variant="outlined" fullWidth onClick={handleAddMedia} sx={{ mt: 2 }}>
        Adicionar Item de Mídia
      </Button>

      {showMediaForm && (
        <Box sx={{ mt: 2, p: 2, border: "1px dashed #ddd", borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            [Formulário de mídia será implementado aqui]
          </Typography>
        </Box>
      )}

      <Button variant="contained" fullWidth onClick={handleAddSection} sx={{ mt: 2 }}>
        Adicionar Seção
      </Button>

      <Dialog open={deleteMediaIndex !== null} onClose={() => setDeleteMediaIndex(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este item de mídia?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMediaIndex(null)}>Cancelar</Button>
          <Button onClick={confirmDeleteMedia} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}