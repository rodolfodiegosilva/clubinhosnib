// components/IdeasMaterialDocuments.tsx

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
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IdeasMediaItem } from "store/slices/ideas/ideasSlice";
import { validateMediaURL } from "utils/validateMediaURL"; // Crie uma função de validação ou ajuste conforme seu projeto

interface DocumentsProps {
  documents: IdeasMediaItem[];
  setDocuments: (docs: IdeasMediaItem[]) => void;
}

export function IdeasMaterialDocuments({ documents, setDocuments }: DocumentsProps) {
  const [tempDoc, setTempDoc] = useState<IdeasMediaItem>({
    title: "",
    description: "",
    type: "document",
    uploadType: "link",
    url: "",
    platform: "googledrive",
  });
  const [fileName, setFileName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
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
    setTempDoc((prev) => ({ ...prev, url: objectURL, file }));
  };

  const resetForm = () => {
    setTempDoc({
      title: "",
      description: "",
      type: "document",
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
      tempDoc.uploadType === "upload" ||
      validateMediaURL(tempDoc.url, tempDoc.platform);
    const hasError =
      !tempDoc.title ||
      !tempDoc.description ||
      !tempDoc.url ||
      (tempDoc.uploadType === "link" && !isValid);

    setErrors({
      title: !tempDoc.title,
      description: !tempDoc.description,
      url: !tempDoc.url || (tempDoc.uploadType === "link" && !isValid),
    });

    if (hasError) return;

    let updated = [...documents];

    if (editingIndex !== null) {
      updated[editingIndex] = tempDoc;
    } else {
      updated.push(tempDoc);
    }

    setDocuments(updated);
    resetForm();
  };

  const handleEdit = (index: number) => {
    setTempDoc(documents[index]);
    setFileName(documents[index].file?.name || "");
    setEditingIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      setDocuments(documents.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <Box>
      {/* Form de criação/edição */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Título"
            fullWidth
            value={tempDoc.title}
            onChange={(e) => setTempDoc({ ...tempDoc, title: e.target.value })}
            error={errors.title}
            helperText={errors.title ? "Campo obrigatório" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descrição"
            fullWidth
            value={tempDoc.description}
            onChange={(e) =>
              setTempDoc({ ...tempDoc, description: e.target.value })
            }
            error={errors.description}
            helperText={errors.description ? "Campo obrigatório" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={tempDoc.uploadType}
              label="Tipo"
              onChange={(e) =>
                setTempDoc({
                  ...tempDoc,
                  uploadType: e.target.value as "link" | "upload",
                  // Se for link, definimos uma plataforma padrão
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

        {/* Se for link, escolhe plataforma e insere URL */}
        {tempDoc.uploadType === "link" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select
                  value={tempDoc.platform || ""}
                  label="Plataforma"
                  onChange={(e) =>
                    setTempDoc({
                      ...tempDoc,
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
                label="URL do Documento"
                fullWidth
                value={tempDoc.url}
                onChange={(e) => setTempDoc({ ...tempDoc, url: e.target.value })}
                error={errors.url}
                helperText={errors.url ? "URL inválida ou obrigatória" : ""}
              />
            </Grid>
          </>
        )}

        {/* Se for upload, escolhe um arquivo */}
        {tempDoc.uploadType === "upload" && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload de Documento
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
              />
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
            {editingIndex !== null ? "Salvar Alterações" : "Adicionar Documento"}
          </Button>
        </Grid>
      </Grid>

      {/* Lista de documentos já adicionados */}
      <Grid container spacing={2} mt={3}>
        {documents.map((doc, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              border={1}
              borderRadius={2}
              p={2}
              position="relative"
              borderColor="#ccc"
            >
              <Typography fontWeight="bold">{doc.title}</Typography>
              <Typography variant="body2" mb={1}>
                {doc.description}
              </Typography>

              <Box display="flex" justifyContent="space-between" mt={1}>
                {/* Visualização simples */}
                {doc.uploadType === "upload" && (
                  <Tooltip title="Visualizar">
                    <IconButton
                      color="primary"
                      onClick={() => setPreviewDoc(doc.url)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => handleEdit(index)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Remover">
                  <IconButton
                    color="error"
                    size="small"
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

      {/* Preview simples (para PDF ou DOC, a visualização no iframe pode variar) */}
      <Dialog
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Visualizar Documento</DialogTitle>
        <DialogContent>
          {previewDoc && (
            <iframe
              src={previewDoc}
              title="Documento"
              style={{ width: "100%", height: "80vh", border: 0 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDoc(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar remoção */}
      <Dialog open={deleteIndex !== null} onClose={() => setDeleteIndex(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Deseja realmente remover este documento?</Typography>
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
