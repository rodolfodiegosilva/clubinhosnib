import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import { AppDispatch } from "../../../store/slices";
import {
  setMeditationData,
  MeditationData,
  DayItem,
  MediaItem,
} from "../../../store/slices/meditation/meditationSlice";
import MeditationCard from "./MeditationCard";
import DayDetailsDialog from "./DayDetailsDialog";
import MediaPreviewDialog from "./MediaPreviewDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function MeditationListPage() {
  const [meditations, setMeditations] = useState<MeditationData[]>([]);
  const [filteredMeditations, setFilteredMeditations] = useState<MeditationData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayItem | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [meditationToDelete, setMeditationToDelete] = useState<MeditationData | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeditations();
  }, []);

  const fetchMeditations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/meditations");
      const meditationList: MeditationData[] = response.data.map((item: any) => item.meditation);
      setMeditations(meditationList);
      setFilteredMeditations(meditationList);
    } catch (err) {
      console.error("Erro ao buscar meditações:", err);
      setError("Erro ao buscar meditações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const filtered = meditations.filter((m) =>
        m.topic.toLowerCase().includes(term)
      );
      setFilteredMeditations(filtered);
      setIsFiltering(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, meditations]);

  const handleOpenEdit = (meditation: MeditationData) => {
    dispatch(setMeditationData(meditation));
    navigate("/editar-meditacao");
  };

  const handleDelete = async () => {
    if (!meditationToDelete) return;
    setMeditationToDelete(null);
    setLoading(true);
    try {
      await api.delete(`/meditations/${meditationToDelete.id}`);
      await fetchMeditations();
    } catch (error) {
      console.error("Erro ao deletar meditação:", error);
      setError("Erro ao deletar meditação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 1, md: 3 },
        py: { xs: 1, md: 2 },
        mt: { xs: 0, md: 4 },
        bgcolor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{ mt: 0, mb: { xs: 4, md: 3 }, fontSize: { xs: "1.5rem", md: "2.4rem" } }}
      >
        Meditações Semanais
      </Typography>

      <Box maxWidth={500} mx="auto" mb={5}>
        <TextField
          fullWidth
          placeholder="Buscar por tema..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {loading || isFiltering ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box textAlign="center" mt={10}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : filteredMeditations.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <Alert severity="info">Nenhuma meditação encontrada.</Alert>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {filteredMeditations.map((meditation) => (
            <Grid
              item
              key={meditation.id}
              sx={{
                flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
                maxWidth: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
                minWidth: 280,
                display: "flex",
              }}
            >
              <MeditationCard
                meditation={meditation}
                onEdit={handleOpenEdit}
                onDelete={setMeditationToDelete}
                onDayClick={setSelectedDay}
                onViewMedia={setMediaUrl}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <DayDetailsDialog day={selectedDay} onClose={() => setSelectedDay(null)} />
      <MediaPreviewDialog mediaUrl={mediaUrl} onClose={() => setMediaUrl(null)} />
      <DeleteConfirmDialog
        meditation={meditationToDelete}
        onCancel={() => setMeditationToDelete(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}