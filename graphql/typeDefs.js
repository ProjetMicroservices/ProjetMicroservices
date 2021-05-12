const { gql } = require('apollo-server');



module.exports= gql`
type Post {
    id:ID!
    body:String!
    createdAt:String!
    username:String!
    comments:[Comment]!
    likes:[Like]!
    likeCount: Int!
    commentCount: Int!
 }
 type Comment {
     id:ID!
     createdAt: String!
     username:String!
     body:String!
 }
 type Like {
     id:ID!
     createdAt: String!
     username:String!
 }
 type Query {
    getPosts:[Post]
    getPost(postId:ID!):Post
    getPostByUser(user:String!):[Post]

}
type Mutation{
    createPost(body:String!,user:String!,username:String!):Post!
    deletePost(postId:ID!):String!
    createComment(postId:String!,body:String!,username:String!): Post!
    deleteComment(postId:ID!,commentId:ID!):Post! 
    likePost(postId:ID!,username:String!):Post! 
}
type Subscription {
    newPost: Post!
  }
`;
