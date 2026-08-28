import { prisma } from "./lib/prisma";

async function seed(): Promise<void> {
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  const [doctor, secondDoctor] = await Promise.all([
    prisma.doctor.create({ data: { name: "Dr. Priya Shah", specialty: "Cardiology" } }),
    prisma.doctor.create({ data: { name: "Dr. Arjun Mehta", specialty: "Pediatrics" } })
  ]);
  const [patient, secondPatient] = await Promise.all([
    prisma.patient.create({ data: { name: "Anita Rao", phone: "555-0101" } }),
    prisma.patient.create({ data: { name: "Rahul Verma", phone: "555-0102" } })
  ]);

  await prisma.appointment.createMany({
    data: [
      { patientId: patient.id, doctorId: doctor.id, appointmentDate: new Date(Date.now() + 86400000), status: "scheduled" },
      { patientId: secondPatient.id, doctorId: secondDoctor.id, appointmentDate: new Date(Date.now() + 172800000), status: "scheduled" }
    ]
  });
}

seed().finally(() => prisma.$disconnect());