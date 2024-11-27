export interface ListTherapistInput {
  userId: number;
  //licenseNumber: string,
}

export interface ListTherapistItem {
  firstName: string;
  lastName: string;
  // email: string,
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
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export type ListUserTherapistResult = ListTherapistItem[];

export interface UpdateTherapistStatusInput {
  therapistId: number;
  active: boolean | null;
}

export interface UpdateTherapistStatusResult {
  active: boolean | null;
}

export interface FilterTherapistInput {
  firstName: string;
  lastName: string;
}

export interface FilterTherapistResult {
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  active: boolean | null;
}