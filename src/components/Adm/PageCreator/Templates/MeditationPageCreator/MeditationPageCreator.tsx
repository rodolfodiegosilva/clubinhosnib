import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../store/slices";
import { fetchRoutes } from "../../../../../store/slices/route/routeSlice";
import {
  clearMeditationData,
  clearMedia,
  setMedia,
  DayItem,
  MediaItem,
} from "../../../../../store/slices/meditation/meditationSlice";
import MeditationForm from "./MeditationForm";
import { AxiosError } from "axios";

interface Props {
  fromTemplatePage?: boolean;
}

function isMonday(dateStr: string) {
  if (!dateStr) return false;
  const date = new Date(dateStr + "T00:00:00");
  return date.getDay() === 1;
}

function isFriday(dateStr: string) {
  if (!dateStr) return false;
  const date = new Date(dateStr + "T00:00:00");
  return date.getDay() === 5;
}

export default function MeditationPageCreator({ fromTemplatePage }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const meditationData = useSelector((state: RootState) => state.meditation.meditationData);

  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"link" | "upload">("link");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<"ANY" | "googledrive" | "onedrive" | "dropbox">("ANY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState<DayItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if (fromTemplatePage) {
      dispatch(clearMeditationData());
      dispatch(clearMedia());
      setTopic("");
      setFile(null);
      setFileType("link");
      setUrl("");
      setPlatform("ANY");
      setStartDate("");
      setEndDate("");
      setDays([]);
    }
  }, [fromTemplatePage, dispatch]);

  useEffect(() => {
    if (!fromTemplatePage && meditationData) {
      setTopic(meditationData.topic);
      setStartDate(meditationData.startDate);
      setEndDate(meditationData.endDate);
      setDays(meditationData.days);

      if (meditationData.media) {
        setFileType(meditationData.media.isLocalFile ? "upload" : "link");
        setUrl(meditationData.media.url ?? "");
        setPlatform(meditationData.media.platform ?? "ANY");
      }
    }
  }, [fromTemplatePage, meditationData]);

  const handleFileTypeChange = (type: "link" | "upload") => {
    setFileType(type);
    if (type === "link") {
      setFile(null);
      setUrl("");
    } else {
      setUrl("");
    }
  };

  const handleSave = async () => {
    const hasEmptyFields = !topic || !startDate || !endDate;
    const isIncompleteDays = days.length !== 5;
    const hasNoLink = fileType === "link" && !url.trim();
    const hasNoFile = fileType === "upload" && !file;

    if (hasEmptyFields) {
      setSnackbar({
        open: true,
        message: "Informe tema, data de início e fim.",
        severity: "error",
      });
      return;
    }

    if (!isMonday(startDate)) {
      setSnackbar({
        open: true,
        message: "A data de início deve ser uma segunda-feira.",
        severity: "error",
      });
      return;
    }

    if (!isFriday(endDate)) {
      setSnackbar({
        open: true,
        message: "A data de término deve ser uma sexta-feira.",
        severity: "error",
      });
      return;
    }

    if (isIncompleteDays) {
      setSnackbar({
        open: true,
        message: "Adicione exatamente 5 dias de meditação.",
        severity: "error",
      });
      return;
    }

    if ((fileType === "link" && hasNoLink) || (fileType === "upload" && hasNoFile)) {
      setSnackbar({
        open: true,
        message: "Informe um link válido ou envie um arquivo.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (fileType === "upload" && file) {
        formData.append("file", file);
      }

      const media: MediaItem = {
        title: topic.trim(),
        description: `Meditação da semana de ${startDate} a ${endDate}`,
        type: fileType,
        isLocalFile: fileType === "upload",
        url: fileType === "link" ? url.trim() : "",
        platform: fileType === "link" ? platform : undefined,
        ...(file ? { originalName: file.name, size: file.size } : {}),
      };

      const meditationDataPayload = {
        ...(fromTemplatePage ? {} : { id: meditationData?.id }),
        topic: topic.trim(),
        startDate,
        endDate,
        media,
        days: days.map((day) => ({
          day: day.day,
          verse: day.verse.replace(/\\"/g, '"').normalize().trim(),
          topic: day.topic.replace(/\\"/g, '"').normalize().trim(),
          ...(fromTemplatePage ? {} : { id: day.id }),
        })),
      };

      formData.append("meditationData", JSON.stringify(meditationDataPayload));

      if (fromTemplatePage) {
        await api.post("/meditations", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.patch(`/meditations/${meditationData?.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await dispatch(fetchRoutes());

      setSnackbar({
        open: true,
        message: "Meditação salva com sucesso!",
        severity: "success",
      });
      navigate("/adm/meditacoes");
    } catch (error) {
      let errMessage = "Erro desconhecido";

      if (error instanceof AxiosError && error.response?.data?.message) {
        errMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errMessage = error.message;
      }

      console.error("❌ Erro ao salvar meditação:", error);
      setSnackbar({
        open: true,
        message: errMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 0, mt: fromTemplatePage ? 0 : 10, width: "95%", maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
        textAlign="center"
        sx={{ fontSize: { xs: "1.6rem", sm: "2rem", md: "2.25rem" } }}
      >
        {fromTemplatePage ? "Criar Meditação da Semana" : "Editar Meditação"}
      </Typography>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 5 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Tema da Meditação"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Data de Início (segunda-feira)"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              fullWidth
              label="Data de Término (sexta-feira)"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Stack>

          <FormControl fullWidth>
            <InputLabel id="file-type-label">Tipo de conteúdo</InputLabel>
            <Select
              labelId="file-type-label"
              value={fileType}
              label="Tipo de conteúdo"
              onChange={(e) => handleFileTypeChange(e.target.value as "link" | "upload")}
            >
              <MenuItem value="link">Link</MenuItem>
              <MenuItem value="upload">Upload (PDF ou DOC)</MenuItem>
            </Select>
          </FormControl>

          {fileType === "link" && (
            <>
              <TextField
                fullWidth
                label="Insira o link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="platform-label">Plataforma</InputLabel>
                <Select
                  labelId="platform-label"
                  value={platform}
                  label="Plataforma"
                  onChange={(e) => setPlatform(e.target.value as any)}
                >
                  <MenuItem value="ANY">Qualquer</MenuItem>
                  <MenuItem value="googledrive">Google Drive</MenuItem>
                  <MenuItem value="onedrive">OneDrive</MenuItem>
                  <MenuItem value="dropbox">Dropbox</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {fileType === "upload" && (
            <Button component="label" variant="outlined" size="small" fullWidth>
              {file ? file.name : "Selecionar arquivo (PDF ou DOC)"}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) setFile(selected);
                }}
              />
            </Button>
          )}
        </Stack>
      </Paper>

      <MeditationForm days={days} onDaysChange={setDays} />

      <Box textAlign="center" mt={6}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Salvando..." : "Salvar Meditação"}
        </Button>
      </Box>

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
