import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/slices';
import TeacherWeekBanner from './TeacherWeekBanner';

const TeacherArea: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dynamicRoutes = useSelector((state: RootState) => state.routes.routes);

  const filteredRoutes = dynamicRoutes
    .filter((route) => route.entityType === 'StudyMaterialsPage')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const latestRoute = filteredRoutes[0];

  const versiculoDoDia =
    'Ide por todo o mundo e pregai o evangelho a toda criatura. (Marcos 16:15)';
  const motivacaoEvangelismo =
    '💬 Que tal aproveitar esta semana para compartilhar o amor de Jesus com alguém da sua comunidade? Uma conversa, uma visita, uma oração... cada gesto conta!';

  return (
    <Container maxWidth={false} sx={{ width: '100%', mt: 10, mb: 8, mx: 'auto' }}>
      {latestRoute && latestRoute.title && latestRoute.path && (
        <TeacherWeekBanner
          title={latestRoute.title}
          subtitle={latestRoute.subtitle}
          linkTo={`/${latestRoute.path}`}
        />
      )}

      {/* Versículo do Dia */}
      <Paper
        elevation={2}
        sx={{
          backgroundColor: '#fff8e1',
          p: { xs: 2, md: 3 },
          my: 4,
          borderLeft: '6px solid #ffb300',
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📖 Versículo do Dia
        </Typography>
        <Typography variant="body1" fontStyle="italic">
          “{versiculoDoDia}”
        </Typography>
      </Paper>

      {/* Motivação Evangelística */}
      <Paper
        elevation={2}
        sx={{
          backgroundColor: '#e3f2fd',
          p: { xs: 2, md: 3 },
          mb: 4,
          borderLeft: '6px solid #2196f3',
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ✨ Motivação para Evangelizar
        </Typography>
        <Typography variant="body1">{motivacaoEvangelismo}</Typography>
      </Paper>

      {/* Bloco Principal */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Área do Professor
        </Typography>

        <Divider sx={{ my: 2 }} />

        {isAuthenticated ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Olá, {user?.name || 'Professor'}!
            </Typography>

            <Typography variant="body1" gutterBottom>
              Seja bem-vindo à sua central de apoio pedagógico. Aqui você encontrará conteúdos atualizados semanalmente, orientações e recursos exclusivos para enriquecer suas aulas.
            </Typography>

            {/* Objetivos */}
            <Paper elevation={1} sx={{ p: 3, mt: 4, borderLeft: '5px solid #4caf50', backgroundColor: '#f9f9f9' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📘 Objetivos da Área
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Disponibilizar materiais alinhados ao calendário semanal." /></ListItem>
                <ListItem><ListItemText primary="Facilitar o acesso a conteúdos organizados por faixa etária e tema." /></ListItem>
                <ListItem><ListItemText primary="Proporcionar apoio didático e sugestões de atividades." /></ListItem>
              </List>
            </Paper>

            {/* Orientações */}
            <Paper elevation={1} sx={{ p: 3, mt: 4, borderLeft: '5px solid #f44336', backgroundColor: '#fdf2f2' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📌 Orientações
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Acesse o banner semanal para visualizar o tema atual." /></ListItem>
                <ListItem><ListItemText primary="Utilize os materiais como base e adapte conforme a realidade da sua turma." /></ListItem>
                <ListItem><ListItemText primary="Compartilhe ideias com outros professores e coordenação." /></ListItem>
              </List>
            </Paper>

            {/* Dicas Rápidas */}
            <Paper elevation={1} sx={{ p: 3, mt: 4, borderLeft: '5px solid #ff9800', backgroundColor: '#fff8e1' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                💡 Dicas Rápidas
              </Typography>
              <List dense>
                <ListItem><ListItemText primary="Reserve um tempo para preparar a aula com antecedência." /></ListItem>
                <ListItem><ListItemText primary="Reforce os valores bíblicos de forma prática e criativa." /></ListItem>
                <ListItem><ListItemText primary="Mantenha o ambiente acolhedor e interativo." /></ListItem>
              </List>
            </Paper>

            {/* Galeria */}
            <Paper elevation={1} sx={{ p: 3, mt: 5, borderLeft: '5px solid #ab47bc', backgroundColor: '#f3e5f5' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🎨 Galeria de Ideias (em breve)
              </Typography>
              <Typography variant="body2">
                Uma seção especial para que professores compartilhem fotos, ideias de dinâmicas e boas práticas em sala. Fique atento!
              </Typography>
            </Paper>

            {/* Vídeos */}
            <Paper elevation={1} sx={{ p: 3, mt: 5, borderLeft: '5px solid #7e57c2', backgroundColor: '#ede7f6' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🎥 Vídeos de Capacitação
              </Typography>
              <Typography variant="body2">
                Acesse vídeos curtos com orientações práticas, dicas pedagógicas e inspirações para seu ministério.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Em breve: vídeos incorporados diretamente aqui!)
              </Typography>
            </Paper>

            {/* Mural */}
            <Paper elevation={1} sx={{ p: 3, mt: 5, borderLeft: '5px solid #607d8b', backgroundColor: '#eceff1' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                💬 Mural de Comentários
              </Typography>
              <Typography variant="body2">
                Em breve, você poderá deixar mensagens, dúvidas e sugestões para a equipe pedagógica e outros professores.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Funcionalidade em desenvolvimento.)
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Typography variant="body1" gutterBottom>
            Você precisa estar logado para acessar esta área.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default TeacherArea;
