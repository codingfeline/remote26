import { z } from "zod";

export const MethodInfoSchema = z.object({
  methodName: z.string().min(1, "Name is required"),
  url: z.url().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  notes: z.string().optional(),
});

export const ContactInfoSchema = z.object({
  name: z.string().min(1, "Name must be at least 2 characters").optional(),
  tel: z.string().optional(),
  email: z.email("Invalid email").optional().or(z.literal(""))
});

export const ServerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ip: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export const SolutionSchema = z.object({
  comment: z.string().optional(),
  screenshot: z.string().optional(),
  path: z.string().optional(),
});

export const DevicePasswordSchema = z.object({
  make: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export const DeviceSetupSchema = z.object({
  comment: z.string().optional(),
  screenshot: z.string().optional(),
  path: z.string().optional(),
});

export type Params = Promise<{ customerId: string }>;
export type CustIDProp = { params: Params }

export type MethodIdProp = { params: Promise<{ customerId: string, methodId: string }> }
export type ContactIdProp = { params: Promise<{ customerId: string, contactId: string }> }

export type CustomerAllProps = {
  params: Promise<
    {
      customerId?: string, methodId?: string, contactId?: string,
      serverId?: string, deviceId?: string, deviceSetupId?: string, solutionId?: string
    }>
}