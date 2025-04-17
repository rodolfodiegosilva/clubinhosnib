import { Grid, Card, CardContent, Typography, IconButton, Button, Box } from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { WeekMaterialPageData } from "store/slices/week-material/weekMaterialSlice";

interface Props {
  material: WeekMaterialPageData;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function WeekMaterialCard({ material, onView, onEdit, onDelete }: Props) {
  const truncate = (text: string, max = 100) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  return (
    <Grid item sx={{ flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" }, maxWidth: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" }, minWidth: 280, display: "flex" }}>
      <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3, p: 2, bgcolor: "#fff", border: "1px solid #e0e0e0", position: "relative" }}>
        <IconButton size="small" onClick={onDelete} sx={{ position: "absolute", top: 8, right: 8, color: "#d32f2f" }} title="Excluir Material">
          <Delete fontSize="small" />
        </IconButton>

        <CardContent>
          <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}>
            {material.title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ fontSize: { xs: ".9rem", md: "1rem" } }}>
            {material.subtitle}
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ fontSize: { xs: ".8rem", md: "1rem" }, mt: 1 }}>
            {truncate(material.description)}
          </Typography>

          <Box textAlign="center" mt={3}>
            <Button variant="contained" startIcon={<Visibility />} onClick={onView} sx={{ mr: 2 }}>
              Ver Detalhes
            </Button>
            <Button variant="outlined" onClick={onEdit}>Editar</Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
