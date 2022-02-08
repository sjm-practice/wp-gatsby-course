import React from "react";
import Layout from "../components/layout";
import styled from "styled-components";

const FeaturedImage = styled.img`
  max-width: 300px;
  margin: 16px 0;
`;

const Portfolio = ({ pageContext }) => (
  <Layout>
    <h1>{pageContext.title}</h1>
    <FeaturedImage src={pageContext.featured_media.source_url} />
    <div>
      <strong>Website URL:&nbsp;</strong>
      <a
        href={pageContext.acf.portfolio_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {pageContext.acf.portfolio_url}
      </a>
    </div>
    <div dangerouslySetInnerHTML={{ __html: pageContext.content }} />
  </Layout>
);

export default Portfolio;
