import React from "react";
import Layout from "../components/layout";
import styled from "styled-components";

const BlogPostList = ({ pageContext }) => (
  <Layout>
    {pageContext.posts.map(post => (
      <div>
        <h3 dangerouslySetInnerHTML={{ __html: post.node.title }} />
        <p dangerouslySetInnerHTML={{ __html: post.node.excerpt }} />
      </div>
    ))}
  </Layout>
);

export default BlogPostList;
