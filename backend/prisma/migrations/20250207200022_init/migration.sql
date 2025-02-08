-- CreateTable
CREATE TABLE "doctor_table" (
    "doctor_id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "rating" DECIMAL(3,2),
    "charge_per_hour" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "doctor_table_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "patient_table" (
    "patient_id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "patient_table_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "doctor_appointment" (
    "appointment_id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "appointment_date" DATE NOT NULL,
    "time_from" TIME(6) NOT NULL,
    "time_to" TIME(6) NOT NULL,

    CONSTRAINT "doctor_appointment_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateTable
CREATE TABLE "languages_table" (
    "language_id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "language_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "languages_table_pkey" PRIMARY KEY ("language_id")
);

-- CreateTable
CREATE TABLE "speciality_table" (
    "speciality_id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "speciality_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "speciality_table_pkey" PRIMARY KEY ("speciality_id")
);

-- CreateTable
CREATE TABLE "chat_history" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_table_username_key" ON "doctor_table"("username");

-- CreateIndex
CREATE UNIQUE INDEX "patient_table_username_key" ON "patient_table"("username");

-- CreateIndex
CREATE UNIQUE INDEX "unique_doctor_language" ON "languages_table"("doctor_id", "language_name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_doctor_speciality" ON "speciality_table"("doctor_id", "speciality_name");

-- AddForeignKey
ALTER TABLE "doctor_appointment" ADD CONSTRAINT "fk_doctor" FOREIGN KEY ("doctor_id") REFERENCES "doctor_table"("doctor_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "doctor_appointment" ADD CONSTRAINT "fk_patient" FOREIGN KEY ("patient_id") REFERENCES "patient_table"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "languages_table" ADD CONSTRAINT "fk_doctor_languages" FOREIGN KEY ("doctor_id") REFERENCES "doctor_table"("doctor_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "speciality_table" ADD CONSTRAINT "fk_doctor_speciality" FOREIGN KEY ("doctor_id") REFERENCES "doctor_table"("doctor_id") ON DELETE CASCADE ON UPDATE NO ACTION;
