'use server';

import { db } from '@src/db';
import { NewResourceParams, insertResourceSchema, resources } from '@src/db/schema/resource';

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [resource] = await db.insert(resources).values({ content }).returning();

    return 'Resource successfully created.';
  } catch (e) {
    if (e instanceof Error) return e.message.length > 0 ? e.message : 'Error, please try again.';
  }
};
