export const SELF_SELECT_ROLES = ["Maintainer", "Data Collaborator", "Data Validator", "Tester"] as const;
export type SelfSelectRole = typeof SELF_SELECT_ROLES[number];
