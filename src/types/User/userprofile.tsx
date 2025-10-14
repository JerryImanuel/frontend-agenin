export type UserProfile = {
  userId: string;
  userFullName: string;
  userEmail: string;
  userPhoneNumber: string;
  roleName: string;
};

export interface UserProfileResponse {
  status: number;
  message: string;
  error: string | null;
  results: UserProfile;
}
