import { Patient, Prisma } from "@prisma/client";
import { prisma } from "./lib/prisma";

export type NewPatient = Prisma.PatientCreateInput;

export const createPatient = (data: NewPatient): Promise<Patient> =>
  prisma.patient.create({ data });

export const getPatient = (id: number): Promise<Patient | null> =>
  prisma.patient.findUnique({ where: { id } });

export const searchPatients = (name: string): Promise<Patient[]> =>
  prisma.patient.findMany({
    where: { name: { contains: name, mode: "insensitive" } },
    orderBy: { name: "asc" }
  });

export const updatePatientPhone = (id: number, phone: string): Promise<Patient> =>
  prisma.patient.update({ where: { id }, data: { phone } });

export const deletePatient = (id: number): Promise<Patient> =>
  prisma.patient.delete({ where: { id } });