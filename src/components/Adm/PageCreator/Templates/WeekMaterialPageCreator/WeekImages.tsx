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
import { useState } from "react";
import { WeekMediaItem } from "store/slices/week-material/weekMaterialSlice";
import { validateMediaURL } from "utils/validateMediaURL"; // <-- IMPORTADO

interface Props {
  images: WeekMediaItem[];
  setImages: (imgs: WeekMediaItem[]) => void;
}

export default function WeekImages({ images, setImages }: Props) {
  const [newImg, setNewImg] = useState<WeekMediaItem>({
    title: "",
    description: "",
    type: "link",
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
    const url = URL.createObjectURL(file);
    setNewImg((prev) => ({ ...prev, url, file }));
  };

  const handleAddOrUpdate = () => {
    const isValid = newImg.type === "upload" || validateMediaURL(newImg.url, newImg.platform);
    const hasError =
      !newImg.title || !newImg.description || !newImg.url || (newImg.type === "link" && !isValid);

    setErrors({
      title: !newImg.title,
      description: !newImg.description,
      url: !newImg.url || (newImg.type === "link" && !isValid),
    });

    if (hasError) return;

    const updated = [...images];
    if (editingIndex !== null) {
      updated[editingIndex] = newImg;
      setEditingIndex(null);
    } else {
      updated.push(newImg);
    }

    setImages(updated);
    setNewImg({ title: "", description: "", type: "link", url: "", platform: "googledrive" });
    setFileName("");
  };

  const handleEdit = (index: number) => {
    setNewImg(images[index]);
    setEditingIndex(index);
    setFileName(images[index].file?.name || "");
  };

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      setImages(images.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <Box sx={{ width: { xs: "95%", md: "100%" }, mx: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título da Imagem"
            fullWidth
            value={newImg.title}
            onChange={(e) => setNewImg((prev) => ({ ...prev, title: e.target.value }))}
            error={errors.title}
            helperText={errors.title ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descrição da Imagem"
            fullWidth
            value={newImg.description}
            onChange={(e) => setNewImg((prev) => ({ ...prev, description: e.target.value }))}
            error={errors.description}
            helperText={errors.description ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={newImg.type}
              label="Tipo"
              onChange={(e) =>
                setNewImg((prev) => ({
                  ...prev,
                  type: e.target.value as "upload" | "link",
                  url: "",
                  file: undefined,
                  platform: "googledrive",
                }))
              }
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {newImg.type === "link" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={newImg.platform || ""}
                  label="Plataforma"
                  onChange={(e) =>
                    setNewImg((prev) => ({
                      ...prev,
                      platform: e.target.value as WeekMediaItem["platform"],
                    }))
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
                value={newImg.url}
                onChange={(e) => setNewImg((prev) => ({ ...prev, url: e.target.value }))}
                error={errors.url}
                helperText={errors.url ? "URL inválida ou obrigatória" : ""}
              />
            </Grid>
          </>
        )}

        {newImg.type === "upload" && (
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
          <Button variant="contained" fullWidth onClick={handleAddOrUpdate}>
            {editingIndex !== null ? "Salvar Alterações" : "Adicionar Imagem"}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={4}>
        {images.map((img, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box border={1} borderRadius={2} p={2} position="relative">
              <Typography fontWeight="bold">{img.title}</Typography>
              <Typography variant="body2" mb={1}>{img.description}</Typography>
              <img
                src={img.url}
                alt={img.title}
                style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
              />
              <Box position="absolute" top={8} right={8} display="flex" gap={1}>
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remover">
                  <IconButton size="small" color="error" onClick={() => setDeleteIndex(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente remover esta imagem?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)}>Cancelar</Button>
          <Button color="error" onClick={confirmRemove}>Remover</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
