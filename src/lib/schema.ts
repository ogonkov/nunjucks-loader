import type {JSONSchemaType} from 'ajv';

import type {NullableLoaderOptions} from './types';

const schema = {
  title: 'Simple Nunjucks Loader options',
  type: 'object',
  properties: {
    dev: {
      type: 'boolean',
      nullable: true
    },
    autoescape: {
      type: 'boolean',
      nullable: true
    },
    throwOnUndefined: {
      type: 'boolean',
      nullable: true
    },
    trimBlocks: {
      type: 'boolean',
      nullable: true
    },
    lstripBlocks: {
      type: 'boolean',
      nullable: true
    },
    jinjaCompat: {
      type: 'boolean',
      nullable: true,
      default: false
    },
    tags: {
      type: 'object',
      nullable: true,
      properties: {
        blockStart: {
          type: 'string',
          nullable: true
        },
        blockEnd: {
          type: 'string',
          nullable: true
        },
        variableStart: {
          type: 'string',
          nullable: true
        },
        variableEnd: {
          type: 'string',
          nullable: true
        },
        commentStart: {
          type: 'string',
          nullable: true
        },
        commentEnd: {
          type: 'string',
          nullable: true
        }
      },
      additionalProperties: false
    },
    searchPaths: {
      type: ['string', 'array'],
      nullable: true,
      oneOf: [
        {
          type: 'string',
          nullable: true
        },
        {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      ],
      default: '.'
    },
    assetsPaths: {
      type: ['string', 'array'],
      nullable: true,
      oneOf: [
        {
          type: 'string',
          nullable: true
        },
        {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      ],
      default: '.'
    },
    globals: {
      type: 'object',
      nullable: true,
      required: [],
      patternProperties: {
        '.+': {
          type: 'string'
        }
      },
      default: {}
    },
    extensions: {
      type: 'object',
      nullable: true,
      required: [],
      patternProperties: {
        '.+': {
          type: 'string'
        }
      },
      default: {}
    },
    filters: {
      type: 'object',
      nullable: true,
      required: [],
      patternProperties: {
        '.+': {
          type: 'string'
        }
      },
      default: {}
    },
    esModule: {
      type: 'boolean',
      nullable: true,
      default: false
    }
  },
  additionalProperties: false
} satisfies JSONSchemaType<NullableLoaderOptions>;

export default schema;
