// components/IdeasMaterialImages.tsx

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

interface ImagesProps {
  images: IdeasMediaItem[];
  setImages: (imgs: IdeasMediaItem[]) => void;
}

export function IdeasMaterialImages({ images, setImages }: ImagesProps) {
  const [tempImg, setTempImg] = useState<IdeasMediaItem>({
    title: "",
    description: "",
    type: "image",
    uploadType: "link",
    url: "",
    platform: "googledrive",
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
    setTempImg((prev) => ({ ...prev, url: objectURL, file }));
  };

  const resetForm = () => {
    setTempImg({
      title: "",
      description: "",
      type: "image",
      uploadType: "link",
      url: "",
      platform: "googledrive",
    });
    setFileName("");
    setEditingIndex(null);
    setErrors({ title: false, description: false, url: false });
  };

  const handleAddOrUpdate = () => {
    const isValid =
      tempImg.uploadType === "upload" ||
      validateMediaURL(tempImg.url, tempImg.platform);
    const hasError =
      !tempImg.title ||
      !tempImg.description ||
      !tempImg.url ||
      (tempImg.uploadType === "link" && !isValid);

    setErrors({
      title: !tempImg.title,
      description: !tempImg.description,
      url: !tempImg.url || (tempImg.uploadType === "link" && !isValid),
    });

    if (hasError) return;

    let updated = [...images];
    if (editingIndex !== null) {
      updated[editingIndex] = tempImg;
    } else {
      updated.push(tempImg);
    }

    setImages(updated);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setTempImg(images[index]);
    setFileName(images[index].file?.name || "");
    setEditingIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      setImages(images.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <Box>
      {/* Formulário de criação/edição */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título da Imagem"
            fullWidth
            value={tempImg.title}
            onChange={(e) => setTempImg({ ...tempImg, title: e.target.value })}
            error={errors.title}
            helperText={errors.title ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descrição da Imagem"
            fullWidth
            value={tempImg.description}
            onChange={(e) =>
              setTempImg({ ...tempImg, description: e.target.value })
            }
            error={errors.description}
            helperText={errors.description ? "Campo obrigatório" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={tempImg.uploadType}
              label="Tipo"
              onChange={(e) =>
                setTempImg({
                  ...tempImg,
                  uploadType: e.target.value as "link" | "upload",
                  platform: e.target.value === "link" ? "googledrive" : undefined,
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

        {tempImg.uploadType === "link" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={tempImg.platform || ""}
                  label="Plataforma"
                  onChange={(e) =>
                    setTempImg({
                      ...tempImg,
                      platform: e.target.value as IdeasMediaItem["platform"],
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
                label="URL da Imagem"
                fullWidth
                value={tempImg.url}
                onChange={(e) => setTempImg({ ...tempImg, url: e.target.value })}
                error={errors.url}
                helperText={errors.url ? "URL inválida ou obrigatória" : ""}
              />
            </Grid>
          </>
        )}

        {tempImg.uploadType === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Imagem
              <input type="file" hidden accept="image/*" onChange={handleUpload} />
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
            {editingIndex !== null ? "Salvar Alterações" : "Adicionar Imagem"}
          </Button>
        </Grid>
      </Grid>

      {/* Lista de imagens já adicionadas */}
      <Grid container spacing={2} mt={3}>
        {images.map((img, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              border={1}
              borderRadius={2}
              p={2}
              position="relative"
              borderColor="#ccc"
            >
              <Typography fontWeight="bold">{img.title}</Typography>
              <Typography variant="body2" mb={1}>
                {img.description}
              </Typography>
              {img.url && (
                <img
                  src={img.url}
                  alt={img.title}
                  style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
                />
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
          <Typography>Deseja realmente remover esta imagem?</Typography>
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
