import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { WeekMediaItem } from "store/slices/week-material/weekMaterialSlice";
import { validateMediaURL } from "utils/validateMediaURL"; // ✅ Função utilitária

interface Props {
  audios: WeekMediaItem[];
  setAudios: (a: WeekMediaItem[]) => void;
}

export default function WeekAudios({ audios, setAudios }: Props) {
  const [newAudio, setNewAudio] = useState<WeekMediaItem>({
    title: "",
    description: "",
    type: "link",
    platform: "googledrive",
    url: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState({ title: false, description: false, url: false });
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setNewAudio((prev) => ({ ...prev, url, file }));
  };

  const handleAddOrEdit = () => {
    const isValidURL = newAudio.type === "upload" || validateMediaURL(newAudio.url, newAudio.platform);
    const hasError = !newAudio.title || !newAudio.description || !newAudio.url || !isValidURL;

    setErrors({
      title: !newAudio.title,
      description: !newAudio.description,
      url: !newAudio.url || !isValidURL,
    });

    if (hasError) return;

    const updated = [...audios];
    if (editIndex !== null) {
      updated[editIndex] = newAudio;
      setAudios(updated);
      setEditIndex(null);
    } else {
      setAudios([...audios, newAudio]);
    }

    setNewAudio({ title: "", description: "", type: "link", platform: "googledrive", url: "" });
    setErrors({ title: false, description: false, url: false });
  };

  const handleEdit = (index: number) => {
    setNewAudio(audios[index]);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    setConfirmDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (confirmDeleteIndex !== null) {
      const updated = audios.filter((_, i) => i !== confirmDeleteIndex);
      setAudios(updated);
      setConfirmDeleteIndex(null);
    }
  };

  return (
    <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título do Áudio"
            fullWidth
            value={newAudio.title}
            onChange={(e) => setNewAudio({ ...newAudio, title: e.target.value })}
            error={errors.title}
            helperText={errors.title ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descrição"
            fullWidth
            value={newAudio.description}
            onChange={(e) => setNewAudio({ ...newAudio, description: e.target.value })}
            error={errors.description}
            helperText={errors.description ? "Campo obrigatório" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              value={newAudio.type}
              onChange={(e) => {
                const newType = e.target.value as "upload" | "link";
                setNewAudio({
                  ...newAudio,
                  type: newType,
                  platform: newType === "link" ? "googledrive" : undefined,
                  url: "",
                  file: undefined,
                });
              }}
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {newAudio.type === "link" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Origem</InputLabel>
                <Select
                  value={newAudio.platform || ""}
                  label="Origem"
                  onChange={(e) =>
                    setNewAudio({
                      ...newAudio,
                      platform: e.target.value as WeekMediaItem["platform"],
                    })
                  }
                >
                  <MenuItem value="googledrive">Google Drive</MenuItem>
                  <MenuItem value="onedrive">OneDrive</MenuItem>
                  <MenuItem value="dropbox">Dropbox</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="URL do Áudio"
                fullWidth
                value={newAudio.url}
                onChange={(e) => setNewAudio({ ...newAudio, url: e.target.value })}
                error={errors.url}
                helperText={errors.url ? "URL inválida ou obrigatória" : ""}
              />
            </Grid>
          </>
        )}

        {newAudio.type === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Áudio MP3
              <input type="file" hidden accept="audio/mp3" onChange={handleUpload} />
            </Button>
            {newAudio.file && (
              <Typography variant="body2" mt={1}>
                Arquivo selecionado: {newAudio.file.name}
              </Typography>
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleAddOrEdit}>
            {editIndex !== null ? "Atualizar Áudio" : "Adicionar Áudio"}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={4}>
        {audios.map((audio, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box border={1} borderRadius={2} p={2} position="relative">
              <Typography fontWeight="bold">{audio.title}</Typography>
              <Typography variant="body2" mb={1}>{audio.description}</Typography>
              <audio controls style={{ width: "100%", marginTop: 8 }}>
                <source src={audio.url} type="audio/mp3" />
                Seu navegador não suporta áudio.
              </audio>
              <Box position="absolute" top={8} right={8} display="flex" gap={1}>
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remover">
                  <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={confirmDeleteIndex !== null} onClose={() => setConfirmDeleteIndex(null)}>
        <DialogTitle>Confirmar remoção do áudio?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteIndex(null)}>Cancelar</Button>
          <Button color="error" onClick={confirmDelete}>
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
