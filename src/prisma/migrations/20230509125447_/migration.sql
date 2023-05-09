-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('BLOCKED', 'ACTIVE', 'INACTIVE', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('CANCELED', 'SUCCESSFUL', 'INPROGRESS', 'REFOUND');

-- CreateTable
CREATE TABLE "User_info" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "cpf" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    "birth" DATE,
    "status" "AccessStatus",

    CONSTRAINT "User_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_auth" (
    "id" UUID NOT NULL,
    "user_info_id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "street" TEXT NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "complement" VARCHAR(200) NOT NULL,
    "neighborhood" VARCHAR(200) NOT NULL,
    "city" VARCHAR(200) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "account_number" VARCHAR(100) NOT NULL,
    "agency" VARCHAR(10) NOT NULL,
    "user_id" UUID NOT NULL,
    "balance" MONEY NOT NULL,
    "transaction_password" VARCHAR(4) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    "status" "AccessStatus" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "account_receiver_id" UUID NOT NULL,
    "schedule_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,
    "value" MONEY NOT NULL,
    "status" "TransferStatus" NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" UUID NOT NULL,
    "user_info_id" UUID NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "is_solved" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "ticket_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "suport_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suport_info" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Suport_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suport_auth" (
    "id" UUID NOT NULL,
    "suport_info_id" UUID NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP,

    CONSTRAINT "Suport_auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_info_cpf_key" ON "User_info"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_user_info_id_key" ON "User_auth"("user_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_email_key" ON "User_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_number_key" ON "Account"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "Suport_auth_suport_info_id_key" ON "Suport_auth"("suport_info_id");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_account_receiver_id_fkey" FOREIGN KEY ("account_receiver_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_user_info_id_fkey" FOREIGN KEY ("user_info_id") REFERENCES "User_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_suport_id_fkey" FOREIGN KEY ("suport_id") REFERENCES "Suport_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suport_auth" ADD CONSTRAINT "Suport_auth_suport_info_id_fkey" FOREIGN KEY ("suport_info_id") REFERENCES "Suport_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
