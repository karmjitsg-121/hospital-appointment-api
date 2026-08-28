import assert from "node:assert/strict";
import { prisma } from "./lib/prisma";
import { createPatient, deletePatient, getPatient, searchPatients, updatePatientPhone } from "./patients";
import { createDoctor, deleteDoctor, listDoctorsBySpecialty } from "./doctors";
import { bookAppointment, cancelAllPatientAppointments, deleteAppointment, getAppointmentFull, getDoctorUpcomingAppointments, setAppointmentStatus } from "./appointments";

async function test(): Promise<void> {
  const patient = await createPatient({ name: "Test Patient", phone: "555-1000" });
  assert.equal((await getPatient(patient.id))?.name, "Test Patient");
  assert.equal((await searchPatients("test"))[0]?.id, patient.id);
  assert.equal((await updatePatientPhone(patient.id, "555-1001")).phone, "555-1001");
  console.log("patient creation, retrieval, search, and phone update: ok");

  const doctor = await createDoctor({ name: "Test Doctor", specialty: "Neurology" });
  assert.equal((await listDoctorsBySpecialty("neuro"))[0]?.id, doctor.id);
  console.log("doctor creation and specialty search: ok");

  const appointment = await bookAppointment({ patientId: patient.id, doctorId: doctor.id, appointmentDate: new Date(Date.now() + 86400000) });
  assert.equal(appointment.patient.id, patient.id);
  assert.equal(appointment.doctor.id, doctor.id);
  assert.equal((await getAppointmentFull(appointment.id))?.patient.phone, "555-1001");
  assert.equal((await getDoctorUpcomingAppointments(doctor.id))[0]?.id, appointment.id);
  await setAppointmentStatus(appointment.id, "completed");
  await cancelAllPatientAppointments(patient.id);
  await deleteAppointment(appointment.id);
  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);
  console.log("appointment creation with nested relations, upcoming lookup, status update, and cleanup: ok");
}

test().catch((error: unknown) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());