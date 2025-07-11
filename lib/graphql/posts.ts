import { gql } from '@apollo/client';

// Post fragment for reuse - updated for backend schema
export const POST_FRAGMENT = gql`
  fragment PostDetails on Post {
    id
    title
    content
    authorId
    authorName
    tags
    published
    createdAt
    updatedAt
  }
`;

// Query to get paginated posts with filtering
export const GET_POSTS = gql`
  ${POST_FRAGMENT}
  query GetPosts(
    $page: Int = 1
    $perPage: Int = 10
    $search: String
    $authorId: String
    $published: Boolean
  ) {
    posts(
      page: $page
      perPage: $perPage
      search: $search
      authorId: $authorId
      published: $published
    ) {
      posts {
        ...PostDetails
      }
      total
      page
      perPage
    }
  }
`;

// Query to get a single post by ID
export const GET_POST = gql`
  ${POST_FRAGMENT}
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostDetails
    }
  }
`;

// Query to get posts by author
export const GET_POSTS_BY_AUTHOR = gql`
  ${POST_FRAGMENT}
  query GetPostsByAuthor($authorId: String!) {
    postsByAuthor(authorId: $authorId) {
      ...PostDetails
    }
  }
`;

// Mutation to create a new post
export const CREATE_POST = gql`
  ${POST_FRAGMENT}
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      success
      message
      post {
        ...PostDetails
      }
    }
  }
`;

// Mutation to update an existing post
export const UPDATE_POST = gql`
  ${POST_FRAGMENT}
  mutation UpdatePost($id: String!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      success
      message
      post {
        ...PostDetails
      }
    }
  }
`;

// Mutation to delete a post
export const DELETE_POST = gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;

// Mutation to publish a post
export const PUBLISH_POST = gql`
  ${POST_FRAGMENT}
  mutation PublishPost($id: String!) {
    publishPost(id: $id) {
      success
      message
      post {
        ...PostDetails
      }
    }
  }
`;

// TypeScript types for the GraphQL responses
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  perPage: number;
}

export interface PostInput {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
  published?: boolean;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  tags?: string[];
  published?: boolean;
}

export interface PostMutationResponse {
  success: boolean;
  message: string;
  post?: Post;
}
