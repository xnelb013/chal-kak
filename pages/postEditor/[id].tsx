import HomePage, { editData } from "./index";
import { GetServerSideProps } from "next";
import { apiInstance } from "../api/api";

interface PostEditorProps {
  initialPostData: editData;
}

const PostEditor = ({ initialPostData }: PostEditorProps) => {
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
    postData = response.data.data;
    console.log(response);
  } catch (error) {
    return { notFound: true };
  }

  return { props: { initialPostData: postData } };
};

export default PostEditor;
