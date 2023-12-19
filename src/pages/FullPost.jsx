import React from "react";
import { useParams } from 'react-router-dom';
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "axios";

export const FullPost = () => {
  const [data, setData] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios.get(`http://localhost:4444/posts/${id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при загрузке поста');
        setLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <Post isLoading={true} />;
  }

  if (!data) {
    return <p>Пост не найден</p>;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount}
        tags={data.tags}
        isFullPost
      >
        <p>{data.text}</p>
      </Post>
      <CommentsBlock
        items={data.comments || []}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
