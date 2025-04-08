import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
  Reference,
  TypePolicies,
  PossibleTypesMap
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = (endpoint?: string) =>
    createHttpLink({
      uri: endpoint || import.meta.env.VITE_JCONTENT_GQL_ENDPOINT
    });

const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_GQL_API_TOKEN;
  const authHeaders: Record<string, string> = {};

  if (token) {
    authHeaders['Authorization'] = `APIToken ${token}`;
  }

  return {
    headers: {
      ...headers,
      ...authHeaders
    }
  };
});

const possibleTypes: PossibleTypesMap = {
  JCRNode: ['JCRNode', 'GenericJCRNode', 'JCRSite', 'VanityUrl'],
  JCRItemDefinition: ['JCRItemDefinition', 'JCRPropertyDefinition', 'JCRNodeDefinition']
};

const mainType: Record<string, string> = {};
Object.entries(possibleTypes).forEach(([main, types]) => {
  types.forEach(type => {
    mainType[type] = main;
  });
});

const customTypePolicies: Record<string, { keyFields: string[] }> = {
  JCRNode: {
    keyFields: ['uuid', 'workspace']
  },
  JCRQuery: {
    keyFields: ['workspace']
  },
  JCRNodeType: {
    keyFields: ['name']
  },
  GqlEditorForms: {
    keyFields: []
  }
};

const getNodeKey = (uuid: string, workspace: string): string =>
    `JCRNode:${JSON.stringify({ uuid, workspace })}`;

export const getClient = (gqlEndpoint?: string): ApolloClient<NormalizedCacheObject> => {
  console.log('Creating Apollo Client');

  const idByPath: Record<string, string> = {};
  let currentWs = 'EDIT';

  const typePolicies: TypePolicies = {
    Query: {
      fields: {
        jcr: {
          read(existingData, { args, toReference }) {
            currentWs = args?.workspace || 'EDIT';
            return (
                existingData ||
                toReference({ __typename: 'JCRQuery', workspace: currentWs })
            );
          }
        }
      }
    },
    GqlPublicationInfo: {
      merge: true
    },
    JCRQuery: {
      fields: {
        nodeById(_, { args, toReference }) {
          return toReference(getNodeKey(args.uuid, currentWs));
        },
        nodesById(_, { args, toReference }) {
          return args.uuids.map((uuid: string) =>
              toReference(getNodeKey(uuid, currentWs))
          );
        },
        nodeByPath(_, { args, toReference }) {
          const uuid = idByPath[args.path];
          return uuid ? toReference(getNodeKey(uuid, currentWs)) : undefined;
        },
        nodesByPath(_, { args, toReference }) {
          const allAvailable = args.paths.every((path: string) => idByPath[path]);
          return allAvailable
              ? args.paths.map((path: string) =>
                  toReference(getNodeKey(idByPath[path], currentWs))
              )
              : undefined;
        }
      }
    }
  };

  const dataIdFromObject: InMemoryCacheConfig['dataIdFromObject'] = (data: any, context) => {
    const type = mainType[data.__typename] ?? data.__typename;

    if (type === 'JCRNode' && data.path && data.uuid) {
      idByPath[data.path] = data.uuid;
    }

    const customPolicy = customTypePolicies[type];
    if (customPolicy) {
      const { keyFields } = customPolicy;
      const hasAllKeys = keyFields.every(field => !!data[field]);
      if (hasAllKeys) {
        const compositeKey = keyFields.reduce<Record<string, any>>((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});
        return `${type}:${JSON.stringify(compositeKey)}`;
      }

      console.warn(
          `Missing fields [${keyFields.join(', ')}] for ${data.__typename}`,
          data,
          context
      );
    }

    return undefined;
  };

  return new ApolloClient({
    link: authLink.concat(httpLink(gqlEndpoint)),
    cache: new InMemoryCache({
      possibleTypes,
      typePolicies,
      dataIdFromObject
    })
  });
};