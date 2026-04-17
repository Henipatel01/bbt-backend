import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

 const validate = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.body)
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    return next();
  } catch (err) {
    if (err instanceof ZodError) {
  const errors: Record<string, string> = {};

  err.issues.forEach((e) => {
    const field = e.path[0] as string;
    if (!errors[field]) {
      errors[field] = e.message;
    }
  });

  return res.status(400).json({
    success: false,
    message: "Validation error",
    errors,   // 👈 THIS is important
  });
}
  };
}

export default validate

// module.exports = validate;