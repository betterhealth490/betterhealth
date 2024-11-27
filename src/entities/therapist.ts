export interface ListTherapistInput {
  role: "therapist";
  firstName: string;
  lastName: string;
  email: string;
}

export interface ListTherapistItem {
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
}

export type ListTherapistResult = ListTherapistItem[];

export interface ListUserTherapistInput {
  userId: number;
}

export interface ListUserTherapistItem {
  therapistId: number;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  status: "Pending" | "Approved" | "Declined";
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type ListUserTherapistResult = ListUserTherapistItem[];

export interface UpdateTherapistStatusInput {
  therapistId: number;
  active: boolean;
}

export interface UpdateTherapistStatusResult {
  active: boolean | null;
}

