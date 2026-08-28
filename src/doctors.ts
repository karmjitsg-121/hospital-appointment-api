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

export const deleteDoctor = (id: number): Promise<Doctor> =>
  prisma.doctor.delete({ where: { id } });