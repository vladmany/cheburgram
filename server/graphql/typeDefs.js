import {__dirname} from '../services/pathService.js';
import path from 'path';

import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFiles } from '@graphql-tools/load-files';

async function getMergedTypeDefs() {
    const typeDefsFiles = await loadFiles(path.join(__dirname, '../graphql/modules/**/!(*.d).typeDefs.{ts,js}'));
    return mergeTypeDefs(typeDefsFiles);
}

export default await getMergedTypeDefs();