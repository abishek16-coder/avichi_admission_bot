export type Role = "user" | "model";

export type ChatMessage = {
  role: Role;
  text: string;
};

export type Lead = {
  name: string;
  phone: string;
  course: string;
  createdAt: string;
};
