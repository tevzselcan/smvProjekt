export interface UserData {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role?: { id: string; name: string };
}
