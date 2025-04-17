import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDocumentData,
  setMedia,
  clearDocumentData,
  clearMedia,
} from 'store/slices/documents/documentSlice';
import { RootState } from 'store/slices';
import api from '../../../config/axiosConfig';

interface DocumentFormProps {
  isEditing: boolean;
  onSuccess: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ isEditing, onSuccess }) => {
  const dispatch = useDispatch();
  const documentData = useSelector((state: RootState) => state.document.documentData);
  const mediaData = useSelector((state: RootState) => state.document.media);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaType, setMediaType] = useState<'link' | 'upload'>('link');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaPlatform, setMediaPlatform] = useState<'youtube' | 'googledrive' | 'onedrive' | 'dropbox' | 'any'>('any');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (isEditing && documentData) {
      setName(documentData.name);
      setDescription(documentData.description || '');
      if (mediaData) {
        setMediaTitle(mediaData.title);
        setMediaDescription(mediaData.description || '');
        setMediaType(mediaData.type);
        setMediaUrl(mediaData.url || '');
        setMediaPlatform(mediaData.platform || 'any');
      }
    } else {
      dispatch(clearDocumentData());
      dispatch(clearMedia());
      setName('');
      setDescription('');
      setMediaTitle('');
      setMediaDescription('');
      setMediaType('link');
      setMediaUrl('');
      setMediaPlatform('any');
      setFile(null);
    }
  }, [isEditing, documentData, mediaData, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!name || !mediaTitle) {
      setSnackbar({ open: true, message: 'Nome do documento e título da mídia são obrigatórios.', severity: 'error' });
      return;
    }
    if (mediaType === 'link' && !mediaUrl) {
      setSnackbar({ open: true, message: 'Insira uma URL válida.', severity: 'error' });
      return;
    }
    if (mediaType === 'upload' && !file && !isEditing) {
      setSnackbar({ open: true, message: 'Selecione um arquivo.', severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const mediaDto = {
        id: isEditing && mediaData?.id ? mediaData.id : undefined,
        title: mediaTitle,
        description: mediaDescription || '',
        type: mediaType,
        isLocalFile: mediaType === 'upload',
        url: mediaType === 'link' ? mediaUrl : '',
        platform: mediaType === 'link' ? mediaPlatform : undefined,
        originalName: mediaType === 'upload' && file ? file.name : undefined,
        size: mediaType === 'upload' && file ? file.size : undefined,
        fileField: mediaType === 'upload' ? 'file' : undefined,
      };

      const documentDto: any = {
        name,
        description: description || undefined,
        media: mediaDto,
      };
      if (isEditing && documentData?.id) {
        documentDto.id = documentData.id;
      }

      if (mediaType === 'upload' && file) {
        formData.append('file', file);
      }
      formData.append('documentData', JSON.stringify(documentDto));

      if (isEditing && documentData?.id) {
        await api.patch(`/documents/${documentData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      dispatch(setDocumentData(documentDto));
      dispatch(setMedia(mediaDto));
      onSuccess();

      if (!isEditing) {
        setName('');
        setDescription('');
        setMediaTitle('');
        setMediaDescription('');
        setMediaType('link');
        setMediaUrl('');
        setMediaPlatform('any');
        setFile(null);
      }
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar documento.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Nome do Documento" value={name} onChange={(e) => setName(e.target.value)} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Título da Mídia" value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Descrição da Mídia" value={mediaDescription} onChange={(e) => setMediaDescription(e.target.value)} multiline rows={2} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Upload</InputLabel>
            <Select value={mediaType} label="Tipo de Upload" onChange={(e) => setMediaType(e.target.value as any)}>
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {mediaType === 'link' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="URL da Mídia" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select value={mediaPlatform} label="Plataforma" onChange={(e) => setMediaPlatform(e.target.value as any)}>
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="googledrive">Google Drive</MenuItem>
                  <MenuItem value="onedrive">OneDrive</MenuItem>
                  <MenuItem value="dropbox">Dropbox</MenuItem>
                  <MenuItem value="any">Outro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        {mediaType === 'upload' && (
          <Grid item xs={12}>
            <Button component="label" variant="outlined" fullWidth>
              {file ? file.name : 'Selecionar Arquivo (PDF, DOC, DOCX)'}
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </Button>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentForm;