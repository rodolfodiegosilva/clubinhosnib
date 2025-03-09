import React, { useEffect, useState } from "react";
import api from "../../config/axiosConfig"; // Instância do Axios configurada
import FeedItem from "./FeedItem";
import "./Feed.css";

/**
 * Interface para os dados do Feed.
 */
interface ImageData {
  id: string;
  url: string;
  isLocalFile: boolean;
}

interface SectionData {
  id: string;
  caption: string;
  description: string;
  images: ImageData[];
}

interface FeedData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sections: SectionData[];
}

/**
 * Componente principal que exibe o feed de forma dinâmica, carregando os dados da API.
 */
export default function Feed() {
  const [feedData, setFeedData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
        const response = await api.get<FeedData>("/gallery/59878b80-bd73-4305-a1c3-4fbdbba2ce23");
        setFeedData(response.data);
      } catch (err) {
        console.error("Erro ao buscar os dados do feed:", err);
        setError("Erro ao carregar o feed. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="feed-error-message">{error}</p>;

  return (
    <div className="feed-page">
      <h2 className="feed-title">{feedData?.name || "Feed do Ministério"}</h2>
      <p className="feed-subtitle">{feedData?.description || "Aqui você encontra fotos e notícias atuais do Ministério de Orfanato."}</p>

      <div className="feed-container">
        {feedData?.sections.map((section) => (
          <FeedItem
            key={section.id}
            images={section.images}
            caption={section.caption}
            description={section.description}
            createdAt={feedData.createdAt}
            updatedAt={feedData.updatedAt}
          />
        ))}
      </div>
    </div>
  );
}