import { Doctor, Prisma } from "@prisma/client";
import { prisma } from "./lib/prisma";

export type NewDoctor = Prisma.DoctorCreateInput;

export const createDoctor = (data: NewDoctor): Promise<Doctor> =>
  prisma.doctor.create({ data });

export const getDoctor = (id: number): Promise<Doctor | null> =>
  prisma.doctor.findUnique({ where: { id } });

export const listDoctorsBySpecialty = (specialty: string): Promise<Doctor[]> =>
  prisma.doctor.findMany({
    where: { specialty: { contains: specialty, mode: "insensitive" } },
    orderBy: { name: "asc" }
  });

export const deleteDoctor = async (id: number): Promise<Doctor> => {
  try {
    return await prisma.doctor.delete({ where: { id } });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new Error("Cannot delete a doctor who has appointments.");
    }
    throw error;
  }
};