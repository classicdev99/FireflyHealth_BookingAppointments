import { Clinician, Patient, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLINICIANS: Omit<Clinician, "id">[] = [
  {
    first_name: "James",
    last_name: "Timothy",
    national_provider_number: "89234",
  },
  {
    first_name: "Kaylie",
    last_name: "Jefferson",
    national_provider_number: "10934",
  },
];

const PATIENTS: Omit<Patient, "id">[] = [
  {
    first_name: "Tanner",
    last_name: "Lensley",
  },
  {
    first_name: "John",
    last_name: "Doe",
  },
];

const THIRTY_MINUTES = 1000 * 60 * 30;

// async function clear() {
//   await prisma.appointment.deleteMany();
//   await prisma.availability.deleteMany();
//   await prisma.patient.deleteMany();
//   await prisma.clinician.deleteMany();
// }

async function seed() {
  // await clear();
  const clinicians = await prisma.clinician.findMany();
  for (const clinician of CLINICIANS) {
    if (!clinicians.find((c) => c.first_name === clinician.first_name)) {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      const times = [
        Date.now() + ONE_DAY,
        Date.now() + ONE_DAY + THIRTY_MINUTES,
        Date.now() + ONE_DAY + THIRTY_MINUTES + THIRTY_MINUTES,
      ];

      await prisma.clinician.create({
        data: {
          ...clinician,
          availabilities: {
            create: times.map((start) => ({
              start: new Date(start),
              end: new Date(start + THIRTY_MINUTES),
            })),
          },
        },
      });
    }
  }

  const patients = await prisma.patient.findMany();
  for (const patient of PATIENTS) {
    if (!patients.find((p) => p.first_name === patient.first_name)) {
      await prisma.patient.create({ data: patient });
    }
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
