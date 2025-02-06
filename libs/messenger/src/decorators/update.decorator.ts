import { SetMetadata, createParamDecorator } from '@nestjs/common';

export const UPDATE_METADATA = 'UPDATE_METADATA';

export const Update = (): ClassDecorator => SetMetadata(UPDATE_METADATA, true);
