const path = require(`path`);
const { slash } = require(`gatsby-core-utils`);

// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
// Will create pages for WordPress pages (route : /{slug})
// Will create pages for WordPress posts (route : /post/{slug})
exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  // TODO
  // TODO NOTE: WHEN DOING THIS FOR PRODUCTION CONSIDER SPLITTING THAT ONE QUERY
  // TODO      OUT INTO THREE QUERIES, PROCESSING EACH INDIVIDUALLY
  // TODO

  // The “graphql” function allows us to run arbitrary
  // queries against the local Gatsby GraphQL schema. Think of
  // it like the site has a built-in database constructed
  // from the fetched data that you can run queries against.
  const result = await graphql(`
    {
      allWordpressPage {
        edges {
          node {
            id
            slug
            status
            template
            title
            content
          }
        }
      }
      allWordpressWpPortfolio {
        edges {
          node {
            id
            title
            slug
            excerpt
            content
            featured_media {
              source_url
            }
            acf {
              portfolio_url
            }
          }
        }
      }
      allWordpressPost {
        edges {
          node {
            title
            content
            excerpt
            wordpress_id
            date(formatString: "Do MMM YYYY HH:mm")
            slug
          }
        }
      }
    }
  `);

  // Check for any errors
  if (result.errors) {
    throw new Error(result.errors);
  }

  // Since WP must have a slug for each page, use the home page for root index
  createRedirect({
    fromPath: "/",
    toPath: "/home",
    redirectInBrowser: true,
    isPermanent: true,
  });

  // Access query results via object destructuring
  const {
    allWordpressPage,
    allWordpressWpPortfolio,
    allWordpressPost,
  } = result.data;

  // Create Page pages.
  const pageTemplate = path.resolve(`./src/templates/page.js`);
  const portfolioUnderContentTemplate = path.resolve(
    `./src/templates/portfolioUnderContent.js`
  );
  // We want to create a detailed page for each page node.
  // The path field contains the relative original WordPress link
  // and we use it for the slug to preserve url structure.
  // The Page ID is prefixed with 'PAGE_'
  allWordpressPage.edges.forEach(edge => {
    // Gatsby uses Redux to manage its internal state.
    // Plugins and sites can use functions like "createPage"
    // to interact with Gatsby.
    let currentTemplate =
      edge.node.template === "portfolio_under_content.php"
        ? portfolioUnderContentTemplate
        : pageTemplate;

    createPage({
      // Each page is required to have a `path` as well
      // as a template component. The `context` is
      // optional but is often necessary so the template
      // can query data specific to each page.
      path: `/${edge.node.slug}/`,
      component: slash(currentTemplate),
      context: edge.node,
    });
  });

  const portfolioTemplate = path.resolve(`./src/templates/portfolio.js`);
  // We want to create a detailed page for each post node.
  // The path field stems from the original WordPress link
  // and we use it for the slug to preserve url structure.
  // The Post ID is prefixed with 'POST_'
  allWordpressWpPortfolio.edges.forEach(edge => {
    createPage({
      path: `/portfolio/${edge.node.slug}/`,
      component: slash(portfolioTemplate),
      context: edge.node,
    });
  });

  const blogPostListTemplate = path.resolve(`./src/templates/blogPostList.js`);

  const posts = allWordpressPost.edges;
  const postsPerPage = 2;
  const numberOfPages = Math.ceil(posts.length / postsPerPage);

  posts.forEach((post, index) => {
    // create the blog list page
    createPage({
      path: index === 0 ? `/blog/` : `/blog/${index + 1}/`,
      component: slash(blogPostListTemplate),
      context: {
        posts: posts.slice(
          index * postsPerPage,
          index * postsPerPage + postsPerPage
        ),
        numberOfPages,
        currentPage: index + 1,
      },
    });

    // create post page
    createPage({
      path: `/post/${post.node.slug}/`,
      component: slash(pageTemplate),
      context: post.node,
    });
  });
};
