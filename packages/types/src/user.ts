/**
 * User entity from the database
 */
export interface User {
  clerkUserId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}
