import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Paper,
    Stack,
    Typography,
  } from "@mui/material";
  import { Delete, PictureAsPdf, Visibility } from "@mui/icons-material";
  import {
    MeditationData,
    DayItem,
    WeekDay,
    WeekDayLabel,
  } from "../../../store/slices/meditation/meditationSlice";
  
  interface Props {
    meditation: MeditationData;
    onEdit: (meditation: MeditationData) => void;
    onDelete: (meditation: MeditationData) => void;
    onDayClick: (day: DayItem) => void;
    onViewMedia: (url: string) => void;
  }
  
  const getMediaPreviewUrl = (media: MeditationData["media"]): string => {
    if (media.type === "upload") return media.url;
    if (media.type === "link" && media.platform === "googledrive") {
      const match = media.url.match(/\/d\/([^/]+)\//);
      if (match?.[1]) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return media.url;
  };
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  export default function MeditationCard({
    meditation,
    onEdit,
    onDelete,
    onDayClick,
    onViewMedia,
  }: Props) {
    return (
      <Card
        sx={{
          flex: 1,
          borderRadius: 3,
          boxShadow: 3,
          p: 2,
          bgcolor: "#fff",
          border: "1px solid #e0e0e0",
          position: "relative",
        }}
      >
        <IconButton
          size="small"
          onClick={() => onDelete(meditation)}
          sx={{ position: "absolute", top: 8, right: 8, color: "#d32f2f" }}
          title="Excluir Meditação"
        >
          <Delete fontSize="small" />
        </IconButton>
  
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ mt: { xs: 0, md: 2 }, mb: { xs: 1, md: 2 }, fontSize: { xs: "1rem", md: "1.5rem" } }}
          >
            {meditation.topic}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ fontSize: { xs: ".8rem", md: "1rem" } }}
          >
            {formatDate(meditation.startDate)} - {formatDate(meditation.endDate)}
          </Typography>
  
          <Typography fontWeight="bold" mt={2} mb={1}>
            Dias:
          </Typography>
          <Stack spacing={1}>
            {meditation.days.map((day) => (
              <Paper
                key={day.id}
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.2,
                  px: 2,
                  border: "1px solid #dcdcdc",
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                }}
              >
                <Typography fontWeight="medium">
                  {WeekDayLabel[day.day as WeekDay]}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => onDayClick(day)}
                  sx={{ color: "#616161" }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Stack>
  
          {meditation.media?.url && (
            <Box textAlign="center" mt={2}>
              <Button
                startIcon={<PictureAsPdf />}
                variant="text"
                size="small"
                onClick={() => onViewMedia(getMediaPreviewUrl(meditation.media))}
              >
                Ver Material
              </Button>
            </Box>
          )}
  
          <Box textAlign="center" mt={3}>
            <Button variant="outlined" onClick={() => onEdit(meditation)} fullWidth>
              Editar
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }
  