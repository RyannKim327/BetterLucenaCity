export const SELF_SELECT_ROLES = ["Data Collaborator", "Data Validator", "Tester"] as const;
export type SelfSelectRole = typeof SELF_SELECT_ROLES[number];
