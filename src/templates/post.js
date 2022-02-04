import React from "react";

const Post = ({ pageContext }) => {
  return (
    <div>
      <h1>{pageContext.title}</h1>
    </div>
  );
};

export default Post;
