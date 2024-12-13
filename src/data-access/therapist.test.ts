import { db } from "../db";
import {
  listTherapistByPatient,
  listAvailability,
  setTherapistAvailability,
} from "./therapist";
import { eq, and } from "drizzle-orm";

jest.mock("../db", () => ({
  db: {
    select: jest.fn(),
    from: jest.fn(),
    innerJoin: jest.fn(),
    where: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
    insert: jest.fn(),
    values: jest.fn(),
  },
}));

describe("Therapist Functions", () => {
  const mockedDb = jest.mocked(db);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listTherapistByPatient", () => {
    it("should return a list of therapists for a patient", async () => {
      const mockResult = [
        {
          patient: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
          },
          therapist: {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
          },
        },
      ];

      mockedDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          innerJoin: jest.fn().mockReturnValueOnce({
            where: jest.fn().mockReturnValueOnce({
              limit: jest.fn().mockReturnValueOnce({
                offset: jest.fn().mockResolvedValueOnce(mockResult),
              }),
            }),
          }),
        }),
      } as any);

      const result = await listTherapistByPatient({ patientId: 1, limit: 2, offset: 0 });

      expect(mockedDb.select).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("listAvailability", () => {
    it("should return availability for a therapist on a specific date", async () => {
      const mockResult = [
        {
          availabilityId: 1,
          startTime: "09:00",
          endTime: "12:00",
        },
      ];

      mockedDb.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValueOnce({
          where: jest.fn().mockResolvedValueOnce(mockResult),
        }),
      } as any);

      const result = await listAvailability({ therapistId: 1, date: 20241215 });

      expect(mockedDb.select).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("setTherapistAvailability", () => {
    it("should insert therapist availability", async () => {
      const mockResult = { success: true };

      mockedDb.insert.mockReturnValueOnce({
        values: jest.fn().mockResolvedValueOnce(mockResult),
      } as any);

      const result = await setTherapistAvailability({
        therapistId: 1,
        day: 20241215,
        startTime: "09:00",
        endTime: "17:00",
      });

      expect(mockedDb.insert).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
