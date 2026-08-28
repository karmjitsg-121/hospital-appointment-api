import { Appointment, Prisma } from "@prisma/client";
import { prisma } from "./lib/prisma";

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { patient: true; doctor: true };
}>;

export type NewAppointment = {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  status?: string;
};

export const bookAppointment = (data: NewAppointment): Promise<AppointmentWithRelations> =>
  prisma.appointment.create({
    data: {
      appointmentDate: data.appointmentDate,
      status: data.status ?? "scheduled",
      patient: { connect: { id: data.patientId } },
      doctor: { connect: { id: data.doctorId } }
    },
    include: { patient: true, doctor: true }
  });

export const getAppointmentFull = (id: number): Promise<AppointmentWithRelations | null> =>
  prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, doctor: true }
  });

export const getDoctorUpcomingAppointments = (doctorId: number): Promise<AppointmentWithRelations[]> =>
  prisma.appointment.findMany({
    where: {
      doctorId,
      status: "scheduled",
      appointmentDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    },
    orderBy: { appointmentDate: "asc" },
    include: { patient: true, doctor: true }
  });

export const setAppointmentStatus = (
  id: number,
  status: "scheduled" | "completed" | "cancelled"
): Promise<Appointment> => prisma.appointment.update({ where: { id }, data: { status } });

export const cancelAllPatientAppointments = async (patientId: number): Promise<Prisma.BatchPayload> =>
  prisma.appointment.updateMany({ where: { patientId }, data: { status: "cancelled" } });

export const deleteAppointment = (id: number): Promise<Appointment> =>
  prisma.appointment.delete({ where: { id } });