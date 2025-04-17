// components/IdeasVideos.tsx

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { IdeasMediaItem } from "store/slices/ideas/ideasSlice";
import { validateMediaURL } from "utils/validateMediaURL";

interface VideosProps {
  videos: IdeasMediaItem[];
  setVideos: (videos: IdeasMediaItem[]) => void;
}

export function IdeasVideos({ videos, setVideos }: VideosProps) {
  const [tempVideo, setTempVideo] = useState<IdeasMediaItem>({
    title: "",
    description: "",
    type: "video",
    uploadType: "link",
    url: "",
    platform: "youtube",
  });
  const [fileName, setFileName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    url: false,
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const objectURL = URL.createObjectURL(file);
    setTempVideo((prev) => ({ ...prev, url: objectURL, file }));
  };

  const resetForm = () => {
    setTempVideo({
      title: "",
      description: "",
      type: "video",
      uploadType: "link",
      url: "",
      platform: "youtube",
    });
    setFileName("");
    setEditingIndex(null);
    setErrors({ title: false, description: false, url: false });
  };

  const handleAddOrUpdate = () => {
    const isValid =
      tempVideo.uploadType === "upload" ||
      validateMediaURL(tempVideo.url, tempVideo.platform);
    const hasError =
      !tempVideo.title ||
      !tempVideo.description ||
      !tempVideo.url ||
      (tempVideo.uploadType === "link" && !isValid);

    setErrors({
      title: !tempVideo.title,
      description: !tempVideo.description,
      url: !tempVideo.url || (tempVideo.uploadType === "link" && !isValid),
    });

    if (hasError) return;

    let updated = [...videos];
    if (editingIndex !== null) {
      updated[editingIndex] = tempVideo;
    } else {
      updated.push(tempVideo);
    }

    setVideos(updated);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setTempVideo(videos[index]);
    setFileName(videos[index].file?.name || "");
    setEditingIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      setVideos(videos.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <Box>
      {/* Form de criação/edição */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título do Vídeo"
            fullWidth
            value={tempVideo.title}
            onChange={(e) => setTempVideo({ ...tempVideo, title: e.target.value })}
            error={errors.title}
            helperText={errors.title ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descrição do Vídeo"
            fullWidth
            value={tempVideo.description}
            onChange={(e) =>
              setTempVideo({ ...tempVideo, description: e.target.value })
            }
            error={errors.description}
            helperText={errors.description ? "Campo obrigatório" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={tempVideo.uploadType}
              label="Tipo"
              onChange={(e) =>
                setTempVideo({
                  ...tempVideo,
                  uploadType: e.target.value as "link" | "upload",
                  platform: e.target.value === "link" ? "youtube" : undefined,
                  url: "",
                  file: undefined,
                })
              }
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {tempVideo.uploadType === "link" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={tempVideo.platform || ""}
                  label="Plataforma"
                  onChange={(e) =>
                    setTempVideo({
                      ...tempVideo,
                      platform: e.target.value as IdeasMediaItem["platform"],
                    })
                  }
                >
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="googledrive">Google Drive</MenuItem>
                  <MenuItem value="onedrive">OneDrive</MenuItem>
                  <MenuItem value="dropbox">Dropbox</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="URL do Vídeo"
                fullWidth
                value={tempVideo.url}
                onChange={(e) => setTempVideo({ ...tempVideo, url: e.target.value })}
                error={errors.url}
                helperText={errors.url ? "URL inválida ou obrigatória" : ""}
              />
            </Grid>
          </>
        )}

        {tempVideo.uploadType === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Vídeo
              <input type="file" hidden accept="video/*" onChange={handleUpload} />
            </Button>
            {fileName && (
              <Typography variant="body2" mt={1}>
                Arquivo selecionado: <strong>{fileName}</strong>
              </Typography>
            )}
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddOrUpdate}
            sx={{ mt: 1 }}
          >
            {editingIndex !== null ? "Salvar Alterações" : "Adicionar Vídeo"}
          </Button>
        </Grid>
      </Grid>

      {/* Lista de vídeos já adicionados */}
      <Grid container spacing={2} mt={3}>
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              border={1}
              borderRadius={2}
              p={2}
              position="relative"
              borderColor="#ccc"
            >
              <Typography fontWeight="bold">{video.title}</Typography>
              <Typography variant="body2" mb={1}>
                {video.description}
              </Typography>

              {video.uploadType === "link" ? (
                <Box sx={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={video.url}
                    title={video.title}
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: 0 }}
                  />
                </Box>
              ) : (
                <video controls style={{ width: "100%", marginTop: 8 }}>
                  <source src={video.url} />
                </video>
              )}

              <Box position="absolute" top={8} right={8} display="flex" gap={1}>
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remover">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de confirmação de remoção */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente remover este vídeo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancelar</Button>
          <Button color="error" onClick={confirmRemove}>
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
