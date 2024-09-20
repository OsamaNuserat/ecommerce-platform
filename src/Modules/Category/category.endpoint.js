import { roles } from "../../Middleware/auth.js";

export const endPoints = {
  create: [roles.admin],
  update: [roles.admin],
  get: [roles.admin, roles.user],
};
