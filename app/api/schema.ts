import { z } from "zod";

export const MethodInfoSchema = z.object({
  methodName: z.string().min(1, "Name is required"),
  url: z.url().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  notes: z.string().optional(),
});

export type Params = Promise<{ customerId: string }>;

export type CustIDProp = { params: Params }
export type MethodIdProp = { params: Promise<{ customerId: string, methodId: string }> }