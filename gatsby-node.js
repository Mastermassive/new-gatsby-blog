/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */

// const { graphql } = require('gatsby');
const {createFilePath} = require(`gatsby-source-filesystem`);
const path = require(`path`);

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}

exports.onCreateNode = ({node, getNode, actions}) => {
  const { createNodeField } = actions;
  if(node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({node, getNode});

    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
  }
}

exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions;
  return graphql(`
    query MyQuery {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }  
  `).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({node}) => {
      createPage({
        path: node.fields.slug,
        component:  path.resolve(`./src/templates/blog-posts.js`),
        context: {
          slug: node.fields.slug,
        }
      })
    });
  })
}
