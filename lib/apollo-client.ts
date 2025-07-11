import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define the URIs
const POSTS_URI = process.env.NEXT_PUBLIC_POSTS_API_URL 
  ? `${process.env.NEXT_PUBLIC_POSTS_API_URL}/graphql/graphql`
  : 'http://localhost:8001/graphql/graphql';

const AUTH_URI = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
  : 'http://localhost:8000/graphql';

// Auth middleware to add JWT token to requests
const authMiddleware = setContext((_, { headers }) => {
  // Use cookie-based authentication instead of localStorage
  // The credentials: 'include' option will send cookies automatically
  return {
    headers: {
      ...headers,
      // Remove explicit authorization header since we're using cookies
    }
  };
});

// For now, let's use a simpler approach - just use the posts service
// We can enhance this later with proper routing
const httpLink = createHttpLink({
  uri: POSTS_URI,
  credentials: 'include', // Include cookies in requests
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([authMiddleware, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Enable pagination for posts query
            keyArgs: ["search", "tags", "authorId"],
            merge(existing = { posts: [], totalCount: 0, hasNextPage: false, hasPreviousPage: false }, incoming) {
              return {
                ...incoming,
                posts: [...existing.posts, ...incoming.posts]
              };
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
