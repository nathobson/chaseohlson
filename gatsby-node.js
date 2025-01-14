const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const standardPosts = new Promise((resolve, reject) => {
    graphql(`
      {
        allContentfulStandardPost(
          sort: { fields: [createdAt], order: DESC }
          limit: 10000
        ) {
          edges {
            node {
              slug
            }
          }
        }
      }
    `).then(result => {
      const posts = result.data.allContentfulStandardPost.edges

      // Create Pages
      posts.map(post => {
        let { slug } = post.node
        createPage({
          path: `/${slug}`,
          component: path.resolve(`./src/templates/StandardBlog.js`),
          context: {
            slug,
          },
        })
      })
      resolve()
    })
  })

  return Promise.all([standardPosts])
}
