import HomePage, { postingData } from "./index";
import { GetServerSideProps } from "next";
import { apiInstance } from "../api/api";

interface PostEditorProps {
  initialPostData: postingData;
}

const PostEditor = ({ initialPostData }: PostEditorProps) => {
  console.log("hh");
  return <HomePage initialPostData={initialPostData} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.params?.id;

  if (!postId || Array.isArray(postId)) {
    return {
      notFound: true,
    };
  }

  let postData;

  try {
    const response = await apiInstance.get(`/posts/${postId}`);
    postData = response.data;
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { initialPostData: postData } };
};

export default PostEditor;
