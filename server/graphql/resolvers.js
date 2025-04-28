import {__dirname} from '../services/pathService.js';
import path from 'path';

import { mergeResolvers } from '@graphql-tools/merge';
import { loadFiles } from '@graphql-tools/load-files';

async function getMergedResolvers() {
    const resolverFiles = await loadFiles(path.join(__dirname, '../graphql/modules/**/!(*.d).resolvers.{ts,js}'));
    return mergeResolvers(resolverFiles);
}

export default await getMergedResolvers();