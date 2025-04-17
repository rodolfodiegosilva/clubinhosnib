import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/slices';
import TeacherWeekBanner from './TeacherWeekBanner';
import api from '../../config/axiosConfig';
import {
  setMeditationData,
  MeditationData,
} from '../../store/slices/meditation/meditationSlice';
import TeacherMeditationBanner from './TeacherMeditationBanner';
import { motion } from 'framer-motion';
import CommentsSection from './CommentsSection';
import TrainingVideosSection from './TrainingVideosSection';
import DocumentsSection from './DocumentsSection'; // Novo componente
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PhotoIcon from '@mui/icons-material/Photo';

const TeacherArea: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dynamicRoutes = useSelector((state: RootState) => state.routes.routes);
  const meditationData = useSelector((state: RootState) => state.meditation.meditationData);

  useEffect(() => {
    async function fetchMeditation() {
      try {
        const response = await api.get('/meditations/this-week');
        if (response.data.status === 'Meditação da Semana' && response.data.meditation) {
          dispatch(setMeditationData(response.data.meditation as MeditationData));
        }
      } catch (error) {
        console.error('Erro ao buscar meditação:', error);
      }
    }
    fetchMeditation();
  }, [dispatch]);

  const filteredRoutes = dynamicRoutes
    .filter((route) => route.entityType === 'WeekMaterialsPage')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latestRoute = filteredRoutes[0];

  const motivacaoEvangelismo =
    '💬 Que tal aproveitar esta semana para compartilhar o amor de Jesus com alguém da sua comunidade? Uma conversa, uma visita, uma oração... cada gesto conta!';

  return (
    <Container maxWidth={false} sx={{ width: '100%', mt: 10, mb: 8, mx: 'auto', bgcolor: '#f5f7fa' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          mb: 6,
        }}
      >
        {latestRoute && latestRoute.title && latestRoute.path && (
          <Box sx={{ flex: 1 }}>
            <TeacherWeekBanner
              title={latestRoute.title}
              subtitle={latestRoute.subtitle}
              linkTo={`/${latestRoute.path}`}
            />
          </Box>
        )}
        {meditationData && meditationData.days && meditationData.days.length > 0 && (
          <Box sx={{ flex: 1 }}>
            <TeacherMeditationBanner meditation={meditationData} />
          </Box>
        )}
      </Box>

      <Paper
        elevation={2}
        sx={{
          backgroundColor: '#e3f2fd',
          p: { xs: 2, md: 3 },
          mb: 5,
          borderLeft: '6px solid #2196f3',
          borderRadius: 2,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold" color="#2196f3" gutterBottom>
            ✨ Motivação para Evangelizar
          </Typography>
          <Typography variant="body1" textAlign="center" >
            {motivacaoEvangelismo}
          </Typography>
        </Box>
      </Paper>



      {/* Bloco Principal */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#424242" gutterBottom>
          Área do Professor
        </Typography>
        <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />

        {isAuthenticated ? (
          <Box>
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h6"
                gutterBottom
                color="#616161"
                sx={{ fontSize: { xs: '1.1rem', md: '1.4rem' } }}
              >
                Olá, {user?.name || 'Professor'}!
              </Typography>

              <Box maxWidth="800px" mx="auto">
                <Typography
                  variant="body1"
                  gutterBottom
                  color="#757575"
                  sx={{
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                  }}
                >
                  Bem-vindo à sua central de apoio pedagógico. Explore recursos atualizados semanalmente e enriqueça suas aulas!
                </Typography>
              </Box>
            </Box>


            {/* Seções em Grade */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} md={4}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    sx={{
                      borderLeft: '5px solid #4caf50',
                      height: '100%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.15)' },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#424242">
                          Objetivos da Área
                        </Typography>
                      </Box>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Materiais alinhados ao calendário semanal." />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Conteúdos por faixa etária e tema." />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Apoio didático e sugestões de atividades." />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    sx={{
                      borderLeft: '5px solid #f44336',
                      height: '100%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.15)' },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <InfoIcon sx={{ color: '#f44336', mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#424242">
                          Orientações
                        </Typography>
                      </Box>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Acesse o banner semanal para o tema atual." />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Adapte os materiais à sua turma." />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Compartilhe ideias com outros professores." />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    sx={{
                      borderLeft: '5px solid #ff9800',
                      height: '100%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.15)' },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LightbulbIcon sx={{ color: '#ff9800', mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="#424242">
                          Dicas Rápidas
                        </Typography>
                      </Box>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Prepare a aula com antecedência." />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Reforce valores bíblicos de forma criativa." />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Crie um ambiente acolhedor." />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            <DocumentsSection />

            <Paper
              elevation={2}
              sx={{
                p: 3,
                mt: 5,
                borderLeft: '5px solid #ab47bc',
                backgroundColor: '#f3e5f5',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhotoIcon sx={{ color: '#ab47bc', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="#424242">
                  Galeria de Ideias (em breve)
                </Typography>
              </Box>
              <Typography variant="body2" color="#616161">
                Compartilhe fotos, dinâmicas e boas práticas em sala. Fique atento!
              </Typography>
            </Paper>

            <TrainingVideosSection />
            <CommentsSection />
          </Box>
        ) : (
          <Typography variant="body1" color="#757575">
            Você precisa estar logado para acessar esta área.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default TeacherArea;