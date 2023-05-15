import { z } from 'zod';

enum InvalidVFieldError{

}

export const fieldErrors: z.ZodErrorMap = (issue, ctx) => {
    return {message: ctx.defaultError}
}